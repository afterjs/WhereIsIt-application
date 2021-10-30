import { Dimensions, PixelRatio, Alert} from 'react-native'


const widthPercentageToDP = widthPercent => {
    const screenWidth = Dimensions.get('window').width;
    return PixelRatio.roundToNearestPixel(screenWidth * parseFloat(widthPercent) / 100);
};

const heightPercentageToDP = heightPercent => {
    const screenHeight = Dimensions.get('window').height;
    return PixelRatio.roundToNearestPixel(screenHeight * parseFloat(heightPercent) / 100);
};

const createTwoButtonAlert = (title, message) => {
    val = false
    
    Alert.alert(title, message, [
        {
            text: 'Cancelar',
            onPress: () => val = false,
            style: 'cancel',
        },
        { text: 'OK', onPress: () => val = true },
    ]);


}


export {
    widthPercentageToDP,
    heightPercentageToDP,
    createTwoButtonAlert
}