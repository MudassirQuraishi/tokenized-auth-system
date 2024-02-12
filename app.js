const express = require("express");
const bcrypt = require("bcrypt");
require("dotenv").config();
const User = require("./data/User");
const { generateAuthToken, authenticateToken } = require("./utilities");

const user = new User();
const app = express();
app.use(express.json());

/**
 * Middleware for handling unauthorized access to protected routes.
 *
 * This middleware uses the authenticateToken function to validate the user's access token.
 * If the token is missing or invalid, it responds with a 401 Unauthorized status.
 * If the token is valid, it attaches the authenticated user information to the request object.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Function} - Calls the next middleware function.
 *
 * @throws {Object} - Responds with a 401 Unauthorized status and a JSON object
 *                   if the provided token is missing or invalid.
 */
const authorize = async (req, res, next) => {
    try {
        // Extract the JWT token from the "Authorization" header
        const { authorization: authToken } = req.headers;

        // Authenticate the user using the provided token
        const authUser = await authenticateToken(authToken);

        if (!authUser) {
            // Respond with 401 if the token is missing or invalid
            return res.status(401).json({
                code: "UNAUTHORIZED",
                message: "Invalid access token",
            });
        }

        // Attach the authenticated user to the request for future middleware or routes
        req.authUser = authUser;
        next();
    } catch (error) {
        // Respond with 401 if an error occurs during authentication
        return res.status(401).json({
            code: "UNAUTHORIZED",
            message: "Invalid access token",
        });
    }
};

/**
 * Route to get all users.
 *
 * Fetches all user data and responds with a JSON object containing user information.
 * If the user file is not found or no users are found, it responds with a 404 status.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
app.get("/auth/user/get-users", async (req, res) => {
    const allUserData = user.fetchAllUsers();

    if (allUserData === undefined) {
        // Respond with 404 if the user file is not found
        return res.status(404).json({
            code: "DATA_NOT_FOUND",
            message: "User file not found. Add a user first",
        });
    } else if (allUserData.length === 0) {
        // Respond with 404 if no users are found
        return res.status(404).json({
            code: "DATA_NOT_FOUND",
            message: "No users found",
        });
    }

    // Respond with 200 and the fetched user data
    return res.status(200).json({
        code: "OK",
        message: "Users fetched successfully",
        data: allUserData,
    });
});

/**
 * Route to sign up a new user.
 *
 * Extracts user information from the request body, hashes the password,
 * and adds the user to the system. Responds with a 201 status upon successful creation.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
app.post("/auth/user/signup", async (req, res) => {
    const { name, email, password } = req.body;
    const saltrounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltrounds);

    // Add the user to the system
    user.addUser(name, email, hashedPassword);

    // Respond with 201 upon successful user creation
    return res.status(201).json({
        code: "CREATED",
        message: "User created successfully",
    });
});

/**
 * Route to log in a user.
 *
 * Extracts user credentials from the request body,
 * verifies the password, and generates an authentication token.
 * Responds with a 200 status and the authentication token upon successful login.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
app.post("/auth/user/login", async (req, res) => {
    const { email, password } = req.body;
    const userData = user.getUserByEmail(email);

    if (userData === null) {
        // Respond with 404 if the user is not found
        return res.status(404).json({
            code: "NOT_FOUND",
            success: false,
            message: "User Not Found",
        });
    }

    const passwordMatch = await bcrypt.compare(password, userData.password);

    if (!passwordMatch) {
        // Respond with 400 if the password does not match
        return res.status(400).json({
            code: "BAD_REQUEST",
            message: "Password Mismatch",
            success: false,
        });
    }

    // Generate an authentication token
    const jwtToken = generateAuthToken(userData);

    // Add the user to the client and respond with 200 and the token
    user.addUseToClient(userData.email, jwtToken);
    return res.status(200).json({
        code: "OK",
        message: "Logged in successfully",
        success: true,
        encryptedId: jwtToken,
        username: userData.email,
    });
});

/**
 * Route to add a product.
 *
 * Uses the authorize middleware to ensure the user is authenticated,
 * extracts the user email from the authenticated user information,
 * and adds a product to the user's account. Responds with a 201 status upon success.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
app.post("/api/user/add-product", authorize, (req, res) => {
    const { email } = req.authUser;

    // Add a product to the user's account
    user.addProduct(email, req.body);

    // Respond with 201 upon successful product addition
    return res.status(201).json({
        code: "CREATED",
        message: "Product added successfully",
        addedBY: email,
    });
});

/**
 * Start the server on the specified port or default to 3000.
 */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server started at ${PORT}`);
});
