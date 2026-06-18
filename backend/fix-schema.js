const fs = require('fs');
let content = fs.readFileSync('prisma/schema.prisma', 'utf8');

// Replace all usages of the enums with String
content = content.replace(/ Role(?!s)/g, ' String')
                 .replace(/ UserStatus/g, ' String')
                 .replace(/ VerificationStatus/g, ' String')
                 .replace(/ OrderStatus/g, ' String')
                 .replace(/ BillingMethod/g, ' String')
                 .replace(/ TripStatus/g, ' String');

// Also remove the actual enum definitions (which are now `enum String { ... }` or `enum Role`)
content = content.replace(/enum \w+ \{[\s\S]*?\}/g, '');

// Wrap @default(Value) with quotes: @default("Value")
content = content.replace(/@default\((Admin|Company|Driver|Active|Suspended|Pending|Approved|Rejected|Created|Accepted|InProgress|Completed|Cancelled|PerTrip|PerKilometer|PerWeight|WeightPlusDistance|Started|ReachedPickup|Loaded|ReachedDestination|Unloaded)\)/g, '@default("$1")');

fs.writeFileSync('prisma/schema.prisma', content);
console.log('Fixed schema');
