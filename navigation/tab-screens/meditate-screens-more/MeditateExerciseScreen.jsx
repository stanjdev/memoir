import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Text, View, StatusBar, Button, Alert, Vibration, Image, Dimensions, StyleSheet, ImageBackground, TouchableOpacity, TouchableHighlight, TouchableNativeFeedback } from 'react-native';
import AppButton from '../../../components/AppButton';
import { useIsFocused } from '@react-navigation/native';
import { useFonts } from 'expo-font';
const bgImage = require('../../../assets/splash/memoir-splash-thin-4x.png')
import { useNavigation } from '@react-navigation/native';

import { Audio } from 'expo-av';

const { width, height } = Dimensions.get('window');

export default function MeditateExerciseScreen({ route, navigation }) {
  const isFocused = useIsFocused();
  
  let [fontsLoaded] = useFonts({
    'Assistant': require('../../../assets/fonts/Assistant/Assistant-VariableFont_wght.ttf'),
    'Assistant-Regular': require('../../../assets/fonts/Assistant/static/Assistant-Regular.ttf'),
    'Assistant-SemiBold': require('../../../assets/fonts/Assistant/static/Assistant-SemiBold.ttf'),
  });
  




  const [ overlay, setOverlay ] = useState(true);
  // let overlay = true;
  const toggleOverLay = () => {
    // overlay ? setOverlay(false) : setOverlay(true);
    setOverlay(overlay => !overlay);
    // overlay = !overlay;
    // console.log(overlay);
  }

  // const [ overlayer, setOverlayer ] = useState(true);
  // useEffect(() => {
  //   setOverlayer(overlayer => overlay)
  //   console.log(overlay)
  // },[overlay])







  const { minutes, bellInterv } = route.params;
  const [ timerRunning, setTimerRunning ] = useState(true);

  const [ mins, setMins ] = useState(minutes);
  // const [ mins, setMins ] = useState(0);
  const [ secs, setSecs ] = useState(0);


  // Add leading zero to numbers 9 or below (purely for aesthetics):
  function leadingZero(time) {
      if (time <= 9) {
          time = "0" + time;
      }
      return time;
  }

  function pause() {
    // console.log("pause button")
    setTimerRunning(!timerRunning);
  }
  



  // // THE CLOCK
  // // SET TIMEOUT WAY - BINGO
  // let secsTimer;
  // const startCountDown = () => {
  //   if (timerRunning) {
  //     if (secs > 0) {
  //       secsTimer = setTimeout(() => {
  //         setSecs(secs - 1);
  //       }, 1000);
  //     } else if (mins >= 1 && secs == 0) {
  //       let minsTimer = setTimeout(() => {
  //         setSecs(59);
  //         setMins(mins - 1);
  //       }, 1000);
  //     } else {
  //         // setMins("0");
  //         // setSecs("0");
  //         Alert.alert("Done!");
  //         setTimerRunning(false);

  //         // Vibration.vibrate([500, 500, 500])
  //     }
  //   }
  // }

  // useEffect(() => {
  //   startCountDown();
  //   return () => clearTimeout(secsTimer);
  // })






  // OG bell sound. pause works, but play doesn't start the bell again. - this way interrupts the touch screen overlay thing tho.

  // const bellSound = new Audio.Sound();
  // Audio.setAudioModeAsync({playsInSilentModeIOS: true});
  
  // // Bell Interval
  // const bellInterval = useRef(null);

  // const clear = useCallback(() => clearInterval(bellInterval.current), []);
  // const playBell = async () => await bellSound.replayAsync();

  // const playBowlSound = async () => {
  //   try {
  //     await bellSound.loadAsync(require('../../../assets/audio/singing-bowl.mp3'));
  //     await bellSound.playAsync()
  //     // Your sound is playing!

  //   } catch (error) {
  //     console.log(error);
  //   }
  //   // // https://docs.expo.io/versions/latest/sdk/audio/?redirected#parameters

  //   if (timerRunning) {
  //     bellInterval.current = setInterval(playBell, 5000);
  //   }
  // }

  // useEffect(() => {
  //   // MOUNT
  //   playBowlSound();
  //   console.log("useEffect playbowlsound mounted/started!")

  //   // UNMOUNT
  //   return () => clearInterval(bellInterval.current)
  // }, [])


  // useEffect(() => {
  //   if (!timerRunning) console.log("timer done or paused, no more bell sound!");
  //   if (!timerRunning) clear();
  //   console.log(timerRunning);
    
  //   // Don't forget to unload the sound from memory
  //   // when you are done using the Sound object
  //   return () => bellSound.unloadAsync();
  // })














  // useInterval() ATTEMPT - ghetto, but works for the most part. once it hits 00:00, it still hits the else, and still runs every second.
  // COUNTDOWN - useInterval()
  const countDown = () => {
    if (secs > 0) {
      setSecs(secs - 1);
    } else if (mins >= 1 && secs == 0) {
      setSecs(59);
      setMins(mins - 1);
    } else {
      // Alert.alert("Done!");
      setTimerRunning(false);
      bellSound.unloadAsync();
      console.log('else');
      loadSound(); // final 3 bells because of the 2 sec setTimeout below.
      setTimeout(() => {
        navigation.navigate("MeditateTimerSetScreen");
      }, 2000);
    }
  }



  // BELL SOUND - useInterval()  
  const bellSound = new Audio.Sound();
  Audio.setAudioModeAsync({playsInSilentModeIOS: true});

  const playBell = async () => await bellSound.replayAsync();
  const playBellFirst = async () => await bellSound.playAsync();

  const loadSound = async () => {
    try {
      await bellSound.loadAsync(require('../../../assets/audio/singing-bowl.mp3'));
      bellInterv === null ? null : await bellSound.playAsync()
      console.log("load sound!")
    } catch (error) {
      console.log(error);
    }
    // // https://docs.expo.io/versions/latest/sdk/audio/?redirected#parameters
  }

  useEffect(() => {
    // MOUNT
    loadSound();
    // playBellFirst();
    console.log("useEffect loadSound mounted/started!");
    console.log(bellInterv);

    // UNMOUNT
    return () => bellSound.unloadAsync();
  }, [])

  const [toggleClock, runningClock] = useInterval(() => {
    countDown();
  }, 1000);

  const [toggleBell, runningBell] = useInterval(() => {
    loadSound();
  }, bellInterv);

  const toggle = () => {
    toggleClock();
    bellInterv === null ? null : toggleBell();
    setTimerRunning(!timerRunning);
  }












  return (
    <ImageBackground source={bgImage} style={{ flex: 1, resizeMode: "cover", position: "relative", zIndex: -10}}>
      {isFocused ? <StatusBar hidden={false} barStyle="light-content"/> : null} 

      {overlay ? 
      <View style={{ width: width, flexDirection: "row", alignItems: "center", marginTop: height * 0.07, position: "absolute", zIndex: 100}}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 15}}>
          <Image source={require('../../../assets/screen-icons/back-arrow-white.png')} style={{height: 20, marginLeft: 0}} resizeMode="contain"/>
        </TouchableOpacity>
        <Text style={{textAlign: "center", fontSize: 23, fontFamily: "Assistant-SemiBold", color: 'white', position: "absolute", zIndex: -1, width: width}}>Meditate</Text>
      </View>
      : null}
      

      <View style={{ justifyContent: "center", position: "absolute", height: height, width: width}}>
        <View style={{ padding: 20, alignItems: "center" }}>
        <Text style={{fontFamily: "Assistant", color: "white", fontSize: 67}}>{`${leadingZero(mins)}:${leadingZero(secs)}`}</Text>
        {/* <Text style={{fontFamily: "Assistant", color: "white", fontSize: 67}}>{`${leadingZero(mins)}:${leadingZero(secs)}`}</Text> */}
        {/* <Text style={{fontFamily: "Assistant", color: "white", fontSize: 67}}>{`${leadingZero(clock.mins)}:${leadingZero(clock.secs)}`}</Text> */}
          
          {/* <TouchableOpacity onPress={() => pause()}> */}
          <TouchableOpacity onPress={() => toggle()}>
            {timerRunning ? 
            <Image source={require('../../../assets/screen-icons/pause-circle.png')} style={{height: 66}} resizeMode="contain"/>
            :
            <Image source={require('../../../assets/screen-icons/play-circle.png')} style={{height: 66}} resizeMode="contain"/>
            }
          </TouchableOpacity>

          <TouchableNativeFeedback onPress={toggleOverLay}>
            <Text>TOUCH to show/hide header</Text>
          </TouchableNativeFeedback>
        </View>
      </View>
    </ImageBackground>
  )
}

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
  }
})









// useINTERVAL ATTEMPT
function useInterval(callback, delay) {
  const savedCallback = useRef();
  const intervalId = useRef(null);
  const [currentDelay, setDelay] = useState(delay);

  const toggleRunning = useCallback(
    () => setDelay(currentDelay => (currentDelay === null ? delay : null)),
    [delay]
  );

  const clear = useCallback(() => clearInterval(intervalId.current), []);

  // Remember the latest function.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }

    if (intervalId.current) clear();

    if (currentDelay !== null) {
      intervalId.current = setInterval(tick, currentDelay);
    }

    return clear;
  }, [currentDelay, clear]);

  return [toggleRunning, !!currentDelay];
}