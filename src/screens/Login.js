import { useNavigation } from "@react-navigation/native";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import React, { useState, useEffect } from "react";
import { StyleSheet, View, ScrollView, Image, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, LogBox } from "react-native";
import { AuthContext } from "../components/context";
import {heightPercentageToDP } from "../../Config/snippets";
import { auth, database } from "../../Config/firebase";
import { normalAlert } from "../components/Alerts";
import Loader from "../components/Loader";
import AsyncStorage from '@react-native-async-storage/async-storage';


LogBox.ignoreLogs(['AsyncStorage has been extracted from react-native core and will be removed in a future release.']);
LogBox.ignoreLogs(['Setting a timer']); 


export default (props) => {
  const navigation = useNavigation();
  const { signIn } = React.useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [btn, btnStatus] = useState(false);
  const [isValidEmail, setisValidEmail] = useState(true);
  const [password, setPassword] = useState("");
  const [forgotPassword, setForgotPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  let register = () => {
    navigation.replace("Register");
  };

  let resetPassword = () => {
    navigation.replace("ResetPassword");
  };

  useEffect(() => {
   
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setIsLoading(true);
        setTimeout(() => {
          setIsLoading(false);
        //  normalAlert("Where Is It", "Bem Vindo ", "Ok");
          signIn();
        }, 1000);
      }
    });
    return unsubscribe;
  }, []);


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

  var counter = 0

  const saveData = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, value)
    } catch (error) {
      alert(error)
    }
  }

  const handleLogin = () => {
    isValidEmail && password !== ""
      ? auth
          .signInWithEmailAndPassword(email, password)
          .then((userCreadentials) => {
            btnStatus(true);
            const user = userCreadentials.user;

            if (user.emailVerified) {
              setIsLoading(true);

              const docRef = database
                .collection("users")
                .doc(user.uid)
                .get()
                .then(async (documentSnapshot) => {
                  const data = documentSnapshot.data();      
                  saveData('name', data.name.toString())
                  setTimeout(() => {
                    signIn();
                  }, 1000);
                });
            } else {
              auth
                .signOut()
                .then(() => {
                  navigation.replace("Login");
                })
                .catch((error) => alert(error.message));
              normalAlert("Login", "Tens de verificar o email 😪", "Ok");
            }
          })
          .catch((error) => {
            console.log(error.message);
             counter++
              counter >= 2 
              ? setForgotPassword(true)
              : setForgotPassword(false)

            normalAlert("Login", "A password é invalida ou o email não existe", "Verificar");
          })
      : normalAlert("Login", "Tens de preencher todos os campos!", "Verificar");
  };

  if (isLoading) {
    return <Loader text={"A fazer login... 😎"} />;
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined} keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}>
      <ScrollView style={styles.container}>
        <View>
          <View style={{ marginTop: heightPercentageToDP("7%"), alignItems: "center", justifyContent: "center" }}>
            <Image source={require("../images/mapa.png")} style={styles.logo} />
          </View>

          <View style={styles.formInputs}>
            <View style={styles.form}>
              <Text style={styles.inputTitle}>Email</Text>
              <TextInput style={styles.input} value={email} onChangeText={(text) => validate(text)} />
              <View style={styles.inputUnder} />
              <Text style={!isValidEmail ? styles.notValid : styles.isValid}>Email Invalido</Text>
            </View>

            <View style={styles.form}>
              <Text style={[styles.inputTitle, styles.password]}>Password</Text>
              <TextInput
                secureTextEntry={true}
                style={styles.input}
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                }}
              />
              <View style={styles.inputUnder} />

              <View style={forgotPassword ? styles.ShowforgotPasswordView : styles.HideforgotPasswordView} >
              <Text style={styles.forgotPassword}>Não sabes a password?</Text>
              <Text style={[styles.forgotPassword, styles.create]} onPress={resetPassword}>
                Recuperar
              </Text>
            </View>
            </View>
          </View>

          <View>
            <View>
              <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={btn}>
                <Text style={styles.btnText}>LOGIN</Text>
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
    paddingHorizontal: "10%",
  },
  logo: {
    resizeMode: "contain",
    maxWidth: "50%",
  },
  formInputs: {
    marginTop: heightPercentageToDP("15%"),
  },
  form: {
    marginHorizontal: 20,
    marginTop: heightPercentageToDP("1%"),
  },
  input: {
    height: heightPercentageToDP("5%"),
    fontSize: RFValue(15),
  },
  inputTitle: {
    color: "#707070",
    fontSize: RFValue(18),
    fontWeight: "bold",
  },
  password: {
    marginTop: heightPercentageToDP("5%"),
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
  textCreate: {
    fontWeight: "bold",
    marginTop: heightPercentageToDP("5%"),
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
  ShowforgotPasswordView: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    color: "#30A24B",
    
  },

  HideforgotPasswordView: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    color: "#30A24B",
    opacity: 0,
    height: 0,
  },

  create: {
    color: "#30A24B",
    paddingLeft: 10,
    textDecorationLine: "underline",
  },
  inputUnder: {
    borderBottomColor: "#05164B",
    borderBottomWidth: 2,
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
  textWait: {
    fontSize: RFValue(15),
    fontWeight: "bold",
    marginTop: heightPercentageToDP("3%"),
  },

  forgotPassword: {
    fontWeight: "bold",
    marginTop: heightPercentageToDP("5%"),
    color: "#707070",
    fontSize: RFValue(15),
    textAlign: "center",
  },
  
});
