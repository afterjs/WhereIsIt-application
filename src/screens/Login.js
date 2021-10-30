import { useNavigation } from "@react-navigation/native";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import React from "react";
import { StyleSheet, View,  ScrollView, Image, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Alert } from "react-native";
import { AuthContext } from "../components/context";

import { createTwoButtonAlert, widthPercentageToDP, heightPercentageToDP } from '../../Config/snippets'

export default props => {

  const navigation = useNavigation();
  const { signIn } = React.useContext(AuthContext);

  

  let register = () => {
  //  navigation.replace("Register");
    val = createTwoButtonAlert("teste 1", "teste 2")
    console.log(val)
  };


  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined} keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}>
      <ScrollView style={styles.container}>
        <View>
          <View style={{ marginTop: heightPercentageToDP('7%'), alignItems: "center", justifyContent: "center" }}>
            <Image source={require("../images/mapa.png")} style={styles.logo} />
          </View>

          <View style={styles.formInputs}>
            <View style={styles.form}>
              <Text style={styles.inputTitle}>Email</Text>
              <TextInput style={styles.input} />
              <View style={styles.inputUnder} />
            </View>

            <View style={styles.form}>
              <Text style={[styles.inputTitle, styles.password]}>Password</Text>
              <TextInput secureTextEntry={true} style={styles.input} />
              <View style={styles.inputUnder} />
            </View>
          </View>

          <View style={styles.btnGroup}>
            <View>
              <TouchableOpacity style={styles.button}>
                <Text style={styles.btnText} onPress={() => { signIn() }}>LOGIN</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.dontHaveAccount}>
              <Text style={styles.textCreate}>Ainda não tens conta?</Text>
              <Text style={[styles.textCreate, styles.create]} onPress={register}>
                Criar Conta
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};





const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: '10%',
  },
  logo: {
    resizeMode: "contain",
    maxWidth: '50%'
  },
  formInputs: {
    marginTop: heightPercentageToDP("15%"),
  },
  form: {
    marginHorizontal: 20,
    marginTop: heightPercentageToDP('1%'),
  },
  input: {
    height: heightPercentageToDP('5%'),
    fontSize: RFValue(15),

  },
  inputTitle: {
    color: "#707070",
    fontSize: RFValue(18),
    fontWeight: "bold",
  },
  password: {
    marginTop: heightPercentageToDP('5%'),
  },
  button: {
    marginTop: heightPercentageToDP('15%'),
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
  textCreate: {
    fontWeight: "bold",
    marginTop: heightPercentageToDP('5%'),
    color: "#707070",
    fontSize: RFValue(15),
    textAlign: "center",
  },
  dontHaveAccount: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    color: "#30A24B",
  },
  create: {
    color: "#30A24B",
    paddingLeft: 10,
    textDecorationLine: "underline",
  },
  inputUnder: {
    borderBottomColor: "#05164B",
     borderBottomWidth: 2
  }
});
