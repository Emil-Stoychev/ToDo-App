import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { AuthContext } from "./authContext";

export const OnlineUsersContext = createContext();

export const OnlineUsersContextProvider = ({ children }) => {
  const [onlineUsers, setOnlineUsers] = useState([]);
  let socket = useRef(null);
  const { user, setUser } = useContext(AuthContext);

  useEffect(() => {
    socket.current = io(`http://${window.location.hostname}:8800`);
    socket.current?.emit("newUser", user?._id);
    socket.current?.on("get-users", (users) => {
      console.log("ONLINE USERS");
      console.log(users);
      setOnlineUsers(users);
    });
  }, [socket, user]);

  return (
    <OnlineUsersContext.Provider
      value={{ onlineUsers, setOnlineUsers, socket }}
    >
      {children}
    </OnlineUsersContext.Provider>
  );
};
