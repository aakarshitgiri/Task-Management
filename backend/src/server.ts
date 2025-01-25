
require('dotenv').config();
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import taskRoutes from './routes/taskRoutes';
import userRoutes from './routes/userRoutes';
import authRoutes from './routes/authRoutes';


const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server);

app.use(cors());
app.use(express.json());


// API Routes
app.use('/tasks', taskRoutes);
app.use('/users', userRoutes);
app.use(authRoutes);

// Socket.io
io.on('connection', (socket) => {
    console.log('New client connected');
});

if (process.env.MONGO_URI) {
    mongoose.connect(process.env.MONGO_URI)
        .then(() => {
            console.log('Connected to MongoDB');
            server.listen(3000, () => {
                console.log('Server is running on port 3000');
            });
        })
        .catch((err) => console.error(err));
} else {
    console.error('MongoDB URI not found in .env file');
}