import { useNavigation } from "@react-navigation/native";
import React from "react";
import { StyleSheet, View, Dimensions, ScrollView, Image, Text, TextInput, TouchableOpacity, KeyboardAvoidingView } from "react-native";

export default props=> {


    const navigation = useNavigation();

    let login = () => {
      navigation.replace("Login");
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
                <TextInput style={styles.input} />
                <View style={{ borderBottomColor: "#05164B", borderBottomWidth: 2 }} />
              </View>

              <View style={styles.form}>
                <Text style={[styles.inputTitle, styles.password]}>Password</Text>
                <TextInput secureTextEntry={true} style={styles.input} />
                <View style={{ borderBottomColor: "#05164B", borderBottomWidth: 2 }} />
              </View>
              <View style={styles.form}>
                <Text style={[styles.inputTitle, styles.password]}>Confirmar Password</Text>
                <TextInput secureTextEntry={true} style={styles.input} />
                <View style={{ borderBottomColor: "#05164B", borderBottomWidth: 2 }} />
              </View>
            </View>

            <View>
              <TouchableOpacity style={styles.button}>
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

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 30,
  },
  novaConta: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 50,
    fontSize: 35,
    color: '#707070'
  },
  formInputs: {
    marginTop: "15%",
  },
  form: {
    marginHorizontal: 20,
    marginTop: "10%",
  },
  input: {
    height: 40,
    fontSize: 15,
  },
  inputTitle: {
    color: "#707070",
    fontSize: 25,
    fontWeight: "bold",
  },
  password: {
    marginTop: "10%",
  },
  button: {
    marginTop: "30%",
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
    fontSize: 25,
    fontWeight: "bold",
  },
  textCreate: {
    fontWeight: "bold",
    marginTop: "5%",
    color: "#707070",
    fontSize: 20,
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
