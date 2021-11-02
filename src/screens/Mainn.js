import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Dimensions, SafeAreaView, TouchableOpacity, Image } from "react-native";
import { useIsFocused } from '@react-navigation/native';

import { StatusBar } from "expo-status-bar";
import * as Location from "expo-location";
import MapView, { Marker } from "react-native-maps";
import whiteMode from "../../Config/whiteMode";
import Markers from "../Layouts/Markers";
import WaitLocation from "../components/WaitLocation";
import Loader from "../components/Loader";
import AsyncStorage from "@react-native-async-storage/async-storage";

import lixo from "../images/Icons/lixo-pin.png";
import banco from "../images/Icons/caixa-pin.png";

import { database } from "../../Config/firebase";

export default (props) => {
  const [isActived, setIsActived] = useState(false);
  const [location, setLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lat, setLat] = useState(null);
  const [long, setLong] = useState(null);

  const [items, setItems] = useState([]);

  const getLoc = () => {
    
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("testeeee")
        return;
      }

      let location = await Location.getCurrentPositionAsync({});

      setLocation(location);
      setLat(location["coords"]["latitude"]);
      setLong(location["coords"]["longitude"]);
      setIsActived(true);
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    })();
  };



  const loadMarkers = () => {
    database
      .collection("pinsData")
      .get()
      .then((querySnapShot) => {
        querySnapShot.forEach((documentSnapshot) => {
          items.push(documentSnapshot.data());
        });
      });
  };

  let imageResolve = (img) => {
    if (img.trim() === "lixo") {
      return lixo;
    } else if (img.trim() === "banco") {
      return banco;
    }
  };

  function createMarker() {
    return items.map((marker, index) => (
      <Marker
        key={index}
        coordinate={{
          latitude: marker.loc.latitude,
          longitude: marker.loc.longitude,
        }}
        title={marker.title}
        description={marker.description}
      >
        <Image source={imageResolve(marker.type)} style={{ height: 41, width: 28 }} />
      </Marker>
    ));
  }

  useEffect(() => {
    console.log("effect")
   // loadMarkers();
  }, []);

  const isFocused = useIsFocused();



  if (isFocused) {
   //do something
  }
   

  if (!isActived) {
    return <WaitLocation loc={getLoc} />;
  }

  if (isLoading) {
    return <Loader text={"A procura da localização... 🛰️"} />;
  }

  return (
    <View style={styles.container}>
      <MapView
        selectedClusterColor="red"
        customMapStyle={whiteMode}
        style={styles.mapStyle}
        initialRegion={{
          latitude: lat,
          longitude: long,
          latitudeDelta: 0.0243,
          longitudeDelta: 0.0234,
        }}
        onLongPress={(e) => {
          console.log(e);
        }}
      >
        {createMarker()}
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
});
