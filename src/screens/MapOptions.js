import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, TouchableOpacity, ActivityIndicator, Image, ScrollView } from "react-native";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { widthPercentageToDP, heightPercentageToDP } from "../../Config/snippets";

import { database } from "../../Config/firebase";

export default (props) => {
  const [choose, setChoose] = useState("pins");

  const opacity = { opacity: 0.3 };

  const [lixoOpacity, setLixoOpacity] = useState(false);
  const [bancoOpacity, setBancoOpacity] = useState(true);
  const [cttOpacity, setCttOpacity] = useState(true);

  const [iconSelected, setIconSelected] = useState(props.icon);

  useEffect(() => {
    switch (props.icon) {
      case "lixo":
        changeOpacityStates(false, true, true);
        break;
      case "banco":
        changeOpacityStates(true, false, true);
        break;
      case "ctt":
        changeOpacityStates(true, true, false);
    }
    return () => {
      console.log("clear up");
    };
  }, []);

  let changeOpacityStates = (state1, state2, state3) => {
    setLixoOpacity(state1);
    setBancoOpacity(state2);
    setCttOpacity(state3);
  };

  let returnPinBlockCode = () => {
    return (
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
    );
  };

  let returnMapBlockCode = () => {
    return <Text>Hello Map</Text>;
  };

  let getCodeBlock = () => {
    if (choose === "pins") {
      return returnPinBlockCode();
    } else {
      return returnMapBlockCode();
    }
  };
  
  let back = () => {
    props.screen(false, true)   
  }

  let changeIcon = () => {
    console.log("Icon selecionado - ", iconSelected)
    props.setIconSelected(iconSelected)
  }

  let btns = () => {
    if (props.icon === iconSelected) {
      return (
        <View>
          <TouchableOpacity style={styles.button}
            onPress={()=> {
              back()
            }}
          >
            <Text style={styles.btnText}>Voltar</Text>
          </TouchableOpacity>
        </View>
      );
    } else {
      return(
        <View style={styles.btns}>
        <TouchableOpacity style={styles.buttonBottom}
          onPress={()=> {
            back()
          }}
        >
          <Text style={styles.btnText}>Voltar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonBottom}
          onPress={() => {
            changeIcon()
          }}
          
        >
          <Text style={styles.btnText}>Confirmar</Text>
        </TouchableOpacity>
      </View>
      )
     
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
      <View>{getCodeBlock()}</View>

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
  imgGroup: {
    justifyContent: "space-between",
    flexDirection: "row",
    flexWrap: "wrap",
    padding: "15%",
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
