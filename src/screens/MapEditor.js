import React from "react";
import {Text, View, StyleSheet} from "react-native";




export default class MapEditor extends React.Component {


    constructor(props){  
        super(props);  
        this.state = {  } 
    }  

    render() {
        return(
            <View style={styles.container}>
                <Text>Map Editor Page</Text>
            </View>
        )
    }

}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
  