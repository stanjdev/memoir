import React, { useEffect } from 'react';
import { Text, View, Button, StyleSheet, StatusBar, Image, Dimensions, ImageBackground, TouchableOpacity } from 'react-native';
import AppButton from './AppButton';
const { width, height } = Dimensions.get('window');

import * as Animatable from 'react-native-animatable';
import { useFonts } from 'expo-font';
import { useNavigation } from '@react-navigation/native';


// Firebase setup for FB
import * as firebase from 'firebase';
const provider = new firebase.auth.FacebookAuthProvider();


// Expo way
import * as Facebook from 'expo-facebook';




export default function CreateAccountPopup() {
  const navigation = useNavigation();


  // Not working with latest Expo SDK? 
  // async function fbSignIn () {
  //   try {
  //     await Facebook.initializeAsync({
  //       appId: '200817071551403',
  //     });
  //     const {type, token} = await Facebook.logInWithReadPermissionsAsync('200817071551403', { permissions: ['public_profile'] });

  //     if (type == "success") {
  //       const credential = firebase.auth.FacebookAuthProvider.credential(token)
    
  //       await firebase.auth().signUpWithCredential(credential).catch((error) => {
  //         console.log(error)
  //       })
  //     }
  //   } catch (error) {
  //     console.log(`Facebook Login Error: ${error}`)
  //   }
  // };




/* 
auth/operation-not-supported-in-this-environment 
This operation is not supported in the environment this application is runningon. 
"location.protocol" must be http, https or chrome-extension and web storage must be enabled.
*/
  async function fbSignIn () {
    firebase.auth().signInWithPopup(provider)

    .then(function(result) {
      var token = result.credential.accessToken;
      var user = result.user;

      // console.log(token)
      // console.log(user)
    }).catch(function(error) {
      console.log(error.code);
      console.log(error.message);
    })
  };
  

  useEffect(() => {
    firebase.auth().onAuthStateChanged(user => {
      if (user !== null) {
        // console.log(user)
      }
    })
  }, )

  let [fontsLoaded] = useFonts({
    'Assistant': require('../assets/fonts/Assistant/Assistant-VariableFont_wght.ttf'),
    'Assistant-Regular': require('../assets/fonts/Assistant/static/Assistant-Regular.ttf'),
    'Assistant-SemiBold': require('../assets/fonts/Assistant/static/Assistant-SemiBold.ttf'),
  });

  return (
    <Animatable.View style={styles.footerIntro} animation="fadeInUpBig">
      <View>
        <Text style={{fontSize: 25, color: "#535353", textAlign: "center", width: 290, fontFamily: "Assistant-SemiBold", }}>Create a Free Account to View Your Favorites, Track Progress, and more.</Text>
      </View>
      <View style={{ height: 250, justifyContent: "space-between"}}>
        <AppButton 
          title="Sign up with Facebook" 
          buttonStyles={styles.facebookButton} 
          buttonTextStyles={styles.buttonText} 
          onPress={fbSignIn}
          icon={"FontAwesome"}
          name={"facebook-square"}
          size={28}
          color={"white"}
        />
        <AppButton 
          title="Sign up with Apple" 
          buttonStyles={styles.appleButton} 
          buttonTextStyles={styles.buttonText} 
          onPress={""}
          icon={"Fontisto"}
          name={"apple"}
          size={28}
          color={"white"}
        />
        <AppButton 
          title="Sign up with Email" 
          buttonStyles={styles.emailButton} 
          buttonTextStyles={styles.emailButtonText} 
          onPress={() => navigation.navigate('SignUpScreen')}
          icon={"Fontisto"}
          name={"email"}
          size={28}
          color={"black"}
        />
      </View>
      <View style={{alignItems: "center"}}>
        <Text style={{fontSize: 15, color: "#535353", fontFamily: "Assistant-SemiBold"}}>Already Have an Account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('SignInScreen')}>
          <Text style={{fontSize: 20, color: "#535353", fontFamily: "Assistant-SemiBold", padding: 10, paddingLeft: 20, paddingRight: 20, }}>Log-In</Text>
        </TouchableOpacity>
        {/* <Button style={{fontSize: 20, color: "#535353", fontFamily: "Assistant-SemiBold"}} title="Log-In" onPress={() => navigation.navigate('SignInScreen')}></Button> */}
      </View>
    </Animatable.View>
  )
}




const styles = StyleSheet.create({

  footerIntro: {
    // borderWidth: 1,
    width: width,
    flex: 4.5,
    height: Math.min(height * 0.79, 600),
    // height: Math.min(height * 0.69),
    position: "absolute",
    bottom: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingVertical: 40,
    paddingHorizontal: 45,
    justifyContent: "space-evenly",
    alignItems: "center"
  },
  facebookButton: {
    backgroundColor: "#3681C7",
    height: 63,
    width: 327,
    borderRadius: 7,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    flex: 1,
    textAlign: "center",
    fontSize: 23,
    fontFamily: "Assistant-SemiBold"
  },
  appleButton: {
    backgroundColor: "#1E1E1E",
    height: 63,
    width: 327,
    borderRadius: 7,
    alignItems: "center",
    justifyContent: "center",
  },
  emailButton: {
    backgroundColor: "#FFF",
    height: 63,
    width: 327,
    borderWidth: 2,
    borderRadius: 7,
    alignItems: "center",
    justifyContent: "center",
  },
  emailButtonText: {
    color: "#1E1E1E",
    flex: 1,
    textAlign: "center",
    fontSize: 23,
    fontFamily: "Assistant-SemiBold"
  }
});