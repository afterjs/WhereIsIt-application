import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Dimensions } from "react-native";
import * as Location from "expo-location";



import WaitLocation_Screen from "../components/WaitLocation";
import Loader from "../components/Loader";

export default (props) => {
  const [waitLocation, setWaitLocation] = useState(true);
  const [location, setLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isBtnDisabled, setIsBtnDisabled] = useState(false);
  const [IsActived, setIsActived] = useState(false);
  const [showBtn, setShowBtn] = useState(true);

  let requestLoc = () => {
    (async () => {
        setIsBtnDisabled(true);
        setShowBtn(false);
        let { status } = await Location.requestForegroundPermissionsAsync();
        
        if (status !== 'granted') {
          console.log('Permission to access location was denied');
          return;
        }

        try {
            let location = await Location.getCurrentPositionAsync({});
            setShowBtn(false);
            setIsLoading(true);
            setWaitLocation(false);
            setLocation(location);
            setTimeout(()=> {   
                setIsActived(true);
                setIsLoading(false);
            },2000)
        } catch (error) {
            setIsBtnDisabled(false);
            setShowBtn(true);
        }

      })();
  };
 
  let checkServiceGps = () => {
    (async () => {
      let { status } = await Location.getForegroundPermissionsAsync();
      if (status === "granted") {
        let serviceStatus = await Location.hasServicesEnabledAsync();
        if (serviceStatus) {
          setIsActived(true);
          setWaitLocation(false);
        }
      }
    })();
  };

  
  useEffect(() => {
    checkServiceGps()
    return () => {
        console.log("clean up")
      };
  }, [])
  

  if (waitLocation) {
    return <WaitLocation_Screen loc={requestLoc} touch={isBtnDisabled} screen={showBtn}/>;
  }

 
  if (isLoading) {
    return <Loader text={"A procura da localização... 🛰️"} />;
  }


  return (
    <View style={styles.container}>
      <Text>location: {IsActived ? <Text>Ativado</Text> : <Text>desativado</Text>}</Text>
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
