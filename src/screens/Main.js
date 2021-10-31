import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Dimensions, SafeAreaView, TouchableOpacity } from "react-native";

import { StatusBar } from "expo-status-bar";
import * as Location from 'expo-location';
import MapView from "react-native-maps";
import whiteMode from "../../Config/whiteMode";
import Markers from "../Layouts/Markers";

export default (props) => {
  const [isActived, setIsActived] = useState(false);

  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const getLoc = () => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  };

  let text = 'Waiting..';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }

  if (!isActived) {
    return (
      <View style={styles.container}>
        <Text>{text}</Text>

        <TouchableOpacity
        style={styles.button}
        onPress={getLoc}
      >
        <Text>Press Here</Text>
      </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        customMapStyle={whiteMode}
        style={styles.mapStyle}
        initialRegion={{
          latitude: 41.695174467275805,
          longitude: -8.834282105916813,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        onLongPress={(e) => {
          console.log(e);
        }}
      >
        <Markers />
      </MapView>
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
  },
  mapStyle: {
    flex: 1,
    width: Dimensions.get("window").width,
  },
  button: {
    alignItems: "center",
    backgroundColor: "#DDDDDD",
    padding: 10
  },
});
