import React, { useState, useEffect } from 'react';
import { Text, View, StatusBar, Image, Dimensions, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import AppButton from '../../components/AppButton';
import { useIsFocused } from '@react-navigation/native';
import { useFonts } from 'expo-font';

const { width, height } = Dimensions.get('window');
const bgImage = require('../../assets/splash/memoir-splash-thin-4x.png');
// const bgImg = 'memoir-splash-thin-4x.png';

// import { cacheAsset } from '../../components/cacheAsset';

export default function MeditateScreen({navigation}) {
  const isFocused = useIsFocused();

  // const [cachedImg, setCachedImg] = useState();

  // useEffect(() => {
  //   cacheAsset(bgImg, setCachedImg, "splash-screens");
  // }, [])

  let [fontsLoaded] = useFonts({
    'Assistant': require('../../assets/fonts/Assistant/Assistant-VariableFont_wght.ttf'),
    'Assistant-Regular': require('../../assets/fonts/Assistant/static/Assistant-Regular.ttf'),
    'Assistant-SemiBold': require('../../assets/fonts/Assistant/static/Assistant-SemiBold.ttf'),
  });

  return (
    <ImageBackground source={bgImage} style={{ flex: 1, resizeMode: "cover", justifyContent: "center" }}>
      {isFocused ? <StatusBar hidden={false} barStyle="light-content"/> : null} 
      <TouchableOpacity onPress={() => navigation.goBack()} style={{position: "absolute", top: height * 0.065, zIndex: 100, padding: 15}}>
        <Image source={require('../../assets/screen-icons/back-arrow-white.png')} style={{height: 20}} resizeMode="contain"/>
      </TouchableOpacity>
      <View style={{marginTop: 20}}>
        <Text style={{textAlign: "center", fontSize: 23, fontFamily: "Assistant-SemiBold", color: 'white'}}>Meditate</Text>
        <View style={{flexDirection: "row", padding: 20}}>
          <View style={{backgroundColor: "white", flex: 1, height: height * 0.7, borderRadius: 20, justifyContent: "space-evenly", alignItems: "center" }}>

            <View style={{width: width < 330 ? width * 0.7 : width * 0.68, height: height * 0.45, justifyContent: "space-around", alignItems: "center", }}>
              <Image source={require('../../assets/screen-icons/meditate-circles-large.png')} style={{height: 47, }} resizeMode="contain"/>
              <Text style={{fontFamily: "Assistant-SemiBold", fontSize: height < 600 ? 20 : 23, textAlign: "center"}}>Sometimes Your Own Inner Voice is Enough</Text>
              <Text style={styles.modalTextStyle}>Our style of meditation doesn’t feature a voice to guide you through it.</Text>
              <Text style={styles.modalTextStyle}>Instead, we use a gentle bell sound to remind you to stay present.</Text>
              <Text style={styles.modalTextStyle}>On the next page you can set how often you’d like the bell to ring.</Text>
            </View>
            <AppButton 
              title="Got It" 
              buttonStyles={styles.blueButton}
              buttonTextStyles={styles.buttonText}
              onPress={() => navigation.navigate('MeditateTimerSetScreen', {bgImage: bgImage})}
            />

          </View>
        </View>
      </View>
    </ImageBackground>
  )
};

const styles = StyleSheet.create({
  blueButton: {
    backgroundColor: "#3681C7",
    height: 51,
    width: 234,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    shadowRadius: 7,
    shadowColor: "black",
    shadowOpacity: 0.2,
    shadowOffset: {width: 3, height: 3}
  },
  buttonText: {
    color: "#fff",
    flex: 1,
    textAlign: "center",
    fontSize: 22,
    letterSpacing: 1,
    fontFamily: "Assistant-SemiBold"
  },
  modalTextStyle : {
    fontFamily: "Assistant-Regular", 
    fontSize: height < 600 ? 14 : 16,
    textAlign: "center"
  }
});