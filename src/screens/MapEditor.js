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
import * as Location from "expo-location";
import { Marker } from "react-native-maps";
import { database } from "../../Config/firebase";
import { getDistance } from "geolib";
let gpsChecker = false;
const checkServiceGps = require("../components/GpsStatus");

export default (props) => {
  const [Lat, setLat] = useState("41.695174467275805");
  const [Long, setLong] = useState("-8.834282105916813");
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
      update(items)

      return true;
    });
  };
  
  function distanceRange(lat, long) {
    var distance = getDistance({ latitude: Lat, longitude: Long }, { latitude: lat, longitude: long });
    return parseInt(distance / 1000);
  }


  let update = (arr) => {
    var data = [];

    var range = 30;

    if (zoom < 10) {
      range = 1000;
    }

    if (arr.length === 0) {
      pins.forEach((item) => {
        if (distanceRange(item.loc.latitude, item.loc.longitude) < range) {
        
            data.push(item);
          
        }
      });
    } else {
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
      console.log("desativadoooooooo");
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
        coordinate={{
          latitude: marker.loc.latitude,
          longitude: marker.loc.longitude,
        }}
        title={marker.title}
      >

      </Marker>
    ));
  }


  if (waitLocation) {
    return <WaitLocation_Screen loc={requestLoc} screen={showBtn} />;
  }

  return (
    <View style={styles.container}>
      <Text>{pinsByLoc.length}</Text>
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
         console.log(pinsByLoc.length);
          var zoom = parseInt(Math.log2(360 * (Dimensions.get("window").width / 256 / e.longitudeDelta)));
          setZoom(zoom);
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
});
