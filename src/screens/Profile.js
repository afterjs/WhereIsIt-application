import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, TouchableOpacity, Image, TextInput, LogBox } from "react-native";
import { AuthContext } from "../components/context";
import { heightPercentageToDP } from "../../Config/snippets";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import Loader from "../components/Loader";
import { Alert } from "react-native";
import { normalAlert } from "../components/Alerts";
import { database, auth } from "../../Config/firebase";

LogBox.ignoreLogs(["AsyncStorage has been extracted from react-native core and will be removed in a future release."]);
LogBox.ignoreLogs(["Setting a timer"]);
LogBox.ignoreLogs(['Warning: ...']); 
LogBox.ignoreAllLogs();

export default (props) => {
  const [LogoutLoader, setLogoutLoader] = useState(false);
  const [passwordReseting, setPasswordReseting] = useState(false);
  const [changeEmailUi, setChangeEmailUi] = useState(false);
  const user = auth.currentUser;

  const { signOut } = React.useContext(AuthContext);

  const [name, setName] = useState("WhereIsIt");
  const [points, setPoints] = useState(0);

  const [email, setEmail] = useState({
    email: null,
    isValid: false,
  });

  const [newEmail, setNewEmail] = useState({
    email: null,
    isValid: false,
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
          signOut();
        }, 1500);
      })
      .catch((error) => alert(error.message));
  };

  const load = async () => {
    const doc = database.collection("users").doc(auth.currentUser.uid);

    doc.onSnapshot((docSnapshot) => {
      if (auth.currentUser) {
        setPoints(docSnapshot.data().points);
      } else {
        return false;
      }
    });

    try {
      let name = await AsyncStorage.getItem("name");
      if (name !== null) {
        setName(name);
      }
    } catch (error) {
    }
  };

  const validate = (text, type) => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    if (reg.test(text) === false) {
      if (type === 0) {
        setEmail({
          email: text.trim(),
          isValid: true,
        });
      } else {
        setNewEmail({
          email: text.trim(),
          isValid: true,
        });
      }
      return false;
    } else {
      if (type === 0) {
        setEmail({
          email: text.trim(),
          isValid: false,
        });
      } else {
        setNewEmail({
          email: text.trim(),
          isValid: false,
        });
      }
      return true;
    }
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
    if (email.email.trim() !== user.email.trim()) {
      normalAlert("Atenção", "O email que introduziu não é igual ao email associado.");
      return;
    } else {
      user.updateEmail(newEmail.email).then(() => {
        user.sendEmailVerification();

        database
          .collection("users")
          .doc(user.uid)
          .update({ email: newEmail.email.toString().trim() })
          .then((val) => {
            auth
              .signOut()
              .then(() => {
                setLogoutLoader(true);
                setTimeout(() => {
                  normalAlert("Atenção", "O teu email foi alterado. Confirme o novo email para poder fazer login.");
                  signOut();
                }, 1500);
              })
              .catch((error) => alert(error.message));
          });
      });
    }
  };

  let resetPassword = () => {
    setPasswordReseting(true);

    auth
      .sendPasswordResetEmail(user.email.toString())
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
          normalAlert("Alterar Password", "Não existe nenhum utilizador associado ao email 😓", "Verificar");
        }
      });
  };

  let btnsBody = () => {
    if (email.email === null && newEmail.email === null) {
      return (
        <View style={styles.btnLogout}>
          <TouchableOpacity
            style={[styles.button]}
            onPress={() => {
              setEmail({
                email: null,
                isValid: false,
              });

              setNewEmail({
                email: null,
                isValid: false,
              });

              setChangeEmailUi(false);
            }}
          >
            <Text style={styles.btnText}>Voltar</Text>
          </TouchableOpacity>
        </View>
      );
    } else {
      return (
        <View style={styles.btns}>
          <TouchableOpacity
            style={styles.buttonBottom}
            onPress={() => {
              setEmail({
                email: null,
                isValid: false,
              });

              setNewEmail({
                email: null,
                isValid: false,
              });

              setChangeEmailUi(false);
            }}
          >
            <Text style={styles.btnText}>Voltar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.buttonBottom, email.email != null && newEmail.email != null && !email.isValid && !newEmail.isValid ? {} : { backgroundColor: "#BBC6CB" }]}
            onPress={() => {
              changeEmail();
            }}
            disabled={email.isValid && newEmail.isValid ? true : false}
          >
            <Text style={styles.btnText}>Confirmar</Text>
          </TouchableOpacity>
        </View>
      );
    }
  };

  let profile = () => {
    if (props.show == true) {
      return (
        <Text style={styles.name}>
          {name} | {points} pontos
        </Text>
      );
    } else {
      return <Text style={styles.name}>{name}</Text>;
    }
  };

  let getBody = () => {
    if (!changeEmailUi) {
      return (
        <>
          <View style={styles.profile}>
            <View>
              <Image source={require("../images/Avatars/avatar.png")} style={styles.logo} />
            </View>
            {profile()}
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
              <TextInput style={styles.input} value={email.email} onChangeText={(text) => validate(text, 0)} />
              <View style={styles.inputUnder} />
              <Text style={email.isValid ? styles.notValid : styles.isValid}>Email Invalido</Text>
            </View>

            <View style={styles.form}>
              <Text style={styles.inputTitle}>Novo Email</Text>
              <TextInput style={styles.input} value={newEmail.email} onChangeText={(text) => validate(text, 1)} />
              <View style={styles.inputUnder} />
              <Text style={newEmail.isValid ? styles.notValid : styles.isValid}>Email Invalido</Text>
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
    textAlign: "center",
  },
  btnLogout: {
    marginTop: heightPercentageToDP("10%"),
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
    marginTop: heightPercentageToDP("5%"),
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
  notValid: {
    color: "red",
    marginTop: heightPercentageToDP("1%"),
  },
  btns: {
    marginTop: heightPercentageToDP("5%"),
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonBottom: {
    height: 50,
    width: "40%",
    backgroundColor: "#05164B",
    marginHorizontal: 10,
    justifyContent: "center",
    borderRadius: 10,
  },
});
