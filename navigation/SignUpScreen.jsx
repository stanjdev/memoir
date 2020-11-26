import React, { useContext, useEffect } from 'react';
import { AuthContext } from '../components/context';
import { Text, View, StyleSheet, StatusBar, Image, Dimensions, ImageBackground, TextInput, TouchableOpacity, Alert } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import * as Animatable from 'react-native-animatable';

import AppButton from '../components/AppButton';
import { useFonts } from 'expo-font';

const { width, height } = Dimensions.get('window');

export default function SignUpScreen ({navigation}) {
  let [fontsLoaded] = useFonts({
    'Assistant': require('../assets/fonts/Assistant/Assistant-VariableFont_wght.ttf'),
    'Assistant-Regular': require('../assets/fonts/Assistant/static/Assistant-Regular.ttf'),
    'Assistant-SemiBold': require('../assets/fonts/Assistant/static/Assistant-SemiBold.ttf'),
  });

  const { userToken } = useContext(AuthContext);

  useEffect(() => {
    if (userToken) {
      navigation.navigate('UserWelcomeScreen')
    }
  }, [userToken])

  
  const [userInfo, setUserInfo] = React.useState({
    firstName: '',
    email: '',
    password: '',
    passwordConfirm: '',
    check_firstName: false,
    check_textInputChange: false,
    check_passwordMatch: false,
    secureTextEntry: true,
    confirmSecureTextEntry: true,
    isValidFirstName: true,
    isValidEmail: true,
    isValidPassword: true,
    isPasswordMatch: true
  })

  const firstNameInputChange = (val) => {
    if (val.length !== 0) {
      setUserInfo({
        ...userInfo,
        firstName: val,
        isValidFirstName: true,
        check_firstName: true
      })
    } else {
      setUserInfo({
        ...userInfo,
        firstName: "",
        isValidFirstName: false,
        check_firstName: false
      })
    }
  }

  // includes validation check when user unfocuses on the firstName TextInput:
  const handleValidFirstName = (val) => {
    if (val.length !== 0) {
      setUserInfo({
        ...userInfo,
        isValidFirstName: true
      })
    } else {
      setUserInfo({
        ...userInfo,
        isValidFirstName: false
      })
    }
  }

  const emailInputChange = (val) => {
    // if (val.length !== 0) {
    if (/[@]/gi.test(val.trim())) {
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

  // includes validation check when user unfocuses on the email TextInput:
  const handleValidEmail = (val) => {
    if (/[@]/gi.test(val.trim())) {
      setUserInfo({
        ...userInfo,
        isValidEmail: true
      })
    } else {
      setUserInfo({
        ...userInfo,
        isValidEmail: false
      })
    }
  }

  const handlePasswordChange = (val) => {
    // if (val.length !== 0) {
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

  const handlePasswordConfirmChange = (val) => {
    if (val.trim().length >= 8 && val === userInfo.password) {
      setUserInfo({
        ...userInfo,
        passwordConfirm: val,
        isPasswordMatch: true
      })
    } else {
      setUserInfo({
        ...userInfo,
        passwordConfirm: "",
        isPasswordMatch: false
      })
    }
  }

  useEffect(() => {
    if (userInfo.password.length !== 0 && userInfo.password === userInfo.passwordConfirm) {
      setUserInfo({
        ...userInfo,
        check_passwordMatch: true,
        isPasswordMatch: true
      });
    } else {
      setUserInfo({
        ...userInfo,
        check_passwordMatch: false,
        // isPasswordMatch: false
      })
    }
  }, [userInfo.password, userInfo.passwordConfirm])




  const toggleShowPassword = () => {
    setUserInfo({
      ...userInfo,
      secureTextEntry: !userInfo.secureTextEntry
    })
  }

  const toggleShowConfirmPassword = () => {
    setUserInfo({
      ...userInfo,
      confirmSecureTextEntry: !userInfo.confirmSecureTextEntry
    })
  }



  const handleSignUp = (inputFirstName, inputEmail, inputPassword, inputConfirmPassword) => {
    if (userInfo.firstName.length == 0 || userInfo.email.length == 0 || userInfo.password.length == 0 || userInfo.passwordConfirm.length == 0) {
      Alert.alert("Missing Info!", "Must fill every field", [
        {text: "Okay"}
      ]);
      return;
    };
    
    Alert.alert("Valid!")

  }


  return (
    <View style={styles.container}>
      <StatusBar hidden={false}/>
        <View style={styles.footerIntro}>
          
          <TouchableOpacity onPress={() => navigation.goBack()} style={{position: "absolute", left: 0, top: height * 0.08, padding: 15, zIndex: 10}}>
            <Image source={require('../assets/screen-icons/back-arrow.png')} style={{height: 20, }} resizeMode="contain"/>
          </TouchableOpacity>
          
          <View style={{ height: Math.max(height * 0.55, 450), marginTop: 0, alignItems: "center", justifyContent: "space-evenly", marginTop: 12}}>
            <Image source={require("../assets/memoir-logo1.png")} resizeMode="contain" style={{height: 20, width: 150, }}/>
            <View>
              <Text style={{fontSize: 26, color: "#717171", textAlign: "center", fontFamily: "Assistant-SemiBold", width: 247}}>Enter Your Name and Email to Get Started</Text>
            </View>
            <View style={{ height: 300, justifyContent: "space-around", alignItems: "center", }}>
              <View>
                <View style={{marginBottom: 15}}>
                  <Text style={{fontFamily: "Assistant-Regular", fontSize: 18.21}}>First Name, {String(userInfo.isValidFirstName)}</Text>
                  <View style={styles.inputsWhole}>
                    <TextInput 
                      placeholder="Your First Name"
                      style={styles.inputs} 
                      autoCapitalize="none"
                      autoCorrect={false}
                      autoFocus={true}
                      onChangeText={(val) => firstNameInputChange(val)}
                      onEndEditing={e => handleValidFirstName(e.nativeEvent.text)}
                    />
                    {
                      userInfo.check_firstName ? 
                      <Animatable.View animation="bounceIn">
                        <Feather
                          name="check-circle"
                          color="green"
                          size={20}
                        />
                      </Animatable.View> 
                    : null
                    }
                  </View>
                  {userInfo.isValidFirstName ? null :
                  <Text style={styles.errorMsg}>First name must be included.</Text>
                  }
                </View>
                <View>
                  <Text style={{fontFamily: "Assistant-Regular", fontSize: 18.21}}>Email Address, {String(userInfo.isValidEmail)}</Text>
                  <View style={styles.inputsWhole}>
                    <TextInput 
                      placeholder="Your Email Address"
                      style={styles.inputs} 
                      autoCapitalize="none"
                      autoCorrect={false}
                      onChangeText={(val) => emailInputChange(val)}
                      onEndEditing={e => handleValidEmail(e.nativeEvent.text)}
                    />
                    {
                      userInfo.check_textInputChange ? 
                      <Animatable.View animation="bounceIn">
                        <Feather
                          name="check-circle"
                          color="green"
                          size={20}
                        />
                      </Animatable.View> 
                    : null
                    }
                  </View>
                  {
                    userInfo.isValidEmail ? null :
                    <Text style={styles.errorMsg}>Email must be valid email.</Text>
                  }
                </View>
              </View>

              <AppButton 
                title="Next" 
                buttonStyles={
                  !(userInfo.firstName &&
                    userInfo.email) ? 
                  styles.disabledButton :
                  styles.blueButton 
                } 
                buttonTextStyles={styles.buttonText} 
                disabled={
                  !(userInfo.firstName &&
                  userInfo.email)
                }
                onPress={() => navigation.navigate('SignUpScreen2', {routeFirstName: userInfo.firstName, routeEmail: userInfo.email})}
                // onPress={() => handleSignUp()}
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
    // borderColor: "pink",
    // borderWidth: 2,
  },
  footerIntro: {
    fontFamily: "Assistant",
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingVertical: 50,
    paddingHorizontal: 45,
    // justifyContent: "center",
    alignItems: "center"
  },
  inputsWhole: {
    flexDirection: 'row', 
    justifyContent: "space-between", 
    alignItems: "center",
    // backgroundColor: "#EAEAEA",
    height: 57.5,
    width: 313,
    borderRadius: 10,
    paddingRight: 15,
    borderColor: "#BDBDBD",
    borderWidth: 1.5,
    marginTop: 5
  },
  inputs: {
    // borderWidth: 1,
    // backgroundColor: "#EAEAEA",
    width: "90%",
    padding: 15,
    fontSize: 19.17,
    fontFamily: "Assistant-Regular"
  },
  passwordInputs: {
    // borderWidth: 1,
    // backgroundColor: "#EAEAEA",
    width: "84%",
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