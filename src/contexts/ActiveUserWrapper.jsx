import { useEffect, useState } from "react";

import GSocketInstance from "../services/socket";

import { ActiveUserContext } from "./ActiveUserContext";

import { usernameToHSL } from "../utils/color";

export function ActiveUserWrapper({ children }) {
  const [activeUsers, setActiveUsers] = useState({});

  useEffect(() => {
    const updateUsers = (e) => {
      const users = {};

      e.forEach((user) => {
        users[user] = {
          color: usernameToHSL(
            user,
            Object.values(activeUsers)
              .map((u) => (typeof u === "object" ? u.color : u))
              .filter(Boolean),
          ),

          file: "Editing...",
        };
      });

      setActiveUsers(users);
    };

    GSocketInstance.on("users", updateUsers);

    return () => {
      GSocketInstance.off("users", updateUsers);
    };

    // this works fine. any other way and the color will re-generate
    // when a user leaves/joins, which is jarring.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ActiveUserContext
      value={{
        activeUsers,
      }}
    >
      {children}
    </ActiveUserContext>
  );
}
