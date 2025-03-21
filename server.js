const express = require("express");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const SECRET_KEY = process.env.JWT_SECRET || "Frogs";

// **Hardcoded Users**
const users = [
    { username: "Admin", password: "Mehmet1453" },
    { username: "Kleenex", password: "dalekbridge" },
    { username: "SillyGoose", password: "froglover" },
    { username: "Galax20", password: "silver" },
    { username: "Bluepinapple", password: "nErdlol" }
];

let messages = [];

function authenticateToken(req, res, next) {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(403).json({ message: "Unauthorized" });

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded.username;
        next();
    } catch {
        res.status(403).json({ message: "Invalid token" });
    }
}

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
app.post("/send", authenticateToken, (req, res) => {
    const message = {
        id: Date.now(),
        sender: req.user,
        text: req.body.message
    };
    messages.push(message);
    res.json({ message: "Message sent", data: message });
});

// **Delete Message (Admin only)**
app.delete("/deleteMessage", authenticateToken, (req, res) => {
    if (req.user !== "Admin") return res.status(403).json({ message: "Unauthorized" });

    messages = messages.filter(msg => msg.id !== req.body.id);
    res.json({ message: "Message deleted" });
});

// **Get Messages**
app.get("/messages", (req, res) => {
    res.json({ messages });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
