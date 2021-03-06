import React, {useState} from "react";
import { Text, View, StyleSheet, TouchableOpacity, ActivityIndicator,LogBox } from "react-native";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { heightPercentageToDP } from "../../Config/snippets";

LogBox.ignoreLogs(["AsyncStorage has been extracted from react-native core and will be removed in a future release."]);
LogBox.ignoreLogs(["Setting a timer"]);
LogBox.ignoreLogs(['Warning: ...']); 
LogBox.ignoreAllLogs();

export default (props) => {

  

  let withBtn = () => {
    return (
      <View style={styles.container}>
        <Text style={styles.textActive}>Para um melhor funcionamento da aplicação, por favor ativa a localização no botão em baixo! 🤪</Text>
  
        <TouchableOpacity
          style={ !props.touch ? styles.buttonActive : styles.buttonDesactive}
          onPress={() => {
            props.loc();
          }}
         
        >
          <Text style={styles.btnText}>Ativar Localização</Text>
        </TouchableOpacity>
      </View>
    );
  }

  let withoutBtn = () => {
    return (
      <View style={styles.container}>
          <ActivityIndicator size="large" color="#05164B" />
        <Text style={styles.textActive}>A carregar....</Text>
      </View>
    );  
  }


  return(
    props.screen 
    ? withBtn()
    : withoutBtn()
  )
 
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
