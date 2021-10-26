import React, {useState} from "react";


import { AuthContext } from "./src/components/context";
import Stack from "./src/components/Stack";
import Tab from "./src/components/Tab";

export default function App() {

  const [IsAuthenticated, setIsAuthenticated] = useState(false);

  const authContext = React.useMemo(() => ({
    
    signIn: () => {
      setIsAuthenticated(true);
    },
    signOut: () => {
      setIsAuthenticated(false);
    },
    data: () => {
      return IsAuthenticated
    }

  }));
  

    return <AuthContext.Provider value={authContext}>{!IsAuthenticated ? <Stack /> : <Tab />}</AuthContext.Provider>;

}
