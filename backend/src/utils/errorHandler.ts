import { Request, Response, NextFunction } from "express";

// Error handler middleware
export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    // Log the error for debugging purposes (you can replace this with a logging service)
    console.error(err.stack);

    // Set default status code to 500 if no status code is provided
    const statusCode = err.statusCode || 500;

    // Create a response object with the error message
    const response = {
        status: "error",
        statusCode,
        message: err.message || "Internal Server Error",
        ...(process.env.NODE_ENV === "development" && { stack: err.stack }), // Include stack trace only in development mode
    };

    // Send the error response
    res.status(statusCode).json(response);
};
