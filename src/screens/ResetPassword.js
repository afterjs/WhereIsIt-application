import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Text, View, StyleSheet, TouchableOpacity, KeyboardAvoidingView, ScrollView, Platform, TextInput, Image, LogBox } from "react-native";
import { heightPercentageToDP } from "../../Config/snippets";
import { RFValue } from "react-native-responsive-fontsize";
import { auth } from "../../Config/firebase";
import {normalAlert} from "../components/Alerts"

LogBox.ignoreLogs(["AsyncStorage has been extracted from react-native core and will be removed in a future release."]);
LogBox.ignoreLogs(["Setting a timer"]);
LogBox.ignoreLogs(['Warning: ...']); 
LogBox.ignoreAllLogs();

export default (props) => {
  const navigation = useNavigation();

  const back = () => {
    navigation.replace("Login");
  };

  const [email, setEmail] = useState("");
  const [isValidEmail, setisValidEmail] = useState(true);

  const validate = (text) => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    if (reg.test(text) === false) {
      setEmail(text.trim());
      setisValidEmail(false);
      return false;
    } else {
      setEmail(text.trim());
      setisValidEmail(true);
      return true;
    }
  };

  const handleReset = () => {
    auth
      .sendPasswordResetEmail(email)
      .then(function () {
        normalAlert("Recuparar Password", "Email enviado. Verifica a tua caixa de email para alterar a password 😎", "Ok");
        back()
      })
      .catch(function (error) {
        if (error.code === "auth/user-not-found") {

          normalAlert("Recuparar Password", "Não existe nenhum utilizador associado ao email 😓", "Verificar");
        }
      });
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined} keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}>
      <ScrollView style={styles.container}>
        <View>
          <View>
            <Text style={styles.novaConta}>Recuperar Password</Text>
          </View>

          <View style={{ marginTop: heightPercentageToDP("2%"), alignItems: "center", justifyContent: "center" }}>
            <Image source={require("../images/mapa.png")} style={styles.logo} />
          </View>

          <View style={styles.form}>
            <Text style={styles.inputTitle}>Indique o email</Text>
            <TextInput style={styles.input} value={email} onChangeText={(text) => validate(text)} />
            <View style={{ borderBottomColor: "#05164B", borderBottomWidth: 2 }} />
            <Text style={!isValidEmail ? styles.notValid : styles.isValid}>Email Invalido</Text>
          </View>

          <View>
            <TouchableOpacity style={styles.button} onPress={handleReset}>
              <Text style={styles.btnText}>Recuperar</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.dontHaveAccount}>
            <Text style={styles.textCreate} onPress={back}>
              Clica para voltar para o
            </Text>
            <Text style={[styles.textCreate, styles.create]} onPress={back}>
              Login
            </Text>
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
    paddingHorizontal: 30,
  },
  logo: {
    resizeMode: "contain",
    maxWidth: "50%",
  },
  novaConta: {
    fontWeight: "bold",
    textAlign: "center",
    marginTop: heightPercentageToDP("10%"),
    fontSize: RFValue(25),
    color: "#707070",
  },
  form: {
    marginHorizontal: 20,
    marginTop: heightPercentageToDP("15%"),
  },
  input: {
    height: 40,
    fontSize: RFValue(15),
  },
  inputTitle: {
    color: "#707070",
    fontSize: RFValue(15),
    fontWeight: "bold",
  },
  btnText: {
    color: "#fff",
    fontSize: RFValue(20),
    fontWeight: "bold",
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
  textCreate: {
    fontWeight: "bold",
    marginTop: heightPercentageToDP("5%"),
    color: "#707070",
    fontSize: RFValue(18),
    textAlign: "center",
  },
  notValid: {
    color: "red",
    marginTop: heightPercentageToDP("1%"),
  },
  isValid: {
    color: "red",
    marginTop: heightPercentageToDP("1%"),
    opacity: 0,
    height: 0,
  },
});
