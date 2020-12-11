import React, { useCallback, useContext, useEffect } from 'react';
import { AuthContext } from '../components/context';
import { Text, View, StyleSheet, StatusBar, Image, Dimensions, ImageBackground, TextInput, TouchableOpacity, Alert } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import * as Animatable from 'react-native-animatable';

import AppButton from '../components/AppButton';
import { useFonts } from 'expo-font';

const { width, height } = Dimensions.get('window');


export default function SignUpScreen ({navigation, route}) {
  let [fontsLoaded] = useFonts({
    'Assistant': require('../assets/fonts/Assistant/Assistant-VariableFont_wght.ttf'),
    'Assistant-Regular': require('../assets/fonts/Assistant/static/Assistant-Regular.ttf'),
    'Assistant-SemiBold': require('../assets/fonts/Assistant/static/Assistant-SemiBold.ttf'),
  });

  const { signUp, userToken } = useContext(AuthContext);

  useEffect(() => {
    if (userToken) {
      navigation.navigate('UserWelcomeScreen')
    }
  }, [userToken])

  const {routeFirstName, routeEmail} = route.params

  const [userInfo, setUserInfo] = React.useState({
    firstName: '',
    email: '',
    password: '',
    passwordConfirm: '',
    check_textInputChange: false,
    check_passwordMatch: false,
    secureTextEntry: true,
    confirmSecureTextEntry: true,
    isValidFirstName: true,
    isValidEmail: true,
    isValidPassword: true,
    isPasswordMatch: true
  })


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

  // // OG unfinished way:
  // const handleSignUp = (inputFirstName, inputEmail, inputPassword, inputConfirmPassword) => {
  //   if (inputFirstName.length == 0 || inputEmail.length == 0 || inputPassword.length == 0 || inputConfirmPassword.length == 0) {
  //     Alert.alert("Missing Info!", "Must fill every field", [
  //       {text: "Okay"}
  //     ]);
  //     return;
  //   };
  //   Alert.alert("Valid!", 
  //   `firstName: ${inputFirstName}, 
  //   email: ${inputEmail}, 
  //   pass: ${inputPassword} 
  //   confirmPass: ${inputConfirmPassword}`,
  //    [{
  //     text: "Dope"
  //   }])
  // }

  const handleSignUp = useCallback(async (inputFirstName, inputEmail, inputPassword, inputConfirmPassword) => {
    if (inputFirstName.length == 0 || inputEmail.length == 0 || inputPassword.length == 0 || inputConfirmPassword.length == 0) {
      Alert.alert("Missing Info!", "Must fill every field", [
        {text: "Okay"}
      ]);
      return;
    };
    await signUp(inputEmail, inputPassword, inputFirstName);
  });





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
              <Text style={{fontSize: 26, color: "#717171", textAlign: "center", fontFamily: "Assistant-SemiBold", width: 247}}>Choose a Password</Text>
            </View>
            <View style={{ height: 300, justifyContent: "space-around", alignItems: "center", }}>
            <View>
              <View style={{marginBottom: 15}}>
                {/* <Text style={{fontFamily: "Assistant-Regular", fontSize: 18.21}}>firstName: {routeFirstName}, email: {routeEmail}</Text> */}
                <Text style={{fontFamily: "Assistant-Regular", fontSize: 18.21}}>Password</Text>
                <View style={styles.inputsWhole}>
                  <TextInput 
                    placeholder="Choose a Password"
                    secureTextEntry={userInfo.secureTextEntry ? true : false}
                    style={styles.passwordInputs} 
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoFocus={true}
                    onChangeText={(val) => handlePasswordChange(val)}
                    />
                  {
                    userInfo.check_passwordMatch ? 
                    <Animatable.View animation="bounceIn">
                      <Feather
                        name="check-circle"
                        color="green"
                        size={20}
                      />
                    </Animatable.View> 
                  : null
                  }
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
                {userInfo.isValidPassword ? null :
                <Text style={styles.errorMsg}>Password must be 8 characters minimum.</Text>
                }
              </View>

              <View>
                <Text style={{fontFamily: "Assistant-Regular", fontSize: 18.21}}>Confirm Password</Text>
                <View style={styles.inputsWhole}>
                  <TextInput 
                    placeholder="Confirm Password"
                    secureTextEntry={userInfo.confirmSecureTextEntry ? true : false}
                    style={styles.passwordInputs} 
                    autoCapitalize="none"
                    autoCorrect={false}
                    onChangeText={(val) => handlePasswordConfirmChange(val)}
                  />
                  {
                    userInfo.check_passwordMatch ? 
                    <Animatable.View animation="bounceIn">
                      <Feather
                        name="check-circle"
                        color="green"
                        size={20}
                      />
                    </Animatable.View> 
                  : null
                  }
                  <TouchableOpacity onPress={toggleShowConfirmPassword} style={{padding: 10}}>
                    {userInfo.confirmSecureTextEntry ?
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
                {userInfo.isPasswordMatch ? null : 
                <Text style={styles.errorMsg}>Passwords do not match.</Text>
                }
              </View>
            </View>

              <AppButton 
                title="Create Account" 
                buttonStyles={
                  !(userInfo.password &&
                    userInfo.password === userInfo.passwordConfirm) ? 
                  styles.disabledButton :
                  styles.blueButton 
                } 
                buttonTextStyles={styles.buttonText} 
                disabled={
                  !(userInfo.password &&
                    userInfo.password === userInfo.passwordConfirm)
                }
                // onPress={() => navigation.navigate('UserWelcomeScreen')}
                onPress={() => handleSignUp(routeFirstName, routeEmail, userInfo.password, userInfo.passwordConfirm)}
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