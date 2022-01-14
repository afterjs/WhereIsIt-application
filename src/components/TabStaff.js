import React from "react";
import { Text, View, StyleSheet, LogBox } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { FontAwesome5, MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";

import Profile from "../screens/Profile";
import PendingPins from "../screens/staff/PendingPins";
import UpdatePin from "../screens/staff/UpdatePins";

const Tab = createBottomTabNavigator();

LogBox.ignoreLogs(["AsyncStorage has been extracted from react-native core and will be removed in a future release."]);
LogBox.ignoreLogs(["Setting a timer"]);
LogBox.ignoreLogs(['Warning: ...']); 
LogBox.ignoreAllLogs();

export default class Tavbar extends React.Component {
  barIcon = (icon, size, type) => {
    return {
      tabBarIcon: ({ focused }) => (
        <View>
          <FontAwesome5 name={icon} size={size} color={focused ? "#05164B" : "gray"}></FontAwesome5>
        </View>
      ),
    };
  };

  render() {
    return (
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            tabBarHideOnKeyboard: "true",
            tabBarLabelStyle: {
              fontSize: 15,
              fontWeight: "bold",
            },
            tabBarShowLabel: true,
            headerShown: false,
            tabBarStyle: [
              {
                backgroundColor: "white",
                position: "absolute",
                height: 60,
                textAlign: "center",
                fontSize: 50,
              },
              null,
            ],
          }}
        >
          <Tab.Screen
            name="Pins Pendentes"
            component={PendingPins}
            options={{
              tabBarIcon: ({ focused }) => (
                <View>
                  <MaterialCommunityIcons name="map-clock" size={30} color={focused ? "#05164B" : "gray"}></MaterialCommunityIcons>
                </View>
              ),
            }}
          />

          <Tab.Screen
            name="Pins"
            component={UpdatePin}
            options={{
              tabBarIcon: ({ focused }) => (
                <View>
                  <MaterialCommunityIcons name="map" size={30} color={focused ? "#05164B" : "gray"}></MaterialCommunityIcons>
                </View>
              ),
            }}
          />

          <Tab.Screen name="Perfil" children={() => <Profile show={false} />} options={this.barIcon("user-alt", 30)} />
        </Tab.Navigator>
      </NavigationContainer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  tab: {
    position: "absolute",
  },
});
