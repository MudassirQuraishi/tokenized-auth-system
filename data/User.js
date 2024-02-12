const fs = require("fs");

/**
 * Class representing a user with methods for user management.
 */
class User {
    /**
     * Create a User instance.
     */
    constructor() {
        /**
         * The file path for storing user data.
         * @type {string}
         */
        this.filePath = "users.json";

        /**
         * The file path for storing client data (authentication tokens).
         * @type {string}
         */
        this.clientPath = "client.json";

        /**
         * The file path for storing product data.
         * @type {string}
         */
        this.productPath = "products.json";

        /**
         * An array to store user data.
         * @type {Array}
         */
        this.users = [];
    }

    /**
     * Add a new user to the system.
     *
     * @param {string} name - The name of the user.
     * @param {string} email - The email of the user.
     * @param {string} password - The hashed password of the user.
     */
    addUser(name, email, password) {
        try {
            // Check if the user data file exists, if not, create an empty file
            if (!fs.existsSync(this.filePath)) {
                fs.writeFileSync(this.filePath, "[]", "utf8");
            }

            // Read existing user data from the file
            const existingData = fs.readFileSync(this.filePath, "utf8");
            const usersArray = existingData ? JSON.parse(existingData) : [];

            // Add the new user to the array
            const newUser = {
                name: name,
                email: email,
                password: password,
            };
            usersArray.push(newUser);

            // Write the updated user data back to the file
            fs.writeFileSync(
                this.filePath,
                JSON.stringify(usersArray, null, 2),
                "utf8"
            );
        } catch (error) {
            console.error(error.message);
        }
    }

    /**
     * Fetch all users from the system.
     *
     * @returns {Array} - An array containing all user data.
     */
    fetchAllUsers() {
        try {
            // Check if the user data file exists, if not, create an empty file
            if (!fs.existsSync(this.filePath)) {
                fs.writeFileSync(this.filePath, "[]", "utf8");
                return [];
            }

            // Read and parse user data from the file
            const userData = fs.readFileSync(this.filePath, "utf8");
            return JSON.parse(userData);
        } catch (error) {
            console.error(error.message);
        }
    }

    /**
     * Get user information by email.
     *
     * @param {string} email - The email of the user to retrieve.
     * @returns {Object|null} - The user object if found, otherwise null.
     */
    getUserByEmail(email) {
        const userData = JSON.parse(fs.readFileSync(this.filePath, "utf8"));

        for (const user of userData) {
            if (user.email === email) {
                return user;
            }
        }

        return null;
    }

    /**
     * Add user information to the client data (authentication tokens).
     *
     * @param {string} email - The email of the user.
     * @param {string} token - The authentication token for the user.
     */
    addUseToClient(email, token) {
        // Check if the client data file exists, if not, create an empty file
        if (!fs.existsSync(this.clientPath)) {
            fs.writeFileSync(this.clientPath, "[]", "utf8");
        }

        // Read existing client data from the file
        const existingData = fs.readFileSync(this.clientPath, "utf8");
        const clientsArray = existingData ? JSON.parse(existingData) : [];

        // Add the new user to the array
        const newUser = {
            email: email,
            AUTH_TOKEN: token,
        };
        clientsArray.push(newUser);

        // Write the updated client data back to the file
        fs.writeFileSync(
            this.clientPath,
            JSON.stringify(clientsArray, null, 2),
            "utf8"
        );
    }

    /**
     * Add a new product to the system.
     *
     * @param {string} email - The email of the user adding the product.
     * @param {Object} product - The product information (title, author, price, genre).
     */
    addProduct(email, { title, author, price, genre }) {
        // Check if the product data file exists, if not, create an empty file
        if (!fs.existsSync(this.productPath)) {
            fs.writeFileSync(this.productPath, "[]", "utf8");
        }

        // Read existing product data from the file
        const existingData = fs.readFileSync(this.productPath, "utf8");
        const productsArray = existingData ? JSON.parse(existingData) : [];

        // Add the new product to the array
        const newProduct = {
            addedBy: email,
            title: title,
            author: author,
            price: price,
            genre: genre,
        };
        productsArray.push(newProduct);

        // Write the updated product data back to the file
        fs.writeFileSync(
            this.productPath,
            JSON.stringify(productsArray, null, 2),
            "utf8"
        );
    }
}

module.exports = User;
