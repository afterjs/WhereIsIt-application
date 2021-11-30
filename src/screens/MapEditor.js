import React, { useState, useEffect } from "react";
import { View, StyleSheet, Dimensions, Image, Text, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import MapView from "react-native-map-clustering";
import tile from "../../Config/whiteMode";
import {heightPercentageToDP } from "../../Config/snippets";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";



export default (props) => {
  const [Lat, setLat] = useState("41.695174467275805");
  const [Long, setLong] = useState("-8.834282105916813");
  const [mapType, setMapType] = useState("standard");
  var top = useSafeAreaInsets().top;

  return (
    <View style={styles.container}>
      <MapView
        clusterColor="#05164B"
        clusterTextColor="white"
        showsUserLocation={true}
        showsMyLocationButton={true}
        followsUserLocation={true}
        toolbarEnabled={false}
        showsCompass={false}
        maxZoom={15}
        customMapStyle={tile}
        mapType={mapType}
        style={[styles.mapStyle, { marginTop: top }]}
        initialRegion={{
          latitude: parseFloat(Lat),
          longitude: parseFloat(Long),
          latitudeDelta: 0.0243,
          longitudeDelta: 0.0234,
        }}
      ></MapView>

      <View>
        <TouchableOpacity style={styles.button} >
          <Text style={styles.btnText}>Adionar Ponto</Text>
        </TouchableOpacity>
      </View>

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
  mapStyle: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    // height: "80%",
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
    opacity: 0.5,
  },
  button: {
    position: 'absolute',
    marginTop: heightPercentageToDP("10%"),
    height: 50,
    alignItems: "center",
    backgroundColor: "#05164B",
    marginHorizontal: 10,
    justifyContent: "center",
    textAlign: "center",
    borderRadius: 10,
    top: 300,
    
  },
  btnText: {
    color: "#fff",
    fontSize: RFValue(20),
    fontWeight: "bold",
  },
}); 
