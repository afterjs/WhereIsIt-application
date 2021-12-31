import React, { useState } from "react";

import { AuthContext } from "./src/components/context";
import Stack from "./src/components/Stack";
import Tab from "./src/components/Tab";

export default function App() {
  const [IsAuthenticated, setIsAuthenticated] = useState({
    isAuthenticated: false,
    isAdmin: false,
  });

  const authContext = React.useMemo(() => ({
    signIn: (isAdmin) => {
      setIsAuthenticated({
        isAuthenticated: true,
        isAdmin: isAdmin,
      });
    },
    signOut: () => {
      setIsAuthenticated(false);
    },
    data: () => {
      return IsAuthenticated;
    },
  }));

  return <AuthContext.Provider value={authContext}>{!IsAuthenticated.isAuthenticated ? <Stack /> : !IsAuthenticated.isAdmin ? <Tab /> : console.log("admin")}</AuthContext.Provider>;
}
