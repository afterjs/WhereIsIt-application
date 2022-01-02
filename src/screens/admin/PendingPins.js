import React, { useState, useEffect } from "react";
import { View, StyleSheet, Dimensions, Image, Text, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import MapView from "react-native-map-clustering";
import tile from "../../../Config/whiteMode";
import { useIsFocused } from "@react-navigation/native";
import WaitLocation_Screen from "../../components/WaitLocation";
import * as Location from "expo-location";
import { Marker, Callout } from "react-native-maps";
import { database, auth } from "../../../Config/firebase";
import { getDistance } from "geolib";

import AnalyzePin from "../../screens/admin/AnalyzePin";

import lixo from "../../images/Icons/lixo-pin.png";
import banco from "../../images/Icons/caixa-pin.png";

let gpsChecker = false;
const checkServiceGps = require("../../components/GpsStatus");

export default (props) => {
  const [Lat, setLat] = useState("41.695174467275805");
  const [Long, setLong] = useState("-8.834282105916813");
  const [showScreen, setShowScreen] = useState(false);
  const [uid, setUid] = useState("");
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [pins, setPins] = useState([]);
  const [zoom, setZoom] = useState(15);
  const [waitLocation, setWaitLocation] = useState(true);
  const [showBtn, setShowBtn] = useState(false);
  const [pinsByLoc, setPinsByLoc] = useState([]);
  const user = auth.currentUser;
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
    const ref = database.collection("pendingPins");
    ref.where("status", "==", "pending").onSnapshot((querySnashot) => {
      const items = [];
      querySnashot.forEach((doc) => {
        const result = {
          ...doc.data(),
          id: doc.id,
        };

        items.push(result);
      });
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
        try {
          if (distanceRange(item.loc.latitude, item.loc.longitude, 0) < range) {
            data.push(item);
          }
        } catch (error) {}
      });
    } else {
      arr.forEach((item) => {
        try {
          if (distanceRange(item.loc.latitude, item.loc.longitude, 0) < range) {
            data.push(item);
          }
        } catch (error) {}
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

  let screen = () => {
    setShowScreen(!showScreen);
  };

  let changeScren = (uid) => {
    setUid(uid);
    screen();
  };

  const createThreeButtonAlert = (uid) =>
    Alert.alert("Pedidos Pendentes", "Deseja analisar o seguinte pin pendente? ", [
      {
        text: "Aceitar",
        onPress: () => changeScren(uid),
      },
      {
        text: "Cancelar",
        style: "cancel",
      },
    ]);

  let imageResolve = (img) => {
    if (img.trim() === "lixo") {
      return lixo;
    } else if (img.trim() === "banco") {
      return banco;
    } else if (img.trim() === "ctt") {
      return banco;
    }
  };

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
        <Image source={imageResolve(marker.type)} style={{ height: 41, width: 28 }} />

        <Callout
          tooltip
          onPress={() => {
            createThreeButtonAlert(marker.id);
          }}
        >
          <View>
            <View style={[styles.bubble]}>
              <Text style={styles.name}>{marker.title.toUpperCase()}</Text>
              <Text style={styles.streetName}>Rua - {marker.streetName}</Text>
              <Text style={styles.description}>{marker.description}</Text>

              <View
                style={{
                  borderBottomColor: "#BBC6CB",
                  borderBottomWidth: 1,
                  padding: 5,
                }}
              />

              <View style={styles.pressEdit}>
                <Text style={styles.locText}>Clicar para editar</Text>
              </View>
            </View>
            <View style={styles.arrowBorder} />
            <View style={styles.arrow} />
          </View>
        </Callout>
      </Marker>
    ));
  }

  if (showScreen) {
    return <AnalyzePin uid={uid} setScreen={screen}></AnalyzePin>;
  }

  if (waitLocation) {
    return <WaitLocation_Screen loc={requestLoc} screen={showBtn} />;
  }

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

  bubble: {
    flexDirection: "column",
    alignSelf: "flex-start",
    backgroundColor: "#fff",
    borderRadius: 6,
    borderColor: "#ccc",
    borderWidth: 0.5,
    padding: 15,
    width: 200,
  },

  arrow: {
    backgroundColor: "transparent",
    borderColor: "transparent",
    borderTopColor: "#fff",
    borderWidth: 16,
    alignSelf: "center",
    marginTop: -32,
  },
  arrowBorder: {
    backgroundColor: "transparent",
    borderColor: "transparent",
    borderTopColor: "#007a87",
    borderWidth: 16,
    alignSelf: "center",
    marginTop: -0.5,
  },

  name: {
    fontSize: 20,
    marginBottom: 5,
    textAlign: "center",
    color: "#05164B",
    fontWeight: "bold",
  },
  streetName: {
    fontSize: 15,
    fontWeight: "bold",
  },
  description: {
    color: "#BBC6CB",
    marginTop: "3%",
    fontStyle: "italic",
  },
  locText: {
    color: "#05164B",
    fontWeight: "bold",
    fontSize: 15,
  },

  //streetName
  //description

  pressEdit: {
    flexDirection: "row",
    alignContent: "center",
    textAlign: "center",
    alignItems: "center",
    marginTop: 5,
    justifyContent: "space-around",
  },
});
