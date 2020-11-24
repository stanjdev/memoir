import React, { useEffect, useContext } from 'react';
import { Text, View, StyleSheet, StatusBar, Image, Dimensions, ImageBackground } from 'react-native';
import { AuthContext } from '../components/context';
import AppButton from '../components/AppButton';
import { useFonts } from 'expo-font';

const { width, height } = Dimensions.get('window');
const bgImage = require('../assets/splash/user-welcome-bg.png')
// const bgImage = require('../assets/splash/memoir-splash-thin.png')
// const bgImage = { uri: "https://reactjs.org/logo-og.png" }


export default function UserWelcomeScreen ({navigation}) {
  const { userToken, userFirstName } = useContext(AuthContext);

  const [fontsLoaded] = useFonts({
    // 'Bilo': 'https://use.typekit.net/ckh3mnt.css' // .css doesn't work. Probably need otf or ttf file. 
    'Assistant': require('../assets/fonts/Assistant/Assistant-VariableFont_wght.ttf'),
    'Assistant-Regular': require('../assets/fonts/Assistant/static/Assistant-Regular.ttf'),
    'Assistant-SemiBold': require('../assets/fonts/Assistant/static/Assistant-SemiBold.ttf'),
  })

  useEffect(() => {
    setTimeout(() => {
      navigation.navigate('Memoir');
    }, 3000);
  }, [])

  return (
    <View style={styles.container}>
      <StatusBar hidden={true}/>
      <ImageBackground source={bgImage} style={styles.bgImage}>
      <Text style={{textAlign: "center", color: "#FFFFFF", fontSize: 40, fontFamily: "Assistant"}}>welcome {userFirstName.toLowerCase()}</Text>
      </ImageBackground>
      <View>
        <AppButton
          buttonStyles={styles.blueButton} 
          onPress={() => navigation.navigate('Memoir')}
        />
        {/* <Image 
          source={require('../assets/splash/user-welcome-bg.png')}
          style={styles.image}
        /> */}
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
    height: height * 1.1,
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