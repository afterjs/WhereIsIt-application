import React, {useState} from "react";
import { Text, View, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { heightPercentageToDP } from "../../Config/snippets";


export default (props) => {


    return (
      <View style={styles.container}>
          <ActivityIndicator size="large" color="#05164B" />
        <Text style={styles.textActive}>OPÇÕES....</Text>
      </View>
    );  
  
 
};
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    paddingHorizontal: 30,
  },
  buttonActive: {
    marginTop: heightPercentageToDP("10%"),
    height: 50,
    alignItems: "center",
    backgroundColor: "#05164B",
    marginHorizontal: 10,
    justifyContent: "center",
    textAlign: "center",
    borderRadius: 10,
  },
  buttonDesactive: {
    marginTop: heightPercentageToDP("10%"),
    height: 50,
    alignItems: "center",
    backgroundColor: "#BBC6CB",
    marginHorizontal: 10,
    justifyContent: "center",
    textAlign: "center",
    borderRadius: 10,
  },
  btnText: {
    color: "#fff",
    fontSize: RFValue(20),
    fontWeight: "bold",
  },
  textActive: {
    textAlign: "center",
    fontSize: RFValue(20),
    color: "#707070",
    fontWeight: "300",
  },
});
