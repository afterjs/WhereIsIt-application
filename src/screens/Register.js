import { useNavigation } from "@react-navigation/native";
import React, { useState,useEffect } from "react";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { StyleSheet, View, Dimensions, ScrollView, PixelRatio,  Text, TextInput, TouchableOpacity, KeyboardAvoidingView } from "react-native";
import {widthPercentageToDP, heightPercentageToDP} from '../../Config/snippets'

import { AuthContext } from "../components/context";


export default props => {

  const { signIn } = React.useContext(AuthContext);



  const navigation = useNavigation();

  let login = () => {
    navigation.replace("Login");
  };





  const handleSignup = () => {

  


  };


  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined} keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}>
      <ScrollView style={styles.container}>
        <View>
          <View>
            <Text style={styles.novaConta}>Nova Conta</Text>
          </View>
          <View style={styles.formInputs}>
            <View style={styles.form}>
              <Text style={styles.inputTitle}>Nome</Text>
              <TextInput style={styles.input} />
              <View style={{ borderBottomColor: "#05164B", borderBottomWidth: 2 }} />
            </View>

            <View style={styles.form}>
              <Text style={styles.inputTitle}>Email</Text>
              <TextInput style={styles.input}  />
              <View style={{ borderBottomColor: "#05164B", borderBottomWidth: 2 }} />
            </View>

            <View style={styles.form}>
              <Text style={[styles.inputTitle, styles.password]}>Password</Text>
              <TextInput secureTextEntry={true} style={styles.input}  />
              <View style={{ borderBottomColor: "#05164B", borderBottomWidth: 2 }} />
            </View>
            <View style={styles.form}>
              <Text style={[styles.inputTitle, styles.password]}>Confirmar Password</Text>
              <TextInput secureTextEntry={true} style={styles.input} />
              <View style={{ borderBottomColor: "#05164B", borderBottomWidth: 2 }} />
            </View>
          </View>

          <View>
            <TouchableOpacity style={styles.button} onPress={handleSignup}>
              <Text style={styles.btnText}>Criar Conta</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.dontHaveAccount}>
            <Text style={styles.textCreate}>Já tens conta?</Text>
            <Text style={[styles.textCreate, styles.create]} onPress={login}>Login</Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );

}





const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 30,
  },
  novaConta: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: heightPercentageToDP('10%'),
    fontSize: RFValue(25),
    color: '#707070'
  },
  formInputs: {
    marginTop: heightPercentageToDP('2%'),
  },
  form: {
    marginHorizontal: 20,
    marginTop: heightPercentageToDP('5%'),
  },
  input: {
    height: 40,
    fontSize: RFValue(10),
  },
  inputTitle: {
    color: "#707070",
    fontSize: RFValue(15),
    fontWeight: "bold",
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
    fontSize: RFValue(17),
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
});
