import { io } from "socket.io-client";
import { getToken } from "../models/token";

const GSocketInstance = io("https://docket.emilfolino.se", {
  auth: {
    token: getToken(),
  },
});

export default GSocketInstance;
