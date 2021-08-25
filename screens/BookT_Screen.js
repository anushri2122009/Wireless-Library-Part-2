import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Image, Alert} from 'react-native';
import * as Permissions from 'expo-permissions';
import { BarCodeScanner } from 'expo-barcode-scanner';
import  firebase from 'firebase';
import db from '../config.js';

export default class BookT_Screen extends React.Component {

    constructor (){
        super();
        this.state = {
            hasCameraPermissions: null,
            scanned: false,
            scannedData: "",
            buttonState: "normal",
            scanned_Book_ID: "",
            scanned_Student_ID: "",
            transactionMessage: ""
        }
    }

    getCameraPermissions = async (id) => {
        const {status} = await Permissions.askAsync (Permissions.CAMERA)
        this.setState ({hasCameraPermissions: status === "granted", buttonState: id, scanned: false})
    }  

    handleBarCodeScanned = async ({type, data}) => {
        this.setState ({scanned: true,
        scannedData: data, buttonState: "normal"})
    }

    handleTransactions = async ()=>{
        var tMessage 
        db.collection("books").doc(this.state.scanned_Book_ID).get().then((doc)=>{
            var book = doc.data()
            if (book.bookAvaiable) {
                this.initiateBookIssue()
                transactionMessage = "Book Issued!!"
            }

            else {
                this.initiateBookReturn()
                transactionMessage = "Book Returned!!"
            }
        } )

        this.setState({trancsactionMessage: tMessage})
    }

    initiateBookIssue = async ()=>{
        db.collection("transactions").add({
            "studentID": this.state.scanned_Student_ID,
            "bookID": this.state.scanned_Book_ID,
            "date": firebase.firestore.Timestamp.now().toDate(),
            "transactionType": "Issue"
        })

        db.collection("books").doc(this.state.scanned_Book_ID).update({
            "bookAvaiable": false
        })

        db.collection("students").doc(this.state.scanned_Student_ID).update({
            "number_Of_Books_Issued": firebase.firestore.FieldValue.increment(1)
        })
        Alert.alert("Books Issued!!");

        this.setState({
            scanned_Book_ID: "",
            scanned_Student_ID: ""
        })
    }

    initiateBookReturn = async ()=>{
        db.collection("transactions").add({
            "studentID": this.state.scanned_Student_ID,
            "bookID": this.state.scanned_Book_ID,
            "date": firebase.firestore.Timestamp.now().toDate(),
            "transactionType": "Return"
        })

        db.collection("books").doc(this.state.scanned_Book_ID).update({
            "bookAvaiable": true
        })

        db.collection("students").doc(this.state.scanned_Student_ID).update({
            "number_Of_Books_Issued": firebase.firestore.FieldValue.increment(-1)
        })
        Alert.alert("Books Returned!!");

        this.setState({
            scanned_Book_ID: "",
            scanned_Student_ID: ""
        })
    }
    render() {

        const hasCameraPermissions = this.state.hasCameraPermissions;
        const scanned = this.state.scanned;
        const buttonState = this.state.buttonState;

        if (buttonState !== "normal" && hasCameraPermissions) {
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

                    <Image source={require('../assets/booklogo.jpg')}
                    style = {{width:450, height: 450}}/>
                    <View style = {styles.inputView}>
                        <TextInput 
                            style = {styles.inputBox}
                            placeholder = "Book ID"
                            value = {this.state.scanned_Book_ID}
                        />

                        <TouchableOpacity style = {styles.scanButton}
                        onPress = { () => {this.getCameraPermissions("Book ID")} }>
                            <Text style = {styles.scanText}>Scan</Text>
                        </TouchableOpacity>
                    </View>
                    
                    <View style = {styles.inputView}>
                    <TextInput 
                            style = {styles.inputBox}
                            placeholder = "Student ID"
                            value = {this.state.scanned_Student_ID}
                        />

                        <TouchableOpacity style = {styles.scanButton}
                        onPress = { () => {this.getCameraPermissions("Student ID")} }>
                            <Text style = {styles.scanText}>Scan</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity style = {styles.submitBox} 
                    onPress = { async ()=> {this.handleTransactions}}>
                        <Text style = {styles.scanText}>Submit</Text>
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
        alignSelf:"center"
    },

    inputView: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    
    scanButton: {
         backgroundColor: "lightblue",
         margin: 10,
         padding: 10
    },

    scanText: {
        fontSize: 17,
        justifyContent: "center",
        fontFamily: "Comic Sans MS",
        alignItems: "center",

    },

    inputBox: {
        width: 200,
        height: 40,
        borderWidth: 5
    },

    submitBox : {
        backgroundColor: "lightpink",
        margin: 10,
        padding: 10,
        borderRadius: 8
    }

    
})