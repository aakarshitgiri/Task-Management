import { Request, Response } from "express";
import Task from "../models/Task";
import { getSocketInstance } from "../socket/taskSocket";

// **Create a New Task**
export const createTask = async (req: Request, res: Response): Promise<any> => {
    try {
        const { title, description, dueDate, priority } = req.body;
        const newTask = new Task({
            title,
            description,
            dueDate,
            priority: priority || "Medium",
            status: false,
            userId: req.params.userId,
        });
        await newTask.save();

        // Emit socket event
        try {
            const io = getSocketInstance();
            io.emit("task_update", { message: "New task added", task: newTask });
        } catch (socketError) {
            console.error("Socket error: ", socketError);
        }

        res.status(201).json(newTask);
    } catch (error) {
        res.status(500).json({ message: "Error creating task", error });
    }
};

// **Get All Tasks**
export const getTasks = async (req: Request, res: Response): Promise<any> => {
    try {
        const { priority, status, sortBy, order, page, limit } = req.query;
        const filter: any = {};
        if (priority) filter.priority = priority;
        if (status) filter.status = status === "true";

        const sortOptions: any = {};
        if (sortBy) sortOptions[sortBy as string] = order === "desc" ? -1 : 1;

        const tasks = await Task.find(filter)
            .sort(sortOptions)
            .skip((Number(page) - 1) * Number(limit))
            .limit(Number(limit))
            .lean();

        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: "Error fetching tasks", error });
    }
};

// **Get Task by ID**
export const getTaskById = async (req: Request, res: Response): Promise<any> => {
    try {
        if (!req.params.id) return res.status(400).json({ message: "Task ID is required" });

        const task = await Task.findById(req.params.id).lean();
        if (!task) return res.status(404).json({ message: "Task not found" });

        res.json(task);
    } catch (error) {
        res.status(500).json({ message: "Error fetching task", error });
    }
};

// **Update Task**
export const updateTask = async (req: Request, res: Response): Promise<any> => {
    try {
        const { title, description, dueDate, priority, status } = req.body;
        const updatedTask = await Task.findByIdAndUpdate(
            req.params.id,
            { title, description, dueDate, priority, status },
            { new: true, lean: true }
        );

        if (!updatedTask) return res.status(404).json({ message: "Task not found" });

        // Emit socket event
        try {
            const io = getSocketInstance();
            io.emit("task_update", { message: "Task updated", task: updatedTask });
        } catch (socketError) {
            console.error("Socket error: ", socketError);
        }

        res.json(updatedTask);
    } catch (error) {
        res.status(500).json({ message: "Error updating task", error });
    }
};

// **Delete Task**
export const deleteTask = async (req: Request, res: Response): Promise<any> => {
    try {
        if (!req.params.id) return res.status(400).json({ message: "Task ID is required" });

        const deletedTask = await Task.findByIdAndDelete(req.params.id);
        if (!deletedTask) return res.status(404).json({ message: "Task not found" });

        // Emit socket event
        try {
            const io = getSocketInstance();
            io.emit("task_update", { message: "Task deleted", taskId: req.params.id });
        } catch (socketError) {
            console.error("Socket error: ", socketError);
        }

        res.json({ message: "Task deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting task", error });
    }
};

// **Get User's Tasks**
export const getUserTasks = async (req: any, res: any): Promise<any> => {
    try {
        const id = req.params?.userId ? req.params.userId : req.userId;
        if (!id) return res.status(400).json({ message: "User ID is required" });

        const tasks = await Task.find({ userId: id }).lean();
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: "Error fetching user tasks", error });
    }
};
