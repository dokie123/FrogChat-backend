<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Chat App</title>
    <style>
        body { font-family: Arial, sans-serif; text-align: center; background-color: #f4f4f4; }
        #chat-container { width: 400px; margin: auto; background: white; padding: 10px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); }
        #chat-box { height: 300px; border: 1px solid #ccc; overflow-y: auto; padding: 10px; background: #fff; text-align: left; }
        #message-input { width: 70%; padding: 8px; }
        button { padding: 8px 15px; background: #007BFF; color: white; border: none; cursor: pointer; }
        button:hover { background: #0056b3; }
    </style>
</head>
<body>
    <h2>Simple Chat App</h2>
    <div id="chat-container">
        <div id="chat-box"></div>
        <input type="text" id="message-input" placeholder="Type a message..." />
        <button onclick="sendMessage()">Send</button>
    </div>

    <script>
        const backendURL = "https://chat-backend.onrender.com"; // Change to your actual backend URL

        async function loadMessages() {
            const response = await fetch(`${backendURL}/messages`);
            const messages = await response.json();
            const chatBox = document.getElementById("chat-box");
            chatBox.innerHTML = messages.map(msg => `<div>${msg}</div>`).join("");
        }

        async function sendMessage() {
            const messageInput = document.getElementById("message-input");
            const text = messageInput.value.trim();
            if (!text) return;

            await fetch(`${backendURL}/messages`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text })
            });

            messageInput.value = "";
            loadMessages(); // Refresh messages after sending
        }

        // Load messages every 2 seconds (since we're not using WebSockets)
        setInterval(loadMessages, 2000);

        // Load messages on page load
        loadMessages();
    </script>
</body>
</html>
