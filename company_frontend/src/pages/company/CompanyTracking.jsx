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

const CompanyTracking = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState('');
  const [driverLocation, setDriverLocation] = useState(null);
  const [liveStatus, setLiveStatus] = useState('In Transit');
  const [socket, setSocket] = useState(null);
  
  // Route state
  const [routePath, setRoutePath] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/orders/company`, {
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

    newSocket.on('receive_location', (data) => {
      if (data.tripId === selectedOrderId || !selectedOrderId) {
        setDriverLocation(data.location);
        if (data.status) setLiveStatus(data.status);
      }
    });

    return () => newSocket.close();
  }, [selectedOrderId]);

  useEffect(() => {
    if (socket && selectedOrderId) {
      socket.emit('join_trip', selectedOrderId);
      // Reset location when changing trips
      setDriverLocation(null);
      setLiveStatus('In Transit');
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
        }
      } catch (err) {
        console.error("Route generation completely failed:", err);
      }
    };
    
    if (selectedOrderId && orders.length > 0) {
      setRoutePath(null); // Clear old route
      fetchRouteInfo();
    }
  }, [selectedOrderId, orders]);

  const selectedOrder = orders.find(o => o.id === selectedOrderId);
  
  // Center is driver location, or route start, or default to India
  const mapCenter = driverLocation || (routePath ? { lat: routePath[0][0], lng: routePath[0][1] } : { lat: 20.5937, lng: 78.9629 });
  const zoomLevel = driverLocation || routePath ? 14 : 5;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-10">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Live Fleet Navigation</h2>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Select Trip to Track</label>
        <select 
          className="w-full md:w-1/2 border-gray-300 rounded-md shadow-sm p-3 border"
          value={selectedOrderId} 
          onChange={(e) => setSelectedOrderId(e.target.value)}
        >
          {orders.length === 0 && <option value="">No 'In Progress' trips available</option>}
          {orders.map(o => (
            <option key={o.id} value={o.id}>
              {o.pickupLocation.address} to {o.dropLocation.address} (₹{o.estimatedCost})
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="rounded-xl h-[500px] flex items-center justify-center relative overflow-hidden border border-gray-300 shadow-inner z-0">
            <MapContainer center={mapCenter} zoom={zoomLevel} style={{ height: '100%', width: '100%' }}>
              <ChangeView center={mapCenter} />
              <TileLayer
                attribution='&copy; OpenStreetMap contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {routePath && <Polyline positions={routePath} color="#2563eb" weight={6} opacity={0.8} />}
              {driverLocation && (
                <Marker position={driverLocation}>
                  <Popup>
                    <strong>Driver Location</strong><br/>
                    Status: {liveStatus}
                  </Popup>
                </Marker>
              )}
            </MapContainer>
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 flex flex-col">
          <h3 className="font-bold text-gray-800 mb-4 border-b pb-2">Trip Overview</h3>
          {selectedOrder ? (
            <div className="space-y-4 text-sm flex-grow">
              <div>
                <p className="text-gray-500 uppercase text-xs font-semibold">Route</p>
                <p className="font-medium text-gray-800 mt-1">{selectedOrder.pickupLocation.address}</p>
                <div className="my-1 ml-2 border-l-2 border-dashed border-gray-400 h-4"></div>
                <p className="font-medium text-gray-800">{selectedOrder.dropLocation.address}</p>
              </div>
              <div className="pt-2">
                <p className="text-gray-500 uppercase text-xs font-semibold">Status</p>
                <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1.5 rounded-md font-bold mt-1">{liveStatus}</span>
              </div>
              <div className="pt-2">
                <p className="text-gray-500 uppercase text-xs font-semibold">Cargo Detail</p>
                <p className="font-medium text-gray-800 mt-1 bg-white border p-2 rounded">{selectedOrder.materialType} ({selectedOrder.materialWeight} Tons)</p>
              </div>
              
              <div className={`mt-auto pt-6 ${driverLocation ? 'opacity-100' : 'opacity-50'}`}>
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <p className="font-bold text-green-800 mb-1 flex items-center">
                    <span className={`w-2.5 h-2.5 bg-green-500 rounded-full mr-2 ${driverLocation ? 'animate-pulse' : ''}`}></span> 
                    {driverLocation ? 'Live GPS Active' : 'Waiting for GPS...'}
                  </p>
                  <p className="text-xs text-green-700">
                    {driverLocation ? 'Real-time navigation data is streaming directly from the driver.' : 'Driver has not started broadcasting location yet.'}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-500 text-center py-10">Select a trip to view real-time data.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyTracking;
