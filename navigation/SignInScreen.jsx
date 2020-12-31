import React, { useCallback, useState, useContext, useEffect } from 'react';
import { Text, View, StyleSheet, StatusBar, Image, Dimensions, ImageBackground, TextInput, TouchableOpacity, Alert } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import * as Animatable from 'react-native-animatable';

import AppButton from '../components/AppButton';
import { AuthContext } from '../components/context';
import { useFonts } from 'expo-font';

const { width, height } = Dimensions.get('window');

// import * as admin from 'firebase-admin';
import firebase from 'firebase';

// import SavedUsers from '../model/users-example';

export default function SignInScreen ({navigation}) {
  let [fontsLoaded] = useFonts({
    'Assistant': require('../assets/fonts/Assistant/Assistant-VariableFont_wght.ttf'),
    'Assistant-Regular': require('../assets/fonts/Assistant/static/Assistant-Regular.ttf'),
    'Assistant-SemiBold': require('../assets/fonts/Assistant/static/Assistant-SemiBold.ttf'),
  });

  
  const [userInfo, setUserInfo] = React.useState({
    firstName: '',
    email: '',
    password: '',
    passwordConfirm: '',
    check_textInputChange: false,
    secureTextEntry: true,
    isValidEmail: true,
    isValidPassword: true
  })
  

  const { signIn, userToken, signInFail, resetSignInFail } = React.useContext(AuthContext);
  const currUser = firebase.auth().currentUser;

  useEffect(() => {
    if (currUser && !currUser.isAnonymous) {
      navigation.navigate('UserWelcomeScreen')
    }
  }, [userToken, currUser])



  // includes validation check when user actually types in their email:
  const emailInputChange = (val) => {
    // length requirement version:
    // if (val.trim().length >= 4) {
    
    // @ symbol regex check:
    if (/[@]/gi.test(val)) {
      setUserInfo({
        ...userInfo,
        email: val,
        check_textInputChange: true,
        isValidEmail: true
      })
    } else {
      setUserInfo({
        ...userInfo,
        email: "",
        check_textInputChange: false,
        isValidEmail: false
      })
    }
  }

  const handlePasswordChange = (val) => {
    if (val.trim().length >= 8) {
      setUserInfo({
        ...userInfo,
        password: val,
        isValidPassword: true
      })
    } else {
      setUserInfo({
        ...userInfo,
        password: "",
        isValidPassword: false
      })
    }
  }


  const toggleShowPassword = () => {
    setUserInfo({
      ...userInfo,
      secureTextEntry: !userInfo.secureTextEntry
    })
  }

  // includes validation check when user unfocuses on the email TextInput:
  const handleValidEmail = (val) => {
  // length requirement version:
    // if (val.trim().length >= 4) {

  // @ symbol regex check:
    if (/[@]/gi.test(val)) {
      setUserInfo({
        ...userInfo,
        isValidEmail: true
      });
    } else {
      setUserInfo({
        ...userInfo,
        isValidEmail: false
      })
    }
  }

  // // OG LOCAL WAY:
  // const handleLogin = (inputEmail, inputPassword) => {
  //   console.log("signin!")
  //   const foundUser = SavedUsers.filter(user => {
  //     return inputEmail == user.email && inputPassword == user.password;
  //   })

  //   if (userInfo.email.length === 0 || userInfo.password.length === 0) {
  //     Alert.alert("Wrong Input!", "Email or password field cannot be empty.", [
  //       {text: "Okay"}
  //     ]);
  //     return;
  //   }

  //   if (foundUser.length == 0) {
  //     Alert.alert("Invalid User!", "Email or password is incorrect.", [
  //       {text: "Okay"}
  //     ]);
  //     return;
  //   }
  //   signIn(foundUser);
  // }

  const handleLogin = useCallback( async (inputEmail, inputPassword) => {
    if (userInfo.email.length === 0 || userInfo.password.length === 0) {
      Alert.alert("Wrong Input!", "Email or password field cannot be empty.", [
        {text: "Okay"}
      ]);
      return;
    };
    await signIn(inputEmail, inputPassword)
  });



  useEffect(() => {  
    return async () => await resetSignInFail();
  }, [])



  const resetPassword = (email) => {
    firebase.auth().sendPasswordResetEmail(email).then(error => error ? null : alert("Password email sent. Check your email!")).catch(error => alert(error))
  }








  return (
    <View style={styles.container}>
      <StatusBar hidden={false}/>
        <View style={styles.footerIntro}>

          <TouchableOpacity onPress={() => navigation.goBack()} style={{position: "absolute", left: 0, top: height * 0.069, zIndex: 10, padding: 15}}>
            <Image source={require('../assets/screen-icons/back-arrow.png')} style={{height: 20}} resizeMode="contain"/>
          </TouchableOpacity>
          
          <View style={{ height: Math.max(height * 0.55, 450), marginTop: 0, alignItems: "center", justifyContent: "space-evenly"}}>
            <Image source={require("../assets/memoir-logo1.png")} resizeMode="contain" style={{height: 20}}/>
            <View style={{ width: 323 }}>
              <Text style={{fontSize: 26, color: "#717171", textAlign: "center", fontFamily: "Assistant-SemiBold", }}>Welcome Back! Enter Your Email &amp; Password to Log In</Text>
            </View>

            <View style={{height: 300, justifyContent: "space-between", alignItems: "center",}}>
              <View>
                <Text style={{fontFamily: "Assistant-Regular", fontSize: 18.21}}>Email</Text>
                <View style={styles.inputsWhole}>
                  <TextInput 
                    placeholder="Email"
                    style={styles.inputs} 
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoFocus={true}
                    onChangeText={(val) => emailInputChange(val)}
                    onEndEditing={e => handleValidEmail(e.nativeEvent.text)}
                  />

                  { userInfo.check_textInputChange ? 
                  <Animatable.View animation="bounceIn">
                    <Feather 
                      name="check-circle"
                      color="green"
                      size={20}
                    />
                  </Animatable.View>
                  : null }

                </View>
                {userInfo.isValidEmail ? 
                  null
                : 
                <Animatable.View animation="fadeInLeft" duration={500}>
                  <Text style={styles.errorMsg}>Email must be valid email.</Text>
                </Animatable.View>
                }
              </View>

              <View>
                <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                  <Text style={{fontFamily: "Assistant-Regular", fontSize: 18.21}}>Password</Text>
                  {signInFail ? 
                    <TouchableOpacity onPress={() => resetPassword(userInfo.email)}>
                      <Text style={{ fontFamily: "Assistant-Regular", fontSize: 15.21, textDecorationLine: "underline", ...styles.errorMsg }}>Forgot Password?</Text>
                    </TouchableOpacity>
                  : null}
                </View>
                <View style={styles.inputsWhole}>
                  <TextInput 
                    placeholder="Password"
                    secureTextEntry={userInfo.secureTextEntry ? true : false}
                    style={styles.inputs} 
                    autoCapitalize="none"
                    autoCorrect={false}
                    onChangeText={(val) => handlePasswordChange(val)}
                    />
                    <TouchableOpacity onPress={toggleShowPassword} style={{padding: 10}}>
                      {userInfo.secureTextEntry ? 
                        <Feather 
                          name="eye-off"
                          color="grey"
                          size={20}
                        /> 
                        :
                        <Feather 
                          name="eye"
                          color="grey"
                          size={20}
                        />
                      }
                    </TouchableOpacity>
                </View>
                {userInfo.isValidPassword ?
                null
              : 
              <Animatable.View animation="fadeInLeft" duration={500}>
                <Text style={styles.errorMsg}>Password must be 8 characters minimum.</Text>
              </Animatable.View>
                }

                </View>

              <AppButton 
                title="Sign In" 
                buttonStyles={!(userInfo.email &&  userInfo.password) ? 
                  styles.disabledButton : 
                  styles.blueButton 
                } 
                buttonTextStyles={styles.buttonText} 
                disabled={!(userInfo.email &&  userInfo.password)}
                // onPress={() => navigation.navigate('UserWelcomeScreen')}
                onPress={() => {handleLogin(userInfo.email, userInfo.password)}}
                // onPress={() => alert(loginState.useToken)}
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
    // justifyContent: "space-evenly",
    alignItems: "center",
  },
  inputsWhole: {
    flexDirection: 'row', 
    justifyContent: "space-between", 
    alignItems: "center",
    height: 57.5,
    width: 313,
    borderRadius: 10,
    paddingRight: 15,
    borderColor: "#BDBDBD",
    borderWidth: 1.5,
    marginTop: 5
  },
  inputs: {
    // borderWidth: 1,d
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
    width: 313,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  disabledButton: {
    backgroundColor: "#3681C7",
    opacity: 0.5,
    height: 62,
    width: 313,
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