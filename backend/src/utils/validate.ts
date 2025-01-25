// validate.ts - Utility functions for input validation

/**
 * Check if a value is a valid string.
 * @param value The value to check.
 * @returns boolean
 */
export const isString = (value: any): boolean => {
    return typeof value === 'string' && value.trim().length > 0;
};

/**
 * Check if a value is a valid email address.
 * @param value The email to check.
 * @returns boolean
 */
export const isEmail = (value: any): boolean => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return typeof value === 'string' && regex.test(value);
};

/**
 * Check if a value is a valid date (in the format YYYY-MM-DD).
 * @param value The value to check.
 * @returns boolean
 */
export const isDate = (value: any): boolean => {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    return typeof value === 'string' && regex.test(value);
};

/**
 * Check if a value is a valid enum.
 * @param value The value to check.
 * @param enumObject The enum object to check against.
 * @returns boolean
 */
export const isEnum = (value: any, enumObject: object): boolean => {
    return Object.values(enumObject).includes(value);
};

/**
 * Check if a value is required (non-empty).
 * @param value The value to check.
 * @returns boolean
 */
export const isRequired = (value: any): boolean => {
    return value !== null && value !== undefined && value.trim().length > 0;
};

/**
 * Validate if a value is a valid priority (High, Medium, Low).
 * @param value The priority to check.
 * @returns boolean
 */
export const isValidPriority = (value: any): boolean => {
    const validPriorities = ['High', 'Medium', 'Low'];
    return isEnum(value, validPriorities);
};

/**
 * Validate if a value is a boolean (true/false).
 * @param value The value to check.
 * @returns boolean
 */
export const isBoolean = (value: any): boolean => {
    return typeof value === 'boolean';
};

/**
 * Check if a value is a valid number.
 * @param value The value to check.
 * @returns boolean
 */
export const isNumber = (value: any): boolean => {
    return typeof value === 'number' && !isNaN(value);
};

/**
 * Validate if a value is a non-empty array.
 * @param value The value to check.
 * @returns boolean
 */
export const isArray = (value: any): boolean => {
    return Array.isArray(value) && value.length > 0;
};

/**
 * Validate if a value is a valid task (title, description, priority).
 * @param task The task object to check.
 * @returns boolean
 */
export const isValidTask = (task: any): boolean => {
    return isString(task.title) && isString(task.description) && isValidPriority(task.priority);
};

/**
 * Check if a value is a valid user session (user_id, timestamp, type).
 * @param session The session object to check.
 * @returns boolean
 */
export const isValidSession = (session: any): boolean => {
    return isRequired(session.user_id) && isDate(session.timestamp) && isEnum(session.type, ['Check-In', 'Check-Out']);
};

/**
 * Validates if a string is a valid UUID.
 * @param value The string to check.
 * @returns boolean
 */
export const isUUID = (value: any): boolean => {
    const regex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    return typeof value === 'string' && regex.test(value);
};

/**
 * Validate if an object has all the required fields (for task creation).
 * @param task The task object to validate.
 * @returns string[] A list of validation errors or an empty array if valid.
 */
export const validateTask = (task: any): string[] => {
    const errors: string[] = [];

    if (!isString(task.title)) errors.push("Title is required and must be a string.");
    if (!isString(task.description)) errors.push("Description must be a string.");
    if (!isValidPriority(task.priority)) errors.push("Priority must be 'High', 'Medium', or 'Low'.");
    if (!isDate(task.due_date)) errors.push("Due Date must be a valid date in the format YYYY-MM-DD.");

    return errors;
};

/**
 * Validate a user object (for registration or updating user profile).
 * @param user The user object to validate.
 * @returns string[] A list of validation errors or an empty array if valid.
 */
export const validateUser = (user: any): string[] => {
    const errors: string[] = [];

    if (!isEmail(user.email)) errors.push("Email must be a valid email address.");
    if (!isRequired(user.username)) errors.push("Username is required.");
    if (!isRequired(user.password)) errors.push("Password is required.");
    if (!isBoolean(user.is_admin)) errors.push("is_admin must be a boolean.");

    return errors;
};

/**
 * Validate if a session object has valid check-in/check-out times.
 * @param session The session object to validate.
 * @returns string[] A list of validation errors or an empty array if valid.
 */
export const validateSession = (session: any): string[] => {
    const errors: string[] = [];

    if (!isUUID(session.user_id)) errors.push("User ID must be a valid UUID.");
    if (!isDate(session.timestamp)) errors.push("Timestamp must be a valid date.");
    if (!isEnum(session.type, ["Check-In", "Check-Out"])) errors.push("Session type must be 'Check-In' or 'Check-Out'.");

    return errors;
};
