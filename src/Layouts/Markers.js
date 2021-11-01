import React from "react";
import { Image } from "react-native";
import { Marker } from "react-native-maps";



import lixo from "../images/Icons/lixo-pin.png";

export default (props) => {
  return (
    <Marker
      coordinate={{
        latitude: props.lat,
        longitude: props.long,
      }}
      title={props.title}
      description={props.description}
      onPress={(e) => {
        console.log(e.nativeEvent.coordinate);
      }}
    >
      <Image source={lixo} style={{ height: 41, width: 28 }} />
    </Marker>
  );
};
