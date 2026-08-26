const { io } = require("socket.io-client");

const socket = io("http://localhost:5007", {
    auth: {
        schoolEmail: "test@test.com", 
    },
    transports: ["websocket", "polling"],
    reconnection: false
});

socket.on("connect", () => {
    console.log("SUCCESS! Connected. Socket ID:", socket.id);
    process.exit(0);
});

socket.on("connect_error", (err: any) => {
    console.error("CONNECT_ERROR:", err.message);
    process.exit(1);
});

socket.on("auth_error", (data: any) => {
    console.error("AUTH_ERROR:", data.message);
    process.exit(1);
});

setTimeout(() => {
    console.error("TIMEOUT! No response after 3 seconds.");
    process.exit(1);
}, 3000);
