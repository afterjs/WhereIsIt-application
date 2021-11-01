import React from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { heightPercentageToDP } from "../../Config/snippets";

export default (props) => {
  return (
    <View style={styles.container}>
      <Text style={styles.textActive}>Para um melhor funcionamento da aplicação, por favor ativa a localização no botão em baixo! 🤪</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          props.loc();
        }}
      >
        <Text style={styles.btnText}>Ativar Localização</Text>
      </TouchableOpacity>
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
  button: {
    marginTop: heightPercentageToDP("10%"),
    height: 50,
    alignItems: "center",
    backgroundColor: "#05164B",
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
