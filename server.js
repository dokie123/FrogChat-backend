const express = require("express");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const SECRET_KEY = process.env.JWT_SECRET || "your-secret-key";

// **Hard-coded users**
const users = [
    { username: "Kleenex", password: "Dalekbridge" },
    { username: "SillyGoose", password: "paswd" },
    { username: "izzy", password: "letmein" }
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
    res.json(messages);
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
