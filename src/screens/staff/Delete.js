import React, { useState, useEffect } from "react";
import { View, StyleSheet, Dimensions, Image, Text, Alert, TouchableOpacity, LogBox} from "react-native";
import { StatusBar } from "expo-status-bar";
import { RFValue } from "react-native-responsive-fontsize";
import { heightPercentageToDP } from "../../../Config/snippets";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { database, firebase } from "../../../Config/firebase";

LogBox.ignoreLogs(["AsyncStorage has been extracted from react-native core and will be removed in a future release."]);
LogBox.ignoreLogs(["Setting a timer"]);
LogBox.ignoreLogs(['Warning: ...']); 
LogBox.ignoreAllLogs();

export default (props) => {
  let deletePin = () => {
    database
      .collection("pinsData")
      .doc(props.uid)
      .delete()
      .then(() => {
        Alert.alert("Gestão de Pin's", "Pin Eliminado com sucesso", [{ text: "OK" }]);
        props.setShowDeleteScreen(false);
      });
  };

  let deletePoint = async () => {
    const pinRef = database.collection("pinsData").doc(props.uid);
    const doc = await pinRef.get();

    if (doc.exists) {
      Alert.alert("Eliminar Pin", "Tens a certeza que queres eliminar?", [
        {
          text: "Confirmar",
          onPress: () => {
            deletePin();
          },
        },
        {
          text: "Cancelar",
          style: "cancel",
        },
      ]);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.item}>
        <TouchableOpacity
          onPress={() => {
            props.setShowDeleteScreen(false);
          }}
        >
          <MaterialCommunityIcons name="step-backward" size={30} color="#05164B" />
        </TouchableOpacity>
      </View>
      <Text style={styles.textWait}>Deseja eliminar o ponto de interesse?</Text>
      <Text style={styles.textWait}>Esta opção é irreversível!</Text>

      <TouchableOpacity
        style={[styles.button, styles.reject]}
        onPress={() => {
          deletePoint();
        }}
      >
        <Text style={styles.txtButtons}>Eliminar Ponto</Text>
      </TouchableOpacity>

      <StatusBar style="auto" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    elevation: 1,
  },
  textWait: {
    fontSize: RFValue(20),
    fontWeight: "bold",
    marginTop: heightPercentageToDP("3%"),
  },
  item: {
    justifyContent: "center",
    alignItems: "center",
    height: 40,
    width: 40,
    backgroundColor: "white",
    position: "absolute",
    top: 40,
    left: 30,
    zIndex: 1,
  },
  button: {
    marginTop: heightPercentageToDP("5%"),
    height: 50,
    width: "80%",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  txtButtons: {
    color: "#fff",
    fontSize: RFValue(20),
    fontWeight: "bold",
  },
  accept: {
    backgroundColor: "#54D157",
  },
  reject: {
    backgroundColor: "#F44336",
  },
});
