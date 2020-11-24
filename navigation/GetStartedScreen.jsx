import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, StatusBar, Image, Dimensions, ImageBackground } from 'react-native';

import AppButton from '../components/AppButton';
import * as Animatable from 'react-native-animatable';
import { useFonts } from 'expo-font';
import * as Font from 'expo-font';
import { AppLoading } from 'expo';

const { width, height } = Dimensions.get('window');
const bgImage = require('../assets/splash/memoir-splash-thin-content-4x.png')
// const bgImage = require('../assets/splash/memoir-splash-thin.png')
// const bgImage = { uri: "https://reactjs.org/logo-og.png" }

// let customFonts = {
//   'Assistant-Regular': require('../assets/fonts/Assistant/static/Assistant-Regular.ttf'),
//   'Assistant-SemiBold': require('../assets/fonts/Assistant/static/Assistant-SemiBold.ttf'),
// }

export default function GetStartedScreen ({navigation}) {
  let [fontsLoaded] = useFonts({
    'Assistant': require('../assets/fonts/Assistant/Assistant-VariableFont_wght.ttf'),
    'Assistant-Regular': require('../assets/fonts/Assistant/static/Assistant-Regular.ttf'),
    'Assistant-SemiBold': require('../assets/fonts/Assistant/static/Assistant-SemiBold.ttf'),
    // 'Bilo': 'https://use.typekit.net/ckh3mnt.css'
  });

  // const [fontsLoaded, setFontsLoaded] = React.useState(false);

  // const _loadFontAsync = async () => {
  //   await Font.loadAsync(customFonts);
  //   setFontsLoaded(true);
  // }

  // useEffect(() => {
  //   _loadFontAsync();
  // }, [])

  return (
    <View style={styles.container}>
      <StatusBar hidden={true}/>
      <ImageBackground source={bgImage} style={styles.bgImage}>
        <View style={styles.body}>
          {/* <Image source={require('../assets/splash/memoir-logo-white.png')}/>
          <Image source={require('../assets/splash/circles-white.png')} resizeMode="stretch"/>
          <Image source={require('../assets/splash/exhale-bilo-light-40.png')}/> */}
        </View>
        <Animatable.View 
          style={styles.footerIntro}
          animation="fadeInUpBig"
        >
          {fontsLoaded ? 
          <View style={{height: "100%", justifyContent: "space-evenly", }}>
            <View style={{alignItems: "center"}}>
              {/* <Text style={{fontFamily: "Bilo"}}>Bilo test font</Text> */}
              <Text style={{fontSize: 35, color: "#535353", fontFamily: "Assistant-SemiBold", width: 300}}>Ease Your Stress</Text>
              <Text style={{fontSize: 22, color: "#717171", fontFamily: "Assistant-Regular", width: 300, marginTop: 10}}>Relieve Anxiety, Sleep Better, and Stay Centered with Memoir.</Text>
            </View>
            <View style={{alignItems: "center"}}>
              <AppButton 
                title="Get Started &rsaquo;" 
                buttonStyles={styles.blueButton} 
                buttonTextStyles={styles.buttonText} 
                onPress={() => navigation.navigate('CreateIntroScreen')}
              />
            </View>
          </View>
          : <AppLoading />
          }

        </Animatable.View>
      </ImageBackground>
      {/* <View>
        <Image 
          source={require('../assets/splash/memoir-splash-thin.png')}
          style={styles.image}
        />
      </View> */}
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
    height: height * 1.1,
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
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingVertical: 40,
    paddingHorizontal: 45,
    justifyContent: "space-evenly",
  },
  blueButton: {
    backgroundColor: "#3681C7",
    // backgroundColor: "blue",
    // borderColor: "green",
    // borderWidth: 1,
    height: 65,
    width: 279,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    flex: 1,
    textAlign: "center",
    fontSize: 24,
    letterSpacing: 1,
    fontFamily: "Assistant-SemiBold"
  }
});