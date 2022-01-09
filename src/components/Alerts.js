import { Alert } from "react-native";


const normalAlert = (title, message, buttonMessage) => {
    Alert.alert(title, message, [

        { text: buttonMessage},
    ]);
}


const createTwoButtonAlert = (title, message, ) => {
    val = false
    
    Alert.alert(title, message, [
        {
            text: 'Cancelar',
            onPress: () => val = false,
            style: 'cancel',
        },
        { text: "OK", onPress: () => val = true },
    ]);
}


export {
    normalAlert,
    createTwoButtonAlert
}