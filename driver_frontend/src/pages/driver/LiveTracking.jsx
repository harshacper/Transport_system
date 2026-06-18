import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

function ChangeView({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.panTo(center, { animate: true, duration: 1 });
    }
  }, [center, map]);
  return null;
}

const LiveTracking = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState('');
  const [tripStatus, setTripStatus] = useState('Pending');
  const [socket, setSocket] = useState(null);
  const [isAutoDriving, setIsAutoDriving] = useState(false);
  
  // Route state
  const [routePath, setRoutePath] = useState(null);
  const [routeProgressIndex, setRouteProgressIndex] = useState(0);

  // Default to Bangalore
  const [currentLocation, setCurrentLocation] = useState({ lat: 12.9716, lng: 77.5946 });
  
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/orders/driver`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const inProgress = res.data.filter(o => o.status === 'In Progress');
        setOrders(inProgress);
        if (inProgress.length > 0) setSelectedOrderId(inProgress[0].id);
      } catch (err) {
        console.error(err);
      }
    };
    fetchOrders();

    const newSocket = io(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}`);
    setSocket(newSocket);
    
    return () => newSocket.close();
  }, []);

  useEffect(() => {
    if (socket && selectedOrderId) {
      socket.emit('join_trip', selectedOrderId);
    }
  }, [socket, selectedOrderId]);

  // Fetch real road route
  useEffect(() => {
    const fetchRouteInfo = async () => {
      const order = orders.find(o => o.id === selectedOrderId);
      if (!order) return;
      
      try {
        const getCoords = async (addr) => {
          try {
            let search = addr.toLowerCase().replace('mysure', 'mysuru').replace('shivamog', 'shivamogga');
            const r = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(search)}`);
            if (r.data && r.data.length > 0) {
              return { lat: parseFloat(r.data[0].lat), lng: parseFloat(r.data[0].lon) };
            }
          } catch (e) {
            console.error(e);
          }
          // Fallback coordinate near Bangalore if completely unfindable
          return { lat: 12.9716 + (Math.random()*0.5 - 0.25), lng: 77.5946 + (Math.random()*0.5 - 0.25) };
        };
        
        const pickup = await getCoords(order.pickupLocation.address);
        const drop = await getCoords(order.dropLocation.address);
        
        if (pickup && drop) {
          try {
            const osrm = await axios.get(`https://router.project-osrm.org/route/v1/driving/${pickup.lng},${pickup.lat};${drop.lng},${drop.lat}?overview=full&geometries=geojson`);
            if (osrm.data.routes && osrm.data.routes.length > 0) {
              const coords = osrm.data.routes[0].geometry.coordinates.map(c => [c[1], c[0]]);
              setRoutePath(coords);
              setRouteProgressIndex(0);
              setCurrentLocation({ lat: coords[0][0], lng: coords[0][1] }); // Snap truck to pickup location
              return;
            }
          } catch (err) {
            console.error("OSRM Route error, falling back to straight line:", err);
          }
          
          // Fallback: Generate a straight line with 100 points
          const fallbackPts = [];
          for (let i = 0; i <= 100; i++) {
            fallbackPts.push([
              pickup.lat + (drop.lat - pickup.lat) * (i / 100),
              pickup.lng + (drop.lng - pickup.lng) * (i / 100)
            ]);
          }
          setRoutePath(fallbackPts);
          setRouteProgressIndex(0);
          setCurrentLocation(pickup);
        }
      } catch (err) {
        console.error("Route generation completely failed:", err);
      }
    };
    
    if (selectedOrderId && orders.length > 0) {
      setRoutePath(null); // Clear old route
      setIsAutoDriving(false);
      fetchRouteInfo();
    }
  }, [selectedOrderId, orders]);

  // Auto Drive Simulation ALONG THE REAL ROUTE
  useEffect(() => {
    let interval;
    if (isAutoDriving && socket && selectedOrderId && routePath) {
      interval = setInterval(() => {
        setRouteProgressIndex(prev => {
          const next = prev + 5; // skip a few points to move at a decent speed
          if (next >= routePath.length) {
            setIsAutoDriving(false);
            return prev;
          }
          const pt = routePath[next];
          const newLoc = { lat: pt[0], lng: pt[1] };
          setCurrentLocation(newLoc);
          socket.emit('location_update', { tripId: selectedOrderId, location: newLoc, status: tripStatus });
          return next;
        });
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [isAutoDriving, socket, selectedOrderId, tripStatus, routePath]);

  const toggleAutoDrive = () => {
    if (!selectedOrderId) {
      alert('Please select an active trip first.');
      return;
    }
    if (!routePath) {
      alert('Still calculating the perfect route... Please wait a second.');
      return;
    }
    setIsAutoDriving(!isAutoDriving);
  };

  const statuses = ['Pending', 'Started', 'Reached Pickup', 'Loaded', 'Reached Destination', 'Unloaded', 'Completed'];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 max-w-3xl mx-auto mb-10">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Live Trip Tracking & Route</h2>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Select Active Trip</label>
        <select 
          className="w-full border-gray-300 rounded-md shadow-sm p-3 border"
          value={selectedOrderId} 
          onChange={(e) => setSelectedOrderId(e.target.value)}
        >
          {orders.length === 0 && <option value="">No active trips found</option>}
          {orders.map(o => (
            <option key={o.id} value={o.id}>
              {o.companyId?.companyName} • {o.pickupLocation.address} to {o.dropLocation.address}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Update Trip Status</h3>
        <div className="flex flex-wrap gap-3">
          {statuses.map(status => (
            <button
              key={status}
              onClick={() => setTripStatus(status)}
              className={`px-4 py-2 rounded-md font-medium text-sm transition-colors ${
                tripStatus === status 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div className="border-t pt-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-700">Real-Time Navigation</h3>
          <button 
            onClick={toggleAutoDrive}
            disabled={!selectedOrderId}
            className={`${isAutoDriving ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-bold shadow-md transition-colors text-sm`}>
            {isAutoDriving ? 'Stop Auto-Drive' : 'Start Auto-Drive'}
          </button>
        </div>
        
        <div className="mt-4 rounded-xl h-96 overflow-hidden border border-gray-300 shadow-inner relative z-0">
          <MapContainer center={currentLocation} zoom={14} style={{ height: '100%', width: '100%' }}>
            <ChangeView center={currentLocation} />
            <TileLayer
              attribution='&copy; OpenStreetMap contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {routePath && <Polyline positions={routePath} color="#2563eb" weight={6} opacity={0.8} />}
            <Marker position={currentLocation}>
              <Popup>Your truck is here</Popup>
            </Marker>
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default LiveTracking;
