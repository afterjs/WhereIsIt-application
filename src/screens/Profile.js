import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { auth } from "../../Config/firebase";
import { AuthContext } from "../components/context";

export default (props) => {
  const { signOut } = React.useContext(AuthContext);

  const [name, setName] = useState("");

  const handleLogout = () => {
    auth
      .signOut()
      .then(() => {
        signOut();
      })
      .catch((error) => alert(error.message));
  };

  const load = async (key) => {
    try {
      let val = await AsyncStorage.getItem(key);

      if (val !== null) {
        setName(val);
      }
    } catch (error) {}
  };

  useEffect(() => {
    load('name')
  }, []);

  return (
    <View style={styles.container}>
      <Text>Ola {name}</Text>

      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    alignItems: "center",
    backgroundColor: "#DDDDDD",
    padding: 10,
  },
});
