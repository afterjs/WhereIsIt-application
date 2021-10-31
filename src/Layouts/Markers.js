import React from "react";
import { Image } from "react-native";
import  { Marker } from "react-native-maps";


import lixo from '../images/Icons/lixo-pin.png'

export default (props) => {
  return (
    <Marker
      coordinate={{
        latitude: 41.695174467275805,
        longitude: -8.834282105916813,
      }}
      title={" Contentor de LIxo"}
      description="bla bla bla bla bla bla bla"
    
      onPress={(e)=>{
        console.log(e.nativeEvent.coordinate)
      }}
    >
      <Image source={lixo} style={{ height: 38, width: 24 }} />
    </Marker>
  );
};
