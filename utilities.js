const jwt = require("jsonwebtoken");
const User = require("./data/User");
const user = new User();
function generateAuthToken(user) {
    const secretKey = process.env.JWT_SECRET_KEY;
    const token = jwt.sign(user.email, secretKey);
    return token;
}
async function authenticateToken(token) {
    try {
        const secretKey = process.env.JWT_SECRET_KEY;
        const email = jwt.verify(token, secretKey);
        const userData = user.getUserByEmail(email);

        if (!userData) {
            return false;
        }
        return userData;
    } catch (error) {
        console.error(error);
        return false;
    }
}

module.exports = {
    generateAuthToken,
    authenticateToken,
};
