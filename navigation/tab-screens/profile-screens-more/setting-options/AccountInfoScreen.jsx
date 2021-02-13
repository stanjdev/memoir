import React, { useCallback, useState, useContext, useEffect } from 'react';
import { Text, View, StyleSheet, StatusBar, Image, Dimensions, ImageBackground, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useFonts } from 'expo-font';
import { AuthContext } from '../../../../components/context';
import Feather from 'react-native-vector-icons/Feather';
import * as Animatable from 'react-native-animatable';
import AppButton from '../../../../components/AppButton';
const { width, height } = Dimensions.get('window');

import firebase from 'firebase';

export default function AccountInfoScreen ({navigation}) {
  let [fontsLoaded] = useFonts({
    'Assistant': require('../../../../assets/fonts/Assistant/Assistant-VariableFont_wght.ttf'),
    'Assistant-Regular': require('../../../../assets/fonts/Assistant/static/Assistant-Regular.ttf'),
    'Assistant-SemiBold': require('../../../../assets/fonts/Assistant/static/Assistant-SemiBold.ttf'),
  });
  
  const [userInfo, setUserInfo] = React.useState({
    firstName: '',
    email: '',
    check_nameInputChange: false,
    check_emailInputChange: false,
    isValidEmail: true,
    isValidFirstName: true,
    password: ''
  })
  
  const { updateNameAndEmail, userToken, } = React.useContext(AuthContext);

  // useEffect(() => {
  //   if (userToken) {
  //     navigation.navigate('UserWelcomeScreen')
  //   }
  // }, [userToken])


  // includes validation check when user actually types in their email:
  const firstNameInputChange = (val) => {
    if (val.length !== 0) {
      setUserInfo({
        ...userInfo,
        firstName: val,
        check_nameInputChange: true,
        isValidFirstName: true
      })
    } else {
      setUserInfo({
        ...userInfo,
        firstName: "",
        check_nameInputChange: false,
        isValidFirstName: false
      })
    }
  }

  const emailInputChange = (val) => {
    // @ symbol regex check:
    if (/[@]/gi.test(val)) {
      setUserInfo({
        ...userInfo,
        email: val,
        check_emailInputChange: true,
        isValidEmail: true
      })
    } else {
      setUserInfo({
        ...userInfo,
        email: "",
        check_emailInputChange: false,
        isValidEmail: false
      })
    }
  }


  const passwordInputChange = (val) => {
    if (val.length > 0) {
      setUserInfo({
        ...userInfo,
        password: val,
        // check_emailInputChange: true,
        // isValidEmail: true
      })
    } else {
      setUserInfo({
        ...userInfo,
        password: "",
        // check_emailInputChange: false,
        // isValidEmail: false
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

  // includes validation check when user unfocuses on the email TextInput:
  const handleValidEmail = (val) => {
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

  
  const handleUpdate = useCallback( async (inputName, inputEmail, inputPassword) => {
    if (userInfo.firstName.length === 0 || userInfo.email.length === 0 || userInfo.password.length === 0) {
      Alert.alert("Wrong Input!", "First name, email, or password field cannot be empty.", [
        {text: "Okay"}
      ]);
      return;
    };
    
    updateNameAndEmail(inputName, inputEmail, inputPassword);
    
    setTimeout(() => {
      navigation.goBack();
    }, 3000);
  });


  return (
    <View style={styles.container}>
      <StatusBar hidden={false}/>
        <View style={styles.footerIntro}>

          <TouchableOpacity onPress={() => navigation.goBack()} style={{position: "absolute", left: 0, top: height * 0.069, zIndex: 10, padding: 15}}>
            <Image source={require('../../../../assets/screen-icons/back-arrow.png')} style={{height: 20}} resizeMode="contain"/>
          </TouchableOpacity>
          
          <View style={{ height: Math.max(height * 0.55, 450), marginTop: 0, alignItems: "center", justifyContent: "space-evenly"}}>
            <View style={{ width: 323 }}>
              <Text style={{fontSize: 26, color: "#717171", textAlign: "center", fontFamily: "Assistant-SemiBold", }}>Account Info</Text>
            </View>

            <View style={{height: 400, justifyContent: "space-around", alignItems: "center", }}>

              <View>
                <Text style={{fontFamily: "Assistant-Regular", fontSize: 18.21}}>First Name</Text>
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

                  { userInfo.check_nameInputChange ? 
                  <Animatable.View animation="bounceIn">
                    <Feather 
                      name="check-circle"
                      color="green"
                      size={20}
                    />
                  </Animatable.View>
                  : null }

                </View>

                {userInfo.isValidFirstName ? 
                  null
                : 
                <Animatable.View animation="fadeInLeft" duration={500}>
                  <Text style={styles.errorMsg}>First name cannot be empty.</Text>
                </Animatable.View>
                }
              </View>

              <View>
                <Text style={{fontFamily: "Assistant-Regular", fontSize: 18.21}}>Email Address</Text>
                <View style={styles.inputsWhole}>
                  <TextInput 
                    placeholder="Your Email Address"
                    style={styles.inputs} 
                    autoCapitalize="none"
                    autoCorrect={false}
                    onChangeText={(val) => emailInputChange(val)}
                    onEndEditing={e => handleValidEmail(e.nativeEvent.text)}
                  />

                  { userInfo.check_emailInputChange ? 
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
                <Text style={{fontFamily: "Assistant-Regular", fontSize: 18.21}}>Confirm Password</Text>
                <View style={styles.inputsWhole}>
                  <TextInput 
                    placeholder="Confirm Your Password"
                    style={styles.inputs} 
                    autoCapitalize="none"
                    autoCorrect={false}
                    onChangeText={(val) => passwordInputChange(val)}
                    secureTextEntry
                  />
                </View>
              </View>

              <AppButton 
                title="Update" 
                buttonStyles={!(userInfo.firstName && userInfo.email) ? 
                  styles.disabledButton : 
                  styles.blueButton 
                } 
                buttonTextStyles={styles.buttonText} 
                disabled={!(userInfo.firstName && userInfo.email)}
                onPress={() => handleUpdate(userInfo.firstName, userInfo.email, userInfo.password)}
              />
            </View>
          </View>
        </View>
    </View>
  )
};

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