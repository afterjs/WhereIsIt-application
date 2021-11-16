import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, TouchableOpacity, ActivityIndicator, Image, ScrollView } from "react-native";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { widthPercentageToDP, heightPercentageToDP } from "../../Config/snippets";

import { database } from "../../Config/firebase";

export default (props) => {
  const [choose, setChoose] = useState("pins");

  const opacity = { opacity: 0.3 };

  const [lixoOpacity, setLixoOpacity] = useState(true);
  const [bancoOpacity, setBancoOpacity] = useState(false);

  const [sateliteOpacity, setSateliteOpacity] = useState(false);
  const [defaultOpacity, setDefaultOpaciy] = useState(false);

  const [iconSelected, setIconSelected] = useState(props.icon);
  const [mapSelected, setMapSelected] = useState(props.map);

  useEffect(() => {
    switch (props.icon) {
      case "lixo":
        setLixoOpacity(false);
        setBancoOpacity(true);
        break;
      case "banco":
        setLixoOpacity(true);
        setBancoOpacity(false);
        break;
    }

    switch (props.map) {
      case "standard":
        setDefaultOpaciy(false);
        setSateliteOpacity(true);
        break;
      case "satellite":
        setDefaultOpaciy(true);
        setSateliteOpacity(false);
        break;
    }
    return () => {
      console.log("clear up");
    };
  }, []);

  //quando é escolhido tem de ser setado em falso, e o resto em true

  let returnPinBlockCode = () => {
    return (
<<<<<<< HEAD
      <View style={styles.imgGroup}>
        <TouchableOpacity
          onPress={() => {
            setLixoOpacity(false);
            setBancoOpacity(true);
            setIconSelected("lixo");
          }}
          disabled={!lixoOpacity ? true : false}
        >
          <View style={[styles.form, lixoOpacity ? opacity : { opacity: 1 }]}>
            <Text style={styles.iconText}>LIXO</Text>
            <Image source={require("../images/Icons/lixo-pin.png")} style={styles.icon} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            setLixoOpacity(true);
            setBancoOpacity(false);
            setIconSelected("banco");
          }}
          disabled={!bancoOpacity ? true : false}
        >
          <View style={[styles.form, bancoOpacity ? opacity : { opacity: 1 }]}>
            <Text style={styles.iconText}>Multibanco</Text>
            <Image source={require("../images/Icons/caixa-pin.png")} style={styles.icon} />
          </View>
        </TouchableOpacity>
      </View>
=======
      <ScrollView style={styles.ScrollView}>
        <View style={styles.imgGroup}>
          <TouchableOpacity
            onPress={() => {
              changeOpacityStates(false, true, true);
              setIconSelected('lixo');
            }}
          >
            <View style={[styles.form, lixoOpacity ? opacity : { opacity: 1 }]}>
              <Text style={styles.iconText}>LIXO</Text>
              <Image source={require("../images/Icons/lixo-pin.png")} style={styles.icon} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              changeOpacityStates(true, false, true);
              setIconSelected('banco');
            }}
          >
            <View style={[styles.form, bancoOpacity ? opacity : { opacity: 1 }]}>
              <Text style={styles.iconText}>Multibanco</Text>
              <Image source={require("../images/Icons/caixa-pin.png")} style={styles.icon} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              changeOpacityStates(true, true, false);
              setIconSelected('ctt');
            }}
          >
            <View style={[styles.form, cttOpacity ? opacity : { opacity: 1 }]}>
              <Text style={styles.iconText}>CTT</Text>
              <Image source={require("../images/Icons/caixa-pin.png")} style={styles.icon} />
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
>>>>>>> ab01b30362cbd49fa96831b189100a7744183b0e
    );
  };

  let returnMapBlockCode = () => {
    return (
      <View style={styles.mapsGroup}>
        <TouchableOpacity
          onPress={() => {
            setMapSelected("satellite");

            setDefaultOpaciy(true);
            setSateliteOpacity(false);
          }}
          disabled={!sateliteOpacity ? true : false}
        >
          <View style={[styles.mapView, sateliteOpacity ? opacity : { opacity: 1 }]}>
            <Text style={styles.mapsTitle}>Mapa Satelite</Text>
            <Image source={require("../images/Maps/satellite.png")} style={styles.map} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            setMapSelected("standard");

            setDefaultOpaciy(false);
            setSateliteOpacity(true);
          }}
          disabled={!defaultOpacity ? true : false}
        >
          <View style={[styles.mapView, defaultOpacity ? opacity : { opacity: 1 }]}>
            <Text style={styles.mapsTitle}>Mapa Predefenido</Text>
            <Image source={require("../images/Maps/satellite.png")} style={styles.map} />
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  let getCodeBlock = () => {
    if (choose === "pins") {
      return returnPinBlockCode();
    } else {
      return returnMapBlockCode();
    }
  };

  let back = () => {
    props.screen(false, true);
  };

  let changeIcon = () => {
<<<<<<< HEAD
    props.setIcon(iconSelected);
  };
