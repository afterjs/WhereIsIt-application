import React, { useState, useEffect } from "react";
import { View, StyleSheet, Dimensions, Image, Text, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import MapView from "react-native-map-clustering";
import tile from "../../Config/whiteMode";
import { heightPercentageToDP } from "../../Config/snippets";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { useIsFocused } from "@react-navigation/native";
import WaitLocation_Screen from "../components/WaitLocation";
import CreatePin from "./CreatePins";
import * as Location from "expo-location";
import { Marker } from "react-native-maps";
import { database } from "../../Config/firebase";
import { getDistance } from "geolib";
import here from "../images/Icons/here.png";

let gpsChecker = false;
const checkServiceGps = require("../components/GpsStatus");

export default (props) => {
  const [creatingPin, setCreatingPin] = useState(false);
  const [Lat, setLat] = useState("41.695174467275805");
  const [Long, setLong] = useState("-8.834282105916813");
  const [MarkerLat, setMarkerLat] = useState("41.695174467275805");
  const [MarkerLong, setMarkerLong] = useState("-8.834282105916813");
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [pins, setPins] = useState([]);
  const [zoom, setZoom] = useState(15);
  const [waitLocation, setWaitLocation] = useState(true);
  const [showBtn, setShowBtn] = useState(false);
  const [pinsByLoc, setPinsByLoc] = useState([]);
  var top = useSafeAreaInsets().top;

  const isFocused = useIsFocused();

  if (gpsChecker) {
    clearInterval(gpsChecker);
    gpsChecker = null;
  }
  if (isFocused) {
    if (isMapLoaded) {
      gpsChecker = setInterval(async () => {
        checkServiceGps().then((val) => {
          if (!val) {
            setIsMapLoaded(false);
            setShowBtn(true);
            setWaitLocation(true);
          }
        });
      }, 2000);
    }
  }

  let getPins = async () => {
    const ref = database.collection("pinsData");
    ref.onSnapshot((querySnashot) => {
      const items = [];
      querySnashot.forEach((doc) => {
        items.push(doc.data());
      });
      setPins(items);
      update(items);

      return true;
    });
  };

  function distanceRange(lat, long, type) {
    var distance = getDistance({ latitude: Lat, longitude: Long }, { latitude: lat, longitude: long });

    return type == 0 ? distance / 1000 : distance;
  }

  let update = (arr) => {
    var data = [];

    var range = 30;

    if (zoom < 10) {
      range = 1000;
    }

    if (arr.length === 0) {
      pins.forEach((item) => {
        if (distanceRange(item.loc.latitude, item.loc.longitude, 0) < range) {
          data.push(item);
        }
      });
    } else {
      arr.forEach((item) => {
        if (distanceRange(item.loc.latitude, item.loc.longitude, 0) < range) {
          data.push(item);
        }
      });
    }

    if (data.length !== 0) {
      setPinsByLoc(data);
    }
  };

  let requestLoc = () => {
    (async () => {
      setShowBtn(false);
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        setShowBtn(true);
        return;
      }

      try {
        let location = await Location.getCurrentPositionAsync({});

        getPins().then((val) => {
          setLat(location.coords.latitude);
          setLong(location.coords.longitude);
          setIsMapLoaded(true);
          setWaitLocation(false);
        });
      } catch (error) {
        setShowBtn(true);
      }
    })();
  };

  useEffect(() => {
    checkServiceGps().then((state) => {
      if (state) {
        getPins(null).then((val) => {
          setTimeout(() => {
            setIsMapLoaded(true);
            setWaitLocation(false);
          }, 1000);
        });
      } else {
        setTimeout(() => {
          setShowBtn(true);
        }, 2000);
      }
    });
  }, []);

  function createMarker() {
    return pinsByLoc.map((marker, index) => (
      <Marker
        key={index}
        pinColor={"green"}
        coordinate={{
          latitude: marker.loc.latitude,
          longitude: marker.loc.longitude,
        }}
        title={marker.title}
      ></Marker>
    ));
  }

  let changeCreatingPinStatus = () => {
    setCreatingPin(!creatingPin);
  };

  if (waitLocation) {
    return <WaitLocation_Screen loc={requestLoc} screen={showBtn} />;
  }

  if (creatingPin) {
    return <CreatePin setScreen={changeCreatingPinStatus} lat={MarkerLat} long={MarkerLong} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.coordsDiv}>
        <Text style={styles.coords}>Latitude: {MarkerLat}</Text>
        <Text style={styles.coords}>Longitude: {MarkerLong}</Text>
      </View>

      <MapView
        clusterColor="#05164B"
        clusterTextColor="white"
        showsUserLocation={true}
        showsMyLocationButton={true}
        followsUserLocation={true}
        toolbarEnabled={false}
        showsCompass={false}
        maxZoom={10}
        customMapStyle={tile}
        mapType="standard"
        style={[styles.mapStyle, { marginTop: top }]}
        initialRegion={{
          latitude: parseFloat(Lat),
          longitude: parseFloat(Long),
          latitudeDelta: 0.0243,
          longitudeDelta: 0.0234,
        }}
        onRegionChangeComplete={(e) => {
          setLat(e.latitude);
          setLong(e.longitude);
          update([]);

          var distanceBetweenScreen = distanceRange(MarkerLat, MarkerLong, 1);
          var zoom = parseInt(Math.log2(360 * (Dimensions.get("window").width / 256 / e.longitudeDelta)));

          if (zoom <= 15) {
            setMarkerLat(e.latitude);
            setMarkerLong(e.longitude);
          }

          if (zoom >= 15) {
            if (distanceBetweenScreen < 100) {
              setMarkerLat(e.latitude);
              setMarkerLong(e.longitude);
            }
          }
          setZoom(zoom);
        }}
      >
        {createMarker()}

        <Marker
          draggable
          centerOffset={{ x: -18, y: -60 }}
          anchor={{ x: 0.69, y: 1 }}
          title="My Location"
          coordinate={{
            latitude: parseFloat(MarkerLat),
            longitude: parseFloat(MarkerLong),
          }}
          onDragEnd={(e) => {
            console.log(e.nativeEvent.coordinate);
            setMarkerLat(e.nativeEvent.coordinate.latitude);
            setMarkerLong(e.nativeEvent.coordinate.longitude);
          }}
        >
          <Image source={here} style={{ height: 46, width: 33 }} />
        </Marker>
      </MapView>

      <View style={styles.submitView}>
        <TouchableOpacity
          style={styles.submitCoord}
          onPress={() => {
            console.log("marcar loc");
          }}
        >
          <Text style={styles.textButton}>Marcar Pin</Text>
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
    position: "absolute",
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
  coordsDiv: {
    zIndex: 5,
    justifyContent: "center",
    position: "absolute",
    top: 40,
    left: 30,
    backgroundColor: "white",
    opacity: 0.9,
    borderRadius: 10,
    padding: 10,
  },
  coords: {
    fontSize: RFValue(20),
    fontWeight: "bold",
    color: "#05164B",
  },
  submitView: {
    position: "absolute",
    bottom: 100,
    left: 0,
    right: 0,
    zIndex: 5,
    height: 50,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  submitCoord: {
    backgroundColor: "#05164B",
    height: 55,
    width: "60%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  textButton: {
    color: "#fff",
    fontSize: RFValue(20),
    fontWeight: "bold",
  },
});
