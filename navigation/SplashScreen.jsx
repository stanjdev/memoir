import React, { useEffect } from 'react';
import { View, StyleSheet, StatusBar, Image, Dimensions } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import AppButton from '../components/AppButton';
const { width, height } = Dimensions.get('window');

export default function SplashScreen ({ route, navigation }) {
  const isFocused = useIsFocused();

  const navTo = () => route.params ? 
                      navigation.navigate('Memoir', { screen: 'Profile' })
                    : navigation.navigate('Memoir')

  useEffect(() => {
    let timeout = setTimeout(() => {
      navTo();
    }, 3000);

    return () => clearTimeout(timeout);
  }, [isFocused])

  return (
    <View style={styles.container}>
      <StatusBar hidden={true}/>
      <View>
        <AppButton
          buttonStyles={styles.blueButton} 
          onPress={navTo}
        />
        <Image 
          source={require('../assets/splash/memoir-splash.png')}
          style={styles.image}
        />
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