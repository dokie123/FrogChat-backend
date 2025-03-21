const express = require("express");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const SECRET_KEY = process.env.JWT_SECRET || "Frogs";

// Hardcoded Users
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

// **Send Message Endpoint**
app.post("/send", (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(403).json({ message: "Unauthorized" });

    try {
        const { username } = jwt.verify(token, SECRET_KEY);
        const timestamp = Date.now();

        messages.push({ sender: username, text: req.body.message, timestamp });
        res.json({ message: "Message sent" });
    } catch {
        res.status(403).json({ message: "Invalid token" });
    }
});

// **Fetch Messages Endpoint (with timestamps)**
app.get("/messages", (req, res) => {
    const since = parseInt(req.query.since) || 0;
    const newMessages = messages.filter(msg => msg.timestamp > since);

    res.json({ messages: newMessages, latestTimestamp: Date.now() });
});

// **Delete Message (Admin Only)**
app.post("/delete", (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(403).json({ message: "Unauthorized" });

    try {
        const { username } = jwt.verify(token, SECRET_KEY);
        if (username !== "Admin") {
            return res.status(403).json({ message: "Only admins can delete messages" });
        }

        const index = req.body.index;
        if (index >= 0 && index < messages.length) {
            messages.splice(index, 1);
            return res.json({ message: "Message deleted" });
        }

        res.status(400).json({ message: "Invalid message index" });
    } catch {
        res.status(403).json({ message: "Invalid token" });
    }
});

// **Start Server**
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
