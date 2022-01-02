import React from "react";
import { Text, View, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";

import Profile from "../screens/Profile";
import PendingPins from "../screens/admin/PendingPins";

const Tab = createBottomTabNavigator();

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
                  <MaterialIcons name="maps-ugc" size={30} color={focused ? "#05164B" : "gray"}></MaterialIcons>
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
    position: "absolute"
  },
});
