import React from "react";
import { Text, View, StyleSheet,Dimensions } from "react-native";
import { AuthContext } from "../components/context";

import MapView from 'react-native-maps';
import whiteMode from "../../Config/whiteMode";
import Markers from "../Layouts/Markers";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default props => {



    return (
      <View style={styles.container}>
      
     <MapView
        customMapStyle={whiteMode}
          style={styles.mapStyle}
          initialRegion={{
            latitude: 41.695174467275805,
            longitude: -8.834282105916813,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          onLongPress={(e) => {
            console.log(e);
          }}
        >
            <Markers/>
     
        </MapView>
      </View>
    
    )
}

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
