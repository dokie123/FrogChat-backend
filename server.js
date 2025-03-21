const express = require("express");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const SECRET_KEY = process.env.JWT_SECRET || "Frogs";

// **Hard-coded users**
const users = [
    { username: "Admin", password: "Mehmet1453" },
    { username: "Kleenex", password: "dalekbridge" },
    { username: "SillyGoose", password: "froglover" },
    { username: "Galax20", password: "silver" },
    { username: "Bluepinapple", password: "nErdlol" }
];

let messages = [];

// **Login Endpoint**
app.post("/login", (req, res) => {
    const { username, password } = req.body;
    const user = users.find(user => user.username === username && user.password === password);

    if (!user) {
        return res.status(401).json({ message: "Invalid username or password" });
    }

    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "1h" });
    res.json({ token });
});

// **Send Message**
app.post("/send", (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(403).json({ message: "Unauthorized" });

    try {
        const { username } = jwt.verify(token, SECRET_KEY);
        messages.push({ sender: username, text: req.body.message });
        res.json({ message: "Message sent" });
    } catch {
        res.status(403).json({ message: "Invalid token" });
    }
});

// **Get Messages**
app.get("/messages", (req, res) => {
    const since = parseInt(req.query.since) || 0; // Get last received timestamp from query
    const newMessages = messages.filter(msg => msg.timestamp > since); // Send only new messages
    res.json({ messages: newMessages, latestTimestamp: Date.now() });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
