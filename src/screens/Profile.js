import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, TouchableOpacity, Image, TextInput } from "react-native";
import { auth } from "../../Config/firebase";
import { AuthContext } from "../components/context";
import { heightPercentageToDP } from "../../Config/snippets";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import Loader from "../components/Loader";
import { Alert } from "react-native";
import { normalAlert } from "../components/Alerts";

export default (props) => {
  const [LogoutLoader, setLogoutLoader] = useState(false);
  const [passwordReseting, setPasswordReseting] = useState(false);
  const [changeEmailUi, setChangeEmailUi] = useState(false);
  const user = auth.currentUser;

  const { signOut } = React.useContext(AuthContext);

  const [info, setInfo] = useState({
    name: null,
    email: null,
  });

  const confirmAlert = (title, message, buttonConfirmText, func) => {
    Alert.alert(title, message, [
      {
        text: "Cancelar",
        style: "cancel",
      },
      { text: buttonConfirmText, onPress: () => func() },
    ]);
  };

  const handleLogout = () => {
    auth
      .signOut()
      .then(() => {
        setLogoutLoader(true);
        setTimeout(() => {
          setLogoutLoader(false);
          signOut();
        }, 1500);
      })
      .catch((error) => alert(error.message));
  };

  const load = async (key) => {
    try {
      let nm = await AsyncStorage.getItem("name");
      let em = await AsyncStorage.getItem("email");

      if (nm !== null && em !== null) {
        setInfo({
          name: nm,
          email: em,
        });
      }
    } catch (error) {}
  };

  useEffect(() => {
    load();
  }, []);

  if (LogoutLoader) {
    return <Loader text={"A fazer logout... 😎"} />;
  }

  if (passwordReseting) {
    return <Loader text={"A enviar email... 😎"} />;
  }

  let changeEmail = () => {
    // user.updateEmail(info.email+"a");
    // user.sendEmailVerification();
    //user logout
  };

  //    confirmAlert("Email", "Deseja alterar o Email?", "Confirmar", resetPassword)

  let resetPassword = () => {
    setPasswordReseting(true);

    auth
      .sendPasswordResetEmail(info.email.toString())
      .then(function () {
        auth
          .signOut()
          .then(() => {
            setTimeout(() => {
              signOut();
              normalAlert("Alterar Password", "Verifica a tua caixa de email para alterar a password 😎", "Ok");
            }, 1500);
          })
          .catch((error) => alert(error.message));
      })
      .catch(function (error) {
        if (error.code === "auth/user-not-found") {
          console.log("no user found");
          normalAlert("Alterar Password", "Não existe nenhum utilizador associado ao email 😓", "Verificar");
        }
      });
  };

  let btnsBody = () => {
    return (
      <View style={styles.btnLogout}>
        <TouchableOpacity style={[styles.button]}>
          <Text style={styles.btnText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  };

  let getBody = () => {
    if (!changeEmailUi) {
      return (
        <>
          <View style={styles.profile}>
            <View>
              <Image source={require("../images/Avatars/avatar.png")} style={styles.logo} />
            </View>
            <Text style={styles.name}>{info.name}</Text>
          </View>

          <View style={styles.buttons}>
            <View>
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  confirmAlert("Password", "Deseja alterar a password?", "Confirmar", resetPassword);
                }}
              >
                <Text style={styles.btnText}>Alterar Password</Text>
              </TouchableOpacity>
            </View>

            <View>
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  setChangeEmailUi(true);
                }}
              >
                <Text style={styles.btnText}>Alterar Email</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.btnLogout}>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: "red" }]}
                onPress={() => {
                  handleLogout();
                }}
              >
                <Text style={styles.btnText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </>
      );
    } else {
      return (
        <>
          <Text style={styles.title}>Alterar Email</Text>

          <View style={styles.formInputs}>
            <View style={styles.form}>
              <Text style={styles.inputTitle}>Email Atual</Text>
              <TextInput style={styles.input} />
              <View style={styles.inputUnder} />
              <Text style={styles.isValid}>Email Invalido</Text>
            </View>

            <View style={styles.form}>
              <Text style={styles.inputTitle}>Novo Email</Text>
              <TextInput style={styles.input} />
              <View style={styles.inputUnder} />
              <Text style={styles.isValid}>Email Invalido</Text>
            </View>
          </View>
          {btnsBody()}
        </>
      );
    }
  };

  return <View style={styles.container}>{getBody()}</View>;
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 30,
  },
  button: {
    alignItems: "center",
    backgroundColor: "#DDDDDD",
    padding: 10,
  },
  profile: {
    marginTop: heightPercentageToDP("10%"),
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  },
  logo: {
    resizeMode: "contain",
    height: 100,
  },
  name: {
    color: "#05164B",
    fontSize: RFValue(20),
    fontWeight: "bold",
    marginTop: heightPercentageToDP("2%"),
  },
  buttons: {
    flexDirection: "column",
    marginTop: heightPercentageToDP("10%"),
  },
  button: {
    marginTop: heightPercentageToDP("5%"),
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
  btnLogout: {
    marginTop: heightPercentageToDP("20%"),
  },
  title: {
    fontWeight: "bold",
    textAlign: "center",
    marginTop: heightPercentageToDP("10%"),
    fontSize: RFValue(25),
    color: "#05164B",
  },
  formInputs: {
    marginTop: heightPercentageToDP("10%"),
  },
  form: {
    marginHorizontal: 20,
    marginTop: heightPercentageToDP("10%"),
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
  inputUnder: {
    borderBottomColor: "#05164B",
    borderBottomWidth: 2,
  },
  isValid: {
    color: "red",
    marginTop: heightPercentageToDP("1%"),
    opacity: 0,
    height: 0,
  },
});
