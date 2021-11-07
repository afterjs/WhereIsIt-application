import React from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { heightPercentageToDP } from "../../Config/snippets";




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
          disabled={props.touch}
        >
          <Text style={styles.btnText}>Ativar Localização</Text>
        </TouchableOpacity>
      </View>
    );
  }

  let withoutBtn = () => {
    return (
      <View style={styles.container}>
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
