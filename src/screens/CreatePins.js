import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, TouchableOpacity, ActivityIndicator, Image, ScrollView, TextInput, LogBox } from "react-native";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";
import { heightPercentageToDP } from "../../Config/snippets";
import { normalAlert } from "../components/Alerts";
import Loader from "../components/Loader";
import DropDownPicker from "react-native-dropdown-picker";
import { database, auth, firebase } from "../../Config/firebase";


LogBox.ignoreLogs(["AsyncStorage has been extracted from react-native core and will be removed in a future release."]);
LogBox.ignoreLogs(["Setting a timer"]);
LogBox.ignoreLogs(['Warning: ...']); 
LogBox.ignoreAllLogs();

export default (props) => {
  const [open, setOpen] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [value, setValue] = useState(null);
  const [description, setDescription] = useState("Sem descrição...");
  const [items, setItems] = useState([
    { label: "Contentores do Lixo", value: "lixo" },
    { label: "Caixas de Multibanco", value: "banco" },
    { label: "CTT", value: "ctt" },
    { label: "Interesses", value: "interesse" },
  ]);

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

  let addNewPin = async () => {
    if (value == null) {
      normalAlert("Atenção", "Por favor selecione um tipo de ponto", "OK");
      return;
    }

    setShowLoader(true);

    let pinsData = props.pins;

    if (description.replace(/\s/g, "").length == 0) {
      setDescription("Sem descrição...");
    }

    const data = {
      description: description,
      loc: new firebase.firestore.GeoPoint(props.lat, props.long),
      streetName: props.street,
      title: await resolveTitle(value),
      type: value,
      user: auth.currentUser.uid,
      createdAt: Date.now(),
      status: "pending",
    };

    database
      .collection("pendingPins")
      .add(data)
      .then((res) => {
        database
          .collection("users")
          .doc(auth.currentUser.uid)
          .update({
            pendingPinsCount: firebase.firestore.FieldValue.increment(1),
          })
          .then((val) => {
            normalAlert("Sucesso", "Ponto criado com sucesso", "OK");
            props.setScreen(1);
          });
      });
  };

  if (showLoader) {
    return <Loader text={"A adicionar novo ponto 🥰"}></Loader>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.item}>
        <TouchableOpacity
          onPress={() => {
            props.setScreen(1);
          }}
        >
          <MaterialCommunityIcons name="step-backward" size={30} color="#05164B" />
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>Adicionar Novo Ponto</Text>

      <View style={styles.pinTypeView}>
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
      <View style={styles.descriptionView}>
        <View style={styles.form}>
          <Text style={styles.inputTitle}>Breve Descrição</Text>
          <TextInput
            style={styles.input}
            placeholder="Não obrigatorio"
            value={description}
            onChangeText={(text) => {
              setDescription(text);
            }}
          />
          <View style={styles.inputUnder} />
        </View>

        <View style={styles.form}>
          <Text style={styles.inputTitle}>Latitude</Text>
          <TextInput style={styles.input} value={props.lat.toString()} editable={false} />
          <View style={styles.inputUnder} />
        </View>

        <View style={styles.form}>
          <Text style={styles.inputTitle}>Longitude</Text>
          <TextInput style={styles.input} value={props.long.toString()} editable={false} />
          <View style={styles.inputUnder} />
        </View>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          addNewPin();
        }}
      >
        <Text style={styles.btnText}>Adicionar Ponto</Text>
      </TouchableOpacity>
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
    fontSize: RFValue(20),
    fontWeight: "bold",
    color: "#05164B",
    top: 43,
  },
  pinTypeView: {
    marginBottom: 20,
    flexDirection: "column",
    paddingHorizontal: "10%",
    top: heightPercentageToDP("10%"),
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
    marginTop: heightPercentageToDP("5%"),
  },
  input: {
    height: heightPercentageToDP("5%"),
    fontSize: RFValue(15),
    marginTop: 10,
  },
  inputTitle: {
    color: "#05164B",
    fontSize: RFValue(18),
    fontWeight: "bold",
  },
  inputUnder: {
    borderBottomColor: "#05164B",
    borderBottomWidth: 2,
  },
  button: {
    marginTop: heightPercentageToDP("10%"),
    height: 50,
    alignItems: "center",
    backgroundColor: "#05164B",
    justifyContent: "center",
    textAlign: "center",
    marginHorizontal: "10%",
    borderRadius: 10,
  },
  btnText: {
    color: "#fff",
    fontSize: RFValue(20),
    fontWeight: "bold",
  },
  coordsForm: {
    flexDirection: "column",
    top: heightPercentageToDP("30%"),
    paddingHorizontal: "10%",
  },
  descriptionView: {
    marginTop: heightPercentageToDP("10%"),
  },
});
