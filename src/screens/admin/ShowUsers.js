import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, TextInput,LogBox } from "react-native";
import { heightPercentageToDP, widthPercentageToDP } from "../../../Config/snippets";
import { RFValue } from "react-native-responsive-fontsize";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { database, firebase } from "../../../Config/firebase";
import DropDownPicker from "react-native-dropdown-picker";
import Loader from "../../components/Loader";

LogBox.ignoreLogs(["AsyncStorage has been extracted from react-native core and will be removed in a future release."]);
LogBox.ignoreLogs(["Setting a timer"]);
LogBox.ignoreLogs(['Warning: ...']); 
LogBox.ignoreAllLogs();

export default (props) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoading2, setIsLoading2] = useState(false);
  const [isLoading3, setIsLoading3] = useState(false);
  const [updateUserData, setUpdateUserData] = useState(false);

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [pendingPinsCount, setPendingPinsCount] = useState(0);
  const [points, setPoints] = useState(0);
  const [permissions, setPermissions] = useState(0);

  const [data, setData] = useState({
    name: "",
    pendingPinsCount: 0,
  });

  let resolveName = async (val) => {
    if (val === 0) {
      return "Utilizador";
    } else if (val === 1) {
      return "Staff";
    } else if (val === 2) {
      return "Administrador";
    } else {
      return "Erro no sistema";
    }
  };

  const setPermission = (perm) => {
    if (perm === 0) {
      setAdmin();
    } else {
      setUser();
    }
  };

  let setAdmin = () => {
    Alert.alert("Lista de Utilizadores", `Deseja tornar o utilizador ${name} como Staff?`, [
      {
        text: "Sim",
        onPress: () => {
          setIsLoading2(true);
          const pinDoc = database.collection("users").doc(props.userID);
          pinDoc
            .update({
              permissions: 1,
            })
            .then(() => {
              setTimeout(() => {
                props.setScreen();
              }, 1500);
            });
        },
      },

      {
        text: "Não",
        style: "cancel",
      },
    ]);
  };

  let setUser = () => {
    Alert.alert("Lista de Utilizadores", `Deseja tornar o utilizador ${name} como utilizador?`, [
      {
        text: "Sim",
        onPress: () => {
          setIsLoading2(true);

          const pinDoc = database.collection("users").doc(props.userID);
          pinDoc
            .update({
              permissions: 0,
            })
            .then(() => {
              setTimeout(() => {
                props.setScreen();
              }, 1500);
            });
        },
      },

      {
        text: "Não",
        style: "cancel",
      },
    ]);
  };

  let askOptions = () => {
    Alert.alert("Lista de Utilizadores", `Escolha uma opção`, [
      {
        text: "Atualizar Dados",
        onPress: () => {
          setData({
            name: name,
            pendingPinsCount: pendingPinsCount,
          });
          setUpdateUserData(true);
        },
      },
      {
        text: "Apagar Conta",
        onPress: () => {
          deleteAccount();
        },
      },
      {
        text: "Cancelar",
        style: "cancel",
      },
    ]);
  };

  let updateUserAccountData = () => {
    //alert to confirm if the user wants to update the account data
    Alert.alert("Lista de Utilizadores", `Deseja atualizar os dados da conta do utilizador ${name}?`, [
      {
        text: "Sim",
        onPress: () => {
          setIsLoading2(true);
          const pinDoc = database.collection("users").doc(props.userID);
          pinDoc
            .update({
              name: name,
              pendingPinsCount: pendingPinsCount,
            })
            .then(() => {
              setTimeout(() => {
                props.setScreen();
                Alert.alert("Lista de Utilizadores", `Dados atualizados com sucesso!`, [
                  {
                    text: "Ok",
                    style: "cancel",
                  },
                ]);
              }, 1500);
            });
        },
      },
      {
        text: "Não",
        style: "cancel",
      },
    ]);
  };

  let deleteAccount = () => {
    //alert to confirm if the user wants to update the account data
    Alert.alert("Lista de Utilizadores", `Deseja eliminar a conta do utilizador ${name} ?\nEsta opção é irreversível.`, [
      {
        text: "Sim",
        onPress: () => {
          setIsLoading3(true);
          const pinDoc = database.collection("users").doc(props.userID);
          pinDoc
            .update({
              canLogin: false,
            })
            .then(() => {
              setTimeout(() => {
                props.setScreen();
                Alert.alert("Lista de Utilizadores", `Conta apagada com sucesso.`, [
                  {
                    text: "Ok",
                    style: "cancel",
                  },
                ]);
              }, 1500);
            });
        },
      },
      {
        text: "Não",
        style: "cancel",
      },
    ]);
  };

  useEffect(async () => {
    const pinDoc = database.collection("users").doc(props.userID).get();

    pinDoc.then((doc) => {
      resolveName(doc.data().permissions).then((res) => {
        setEmail(doc.data().email);
        setName(doc.data().name);
        setPoints(doc.data().points);
        setPendingPinsCount(doc.data().pendingPinsCount);
        setPermissions(res);
      });

      setTimeout(() => {
        setIsLoading(false);
      }, 1500);
    });
  }, []);

  if (isLoading) {
    return <Loader text={"A carregar dados... 👀"} />;
  }

  if (isLoading2) {
    return <Loader text={"A atualizar dados... 🥸"} />;
  }

  if (isLoading3) {
    return <Loader text={"A apagar conta... 🥺"} />;
  }

  let getButtons = () => {
    if (updateUserData) {
      return (
        <View style={styles.btns}>
          <TouchableOpacity
            style={[styles.button, styles.manage]}
            onPress={() => {
              setName(data.name);
              setPendingPinsCount(data.pendingPinsCount);
              setUpdateUserData(false);
            }}
          >
            <Text style={styles.txtButtons}>Voltar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.accept]}
            onPress={() => {
              updateUserAccountData();
            }}
          >
            <Text style={styles.txtButtons}>Atualizar Dados</Text>
          </TouchableOpacity>
        </View>
      );
    } else {
      return (
        <View style={styles.btns}>
          <TouchableOpacity
            style={[styles.button, styles.manage]}
            onPress={() => {
              askOptions();
            }}
          >
            <Text style={styles.txtButtons}>Gerir Conta</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, props.screenType === 0 ? styles.accept : styles.decline]}
            onPress={() => {
              setPermission(props.screenType);
            }}
          >
            <Text style={styles.txtButtons}>{props.screenType == 0 ? "Tornar Staff" : "Tornar Utilizador"}</Text>
          </TouchableOpacity>
        </View>
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.item}>
        <TouchableOpacity
          onPress={() => {
            props.setScreen();
          }}
        >
          <MaterialCommunityIcons name="step-backward" size={30} color="#05164B" />
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>Informações da Conta</Text>

      <View style={styles.form}>
        <View style={styles.spacebtw}>
          <Text style={styles.inputTitle}>Nome</Text>
          <TextInput
            style={styles.input}
            value={name}
            editable={updateUserData}
            onChangeText={(text) => {
              setName(text);
            }}
          />
          <View style={styles.inputUnder} />
        </View>
        <View style={styles.spacebtw}>
          <Text style={styles.inputTitle}>Email</Text>
          <TextInput style={styles.input} value={email} editable={false} />
          <View style={styles.inputUnder} />
        </View>
        <View style={styles.spacebtw}>
          <Text style={styles.inputTitle}>Pins Pendentes</Text>
          <TextInput
            style={styles.input}
            value={pendingPinsCount.toString()}
            editable={updateUserData}
            onChangeText={(text) => {
              setPendingPinsCount(text);
            }}
          />
          <View style={styles.inputUnder} />
        </View>
        <View style={styles.spacebtw}>
          <Text style={styles.inputTitle}>Pontos</Text>
          <TextInput style={styles.input} value={points.toString()} editable={false} />
          <View style={styles.inputUnder} />
        </View>
        <View style={styles.spacebtw}>
          <Text style={styles.inputTitle}>Permissões</Text>
          <TextInput style={styles.input} value={permissions.toString()} editable={false} />
          <View style={styles.inputUnder} />
        </View>
      </View>

      <View style={styles.buttons}>{getButtons()}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    elevation: 1,
  },
  item: {
    justifyContent: "center",
    alignItems: "center",
    height: heightPercentageToDP("5%"),
    width: widthPercentageToDP("10%"),
    backgroundColor: "white",
    position: "absolute",
    top: heightPercentageToDP("4%"),
    left: 30,
    zIndex: 1,
  },
  title: {
    textAlign: "center",
    fontSize: RFValue(20),
    fontWeight: "bold",
    color: "#05164B",
    top: heightPercentageToDP("5%"),
  },
  text: {
    fontSize: RFValue(15),
    fontWeight: "bold",
    color: "#05164B",
  },

  form: {
    paddingHorizontal: "10%",
    top: heightPercentageToDP("6%"),
  },
  input: {
    height: heightPercentageToDP("5%"),
    fontSize: RFValue(15),
    marginTop: heightPercentageToDP("1%"),
  },
  spacebtw: {
    marginTop: heightPercentageToDP("2%"),
  },
  inputTitle: {
    color: "#05164B",
    fontSize: RFValue(20),
    fontWeight: "bold",
  },
  inputUnder: {
    borderBottomColor: "#05164B",
    borderBottomWidth: 2,
  },
  btnText: {
    color: "#fff",
    fontSize: RFValue(20),
    fontWeight: "bold",
  },
  divCoords: {
    flexDirection: "row",
  },
  coords: {
    fontWeight: "bold",
    fontSize: RFValue(19),
    color: "#646369",
  },
  buttons: {
    marginTop: heightPercentageToDP("13%"),
  },
  btns: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  button: {
    height: heightPercentageToDP("6%"),
    width: "40%",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  txtButtons: {
    color: "#fff",
    fontSize: RFValue(15),
    fontWeight: "bold",
  },
  accept: {
    backgroundColor: "#54D157",
  },
  decline: {
    backgroundColor: "#FF5252",
  },
  manage: {
    backgroundColor: "#05164B",
  },
});
