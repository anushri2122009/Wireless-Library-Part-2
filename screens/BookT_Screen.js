import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import * as Permissions from 'expo-permissions';
import { BarCodeScanner } from 'expo-barcode-scanner';

export default class BookT_Screen extends React.Component {

    constructor (){
        super();
        this.state = {
            hasCameraPermissions: null,
            scanned: false,
            scannedData: "",
            buttonState: "normal"
        }
    }

    getCameraPermissions = async () => {
        const {status} = await Permissions.askAsync (Permissions.CAMERA)
        this.setState ({hasCameraPermissions: status === "granted"})
    }  

    handleBarCodeScanned = async ({type, data}) => {
        this.setState ({scanned: true,
        scannedData: data, buttonState: "normal"})
    }
    render() {

        const hasCameraPermissions = this.state.hasCameraPermissions;
        const scanned = this.state.scanned;
        const buttonState = this.state.buttonState;

        if (buttonState === "clicked" && hasCameraPermissions) {
            return(
                <BarCodeScanner
                   onBarCodeScanned = { scanned ? undefined : this.handleBarCodeScanned}
                   style = {StyleSheet.absoluteFillObject}
                />
            )
        }
        else if (buttonState === "normal") {
            return(
                <View style = {styles.container}>
                    <Text>{hasCameraPermissions === true ? this.state.scannedData : "Request Camera Permissions"}</Text>
                    <TouchableOpacity style = {styles.scanButton} onPress = {this.getCameraPermissions}>
                        <Text style = {styles.scanText} >Scan QR Code</Text>
                    </TouchableOpacity>
                </View>
            )
        }
        }
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center', 
        alignItems:'center', 
        margin:'25%', 
        alignSelf:"center"
    },
    
    scanButton: {
         backgroundColor: "lightblue",
         margin: 25,
         width: 150,
         height: 60
    },

    scanText: {
        fontSize: 20,
        justifyContent: "center",
        fontFamily: "Comic Sans MS",
        alignItems: "center",
        paddingTop: 13,
        paddingLeft: 8
    }
})