=======
    console.log("Icon selecionado - ", iconSelected)
    props.setIconSelected(iconSelected)
  }
>>>>>>> ab01b30362cbd49fa96831b189100a7744183b0e

  let changeMap = () => {
    props.changeMap(mapSelected);
  };

  let backButton = () => {
    return (
      <View>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            back();
          }}
        >
          <Text style={styles.btnText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  };

  let confirm = (func) => {
    return (
      <View style={styles.btns}>
        <TouchableOpacity
          style={styles.buttonBottom}
          onPress={() => {
            back();
          }}
        >
          <Text style={styles.btnText}>Voltar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.buttonBottom}
          onPress={() => {
            func();
          }}
        >
          <Text style={styles.btnText}>Confirmar</Text>
        </TouchableOpacity>
      </View>
    );
  };

  let btns = () => {
    if (choose === "pins") {
      if (props.icon === iconSelected) {
        return backButton();
      } else {
        return confirm(changeIcon);
      }
    } else {
      if (props.map === mapSelected) {
        return backButton();
      } else {
        return confirm(changeMap);
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.btns}>
        <TouchableOpacity
          style={choose === "pins" ? styles.buttonActive : styles.buttonDesactive}
          onPress={() => {
            setChoose("pins");
          }}
          disabled={choose === "pins" ? true : false}
        >
          <Text style={styles.btnText}>Pins</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={choose === "map" ? styles.buttonActive : styles.buttonDesactive}
          onPress={() => {
            setChoose("map");
          }}
          disabled={choose === "map" ? true : false}
        >
          <Text style={styles.btnText}>Mapa</Text>
        </TouchableOpacity>
      </View>
      <View>
        <ScrollView style={styles.ScrollView}>{getCodeBlock()}</ScrollView>
      </View>

      {btns()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 30,
  },
  buttonActive: {
    marginTop: heightPercentageToDP("5%"),
    height: 50,
    width: "40%",
    backgroundColor: "#05164B",
    marginHorizontal: 10,
    justifyContent: "center",
    borderRadius: 10,
  },
  buttonBottom: {
    height: 50,
    width: "40%",
    backgroundColor: "#05164B",
    marginHorizontal: 10,
    justifyContent: "center",
    borderRadius: 10,
  },
  buttonDesactive: {
    marginTop: heightPercentageToDP("5%"),
    height: 50,
    width: "40%",
    backgroundColor: "#BBC6CB",
    marginHorizontal: 10,
    justifyContent: "center",
    borderRadius: 10,
  },
  btnText: {
    color: "#fff",
    fontSize: RFValue(20),
    fontWeight: "bold",
    textAlign: "center",
  },
  iconText: {
    color: "#05164B",
    fontSize: RFValue(21),
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 1,
  },
  mapsTitle: {
    color: "#05164B",
    fontSize: RFValue(21),
    fontWeight: "bold",
    textAlign: "center",
    marginTop: heightPercentageToDP("3%"),
    marginBottom: heightPercentageToDP("1%"),
  },
  btns: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  icon: {
    alignContent: "center",
    alignSelf: "center",
    width: widthPercentageToDP("20%"),
    height: heightPercentageToDP("15%"),
    resizeMode: "contain",
  },
  map: {
    borderRadius: 5,
    resizeMode: "contain",
  },
  imgGroup: {
    justifyContent: "space-between",
    flexDirection: "row",
    flexWrap: "wrap",
    padding: "15%",
  },
  mapsGroup: {
    flexDirection: "column",
    justifyContent: "center",
  },
  mapView: {
    justifyContent: "center",
    alignItems: "center",
  },
  form: {
    marginVertical: heightPercentageToDP("2%"),
  },
  ScrollView: {
    marginTop: heightPercentageToDP("2%"),
    height: heightPercentageToDP("70%"),
  },
  button: {
    marginTop: heightPercentageToDP("1%"),
    height: 50,
    alignItems: "center",
    backgroundColor: "#05164B",
    marginHorizontal: 10,
    justifyContent: "center",
    textAlign: "center",
    borderRadius: 10,
  },
});
