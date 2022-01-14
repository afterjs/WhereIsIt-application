import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { heightPercentageToDP, widthPercentageToDP } from "../../../Config/snippets";
import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, FlatList, TouchableOpacity, ScrollView, Alert, TextInput, LogBox } from "react-native";
import { database, firebase } from "../../../Config/firebase";
import ShowUsers from "./ShowUsers";

LogBox.ignoreLogs(["AsyncStorage has been extracted from react-native core and will be removed in a future release."]);
LogBox.ignoreLogs(["Setting a timer"]);
LogBox.ignoreLogs(['Warning: ...']); 
LogBox.ignoreAllLogs();

export default (props) => {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [userID, setUserID] = useState("");
  const [showScreen, setShowScreen] = useState(false);

  const createAlert = (uid) => {
    Alert.alert("Lista de Utilizadores", "Deseja ver os dados do utilizador?", [
      {
        text: "Verificar",
        onPress: () => showUserData(uid),
      },

      {
        text: "Fechar",
        style: "cancel",
      },
    ]);
  };

  let showUserData = (uid) => {
    setUserID(uid);
    manageScreen();
  };

  let manageScreen = () => {
    setShowScreen(!showScreen);
  };

  const loadUserData = () => {
    try {
      database
        .collection("users")
        .where("permissions", "==", props.showType)
        .where("canLogin", "==", true)
        .onSnapshot((querySnapshot) => {
          let data = [];
          querySnapshot.forEach((doc) => {
            data.push({
              userId: doc.id,
              email: doc.data().email,
              name: doc.data().name,
            });
          });
          setData(data);
        });
    } catch (error) {}
  };

  useEffect(() => {
    const users = loadUserData();
    return () => {
      users;
    };
  }, []);

  function Item() {
    return data.map((item, index) =>
      item.email.toLowerCase().includes(search.toLowerCase()) ? (
        <TouchableOpacity
          style={styles.row}
          key={index}
          onPress={() => {
            createAlert(item.userId);
          }}
        >
          <View style={styles.groupData}>
            <View style={styles.rowData}>
              <Text style={styles.text}>Nome: </Text>
              <Text style={styles.info}>{item.name}</Text>
            </View>

            <View style={styles.rowData}>
              <Text style={styles.text}>Email: </Text>
              <Text style={styles.info}>{item.email}</Text>
            </View>
            <View style={styles.rowData}>
              <Text style={styles.text}>ID: </Text>
              <Text style={styles.info}>{item.userId}</Text>
            </View>
          </View>
        </TouchableOpacity>
      ) : null
    );
  }

  if (showScreen) {
    if (props.showType === 0) {
      return <ShowUsers setScreen={manageScreen} userID={userID} screenType={props.showType} />;
    } else {
      return <ShowUsers setScreen={manageScreen} userID={userID} screenType={props.showType} />;
    }
  }

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>{props.showType == 0 ? "Lista de Utilizadores" : "Lista de Staffs"}</Text>
      </View>

      <View>
        <Text style={styles.inputTitle}>Procurar por email:</Text>
        <TextInput
          style={styles.input}
          value={search}
          onChangeText={(text) => {
            setSearch(text);
          }}
        />
        <View style={styles.inputUnder} />
      </View>
      <ScrollView style={styles.scrollView}>{Item()}</ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: widthPercentageToDP("5%"),
  },
  row: {
    borderRadius: 5,
    backgroundColor: "#05164b36",
    flexDirection: "column",
    height: heightPercentageToDP("12%"),
    width: "100%",
    marginTop: heightPercentageToDP("3%"),
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: "#05164b",
  },
  groupData: {
    padding: 10,
  },
  title: {
    alignItems: "center",
    fontSize: RFValue(20),
    fontWeight: "bold",
    color: "#05164B",
    textAlign: "center",
    marginTop: heightPercentageToDP("5%"),
  },
  rowData: {
    flexDirection: "row",
  },
  text: {
    fontSize: RFValue(16),
    fontWeight: "bold",
    color: "#DD4A48",
  },
  info: {
    fontSize: RFValue(16),
    fontWeight: "bold",
    color: "#F5F5F5",
  },
  input: {
    height: heightPercentageToDP("3%"),
    fontSize: RFValue(15),
    marginTop: 10,
  },
  inputUnder: {
    borderBottomColor: "#05164B",
    borderBottomWidth: 2,
  },
  inputTitle: {
    fontSize: RFValue(18),
    fontWeight: "bold",
    color: "#05164B",
    marginTop: heightPercentageToDP("5%"),
  },
});
