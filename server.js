const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

let messages = []; // Stores all chat messages

app.get("/messages", (req, res) => {
    res.json(messages);
});

app.post("/messages", (req, res) => {
    const { text } = req.body;
    if (!text) return res.status(400).send("Message is required");

    messages.push(text); // Store message
    res.status(201).send("Message received");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
