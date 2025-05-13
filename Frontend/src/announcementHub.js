// announcementHub.js
import * as signalR from "@microsoft/signalr";
import { toast, ToastContainer } from "react-toastify";

let connection = null;

export const startConnection = () => {
  connection = new signalR.HubConnectionBuilder()
    .withUrl("http://localhost:5213/notificationHub")
    .withAutomaticReconnect()
    .configureLogging(signalR.LogLevel.Information)
    .build();

  connection.on("ReceiveAnnouncement", (announcement) => {
    // Handle new announcement
    console.log("New announcement:", announcement);
    showAnnouncementToast(announcement);
  });

  connection
    .start()
    .then(() => console.log("Connected to announcement hub"))
    .catch((err) => console.error("Error connecting:", err));
};

export const stopConnection = () => {
  if (connection) {
    connection.stop();
  }
};

const showAnnouncementToast = (announcement) => {
  toast(announcement.message, {
    position: "top-center",
    autoClose: 5000, // 5 seconds
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    toastId: announcement.id,
  });
};
