import React, { useState, useEffect } from "react";
import { View, StyleSheet, Dimensions, Image, Text, TouchableOpacity } from "react-native";
import * as Location from "expo-location";
import WaitLocation_Screen from "../components/WaitLocation";
import { StatusBar } from "expo-status-bar";
import { Marker } from "react-native-maps";
import MapView from "react-native-map-clustering";
import tile from "../../Config/whiteMode";
import lixo from "../images/Icons/lixo-pin.png";
import banco from "../images/Icons/caixa-pin.png";
import { database } from "../../Config/firebase";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getDistance } from "geolib";
import { useIsFocused } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import MapOptions from "../screens/MapOptions";

let gpsChecker = false;

export default (props) => {
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


  var top = useSafeAreaInsets().top;

  const isFocused = useIsFocused();

  if (gpsChecker) {
    clearInterval(gpsChecker);
    gpsChecker = null;
  }

  if (isFocused) {
    if (isMapLoaded) {
      gpsChecker = setInterval(async () => {
        await checkServiceGps().then((val) => {
          if (!val) {
            setIsMapLoaded(false);
            setShowBtn(true);
            setWaitLocation(true);
          }
        });
      }, 2000);
    }
  }

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
        getPins(null).then((val) => {
          setTimeout(() => {
            setIsMapLoaded(true);
            setWaitLocation(false);

            setLat(JSON.stringify(location.coords.latitude));
            setLong(JSON.stringify(location.coords.longitude));
          }, 1000);
        });
      } catch (error) {
        setShowBtn(true);
      }
    })();
  };

  let getPins = async (pinType) => {
    const ref = database.collection("pinsData");
    ref.onSnapshot((querySnashot) => {
      const items = [];
      querySnashot.forEach((doc) => {

        if(pinType===null) {
          if (doc.data().type === iconSelected) {
            console.log("ICON NULL - ", iconSelected)
            items.push(doc.data());
          }
        } else {
          if (doc.data().type === pinType) {
            console.log("ICON MODIFIED- ", pinType)
            items.push(doc.data());
          }
        }
         
      });

      setPins(items);
      update(items);
      return true;
    });
  };

  let imageResolve = (img) => {
    if (img.trim() === "lixo") {
      return lixo;
    } else if (img.trim() === "banco") {
      return banco;
    }
  };

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
      </Marker>
    ));
  }

  function distanceRange(lat, long) {
    var distance = getDistance({ latitude: Lat, longitude: Long }, { latitude: lat, longitude: long });
    return parseInt(distance / 1000);
  }

  let checkServiceGps = async () => {
    let { status } = await Location.getForegroundPermissionsAsync();
    if (status === "granted") {
      let serviceStatus = await Location.hasServicesEnabledAsync();
      if (serviceStatus) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  };

  let changeScreenOption = (boolOps, boolMap) => {
    setShowOptions(boolOps);
    setIsMapLoaded(boolMap);
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

    return () => {
      console.log("clean up");
    };
  }, []);

  let setIconType = (newIcon) => {
    setNewIconSelected(newIcon);
    setWaitLocation(true);
    changeScreenOption(false, true);

  
    getPins(newIcon).then((val) => {
     setTimeout(() => {
      setIsMapLoaded(true);
      setWaitLocation(false);
     }, 1000);
    });

   

  };

  let changeMapType = (map) => {
    setMapType(map)

    console.log("New map setted -. " , map)
  }

  if (waitLocation) {
    return <WaitLocation_Screen loc={requestLoc} screen={showBtn} />;
  }

  if (showOptions) {
    return <MapOptions icon={iconSelected} setIcon={setIconType} screen={changeScreenOption}  map={mapType} changeMap={changeMapType}/>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.item}>
        <TouchableOpacity
          onPress={() => {
            changeScreenOption(true, false);
          }}
        >
          <MaterialCommunityIcons name="map-search-outline" size={30} color="red" />
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
});
