import React from "react";
import {View, Text, ActivityIndicator, StyleSheet, LogBox} from 'react-native'
import { RFValue } from "react-native-responsive-fontsize";
import { heightPercentageToDP } from '../../Config/snippets'

LogBox.ignoreLogs(["AsyncStorage has been extracted from react-native core and will be removed in a future release."]);
LogBox.ignoreLogs(["Setting a timer"]);
LogBox.ignoreLogs(['Warning: ...']); 
LogBox.ignoreAllLogs();

export default props => {
    return(
        <View style={{flex:1, justifyContent:'center', alignItems:'center'}}> 
                <ActivityIndicator size="large" color="#05164B" />
                <Text style={styles.textWait}>{props.text}</Text>
        </View>
      )
}

const styles = StyleSheet.create({
    textWait: {
      fontSize: RFValue(15),
      fontWeight: 'bold',
      marginTop: heightPercentageToDP("3%"),
    }
  });
  