# MongoDB Setup Guide

## Quick Setup Options

### Option 1: MongoDB Atlas (Recommended - Cloud Database)

1. **Go to MongoDB Atlas**: https://www.mongodb.com/atlas
2. **Create a free account** (no credit card required)
3. **Create a new cluster**:
   - Choose "Free" tier
   - Select a region close to you
   - Give it a name (e.g., "tnp-cluster")
4. **Create a database user**:
   - Username: `tnp-user`
   - Password: `tnp-password123` (or your own)
5. **Whitelist your IP address**:
   - Click "Add IP Address"
   - Click "Add Current IP Address" or "Allow Access from Anywhere" (0.0.0.0/0)
6. **Get your connection string**:
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `<dbname>` with `tnp-website`

**Example connection string:**
```
mongodb+srv://tnp-user:tnp-password123@tnp-cluster.xxxxx.mongodb.net/tnp-website?retryWrites=true&w=majority
```

7. **Update the config file**:
   - Open `server/config.env`
   - Replace the `MONGODB_URI` with your Atlas connection string

### Option 2: Local MongoDB Installation

1. **Download MongoDB Community Server**: https://www.mongodb.com/try/download/community
2. **Install MongoDB** following the installation wizard
3. **Start MongoDB service**:
   - Windows: MongoDB should start automatically as a service
   - Mac: `brew services start mongodb-community`
   - Linux: `sudo systemctl start mongod`

### Option 3: Docker (if you have Docker installed)

```bash
docker run -d -p 27017:27017 --name mongodb mongo
```

## Test Your Setup

After setting up MongoDB, test the connection:

```bash
# Start the server
cd server
npm run dev
```

You should see:
```
Connected to MongoDB
Server running on port 5000
```

If you see connection errors, double-check your MongoDB setup.

## Troubleshooting

### Common Issues:

1. **Connection Refused**: MongoDB is not running
2. **Authentication Failed**: Wrong username/password
3. **Network Timeout**: IP address not whitelisted (Atlas)
4. **Database Not Found**: The database will be created automatically

### Reset Database (if needed):

```bash
cd server
npm run seed
```

This will clear the database and add sample data.
