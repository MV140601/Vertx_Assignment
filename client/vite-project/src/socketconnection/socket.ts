    import { io } from "socket.io-client";

    const socket = io("http://localhost:4000", {
    withCredentials: true,
    transports: ["websocket"],
    });

    socket.on("connect", () => {
        console.log("Connected to socket server");
      });
      
      socket.on("disconnect", () => {
        console.log("Disconnected from socket server");
      });
      
      export default socket;