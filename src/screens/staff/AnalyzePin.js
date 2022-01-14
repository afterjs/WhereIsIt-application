import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, TextInput , LogBox} from "react-native";
import { heightPercentageToDP } from "../../../Config/snippets";
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
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    { label: "Contentores do Lixo", value: "lixo" },
    { label: "Caixas de Multibanco", value: "banco" },
    { label: "CTT", value: "ctt" },
    { label: "Interesses", value: "interesse" },
  ]);

  const [isLoading, setIsLoading] = useState(true);
  const [updatingPin, setUpdatingPin] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [streetName, setStreetName] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [type, setType] = useState("");
  const [createdAt, setCreatedAt] = useState("");
  const [user, setUser] = useState("");

  let resolveTitle = async (value) => {
    if (value === "lixo") {
      return "Contentores do Lixo";
    } else if (value === "banco") {
      return "Caixas de Multibanco";
    } else if (value === "ctt") {
      return "CTT";
    } else if (value === "interesse") {
      return "Interesses";
    }
  };

  //function to convert timestamp to date
  function timeConverter(UNIX_timestamp) {
    var a = new Date(UNIX_timestamp);
    var months = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outobro", "novembro", "dezembro"];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time = date + " " + month + " " + year + " " + hour + ":" + min + ":" + sec;
    return time;
  }

  useEffect(() => {
    const pinDoc = database.collection("pendingPins").doc(props.uid).get();

    pinDoc.then((doc) => {
      setCreatedAt(timeConverter(doc.data().createdAt));
      setUser(doc.data().user);
      setTitle(doc.data().title);
      setDescription(doc.data().description);
      setStreetName(doc.data().streetName);
      setLatitude(doc.data().loc.latitude);
      setLongitude(doc.data().loc.longitude);
      setValue(doc.data().type);

      setTimeout(() => {
        setIsLoading(false);
      }, 1500);
    });
  }, []);

  let pinStatus = () => {
    const pinDoc = database.collection("pendingPins").doc(props.uid).get();
    return pinDoc.then((doc) => {
      return doc.data().status;
    });
  };

  let updatePinFirestore = async (status) => {
    if (status === "accepted") {
      let newDoc = database.collection("pinsData").doc();

      newDoc
        .set({
          description: description,
          loc: new firebase.firestore.GeoPoint(latitude, longitude),
          streetName: streetName,
          title: await resolveTitle(value),
          type: value,
        })
        .then(() => {
          database.collection("pendingPins").doc(props.uid).update({
            status: "accepted",
          });

          database
            .collection("users")
            .doc(user)
            .update({
              pendingPinsCount: firebase.firestore.FieldValue.increment(-1),
            })
            .then(() => {
              database
                .collection("users")
                .doc(user)
                .update({
                  points: firebase.firestore.FieldValue.increment(2),
                });
            });
        });

      setUpdatingPin(true);
      setTimeout(() => {
        props.setScreen();
        Alert.alert("Atenção", "Pin aceite com sucesso e pontos entregues!", [{ text: "OK" }], { cancelable: false });
      }, 1500);
    } else {
      database.collection("pendingPins").doc(props.uid).update({
        status: "rejected",
      });

      setUpdatingPin(true);
      setTimeout(() => {
        props.setScreen();
        Alert.alert("Atenção", "Pin rejeitado com sucesso!", [{ text: "OK" }], { cancelable: false });
      }, 1500);
    }
  };

  let acceptPin = () => {
    pinStatus().then((status) => {
      if (status === "pending") {
        Alert.alert("Pedidos Pendentes", "Quer aceitar o novo pedido pendente?", [
          {
            text: "Confirmar",
            onPress: () => {
              updatePinFirestore("accepted");
            },
          },
          {
            text: "Cancelar",
            style: "cancel",
          },
        ]);
      }
    });
  };

  let rejectPin = () => {
    pinStatus().then((status) => {
      if (status === "pending") {
        Alert.alert("Pedidos Pendentes", "Quer aceitar o novo pedido pendente?", [
          {
            text: "Confirmar",
            onPress: () => {
              updatePinFirestore("rejected");
            },
          },
          {
            text: "Cancelar",
            style: "cancel",
          },
        ]);
      }
    });
  };

  if (isLoading) {
    return <Loader text={"A carregar dados... 👀"} />;
  }

  if (updatingPin) {
    return <Loader text={"A atualizar dados... 👀"} />;
  }

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

      <Text style={styles.title}>Pin Pendente</Text>

      <View style={styles.form}>
        <View style={styles.spacebtw}>
          <Text style={styles.text}>Escolhe o ponto</Text>
          <DropDownPicker
            style={styles.dropDown}
            open={open}
            value={value}
            items={items}
            setOpen={setOpen}
            setValue={setValue}
            setItems={setItems}
            translation={{
              PLACEHOLDER: "Escolhe um tipo",
            }}
            placeholderStyle={{
              color: "#05164B",
              fontWeight: "bold",
            }}
          />
        </View>
        <View style={styles.spacebtw}>
          <Text style={styles.inputTitle}>Descrição</Text>
          <TextInput
            style={styles.input}
            value={description}
            onChangeText={(text) => {
              setDescription(text);
            }}
          />
          <View style={styles.inputUnder} />
        </View>
        <View style={styles.spacebtw}>
          <Text style={styles.inputTitle}>Nome da Rua</Text>
          <TextInput
            style={styles.input}
            value={streetName}
            onChangeText={(text) => {
              setStreetName(text);
            }}
          />
          <View style={styles.inputUnder} />
        </View>

        <View style={[styles.divCoords, styles.spacebtw]}>
          <Text style={styles.inputTitle}>Latitude: </Text>
          <Text style={styles.coords}>{latitude}</Text>
        </View>

        <View style={[styles.divCoords, styles.spacebtw]}>
          <Text style={styles.inputTitle}>Longitude: </Text>
          <Text style={styles.coords}>{longitude}</Text>
        </View>

        <View style={styles.spacebtw}>
          <Text style={styles.inputTitle}>Data do pedido</Text>
          <TextInput style={styles.input} value={createdAt} editable={false} />
          <View style={styles.inputUnder} />
        </View>
      </View>

      <View style={styles.buttons}>
        <View style={styles.btns}>
          <TouchableOpacity
            style={[styles.button, styles.accept]}
            onPress={() => {
              acceptPin();
            }}
          >
            <Text style={styles.txtButtons}>Aceitar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.reject]}
            onPress={() => {
              rejectPin();
            }}
          >
            <Text style={styles.txtButtons}>Rejeitar</Text>
          </TouchableOpacity>
        </View>
      </View>
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
    height: heightPercentageToDP("4%"),
    width: 40,
    backgroundColor: "white",
    position: "absolute",
    top: 40,
    left: 30,
    zIndex: 1,
  },
  title: {
    textAlign: "center",
    fontSize: 30,
    fontWeight: "bold",
    color: "#05164B",
    top: heightPercentageToDP("4%"),
  },
  picker: {
    width: 100,
    height: 50,
    backgroundColor: "red",
  },
  text: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#05164B",
  },
  dropDown: {
    marginTop: 10,
  },
  form: {
    paddingHorizontal: "10%",
    top: heightPercentageToDP("5%"),
  },
  input: {
    height: heightPercentageToDP("5%"),
    fontSize: RFValue(15),
    marginTop: 10,
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
    marginTop: heightPercentageToDP("10%"),
  },
  btns: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  button: {
    height: 50,
    width: "40%",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  txtButtons: {
    color: "#fff",
    fontSize: RFValue(20),
    fontWeight: "bold",
  },
  accept: {
    backgroundColor: "#54D157",
  },
  reject: {
    backgroundColor: "#F44336",
  },
});
