import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Text, Modal, View, StatusBar, Button, Alert, Vibration, Image, Dimensions, StyleSheet, ImageBackground, TouchableOpacity, TouchableHighlight, TouchableNativeFeedback, Animated } from 'react-native';
import AppButton from './AppButton';
import { useIsFocused } from '@react-navigation/native';
import { useFonts } from 'expo-font';
const bgImage = require('../assets/splash/memoir-splash-thin-4x.png')
import { useNavigation } from '@react-navigation/native';

import { Audio, Video } from 'expo-av';
import { setAudioModeAsync } from 'expo-av/build/Audio';

// import Video from 'react-native-video';
import FlowerOfLife from "../assets/video-exercises/flower-of-life.mp4";
import { ScrollView } from 'react-native-gesture-handler';

const { width, height } = Dimensions.get('window');

export default function ExerciseVideo({ route, navigation }) {
  const isFocused = useIsFocused();
  
  let [fontsLoaded] = useFonts({
    'Assistant': require('../assets/fonts/Assistant/Assistant-VariableFont_wght.ttf'),
    'Assistant-Regular': require('../assets/fonts/Assistant/static/Assistant-Regular.ttf'),
    'Assistant-SemiBold': require('../assets/fonts/Assistant/static/Assistant-SemiBold.ttf'),
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

  const [ modalVisible, setModalVisible ] = useState(true);
  const [ playVideo, setPlayVideo ] = useState(false);
  const [ videoBellVolume, setVideoBellVolume ] = useState(0.0);
  const [bellVolume, setBellVolume] = useState("1.0");
  const [showTimer, setShowTimer] = useState(true);

  const toggleShowTimer = () => {
    setShowTimer(!showTimer);
    fade();
  }



  const fadeAnim = useRef(new Animated.Value(0)).current;

  const fade = () => {
    Animated.timing(fadeAnim, {
      toValue: showTimer ? 1 : 0,
      duration: 200,
      useNativeDriver: true
    }).start();
  };



  // const fadeBellVolume = () => {
  //   const fadeEffect = setInterval(() => {
  //     if (videoBellVolume < 1.0) {
  //       setVideoBellVolume(videoBellVolume => videoBellVolume + 0.1);
  //       clearInterval(fadeEffect);
  //     } else {
  //       clearInterval(fadeEffect);
  //     }
  //     console.log(videoBellVolume);
  //     clearInterval(fadeEffect);
  //   }, 200);
  // }
  

  const [volumeOn, setVolumeOn] = useState(false);

  // const fadeBellVolume = () => {
  //   bellVolume = volumeOn ? 1.0 : 0.0;
  //   setVolumeOn(!volumeOn);
  //   const fadeEffect = setInterval(() => {
  //     if (!volumeOn) {
  //       if (bellVolume < 1.0) {
  //         bellVolume = bellVolume + 0.1;
  //       } else {
  //         clearInterval(fadeEffect);
  //       }
  //     }
  //     if (volumeOn) {
  //       if (bellVolume > 0.0) {
  //         bellVolume = bellVolume - 0.1;
  //       } else {
  //         clearInterval(fadeEffect);
  //       }
  //     }
  //     console.log(bellVolume);
  //     console.log(volumeOn);
  //   }, 50);
  // };




  // LAST ATTEMPT: https://stackblitz.com/edit/react-rj8nrb https://docs.expo.io/versions/latest/sdk/video/ 
  const fadeBellVolume = () => {
    setVolumeOn(!volumeOn);

    // volumeOn ? setBellVolume("1.0") : setBellVolume("0.0");
    // if (bellVolume > 1.0) clearInterval(fadeEffect);
    // if (bellVolume < 0.0) clearInterval(fadeEffect);
    const fadeEffect = setInterval(() => {
      if (!volumeOn) {
        if (bellVolume > 0) {
          setBellVolume(bellVolume => bellVolume - 0.1);
        } else {
          clearInterval(fadeEffect);
          // setVolumeOn(!volumeOn);
        }
      }

      if (volumeOn) {
        if (bellVolume < 1) {
          setBellVolume(bellVolume => bellVolume + 0.1);
        } else {
          clearInterval(fadeEffect);
          // setVolumeOn(!volumeOn);
        }
      }
    }, 500);
    // if (fadeEffect) clearInterval(fadeEffect);
  };

  useEffect(() => {
    console.log(bellVolume);
    console.log(volumeOn);
  });






  const [ timerRunning, setTimerRunning ] = useState(true);

  const [ mins, setMins ] = useState();
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
  














  // useInterval() ATTEMPT - ghetto, but works for the most part. once it hits 00:00, it still hits the else, and still runs every second.
  // COUNTDOWN - useInterval()
  // const countDown = () => {
  //   if (secs > 0) {
  //     setSecs(secs - 1);
  //   } else if (mins >= 1 && secs == 0) {
  //     setSecs(59);
  //     setMins(mins - 1);
  //   } else {
  //     // Alert.alert("Done!");
  //     setTimerRunning(false);
  //     bellSound.unloadAsync();
  //     console.log('else');
  //     loadSound(); // final 3 bells because of the 2 sec setTimeout below.
  //     setTimeout(() => {
  //       navigation.navigate("MeditateTimerSetScreen");
  //     }, 2000);
  //   }
  // }


  // MAY BE USEFUL FOR MUSIC / WHITE NOISE audio
  // BELL SOUND - useInterval()
  const bellSound = new Audio.Sound();
  Audio.setAudioModeAsync({playsInSilentModeIOS: true});

  const playBell = async () => await bellSound.replayAsync();
  const playBellFirst = async () => await bellSound.playAsync();

  const loadSound = async () => {
    try {
      await bellSound.loadAsync(require('../assets/audio/singing-bowl.mp3'));
      // bellInterv === null ? null : await bellSound.playAsync()
      console.log("load sound!")
    } catch (error) {
      console.log(error);
    }
    // // https://docs.expo.io/versions/latest/sdk/audio/?redirected#parameters
  }

  useEffect(() => {
    // MOUNT
    // loadSound();
    // playBellFirst();
    console.log("useEffect loadSound mounted/started!");

    // UNMOUNT
    return () => bellSound.unloadAsync();
  }, [])

  const [toggleClock, runningClock] = useInterval(() => {
    // countDown();
  }, 1000);

  // const [toggleBell, runningBell] = useInterval(() => {
  //   loadSound();
  // }, bellInterv);

  const toggle = () => {
    toggleClock();
    // bellInterv === null ? null : toggleBell();
    setTimerRunning(!timerRunning);
  }










  

  return (
    
    <View style={{ flex: 1, resizeMode: "cover", position: "relative", zIndex: -10,}}>
      <Video
        source={ require('../assets/video-exercises/flower-of-life.mp4') }
        rate={1.0}
        volume={bellVolume}
        isMuted={false}
        resizeMode="cover"
        shouldPlay={!modalVisible}
        isLooping
        style={{ width: width, height: height }}
      />
      {isFocused ? <StatusBar hidden={false} barStyle="light-content"/> : null} 

      {overlay ? 
      <View style={{borderWidth: 2, borderColor: "white", backgroundColor: "pink", opacity: 0.8, position: "absolute", height: height}}>
        <View style={{ width: width, flexDirection: "row", alignItems: "center", marginTop: height * 0.07, zIndex: 100}}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 15, borderWidth: 1, borderColor: "white"}}>
            <Image source={require('../assets/screen-icons/back-arrow-white.png')} style={{height: 20, marginLeft: 0}} resizeMode="contain"/>
          </TouchableOpacity>
        </View>


        <Animated.View style={[ {position: "absolute", bottom: height * 0.12, width: width, opacity: fadeAnim}, ]}>
          <View style={{borderWidth: 1, height: height * 0.07, flexDirection: "row", justifyContent: "space-evenly", alignItems: "center"}}>
            <ScrollView horizontal={true}>
              <Text>30s</Text>
              <Text>1m</Text>
              <Text>2m</Text>
              <Text>3m</Text>
              <Text>5m</Text>
              <Text>10m</Text>
              <Text>15m</Text>
              <Text>20m</Text>
              <Text>30m</Text>
            </ScrollView>
          </View>
        </Animated.View>


        <View style={{borderWidth: 1, borderColor: "white", position: "absolute", bottom: 0, flexDirection: "row", justifyContent: "space-evenly", width: width, height: height * 0.12}}>
          <TouchableOpacity style={styles.exerciseControls} onPress={() => console.log("add to favorites!")}>
            <Image source={require('../assets/screen-icons/1-like-heart.png')} resizeMode="contain" style={{height: 26, width: 26}}/>
          </TouchableOpacity>
          <TouchableOpacity style={styles.exerciseControls} onPress={ fadeBellVolume }>
            <Image source={require('../assets/screen-icons/2-bell-toggle.png')} resizeMode="contain" style={{height: 26, width: 26}}/>
          </TouchableOpacity>
          <TouchableOpacity style={styles.exerciseControls} onPress={() => console.log("toggle music volume")}>
            <Image source={require('../assets/screen-icons/3-music-note.png')} resizeMode="contain" style={{height: 26, width: 26}}/>
          </TouchableOpacity>
          <TouchableOpacity style={styles.exerciseControls} onPress={ toggleShowTimer }>
            <Image source={require('../assets/screen-icons/4-breathe-timer.png')} resizeMode="contain" style={{height: 26, width: 26}}/>
          </TouchableOpacity>
        </View>
        
      </View>
      
      : null}
      

      <View style={{flex: 1, justifyContent: "center", alignItems: "center", marginTop: 22}}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => { Alert.alert("Modal has been closed.") }}
        >
          <View style={{backgroundColor: "white", height: height * 0.74, borderRadius: 20, justifyContent: "space-between", alignItems: "center", width: width * 0.9, ...styles.modalView }}>
            <View style={{width: width * 0.63, height: height * 0.45, justifyContent: "space-between", alignItems: "center" }}>
              <Image source={require('../assets/screen-icons/breathe-waves.png')} style={{height: 31, }} resizeMode="contain"/>
              <Text style={{fontFamily: "Assistant-SemiBold", fontSize: 28, textAlign: "center", width: 205}}>Inhale, Hold, Exhale, Repeat</Text>
              <Text style={{fontFamily: "Assistant-Regular", fontSize: 16, textAlign: "center"}}>This breathing exercise is designed to bring you calmness, relaxation, and inner peace.</Text>
              <Text style={{fontFamily: "Assistant-Regular", fontSize: 16, textAlign: "center"}}>Repeat the loop at least 6 times for maximum benefit, or set a timer on the next page to make it a full session.</Text>
              <Text style={{fontFamily: "Assistant-Regular", fontSize: 16, textAlign: "center"}}>Tap anywhere on the screen to view controls or return to home.</Text>
            </View>
            <AppButton 
              title="Start" 
              buttonStyles={{...styles.blueButton, }}
              buttonTextStyles={styles.buttonText}
              onPress={() => setModalVisible(!modalVisible)}
            />
          </View>
        </Modal>
      </View>

        

    </View>
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
  },
  modalView: {
    margin: 20,
    marginTop: height * 0.15,
    backgroundColor: "white",
    // borderWidth: 1,
    borderRadius: 20,
    padding: 35,
    justifyContent: "space-evenly",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  exerciseControls: {
    padding: 10,
    // borderWidth: 1, 
    height: 50
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