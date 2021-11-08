

import React from "react";
import { View, StyleSheet, Dimensions, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Loader from "../components/Loader";


export default class Map extends React.Component {
 
    constructor(props) {
        super(props)

        this.state = {
            test: true
        };
    }

   
    
    
   
   
    
render() {

     
    if (this.state.test) {
        
        return <Loader text={"A carregar o mapa... 🛰️"} />;
    }

        
    return (
        <View style={styles.container}>
        <Text>AAA</Text>
        </View>
    );



}

}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
      }
});
