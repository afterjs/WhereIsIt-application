import React, { useState, useEffect } from "react";
import { View, StyleSheet, Dimensions, Image, Text, TouchableOpacity, LogBox } from "react-native";
import * as Location from "expo-location";
import WaitLocation_Screen from "../components/WaitLocation";
import { StatusBar } from "expo-status-bar";
import { Marker, Callout } from "react-native-maps";
import MapView from "react-native-map-clustering";
import tile from "../../Config/whiteMode";

import { database, auth } from "../../Config/firebase";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getDistance } from "geolib";
import { useIsFocused } from "@react-navigation/native";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import MapOptions from "../screens/MapOptions";
import * as Linking from "expo-linking";
import { heightPercentageToDP, widthPercentageToDP } from "../../Config/snippets";
import { RFValue } from "react-native-responsive-fontsize";

import lixo from "../images/Icons/lixo-pin.png";
import banco from "../images/Icons/caixa-pin.png";
import ctt from "../images/Icons/pin-ctt.png";
import interesse from "../images/Icons/pin-interesse.png";

import AsyncStorage from "@react-native-async-storage/async-storage";

LogBox.ignoreLogs(["AsyncStorage has been extracted from react-native core and will be removed in a future release."]);
LogBox.ignoreLogs(["Setting a timer"]);
LogBox.ignoreLogs(['Warning: ...']); 
LogBox.ignoreAllLogs();

let gpsChecker = false;
const checkServiceGps = require("../components/GpsStatus");

