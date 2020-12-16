import React, { useEffect } from 'react';
import { Text, View, StyleSheet, StatusBar, Image, Dimensions, ImageBackground } from 'react-native';

import AppButton from '../components/AppButton';

const { width, height } = Dimensions.get('window');


export default function SplashScreen ({navigation}) {

  useEffect(() => {
    setTimeout(() => {
      navigation.navigate('Memoir')
    }, 2000);
  }, [])

  return (
    <View style={styles.container}>
      <StatusBar hidden={true}/>
      {/* <ImageBackground source={bgImage} style={styles.bgImage}>
        
      </ImageBackground> */}
      <View>
        <AppButton
          buttonStyles={styles.blueButton} 
          // onPress={() => navigation.navigate('GetStartedScreen')}
          onPress={() => navigation.navigate('Memoir')}
        />
        <Image 
          source={require('../assets/splash/memoir-splash.png')}
          style={styles.image}
        />
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
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingVertical: 50,
    paddingHorizontal: 45,
    justifyContent: "space-evenly",
  },
  blueButton: {
    // backgroundColor: "#3681C7",
    height: height,
    width: width,
    position: "absolute",
    zIndex: 10,
    top: 0,
    right: 0,
    borderRadius: 20,
  },
  buttonText: {
    color: "#fff",
    flex: 1,
    textAlign: "center",
    fontSize: 24,
  }
});