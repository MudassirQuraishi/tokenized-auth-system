````markdown
# Stateless User Authentication using jsonwebtoken

## Table of Contents

-   [Installation](#installation)
-   [Endpoints](#endpoints)
-   [Configuration](#configuration)
-   [Technologies Used](#technologies-used)
-   [License](#license)

## Installation

1. **Clone the repository:**

    ```bash
    git clone https://github.com/MudassirQuraishi/tokenized-auth-system.git
    cd tokenized-auth-system
    ```
````

2. **Install dependencies:**

    ```bash
    npm install
    ```

3. **Set up environment variables:**

    Create a `.env` file in the root directory and add the necessary environment variables. You can use the provided `.env` file template as a starting point.

    ```plaintext
    PORT=3000 || your-desired-port
    JWT_SECRET_KEY=your-secret-key-here
    ```

4. **Run the application:**

    ```bash
    npm start
    ```

    Your application should now be running at [http://localhost:3000](http://localhost:3000).

## Endpoints

Checkout the [API_DOCUMENTATION]() to know more about the endpoints

## Configuration

The project requires the following configuration:

-   Port: The application runs on port 3000 by default. You can change this by modifying the PORT variable in the .env file.

-   JWT Secret Key: Set a strong secret key for encrypting and decrypting JWTs. Update the JWT_SECRET_KEY variable in the .env file with your secret key.

## Technologies Used

List the technologies and frameworks used in your project.

-   Node.js
-   Express.js
-   bcrypt
-   JSON Web Tokens (JWT)

## License

This project is licensed under the [MIT License](LICENSE).

```

```
