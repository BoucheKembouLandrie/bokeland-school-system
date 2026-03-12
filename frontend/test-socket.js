const { io } = require("socket.io-client");

const socket = io("http://localhost:5007", {
    auth: {
        schoolEmail: "test@test.com", // Dummy or actual if known
        logoUrl: "test-logo.png"
    },
    transports: ["websocket", "polling"],
    reconnection: false
});

socket.on("connect", () => {
    console.log("Connected successfully to community server! Socket ID:", socket.id);
    process.exit(0);
});

socket.on("connect_error", (err) => {
    console.error("Connection Error:", err.message);
    process.exit(1);
});

socket.on("auth_error", (data) => {
    console.error("Auth Error:", data);
    process.exit(1);
});

socket.on("disconnect", (reason) => {
    console.log("Disconnected:", reason);
    process.exit(1);
});

setTimeout(() => {
    console.error("Timeout waiting for connection.");
    process.exit(1);
}, 5000);
