import React from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { auth } from "../../Config/firebase";
import { AuthContext } from "../components/context";
export default (props) => {
  const { signOut } = React.useContext(AuthContext);
  const handleLogout = () => {
    auth
      .signOut()
      .then(() => {
        signOut();
      })
      .catch((error) => alert(error.message));
  };

  return (
    <View style={styles.container}>
      <Text>Profile Page</Text>

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
