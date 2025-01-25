import { Server } from "socket.io";
import http from "http";
import Task from "../models/Task";
import User from "../models/User";
import Session from "../models/Session";

let io: Server | null = null;

export const initializeSocket = (server: http.Server) => {
    io = new Server(server, {
        cors: {
            origin: "*", // Allow all origins (change this in production)
            methods: ["GET", "POST"],
        },
    });

    io.on("connection", (socket) => {
        console.log(`New client connected: ${socket.id}`);

        // Task Events
        socket.on("create_task", async (taskData) => {
            try {
                const newTask = new Task(taskData);
                await newTask.save();
                io?.emit("task_created", newTask);
            } catch (error) {
                console.error("Error creating task:", error);
            }
        });

        socket.on("update_task", async (taskData) => {
            try {
                const task = await Task.findByIdAndUpdate(taskData.id, taskData, { new: true });
                io?.emit("task_updated", task);
            } catch (error) {
                console.error("Error updating task:", error);
            }
        });

        socket.on("delete_task", async (taskId) => {
            try {
                await Task.findByIdAndDelete(taskId);
                io?.emit("task_deleted", taskId);
            } catch (error) {
                console.error("Error deleting task:", error);
            }
        });

        // User Session Events
        socket.on("user_login", async (userId) => {
            try {
                const user = await User.findById(userId);
                if (user) {
                    const session = new Session({
                        user_id: userId,
                        type: "Check-In",
                        timestamp: new Date(),
                    });
                    await session.save();
                    io?.emit("user_logged_in", { userId, username: user.name });
                }
            } catch (error) {
                console.error("Error logging user in:", error);
            }
        });

        socket.on("user_logout", async (userId) => {
            try {
                const user = await User.findById(userId);
                if (user) {
                    const session = new Session({
                        user_id: userId,
                        type: "Check-Out",
                        timestamp: new Date(),
                    });
                    await session.save();
                    io?.emit("user_logged_out", { userId, username: user.name });
                }
            } catch (error) {
                console.error("Error logging user out:", error);
            }
        });

        socket.on("disconnect", () => {
            console.log(`Client disconnected: ${socket.id}`);
        });
    });

    return io;
};

// Function to get the existing socket instance
export const getSocketInstance = () => {
    if (!io) {
        throw new Error("Socket.io has not been initialized!");
    }
    return io;
};
