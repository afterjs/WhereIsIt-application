import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, TextInput, LogBox } from "react-native";
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

  const [description, setDescription] = useState("");
  const [streetName, setStreetName] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

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

  useEffect(() => {
    const pinDoc = database.collection("pinsData").doc(props.uid).get();

    pinDoc.then((doc) => {
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

  let updatePinFirestore = async () => {
    setUpdatingPin(true);
    const newData = {
      title: await resolveTitle(value),
      description: description,
      streetName: streetName,
      loc: new firebase.firestore.GeoPoint(latitude, longitude),
      type: value,
    };

    database
      .collection("pinsData")
      .doc(props.uid)
      .update(newData)
      .then(() => {
        setTimeout(() => {
          setUpdatingPin(false);

          Alert.alert("Gestão de Pin's", "Pin atualizado com sucesso!", [{ text: "OK" }]);
          props.setShowUpdateScreen(false);
        }, 1500);
      });
  };

  let updateData = async () => {
    const pinRef = database.collection("pinsData").doc(props.uid);
    const doc = await pinRef.get();

    if (doc.exists) {
      Alert.alert("Atualizar Dados", "Desejas atualizar os dados?", [
        {
          text: "Confirmar",
          onPress: () => {
            updatePinFirestore();
          },
        },
        {
          text: "Cancelar",
          style: "cancel",
        },
      ]);
    }
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
            props.setShowUpdateScreen(false);
          }}
        >
          <MaterialCommunityIcons name="step-backward" size={30} color="#05164B" />
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>Atualizar Ponto</Text>

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
      </View>

      <View style={styles.buttons}>
        <TouchableOpacity
          style={[styles.button, styles.accept]}
          onPress={() => {
            updateData();
          }}
        >
          <Text style={styles.txtButtons}>Atualizar</Text>
        </TouchableOpacity>
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
    height: heightPercentageToDP("5%"),
    width: widthPercentageToDP("10%"),
    backgroundColor: "white",
    position: "absolute",
    top: heightPercentageToDP("5%"),
    left: 30,
    zIndex: 1,
  },
  title: {
    textAlign: "center",
    fontSize: 30,
    fontWeight: "bold",
    color: "#05164B",
    top: heightPercentageToDP("5%"),
  },

  text: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#05164B",
  },

  form: {
    paddingHorizontal: "10%",
    top: heightPercentageToDP("2%"),
  },
  input: {
    height: heightPercentageToDP("5%"),
    fontSize: RFValue(15),
    marginTop: 10,
  },
  spacebtw: {
    marginTop: heightPercentageToDP("5%"),
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
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    height: 50,
    width: "80%",
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
});
