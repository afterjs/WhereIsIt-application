import React from "react";
import {Text, View, StyleSheet} from "react-native";
import { AuthContext } from "../components/context";




export default class Main extends React.Component {




    constructor(props){  
        super(props);  
        this.state = {  } 
    }  

    

    render() {
        return(
            <View style={styles.container}>
                <Text>Main Page</Text>
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
  