export default (props) => {
  

  const [alreadyTaked, setAlreadyTaked] = useState(false);
  const [alreadyRequested, setAlreadyRequested] = useState(false);
  const [waitLocation, setWaitLocation] = useState(true);
  const [showBtn, setShowBtn] = useState(false);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [pins, setPins] = useState([]);
  const [pinsByLoc, setPinsByLoc] = useState([]);
  const [zoom, setZoom] = useState(15);
  const [Lat, setLat] = useState("41.695174467275805");
  const [Long, setLong] = useState("-8.834282105916813");
  const [showOptions, setShowOptions] = useState(false);
  const [iconSelected, setNewIconSelected] = useState("lixo");
  const [mapType, setMapType] = useState("standard");
  const [reloadMap, setRealoadMap] = useState(true);

  
  /*const [alreadyTaked, setAlreadyTaked] = useState(false);
  const [alreadyRequested, setAlreadyRequested] = useState(false);
  const [waitLocation, setWaitLocation] = useState(false);
  const [showBtn, setShowBtn] = useState(false);
  const [isMapLoaded, setIsMapLoaded] = useState(true);
  const [pins, setPins] = useState([]);
  const [pinsByLoc, setPinsByLoc] = useState([]);
  const [zoom, setZoom] = useState(15);
  const [Lat, setLat] = useState("41.695174467275805");
  const [Long, setLong] = useState("-8.834282105916813");
  const [showOptions, setShowOptions] = useState(false);
  const [iconSelected, setNewIconSelected] = useState("lixo");
  const [mapType, setMapType] = useState("standard");
  const [reloadMap, setRealoadMap] = useState(true);*/

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

  const saveData = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      alert(error);
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
        if (alreadyRequested) {
          setTimeout(() => {
            setIsMapLoaded(true);
            setWaitLocation(false);

            setLat(JSON.stringify(location.coords.latitude));
            setLong(JSON.stringify(location.coords.longitude));
          }, 1000);
        } else {
          getPins().then(() => {
            setTimeout(() => {
              setIsMapLoaded(true);
              setWaitLocation(false);

              setLat(JSON.stringify(location.coords.latitude));
              setLong(JSON.stringify(location.coords.longitude));
            }, 1000);
          });
        }
      } catch (error) {
        setShowBtn(true);
      }
    })();
  };

  let getPins = async () => {
    const ref = database.collection("pinsData");

    ref.onSnapshot((querySnashot, iconSelected) => {
      if (auth.currentUser) {
        const items = [];
        let docSize = querySnashot.docs.length;

        if (docSize != 0) {
          querySnashot.forEach((doc) => {
            items.push(doc.data());
          });

          (async () => {
            try {
              let iconName = await AsyncStorage.getItem("pin");
              setPins(items);
              updateWithIcon(items, iconName);
            } catch (error) {}
          })();
        } else {
          setPinsByLoc([]);
          setPins([]);
        }

        return true;
      } else {
        return false;
      }
    });
  };

  let updatePinSeted = async (novoPin) => {
    let newIconsData = [];

    var range = 30;

    if (zoom < 10) {
      range = 1000;
    }

    pins.forEach((item, index) => {
      if (item.type == novoPin) {
        if (distanceRange(item.loc.latitude, item.loc.longitude) < range) {
          newIconsData.push(item);
        }
      }
    });

    if (newIconsData.length > 0) {
      setPinsByLoc(newIconsData);
    } else {
      setPinsByLoc([]);
    }
    return true;
  };

  let imageResolve = (img) => {
    if (img.trim() === "lixo") {
      return lixo;
    } else if (img.trim() === "banco") {
      return banco;
    } else if (img.trim() === "ctt") {
      return ctt;
    } else if (img.trim() === "interesse") {
      return interesse;
    }
  };

  let update = () => {
    var data = [];

    var range = 30;

    if (zoom < 10) {
      range = 1000;
    }

    pins.forEach((item) => {
      if (distanceRange(item.loc.latitude, item.loc.longitude) < range) {
        if (item.type === iconSelected) {
          data.push(item);
        }
      }
    });

    if (data.length !== 0) {
      setPinsByLoc(data);
    } else {
      setPinsByLoc([]);
    }
  };

  let chooseGPSType = (coords) => {
    var scheme = Platform.OS === "ios" ? "maps:" : "geo:";
    var url = scheme + `${coords.latitude},${coords.longitude}`;

    Linking.openURL(url);
  };

  let updateWithIcon = (arr, icon) => {
    var data = [];

    var range = 30;

    if (zoom < 10) {
      range = 1000;
    }

    arr.forEach((item) => {
      if (distanceRange(item.loc.latitude, item.loc.longitude) < range) {
        if (item.type === icon) {
          data.push(item);
        }
      }
    });

    if (data.length !== 0) {
      setPinsByLoc(data);
    } else {
      setPinsByLoc([]);
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
        description={marker.description}
      >
        <Image source={imageResolve(marker.type)} style={{ height: 41, width: 28 }} />

        <Callout
          tooltip
          onPress={() => {
            chooseGPSType(marker.loc);
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

              <View style={styles.goLoc}>
                <Text style={styles.locText}>Marcar Localização</Text>
                <MaterialIcons name="gps-fixed" size={30} color="#05164B" />
              </View>
            </View>
            <View style={styles.arrowBorder} />
            <View style={styles.arrow} />
          </View>
        </Callout>
      </Marker>
    ));
  }

  function distanceRange(lat, long) {
    var distance = getDistance({ latitude: Lat, longitude: Long }, { latitude: lat, longitude: long });
    return parseInt(distance / 1000);
  }

  let changeScreenOption = (boolOps, boolMap) => {
    setShowOptions(boolOps);
    setIsMapLoaded(boolMap);
  };

  useEffect(() => {
    (async () => {
      try {
        let pn = await AsyncStorage.getItem("pin");
        let mpStyle = await AsyncStorage.getItem("map");

        if (pn != null) {
          setNewIconSelected(pn);
        }
        if (mpStyle != null) {
          setMapType(mpStyle);
        }
      } catch (error) {}

      const task = checkServiceGps().then((state) => {
        if (state) {
          setAlreadyRequested(true);
          getPins().then((val) => {
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
    })();
  }, []);

  let setIconType = (newIcon) => {
    saveData("pin", newIcon);
    setNewIconSelected(newIcon);
    setWaitLocation(true);
    changeScreenOption(false, true);

    updatePinSeted(newIcon).then((val) => {
      setTimeout(() => {
        setIsMapLoaded(true);
        setWaitLocation(false);
      }, 1000);
    });
  };

  let changeMapType = (map) => {
    saveData("map", map);
    setMapType(map);
    setWaitLocation(true);
    changeScreenOption(false, true);

    setWaitLocation(true);
    changeScreenOption(false, true);
    setRealoadMap(false);

    setTimeout(() => {
      setRealoadMap(true);
      setIsMapLoaded(true);
      setWaitLocation(false);
    }, 1500);
  };

  if (waitLocation) {
    return <WaitLocation_Screen loc={requestLoc} screen={showBtn} />;
  }

  if (showOptions) {
    return <MapOptions icon={iconSelected} setIcon={setIconType} screen={changeScreenOption} map={mapType} changeMap={changeMapType} />;
  }

  if (reloadMap) {
    return (
      <View style={styles.container}>
        <View style={styles.item}>
          <TouchableOpacity
            onPress={() => {
              changeScreenOption(true, false);
            }}
          >
            <MaterialCommunityIcons name="map-search-outline" size={30} color="#05164B" />
          </TouchableOpacity>
        </View>

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
          onLongPress={(e) => {}}
          onRegionChangeComplete={(e) => {
            setLat(e.latitude);
            setLong(e.longitude);
            update();

            var zoom = parseInt(Math.log2(360 * (Dimensions.get("window").width / 256 / e.longitudeDelta)));
            setZoom(zoom);
          }}
        >
          {createMarker()}
        </MapView>

        <StatusBar style="auto" />
      </View>
    );
  }
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
  },
  item: {
    justifyContent: "center",
    alignItems: "center",
    height: heightPercentageToDP("5%"),
    width: widthPercentageToDP("10%"),
    backgroundColor: "white",
    position: "absolute",
    top: heightPercentageToDP("13%"),
    right: widthPercentageToDP("2.6%"),
    zIndex: 1,
    opacity: 0.8,
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
    fontSize: RFValue(15),
    marginBottom: 5,
    textAlign: "center",
    color: "#05164B",
    fontWeight: "bold",
  },
  streetName: {
    fontSize: RFValue(12),
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
    fontSize: RFValue(13),
  },
  gpsButton: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  button: {
    alignItems: "center",
    backgroundColor: "#DDDDDD",
    padding: 10,
  },
  image: {
    width: 100,
    height: 80,
  },
  calloutImage: {
    textAlign: "center",
    justifyContent: "center",
    backgroundColor: "red",
  },
  goLoc: {
    flexDirection: "row",
    alignContent: "center",
    textAlign: "center",
    alignItems: "center",
    marginTop: 5,
    justifyContent: "space-around",
  },
});
