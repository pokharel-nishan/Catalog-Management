import { useEffect } from "react";
import { startConnection, stopConnection } from "../announcementHub";
import { useAuth } from "../context/AuthContext";

const AnnouncementManager = () => {
  const { user } = useAuth();

  const userId =
    user?.id ||
    (() => {
      const storedUser = localStorage.getItem("authUser");
      if (!storedUser) return null;
      try {
        return JSON.parse(storedUser).id;
      } catch {
        return null;
      }
    })();

  const userToken =
    "Bearer " + user?.token ? user?.token : localStorage.getItem("token");

  useEffect(() => {
    if (userId && userToken) {
      // Start connection with user ID and token
      startConnection(userId, userToken);

      return () => {
        stopConnection();
      };
    }
  }, [userId, userToken]);

  return null;
};

export default AnnouncementManager;
