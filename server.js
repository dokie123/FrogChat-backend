const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors());
app.use(express.json());

const SECRET_KEY = "Possum"; // Change this to a stronger secret in production

// 🔹 Hardcoded users (replace with a database later)
const users = {
    "sillyGoose": "froglover",
    "dancinPinAple": "nErdlol",
    "Kleenex": "Dalekbridge",
    "baSENORITA": "GITW",
    "violet": "password",
    "julianna": "password",
    "melita": "password"
};

// 🔹 Store messages with sender info
let messages = [];

// 🔐 Login Route - Users get a JWT if credentials are correct
app.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (users[username] && users[username] === password) {
        const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "1h" });
        return res.json({ token });
    }

    res.status(401).json({ error: "Invalid credentials" });
});

// 🛡️ Middleware to protect routes
function authenticate(req, res, next) {
    const token = req.headers.authorization?.split(" ")[1]; // Extract token

    if (!token) return res.status(401).json({ error: "Access denied" });

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({ error: "Invalid token" });
        req.user = user;
        next();
    });
}

// 🔹 Get Messages (Protected)
app.get("/messages", authenticate, (req, res) => {
    res.json(messages);
});

// 🔹 Send Messages (Protected)
app.post("/messages", authenticate, (req, res) => {
    const { text } = req.body;
    if (!text) return res.status(400).send("Message is required");

    messages.push({ sender: req.user.username, text }); // Store message with sender
    res.status(201).send("Message received");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
