import React, { useEffect, useState, useRef, useCallback } from 'react';
import { PanResponder, Text, Modal, View, ScrollView, StatusBar, Button, Alert, Vibration, Image, Dimensions, StyleSheet, ImageBackground, TouchableOpacity, TouchableHighlight, TouchableWithoutFeedback, Animated } from 'react-native';
import AppButton from './AppButton';
import { useIsFocused } from '@react-navigation/native';
import { useFonts } from 'expo-font';
const bgImage = require('../assets/splash/memoir-splash-thin-4x.png')
import { useNavigation } from '@react-navigation/native';

import { Audio, Video } from 'expo-av';
import { setAudioModeAsync } from 'expo-av/build/Audio';

// import Video from 'react-native-video';
import FlowerOfLife from "../assets/video-exercises/flower-of-life.mp4";

const { width, height } = Dimensions.get('window');





export default function ExerciseVideo({ route, navigation }) {
  const isFocused = useIsFocused();

  let [fontsLoaded] = useFonts({
    'Assistant': require('../assets/fonts/Assistant/Assistant-VariableFont_wght.ttf'),
    'Assistant-Regular': require('../assets/fonts/Assistant/static/Assistant-Regular.ttf'),
    'Assistant-SemiBold': require('../assets/fonts/Assistant/static/Assistant-SemiBold.ttf'),
  });

  const { videoFile } = route.params;

  const [modalVisible, setModalVisible] = useState(true);
  const [exerciseFinished, setExerciseFinished] = useState(false);
  const [paused, setPaused] = useState(false);
  const [videoBellVolume, setVideoBellVolume] = useState(0.0);
  const [bellVolume, setBellVolume] = useState("1.0");
  const [showTimerScroller, setShowTimerScroller] = useState(true);
  const [displayTimerDuration, setDisplayTimerDuration] = useState(false);
  const [overlay, setOverlay] = useState(true);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const overlayFade = useRef(new Animated.Value(0)).current;

  const fade = () => {
    Animated.timing(fadeAnim, {
      toValue: showTimerScroller ? 1 : 0,
      duration: 200,
      useNativeDriver: true
    }).start();
  };

  const overlayFader = () => {
    Animated.timing(overlayFade, {
      toValue: overlay ? 1 : 0,
      duration: 200,
      useNativeDriver: true
    }).start();
  };


  const touchScreenToggleControls = () => {
    setOverlay(!overlay);
    overlayFader();
  }


  const toggleShowTimerScroller = () => {
    if (displayTimerDuration) {
      setDisplayTimerDuration(false);
    }
    if (!showTimerScroller && timerDuration) {
      setDisplayTimerDuration(true);
    }
    setShowTimerScroller(!showTimerScroller);
    fade();
  }


  const [ mins, setMins ] = useState(1);
  // const [ mins, setMins ] = useState(0);
  const [ secs, setSecs ] = useState(5);

  const [ timerRunning, setTimerRunning ] = useState(false);
  const [ timerDuration, setTimerDuration ] = useState(null);

  const timerDurationsOptions = {
    "30s": {mins: 0, secs: 2},
    "1m": {mins: 1, secs: 0},
    "2m": {mins: 2, secs: 0},
    "3m": {mins: 3, secs: 0},
    "5m": {mins: 5, secs: 0},
    "10m": {mins: 10, secs: 0},
    "15m": {mins: 15, secs: 0},
    "20m": {mins: 20, secs: 0},
    "30m": {mins: 30, secs: 0},
  };

  const renderTimerOptions = () => {
    const options = [];
    for (let time in timerDurationsOptions) {
      options.push(
        <TouchableOpacity 
          onPress={() => pressTimerChoice(time)}
          key={`${time}`} 
          style={{ padding: 10, paddingRight: 27, paddingLeft: 27}}
        >
          <Text style={{fontFamily: "Assistant-SemiBold", fontSize: 19, color: "white", }}>{time}</Text>
        </TouchableOpacity>
      )
    }
    return options;
  };

  const pressTimerChoice = (time) => {
    setTimerDuration(timerDurationsOptions[time]);
    setDisplayTimerDuration(true);
    toggleShowTimerScroller();
    setTimerRunning(true);
    // toggleClock();
  };


  useEffect(() => {
    if (timerDuration) {
      setMins(timerDuration["mins"])
      setSecs(timerDuration["secs"])
      // console.log("current mins: " + timerDuration["mins"])
      // toggleClock();
      console.log("mins: " + mins);
      console.log("secs: " + secs);
    }
  }, [timerDuration]);

  
  useEffect(() => {
    // MOUNT
    console.log("exercise screen mounted!");
    console.log(videoFile);

    // UNMOUNT
    return () => clearInterval(exerciseInterv.current);
  }, []);


  const exerciseInterv = useRef(null);
  useEffect(() => {
    if (exerciseInterv.current) clearInterval(exerciseInterv.current);
    if (timerDuration) {
      if (paused) setTimerRunning(false);
      else setTimerRunning(true);
    }
    if (timerRunning) {
      console.log("timerRunning: " + timerRunning)
      setExerciseFinished(false);
      exerciseInterv.current = setInterval(() => runExerciseClock(), 1000);
    } 
    if (!timerRunning) {
      clearInterval(exerciseInterv.current);
    }
  }, )


  // COUNTDOWN for Exercise vids
  const runExerciseClock = () => {
    if (secs > 0) {
      setSecs(secs - 1);
      
    } else if (mins >= 1 && secs == 0) {
      setSecs(59);
      setMins(mins - 1);
    } else {
      Alert.alert("Congratulations!", "You've completed your exercise!", [{text: "Okay"}]);
      setTimerDuration(null);
      setTimerRunning(false);
      setBellMuted(true);
      setExerciseFinished(true);
      touchScreenToggleControls();
      console.log('else hit!');
      loadFinishedSound();
      clearInterval(exerciseInterv.current);
      bellSound.unloadAsync();
      // setTimeout(() => {
      //   navigation.navigate("Memoir");
      // }, 2000);
    }
    console.log("runExerciseClock secs: " + secs);
  }

  // Add leading zero to numbers 9 or below (purely for aesthetics):
  function leadingZero(time) {
    if (time <= 9) {
        time = "0" + time;
    }
    return time;
}
  







  
  // // inactivity, hide the overlay controls - DIDN'T WORK
  // // https://codedaily.io/tutorials/140/How-to-Detect-Touch-Inactivity-with-a-PanResponder-in-React-Native
  
  // const [inactive, setInactive] = useState(true);
  // let inactiveTimeout;
  // const [panResponder, setPanresponder] = useState();

  // useEffect(() => {
  //   const panResponder = PanResponder.create({
  //     onMoveShouldSetPanResponderCapture: () => {
  //       clearTimeout(inactiveTimeout)
  //       setInactive(inactive => {
  //         if (!inactive) return null;
  //         return false;
  //       });
  //       inactiveTimeout = setTimeout(() => {
  //         setInactive(true);
  //       }, 3000);
  //       return false;
  //     }
  //   })
  //   setPanresponder(panResponder)
  //   console.log("inactive: " + inactive)
  //   console.log(JSON.stringify({...panResponder.panHandlers}))
  //   return () => clearTimeout(inactiveTimeout)
  // },)













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
    // console.log("bellVolume: " + bellVolume);
    // console.log("volumeOn: " + volumeOn);
  });










  // MAY BE USEFUL FOR MUSIC / WHITE NOISE audio
  // BELL SOUND - useInterval()
  const bellSound = new Audio.Sound();
  Audio.setAudioModeAsync({playsInSilentModeIOS: true});

  const playBell = async () => await bellSound.replayAsync();
  const playBellFirst = async () => await bellSound.playAsync();

  const loadFinishedSound = async () => {
    try {
      await bellSound.loadAsync(require('../assets/audio/meditation-finished-sound.mp3'));
      await bellSound.playAsync()
      console.log("load sound!");
    } catch (error) {
      console.log(error);
    }
    // // https://docs.expo.io/versions/latest/sdk/audio/?redirected#parameters
  }



  const [liked, setLiked] = useState(false);
  const toggleLike = () => {
    setLiked(!liked);
  }

  // simple bell mute function
  const [bellMuted, setBellMuted] = useState(false);
  const bellMute = () => {
    setBellMuted(!bellMuted);
  }

  const [musicMuted, setMusicMuted] = useState(false);
  const toggleMusic = () => {
    setMusicMuted(!musicMuted);
  }

  const pause = () => {
    setPaused(!paused);
    if (timerDuration) {

    }
  }


  return (
    
    <View style={{ flex: 1, resizeMode: "cover", position: "relative", zIndex: -10,}} >
      <Video
        source={ videoFile }
        rate={1.0}
        volume={0.4}
        isMuted={bellMuted}
        // isMuted={true}
        resizeMode="cover"
        shouldPlay={!modalVisible && !exerciseFinished && !paused}
        // shouldPlay={false}
        isLooping
        style={{ width: width, height: height }}
      />
      {isFocused ? <StatusBar hidden={false} barStyle="light-content"/> : null} 

      <TouchableWithoutFeedback 
        onPress={touchScreenToggleControls} 
        onLongPress={pause}
      >
        <View 
          style={{  height: height * 0.63, width: width, position: "absolute", top: height * 0.15, zIndex: 10, }} 
        >
          {/* <Text style={{color: "orange"}}>TOUCH!</Text> */}
        </View>
      </TouchableWithoutFeedback>


      <Animated.View style={{ height: height, width: width, position: "absolute", opacity: overlayFade }}>
        <View style={{ borderColor: "white", position: "absolute", height: height}}>
          <View style={{ width: width, flexDirection: "row", alignItems: "center", marginTop: height * 0.07, zIndex: 100}}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 15, }}>
              <Image source={require('../assets/screen-icons/back-arrow-white.png')} style={{height: 20, marginLeft: 0}} resizeMode="contain"/>
            </TouchableOpacity>
          </View>

          <Animated.View style={[ {position: "absolute", bottom: height * 0.18, width: width, } ]}>
            <View>
              {displayTimerDuration ? 
              <View>
                <Text style={{fontFamily: "Assistant-Regular", fontSize: 35, color: "white", textAlign: "center"}}>{`${mins}:${leadingZero(secs)}`}</Text> 
                <Text style={{fontFamily: "Assistant-Regular", fontSize: 19, color: "white", textAlign: "center"}}>Timer</Text> 
              </View>
              : null}
            </View>
          </Animated.View>

          <Animated.View style={[ {position: "absolute", bottom: height * 0.12, width: width, opacity: fadeAnim, display: showTimerScroller ? "none" : "flex"}, ]}>
            <Text style={{fontFamily: "Assistant-SemiBold", fontSize: 17, color: "white", textAlign: "center"}}>Select Timer Duration</Text>
            <View style={{height: height * 0.06, flexDirection: "row", justifyContent: "space-evenly", alignItems: "center"}}>
              <ScrollView 
                horizontal={true} 
                showsHorizontalScrollIndicator={false}
              >
                {renderTimerOptions()}

              </ScrollView>
            </View>
          </Animated.View>


          <View style={{...styles.borderControl}, {  position: "absolute", bottom: 0, flexDirection: "row", justifyContent: "space-evenly", width: width, height: height * 0.12}}>
            <TouchableOpacity style={styles.exerciseControls, {padding: 13, paddingLeft: 11} } onPress={ toggleLike }>
              {liked ? 
              <Image source={require('../assets/screen-icons/1-like-heart-filled.png')} resizeMode="contain" style={{margin: 4, height: 27, width: 27, }}/>
              : <Image source={require('../assets/screen-icons/1-like-heart.png')} resizeMode="contain" style={{margin: 4, height: 27, width: 27, }}/>
              }
            </TouchableOpacity>
            <TouchableOpacity style={styles.exerciseControls, {padding: 13, }} onPress={ bellMute }>
              {bellMuted ? 
              <Image source={require('../assets/screen-icons/2-bell-muted.png')} resizeMode="contain" style={{height: 38, width: 38,}}/>
              :<Image source={require('../assets/screen-icons/2-bell-toggle-2.png')} resizeMode="contain" style={{height: 38, width: 38, }}/>
              }
            </TouchableOpacity>
            <TouchableOpacity style={styles.exerciseControls, {padding: 13, }} onPress={ toggleMusic }>
              {musicMuted ? 
              <Image source={require('../assets/screen-icons/3-music-muted-2.png')} resizeMode="contain" style={{ marginTop: 3, height: 32, width: 32, }}/>
              : <Image source={require('../assets/screen-icons/3-music-note.png')} resizeMode="contain" style={{ marginTop: 3, height: 32, width: 32, }}/>
              }
            </TouchableOpacity>
            <TouchableOpacity style={styles.exerciseControls, {padding: 13, }} onPress={ toggleShowTimerScroller }>
              <Image source={require('../assets/screen-icons/4-breathe-timer.png')} resizeMode="contain" style={{ marginTop: 5, height: 30, width: 30, }}/>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
      

      

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
    height: 50,
    borderWidth: 1, borderColor: "white"
  },
  borderControl: {
    borderWidth: 1, borderColor: "white"
  }
})

