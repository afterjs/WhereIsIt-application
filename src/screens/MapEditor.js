import React from "react";
import { Text, View, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { useState } from "react/cjs/react.development";
import { auth, database, firebase } from "../../Config/firebase";

export default (props) => {
  const [lat, setLat] = useState("");
  const [long, setLong] = useState("");

//, 
//, 



  let data = [

    //viana e ancora
    {"title": "Caixote do Lixo", "description": "Bla bla bla", "type":"lixo", "lat": 41.69604430275174, "long": -8.841261753098259},
    {"title": "Caixote do Lixo", "description": "Bla bla bla", "type":"lixo", "lat": 41.69991563596667, "long": -8.823762863388366},
    {"title": "Caixote do Lixo", "description": "Bla bla bla", "type":"lixo", "lat": 41.69834767553573, "long": -8.836603461255036},
    {"title": "Caixas de Multibanco", "description": "Ble Ble Ble", "type":"banco", "lat": 41.68705461391431, "long":-8.846822040163348}, 
    {"title": "Caixote do Lixo", "description": "Bla bla bla", "type":"lixo", "lat":41.69519395696453, "long": -8.82447741428384},
    {"title": "Caixas de Multibanco", "description": "Ble Ble Ble", "type":"banco", "lat": 41.696018182045485,  "long": -8.828550988026958}, 
    {"title": "Caixote do Lixo", "description": "Bla bla bla", "type":"lixo", "lat": 41.69737110481944, "long": -8.8399757226332},
    {"title": "Caixote do Lixo", "description": "Bla bla bla", "type":"lixo", "lat": 41.696472865584234, "long": -8.815572266133918},
    {"title": "Caixas de Multibanco", "description": "Ble Ble Ble", "type":"banco", "lat": 41.701006706927394, "long": -8.823076615418517}, 
    {"title": "Caixote do Lixo", "description": "Bla bla bla", "type":"lixo", "lat": 41.703707309915,  "long": -8.852143011656697},
    {"title": "Caixas de Multibanco", "description": "Ble Ble Ble", "type":"banco", "lat": 41.716624691414054,  "long": -8.807726255335234}, 
    {"title": "Caixote do Lixo", "description": "Bla bla bla", "type":"lixo", "lat": 41.68213865423564, "long": -8.821759770369317},
    {"title": "Caixote do Lixo", "description": "Bla bla bla", "type":"lixo", "lat": 41.68417374203296, "long": -8.782384179642623},
    {"title": "Caixas de Multibanco", "description": "Ble Ble Ble", "type":"banco", "lat": 41.675931238469644, "long": -8.782656674555739}, 
    {"title": "Caixote do Lixo", "description": "Bla bla bla", "type":"lixo", "lat": 41.75353086774423, "long": -8.862552476423472},
    {"title": "Caixote do Lixo", "description": "Bla bla bla", "type":"lixo", "lat": 41.777217918592825,  "long":-8.858339780733674},
    {"title": "Caixote do Lixo", "description": "Bla bla bla", "type":"lixo", "lat": 41.77028104708237, "long": -8.865300517883009},
    {"title": "Caixa de Multibanco", "description": "Ble Ble Ble", "type":"banco", "lat": 41.82378467623711, "long": -8.866133385906187}, 
    {"title": "Caixa de Multibanco", "description": "Ble Ble Ble", "type":"banco", "lat": 41.820738653037964, "long": -8.831526465299625}, 

    //povoa e porto
    {"title": "Caixa de Multibanco", "description": "Ble Ble Ble", "type":"banco", "lat": 41.50177077129125, "long": -8.76384608112649}, 
    {"title": "Caixote do Lixo", "description": "Bla bla bla", "type":"lixo", "lat": 41.385769062644975, "long": -8.764952747126735}, 
    {"title": "Caixa de Multibanco", "description": "Ble Ble Ble", "type":"banco", "lat": 41.41091860683773, "long": -8.769191781304961}, 
    {"title": "Caixa de Multibanco", "description": "Ble Ble Ble", "type":"banco", "lat": 41.39661057661955, "long": -8.72757217299842}, 
    {"title": "Caixote do Lixo", "description": "Bla bla bla", "type":"lixo", "lat": 41.37376901232377, "long": -8.714469703252044}, 
    {"title": "Caixa de Multibanco", "description": "Ble Ble Ble", "type":"banco", "lat": 41.38519079726067,  "long": -8.743950259127885}, 
    {"title": "Caixote do Lixo", "description": "Bla bla bla", "type":"lixo", "lat":41.264926213387426, "long": -8.687107539131013}, 
    {"title": "Caixa de Multibanco", "description": "Ble Ble Ble", "type":"banco", "lat": 41.175301280281325, "long": -8.627989306484865}, 
    {"title": "Caixote do Lixo", "description": "Bla bla bla", "type":"lixo", "lat": 41.161156907895034,  "long": -8.60049245409131}, 
    {"title": "Caixote do Lixo", "description": "Bla bla bla", "type":"lixo", "lat": 41.15046035537269, "long": -8.636238362202933}, 
    {"title": "Caixote do Lixo", "description": "Bla bla bla", "type":"lixo", "lat": 41.151150508207905, "long": -8.667859742455523}, 
    {"title": "Caixa de Multibanco", "description": "Ble Ble Ble", "type":"banco", "lat": 41.172541642510545,  "long": -8.676567079046817}, 
    {"title": "Caixote do Lixo", "description": "Bla bla bla", "type":"lixo", "lat": 41.17875066401209,  "long": -8.682983011271979}, 
    {"title": "Caixa de Multibanco", "description": "Ble Ble Ble", "type":"banco", "lat": 41.1904772099358,  "long": -8.61057463330228}, 
    {"title": "Caixa de Multibanco", "description": "Ble Ble Ble", "type":"banco", "lat": 41.148044763237394, "long": -8.567954512092268}, 
    {"title": "Caixote do Lixo", "description": "Bla bla bla", "type":"lixo", "lat": 41.21426874477857, "long": -8.624323059499059}, 

    //lisboa
    {"title": "Caixas de Multinbaco", "description": "Ble Ble Ble", "type":"banco", "lat": 38.70004139118512, "long": -9.20615045399392}, 
    {"title": "Caixote do Lixo", "description": "Bla bla bla", "type":"lixo", "lat": 38.70725906893937,  "long": -9.156823510829117}, 
    {"title": "Caixas de Multinbaco", "description": "Ble Ble Ble", "type":"banco", "lat": 38.75054983461311,  "long": -9.107111200920835}, 
    {"title": "Caixote do Lixo", "description": "Bla bla bla", "type":"lixo", "lat": 38.73942901710422,  "long": -9.198057752380945}, 
    {"title": "Caixote do Lixo", "description": "Bla bla bla", "type":"lixo", "lat": 38.73977005492659,  "long": -9.281652804132698}, 
    {"title": "Caixas de Multinbaco", "description": "Ble Ble Ble", "type":"banco", "lat": 38.71438607356249,  "long": -9.34122931765207}, 
    {"title": "Caixote do Lixo", "description": "Bla bla bla", "type":"lixo", "lat": 38.76657432386384,  "long": -9.229408784584939}, 
    {"title": "Caixas de Multinbaco", "description": "Ble Ble Ble", "type":"banco", "lat": 38.73047555904106,  "long": -9.361393676074012}, 
    {"title": "Caixote do Lixo", "description": "Bla bla bla", "type":"lixo", "lat": 38.64677068257021, "long":  -9.192746314468504}, 
    {"title": "Caixote do Lixo", "description": "Bla bla bla", "type":"lixo", "lat": 38.79444008508636, "long":  -9.200537089616244}, 


    //faro
    {"title": "Caixote do Lixo", "description": "Bla bla bla", "type":"lixo", "lat": 37.01148378634596,  "long":  -7.913336351897702}, 
    {"title": "Caixa de Multibanco", "description": "Ble Ble Ble", "type":"banco", "lat": 37.01388084310376, "long":  -7.988384877702475}, 
    {"title": "Caixote do Lixo", "description": "Bla bla bla", "type":"lixo", "lat": 37.03811350303496,  "long": -7.867640138407683}, 
    {"title": "Caixote do Lixo", "description": "Bla bla bla", "type":"lixo", "lat": 37.0532882641911,  "long":  -7.998724896813355}, 
    {"title": "Caixote do Lixo", "description": "Bla bla bla", "type":"lixo", "lat": 36.98724263256162,  "long":  -7.837954277089351}, 
    {"title": "Caixa de Multibanco", "description": "Ble Ble Ble", "type":"banco", "lat": 37.02187048624621,  "long":  -8.011066209945696}, 
    {"title": "Caixote do Lixo", "description": "Bla bla bla", "type":"lixo", "lat": 37.00349305113664,  "long":  -7.886985980615137}, 
    {"title": "Caixa de Multibanco", "description": "Ble Ble Ble", "type":"banco", "lat": 37.08495912694741,  "long":  -7.938352527165959}, 
    {"title": "Caixote do Lixo", "description": "Bla bla bla", "type":"lixo", "lat": 37.05515162219578,  "long":  -7.839622022107235}, 
    {"title": "Caixa de Multibanco", "description": "Ble Ble Ble", "type":"banco", "lat": 37.06925841945171,  "long":  -7.9790455056023255}, 

  ]




  let add = () => {
    

    data.forEach((item)=> {
      const docRef = database.collection("pinsData").doc();
      docRef
      .set({
        title: item.title,
        description: item.description,
        type: item.type,
        loc: new firebase.firestore.GeoPoint(item.lat, item.long)
      })
  
    })

    
  };

  return (
    <View style={styles.container}>
      <Text>Map Editor Page</Text>
      <View style={styles.pd}>
        <TextInput
          style={styles.input}
          value={lat}
          placeholder="latitude"
          onChangeText={(text) => {
            setLat(text);
          }}
        ></TextInput>

        <TextInput
          style={styles.input}
          value={long}
          placeholder="longitude"
          onChangeText={(text) => {
            setLat(text);
          }}
        ></TextInput>
      </View>

      <TouchableOpacity style={styles.button} onPress={add}>
        <Text style={{ color: "white" }}>Adicionar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  button: {
    marginTop: "10%",
    height: 50,
    alignItems: "center",
    backgroundColor: "#05164B",
    marginHorizontal: 10,
    justifyContent: "center",
    textAlign: "center",
    borderRadius: 10,
  },
  pd: {
    marginHorizontal: 50,
  },
  input: {
    height: 50,
  },
});
