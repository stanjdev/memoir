import React from 'react';
import { Text, View, StyleSheet, StatusBar, Image, Dimensions, TouchableOpacity } from 'react-native';
import { useFonts } from 'expo-font';
import AppButton from '../../../../components/AppButton';
const { width, height } = Dimensions.get('window');

import firebase from 'firebase';

export default function ChangePasswordScreen ({navigation}) {
  let [fontsLoaded] = useFonts({
    'Assistant': require('../../../../assets/fonts/Assistant/Assistant-VariableFont_wght.ttf'),
    'Assistant-Regular': require('../../../../assets/fonts/Assistant/static/Assistant-Regular.ttf'),
    'Assistant-SemiBold': require('../../../../assets/fonts/Assistant/static/Assistant-SemiBold.ttf'),
  });

  // Change Password button
  const currUser = firebase.auth().currentUser;
  const currUserEmail = currUser ? currUser.email : null;

  const resetPassword = (email) => {
    firebase.auth().sendPasswordResetEmail(email).then(error => error ? null : alert("Password email sent. Check your email!")).catch(error => alert(error))
  }

  return (
    <View style={styles.container}>
      <StatusBar hidden={false}/>
        <View style={styles.footerIntro}>

          <TouchableOpacity onPress={() => navigation.goBack()} style={{position: "absolute", left: 0, top: height * 0.069, zIndex: 10, padding: 15}}>
            <Image source={require('../../../../assets/screen-icons/back-arrow.png')} style={{height: 20}} resizeMode="contain"/>
          </TouchableOpacity>
          
          <View style={{ height: Math.max(height * 0.55, 450), marginTop: 0, alignItems: "center", justifyContent: "space-evenly"}}>
            <View style={{ width: 323 }}>
              <Text style={{fontSize: 26, color: "#717171", textAlign: "center", fontFamily: "Assistant-SemiBold", }}>Change Password</Text>
            </View>

            <View style={{height: 275, justifyContent: "space-evenly", alignItems: "center", marginTop: 40}}>
              <View style={{width: 246}}>
                <Text style={{fontFamily: "Assistant-Regular", fontSize: 19.21, textAlign: "center"}}>We can send a link to your registered email to change your password.</Text>
              </View>
              <AppButton 
                title="Send Email" 
                buttonStyles={ styles.blueButton } 
                buttonTextStyles={styles.buttonText} 
                onPress={() => resetPassword(currUserEmail)}
              />
            </View>
          </View>
        </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    height: height,
    width: width,
  },
  bgImage: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center"
  },
  body: {
    flex: 2,
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  footerIntro: {
    fontFamily: "Assistant",
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingVertical: 50,
    paddingHorizontal: 45,
    alignItems: "center",
  },
  inputsWhole: {
    flexDirection: 'row', 
    justifyContent: "space-between", 
    alignItems: "center",
    height: 57.5,
    width: width < 330 ? width * 0.8 : 313,
    borderRadius: 10,
    paddingRight: 15,
    borderColor: "#BDBDBD",
    borderWidth: 1.5,
    marginTop: 5
  },
  inputs: {
    width: "90%",
    padding: 15,
    fontSize: 19.17,
    fontFamily: "Assistant-Regular"
  },
  errorMsg: {
    color: "red"
  },
  blueButton: {
    backgroundColor: "#3681C7",
    height: 62,
    width: width < 330 ? width * 0.8 : 313,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  disabledButton: {
    backgroundColor: "#3681C7",
    opacity: 0.5,
    height: 62,
    width: width < 330 ? width * 0.8 : 313,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    flex: 1,
    textAlign: "center",
    fontSize: 24,
    fontFamily: "Assistant-SemiBold"
  }
});