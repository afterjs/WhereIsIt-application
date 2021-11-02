import React from "react";
import { Text, View, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { useState } from "react/cjs/react.development";
import { auth, database } from "../../Config/firebase";

export default (props) => {
  const [lat, setLat] = useState("");
  const [long, setLong] = useState("");

  let add = () => {
    const docRef = database.collection("pinsData").doc();

  };

  return (
    <View style={styles.container}>
      <Text>Map Editor Page</Text>
      <View style={styles.pd}>
        <TextInput
          style={styles.input}
          value={lat}
          placeholder="latitude"
          onChangeText={(text) => {
            setLat(text);
          }}
        ></TextInput>

        <TextInput
          style={styles.input}
          value={long}
          placeholder="longitude"
          onChangeText={(text) => {
            setLat(text);
          }}
        ></TextInput>
      </View>

      <TouchableOpacity style={styles.button} onPress={add}>
        <Text style={{ color: "white" }}>Adicionar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  button: {
    marginTop: "10%",
    height: 50,
    alignItems: "center",
    backgroundColor: "#05164B",
    marginHorizontal: 10,
    justifyContent: "center",
    textAlign: "center",
    borderRadius: 10,
  },
  pd: {
    marginHorizontal: 50,
  },
  input: {
    height: 50,
  },
});
