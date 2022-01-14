import React, {useEffect} from 'react';
import {LogBox} from 'react-native';
import * as Location from "expo-location";


LogBox.ignoreLogs(["AsyncStorage has been extracted from react-native core and will be removed in a future release."]);
LogBox.ignoreLogs(["Setting a timer"]);
LogBox.ignoreLogs(['Warning: ...']); 
LogBox.ignoreAllLogs();

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