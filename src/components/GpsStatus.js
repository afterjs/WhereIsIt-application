import React, {useEffect} from 'react';
import * as Location from "expo-location";



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




module.exports = checkServiceGps;