// AnnouncementManager.jsx
import { useEffect } from "react";
import { startConnection, stopConnection } from "../announcementHub.js";

const AnnouncementManager = () => {
  useEffect(() => {
    startConnection();

    return () => {
      stopConnection();
    };
  }, []);

  return null;
};

export default AnnouncementManager;

