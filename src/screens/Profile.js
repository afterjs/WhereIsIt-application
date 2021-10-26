import React from "react";
import {Text, View, StyleSheet} from "react-native";


export default class Profile extends React.Component {


    constructor(props){  
        super(props);  
        this.state = {  } 
    }  

    render() {
        return(
            <View style={styles.container}>
                <Text>Profile Page</Text>
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
  