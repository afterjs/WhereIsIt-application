import React, { useState } from "react";

import { AuthContext } from "./src/components/context";
import Stack from "./src/components/Stack";

import Tab from "./src/components/Tab";
import TabStaff from "./src/components/TabStaff";
import TabAdmin from "./src/components/TabAdmin";
import { Alert } from "react-native";

export default function App() {
  const [IsAuthenticated, setIsAuthenticated] = useState({
    isAuthenticated: false,
    isAdmin: 0,
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

  let getScreen = () => {};

  return (
    <AuthContext.Provider value={authContext}>
      {!IsAuthenticated.isAuthenticated ? ( // se nao tiver logado
        <Stack /> // vai para o stack
      ) : IsAuthenticated.isAdmin === 0 ? (
        <Tab />
      ) : IsAuthenticated.isAdmin === 1 ? (
        <TabStaff />
      ) : IsAuthenticated.isAdmin === 2 ? (
        <TabAdmin />
      ) : null}
    </AuthContext.Provider>
  );
}
//Tab = 0
//TabAdmin == 2
//TabStaff == 1
