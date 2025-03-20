const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json()); // Allow JSON requests

// In-memory storage for messages (will be lost if server restarts)
let messages = [];

app.get("/messages", (req, res) => {
    res.json(messages);
});

app.post("/messages", (req, res) => {
    const { text } = req.body;
    if (!text) {
        return res.status(400).json({ error: "Message text is required" });
    }
    messages.push(text);
    res.json({ success: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
