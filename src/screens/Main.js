import React, { useState, useEffect } from "react";
import { View, StyleSheet, Dimensions, SafeAreaView, TouchableOpacity, Image, Text } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Marker } from "react-native-maps";
import MapView from "react-native-map-clustering";
import whiteMode from "../../Config/whiteMode";
import lixo from "../images/Icons/lixo-pin.png";
import banco from "../images/Icons/caixa-pin.png";
import { database } from "../../Config/firebase";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getDistance } from "geolib";
import Loader from "../components/Loader";

export default (props) => {
  const [pins, setPins] = useState([]);
  const [pinsByLoc, setPinsByLoc] = useState([]);
  const [zoom, setZoom] = useState(15);
  const [isLoading, setIsLoading] = useState(false);

  const [Lat, setLat] = useState("41.695174467275805");
  const [Long, setLong] = useState("-8.834282105916813");

  var top = useSafeAreaInsets().top;

  function getPins() {
    const ref = database.collection("pinsData");

    ref.onSnapshot((querySnashot) => {
      console.log("snap shot");
      const items = [];
      querySnashot.forEach((doc) => {
        items.push(doc.data());
      });
      setPins(items);
      update(items);
    });
  }

  let imageResolve = (img) => {
    if (img.trim() === "lixo") {
      return lixo;
    } else if (img.trim() === "banco") {
      return banco;
    }
  };

  let update = (arr) => {
    var counter = 0;
    var data = [];

    var range = 30;

    if (zoom < 10) {
      range = 500;
    }

    if (arr.length === 0) {
      console.log("dentro do pin");
      pins.forEach((item) => {
        if (distanceRange(item.loc.latitude, item.loc.longitude) < range) {
          data.push(item);
        }
      });
    } else {
      console.log("dentro do arr");
      arr.forEach((item) => {
        if (distanceRange(item.loc.latitude, item.loc.longitude) < range) {
          data.push(item);
        }
      });
    }

    if (data.length !== 0) {
      setPinsByLoc(data);
    }
  };

  // let changePinsLoc = () => {
  //   var data = [];

  //   var range = 100;

  //   if (zoom < 10) {
  //     range = 600;
  //   }

  //   pins.forEach((item) => {
  //     if (distanceRange(item.loc.latitude, item.loc.longitude) < range) {
  //       data.push(item);
  //     }
  //   });

  //   if (data.length !== 0) {
  //     setPinsByLoc(data);
  //   }

  // };

  function createMarker() {
    //marker function

    return pinsByLoc.map((marker, index) => (
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

  function distanceRange(lat, long) {
    var distance = getDistance({ latitude: Lat, longitude: Long }, { latitude: lat, longitude: long });
    return parseInt(distance / 1000);
  }

  useEffect(() => {
    getPins();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  }, []);

  if (isLoading) {
    return <Loader text={"A carregar o mapa.. 😎"} />;
  }

  return (
    <View style={styles.container}>
      <View>
        <Text style={{ justifyContent: "center", fontSize: 20, alignItems: "center" }}>Zoom -> {zoom}</Text>
        <Text style={{ justifyContent: "center", fontSize: 20, alignItems: "center" }}>Latitude -> {Lat}</Text>
        <Text style={{ justifyContent: "center", fontSize: 20, alignItems: "center" }}>Longitude -> {Long}</Text>
        <Text style={{ justifyContent: "center", fontSize: 20, alignItems: "center" }}>
          Caixotes Pertos -> {pinsByLoc.length} | Total -> {pins.length}{" "}
        </Text>
      </View>

      <MapView
        clusterColor="#05164B"
        clusterTextColor="white"
        showsUserLocation={true}
        showsMyLocationButton={true}
        followsUserLocation={true}
        maxZoom={15}
        customMapStyle={whiteMode}
        style={[styles.mapStyle, { marginTop: top }]}
        initialRegion={{
          latitude: 41.695174467275805,
          longitude: -8.834282105916813,
          latitudeDelta: 0.0243,
          longitudeDelta: 0.0234,
        }}
        onLongPress={(e) => {}}
        onRegionChangeComplete={(e) => {
          setLat(e.latitude);
          setLong(e.longitude);
          update([]);

          var t = parseInt(Math.log2(360 * (Dimensions.get("window").width / 256 / e.longitudeDelta)));
          setZoom(t);
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
    width: Dimensions.get("window").width,
    // height: Dimensions.get("window").height,
    height: "80%",
  },
});
