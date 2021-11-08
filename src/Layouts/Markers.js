import React from "react";
import { Image } from "react-native";
import { Marker } from "react-native-maps";


import lixo from "../images/Icons/lixo-pin.png";
import banco from "../images/Icons/caixa-pin.png";

export default (props) => {

  let imageResolve = (img) => {
    if (img.trim() === "lixo") {
      return lixo;
    } else if (img.trim() === "banco") {
      return banco;
    }
  };

  return (
    <Marker
        key={props.index}
        coordinate={{
          latitude: props.latitude,
          longitude: props.longitude,
        }}
        title={props.title}
        description={props.description}
      >
        <Image source={imageResolve(props.type)} style={{ height: 41, width: 28 }} />
      </Marker>
  );
};
