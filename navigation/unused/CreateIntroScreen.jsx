import React from 'react';
import { Text, View, Button, StyleSheet, StatusBar, Image, Dimensions, ImageBackground } from 'react-native';

import AppButton from '../components/AppButton';
import * as Animatable from 'react-native-animatable';
import { useFonts } from 'expo-font';
import { TouchableOpacity } from 'react-native-gesture-handler';

const { width, height } = Dimensions.get('window');
const bgImage = require('../assets/splash/memoir-splash-thin-content-4x.png')
// const bgImage = { uri: "https://reactjs.org/logo-og.png" }


export default function CreateIntroScreen ({navigation}) {
  let [fontsLoaded] = useFonts({
    'Assistant': require('../assets/fonts/Assistant/Assistant-VariableFont_wght.ttf'),
    'Assistant-Regular': require('../assets/fonts/Assistant/static/Assistant-Regular.ttf'),
    'Assistant-SemiBold': require('../assets/fonts/Assistant/static/Assistant-SemiBold.ttf'),
  });

  return (
    <View style={styles.container}>
      <StatusBar hidden={true} barStyle="light-content"/>
      <ImageBackground source={bgImage} style={styles.bgImage}>
        <View style={styles.body}>
          {/* <Image source={require('../assets/splash/memoir-logo-white.png')}/>
          <Image source={require('../assets/splash/circles-white.png')} resizeMode="stretch"/>
          <Image source={require('../assets/splash/exhale-bilo-light-40.png')}/> */}
        </View>
        <Animatable.View style={styles.footerIntro} animation="fadeInUpBig">
          <View>
            <Text style={{fontSize: 26, color: "#535353", textAlign: "center", width: 247, fontFamily: "Assistant-SemiBold", }}>Create a Free Account to Get Started</Text>
          </View>
          <View style={{ height: 250, justifyContent: "space-between"}}>
            <AppButton 
              title="Sign up with Facebook" 
              buttonStyles={styles.facebookButton} 
              buttonTextStyles={styles.buttonText} 
              onPress={""}
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
              <Text style={{fontSize: 20, color: "#535353", fontFamily: "Assistant-SemiBold"}}>stuffn</Text>
            </TouchableOpacity>
            {/* <Button style={{fontSize: 20, color: "#535353", fontFamily: "Assistant-SemiBold"}} title="Log-In" onPress={() => navigation.navigate('SignInScreen')}></Button> */}
          </View>
        </Animatable.View>
      </ImageBackground>
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
    height: height * 1.1,
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
    flex: 4.5,
    position: "relative",
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