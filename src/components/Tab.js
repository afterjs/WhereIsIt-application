import React from "react";
import { Text, View, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { FontAwesome5 } from "@expo/vector-icons";

import MapEditor from "../screens/MapEditor";
import Profile from "../screens/Profile";
import Main from "../screens/Main";

const Tab = createBottomTabNavigator();

export default class Tavbar extends React.Component {

    //posso trabalhar aqui dentro com 



   barIcon = (icon, size) => {
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
              "tabBarHideOnKeyboard":"true",
              tabBarLabelStyle: {
                fontSize: 15,
                fontWeight: 'bold'
              },
              tabBarShowLabel: true,
              headerShown: false,
              tabBarStyle: [
                {
                  backgroundColor: "white",
                  position: "absolute",
                  height: 60,
                  textAlign: 'center',
                  fontSize : 50
                },
                null,
              ],
            }}
          >
            <Tab.Screen name="Mapa" component={Main} options={this.barIcon("location-arrow", 30)} />
            <Tab.Screen name="Editor" component={MapEditor} options={this.barIcon("map-marked-alt", 30)} />
            <Tab.Screen name="Perfil" component={Profile} options={this.barIcon("user-alt", 30)} />
          </Tab.Navigator>
        </NavigationContainer>
      );
  }
  
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  tab: {
    position: "absolute",
    bottom: "40$",
  },
});
