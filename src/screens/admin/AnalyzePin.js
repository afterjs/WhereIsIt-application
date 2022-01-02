import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, TextInput } from "react-native";
import { heightPercentageToDP } from "../../../Config/snippets";
import { RFValue } from "react-native-responsive-fontsize";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { database, firebase } from "../../../Config/firebase";
import Loader from "../../components/Loader";

export default (props) => {
  const [isLoading, setIsLoading] = useState(true);
  const [pinData, setPinData] = useState({
    createdAt: "",
    description: "",
    latitude: "",
    longitude: "",
    status: "",
    streetName: "",
    title: "",
    type: "",
    user: "",
  });

  //function to convert timestamp to date
  function timeConverter(UNIX_timestamp) {
    var a = new Date(UNIX_timestamp * 1000);
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
      setPinData({
        createdAt: timeConverter(doc.data().createdAt),
        description: doc.data().description,
        latitude: doc.data().loc.latitude,
        longitude: doc.data().loc.longitude,
        status: doc.data().status,
        streetName: doc.data().streetName,
        title: doc.data().title,
        type: doc.data().type,
        user: doc.data().user,
      });

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

  let acceptPin = () => {
    pinStatus().then((status) => {
      if (status === "pending") {
        /*database.collection("pendingPins").doc(props.uid).update({
          status: "accepted",
        });*/
       
      }
    });
  };

  let rejectPin = () => {
    if (pinStatus() == "pending") {
      database.collection("pendingPins").doc(props.uid).update({
        status: "rejected",
      });
    }
  };

  if (isLoading) {
    return <Loader text={"A carregar dados... 👀"} />;
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
        <View>
          <Text style={styles.inputTitle}>Tipo de pin</Text>
          <TextInput style={styles.input} value={pinData.title} />
          <View style={styles.inputUnder} />
        </View>
        <View style={styles.spacebtw}>
          <Text style={styles.inputTitle}>Descrição</Text>
          <TextInput style={styles.input} value={pinData.description} />
          <View style={styles.inputUnder} />
        </View>
        <View style={styles.spacebtw}>
          <Text style={styles.inputTitle}>Nome da Rua</Text>
          <TextInput style={styles.input} value={pinData.streetName} />
          <View style={styles.inputUnder} />
        </View>

        <View style={[styles.divCoords, styles.spacebtw]}>
          <Text style={styles.inputTitle}>Latitude: </Text>
          <Text style={styles.coords}>{pinData.latitude}</Text>
        </View>

        <View style={[styles.divCoords, styles.spacebtw]}>
          <Text style={styles.inputTitle}>Longitude: </Text>
          <Text style={styles.coords}>{pinData.longitude}</Text>
        </View>

        <View style={styles.spacebtw}>
          <Text style={styles.inputTitle}>Data do pedido</Text>
          <TextInput style={styles.input} value={pinData.createdAt} />
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
    height: 40,
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
    top: 43,
  },
  pinTypeView: {
    marginTop: 20,
    marginBottom: 20,
    flexDirection: "column",
    paddingHorizontal: "10%",
    top: heightPercentageToDP("15%"),
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
    top: heightPercentageToDP("10%"),
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
    marginTop: heightPercentageToDP("20%"),
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
