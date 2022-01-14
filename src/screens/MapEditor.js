import React, { useState, useEffect } from "react";
import { View, StyleSheet, Dimensions, Image, Text, TouchableOpacity, Alert, LogBox } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import MapView from "react-native-map-clustering";
import tile from "../../Config/whiteMode";
import { heightPercentageToDP, widthPercentageToDP } from "../../Config/snippets";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { useIsFocused } from "@react-navigation/native";
import WaitLocation_Screen from "../components/WaitLocation";
import CreatePin from "./CreatePins";
import * as Location from "expo-location";
import { Marker } from "react-native-maps";
import { database, auth } from "../../Config/firebase";
import { getDistance } from "geolib";
import { normalAlert } from "../components/Alerts";
import here from "../images/Icons/here.png";

LogBox.ignoreLogs(["AsyncStorage has been extracted from react-native core and will be removed in a future release."]);
LogBox.ignoreLogs(["Setting a timer"]);
LogBox.ignoreLogs(['Warning: ...']); 
LogBox.ignoreAllLogs();
let gpsChecker = false;
const checkServiceGps = require("../components/GpsStatus");

export default (props) => {
  const [creatingPin, setCreatingPin] = useState(true);
  const [streetName, setStreetName] = useState("");
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
  const [pendingPinsCounter, setPendingPinsCounter] = useState(0);
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
      }, 1000);
    }
  }

  let getPins = async () => {
    const ref = database.collection("pinsData");
    ref.onSnapshot((querySnashot) => {
      if (auth.currentUser) {
        const items = [];
        querySnashot.forEach((doc) => {
          items.push(doc.data());
        });
        setPins(items);
        update(items);

        return true;
      } else {
        return false;
      }
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

  let changeCreatingPinStatus = async (typeChange) => {
    if (typeChange === 0) {
      var latitude = parseFloat(MarkerLat);
      var longitude = parseFloat(MarkerLong);

      await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      }).then((res) => {
        let street = res[0].street || "Estrada sem nome";
        setStreetName(street);

        for (let i = 0; i < pinsByLoc.length; i++) {
          let distance = getDistance({ latitude: pinsByLoc[i].loc.latitude, longitude: pinsByLoc[i].loc.longitude }, { latitude: MarkerLat, longitude: MarkerLong });

          if (distance < 5) {
            normalAlert("Atenção", `Já existe um ponto próximo ao seu local.\n Distancia : ${distance}m`, "OK");
            return;
          }
        }

        setCreatingPin(!creatingPin);
      });
    } else {
      setCreatingPin(!creatingPin);
    }
  };

  let verifyPinCounter = () => {
    database
      .collection("users")
      .doc(user.uid)
      .get()
      .then(async (documentSnapshot) => {
        const data = documentSnapshot.data();

        if (data.pendingPinsCount >= 3) {
          Alert.alert(
            "Aviso",
            "Tem " + data.pendingPinsCount + " pin(s) pendente(s) de aprovação!",
            [
              {
                text: "OK",
              },
            ],
            { cancelable: false }
          );
        } else {
          changeCreatingPinStatus(0);
        }
      });
  };

  let confirmAddPin = () => {
    Alert.alert("Editor de Mapa", "Deseja adicionar um novo pin?", [
      {
        text: "Cancelar",
        style: "cancel",
      },
      { text: "Sim", onPress: () => verifyPinCounter() },
    ]);
  };

  if (waitLocation) {
    return <WaitLocation_Screen loc={requestLoc} screen={showBtn} />;
  }

  if (creatingPin) {
    return <CreatePin setScreen={changeCreatingPinStatus} lat={MarkerLat} long={MarkerLong} street={streetName} pins={pinsByLoc} />;
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
          title="Novo Pin"
          coordinate={{
            latitude: parseFloat(MarkerLat),
            longitude: parseFloat(MarkerLong),
          }}
          onDragEnd={(e) => {
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
            confirmAddPin();
          }}
        >
          <Text style={styles.textButton}>Adicionar Ponto</Text>
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
    top: heightPercentageToDP("5%"),
    left: 30,
    backgroundColor: "white",
    opacity: 0.9,
    borderRadius: 10,
    padding: 10,
  },
  coords: {
    fontSize: RFValue(15),
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
