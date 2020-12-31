import React, { useEffect, useState, useRef, useCallback, useContext } from 'react';
import { Animated, Text, View, StatusBar, Button, Alert, Vibration, Image, Dimensions, StyleSheet, ImageBackground, TouchableOpacity, TouchableHighlight, TouchableWithoutFeedback } from 'react-native';
import AppButton from '../../../components/AppButton';
import { useIsFocused } from '@react-navigation/native';
import { useFonts } from 'expo-font';
const bgImage = require('../../../assets/splash/memoir-splash-thin-4x.png')
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../../components/context';

import { Audio } from 'expo-av';
import { useKeepAwake } from 'expo-keep-awake';

const { width, height } = Dimensions.get('window');

import firebase from 'firebase';


export default function MeditateExerciseScreen({ route, navigation }) {
  useKeepAwake();
  const isFocused = useIsFocused();
  
  let [fontsLoaded] = useFonts({
    'Assistant': require('../../../assets/fonts/Assistant/Assistant-VariableFont_wght.ttf'),
    'Assistant-Regular': require('../../../assets/fonts/Assistant/static/Assistant-Regular.ttf'),
    'Assistant-SemiBold': require('../../../assets/fonts/Assistant/static/Assistant-SemiBold.ttf'),
  });
  
  const { userToken } = useContext(AuthContext);
  
  const [ overlay, setOverlay ] = useState(true);
  const overlayFade = useRef(new Animated.Value(0)).current;

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











  const { minutes, bellInterv } = route.params;
  const [ timerRunning, setTimerRunning ] = useState(true);

  const [ mins, setMins ] = useState(minutes);
  const [ secs, setSecs ] = useState(0);

  // SHORT 2 SEC TEST
  // const [ mins, setMins ] = useState(0);
  // const [ secs, setSecs ] = useState(2);

  // Add leading zero to numbers 9 or below (purely for aesthetics):
  function leadingZero(time) {
      if (time <= 9) {
          time = "0" + time;
      }
      return time;
  }


  // useInterval() ATTEMPT - ghetto, but works for the most part. once it hits 00:00, it still hits the else, and still runs every second. BUT DESTRUCTURING THE CLEAR() METHOD FROM USEINTERVAL FUNCTION AND CALLING THAT WORKS!
  // COUNTDOWN - useInterval()
  const countDown = () => {
    if (secs > 0) {
      setSecs(secs - 1);
    } else if (mins >= 1 && secs == 0) {
      setSecs(59);
      setMins(mins - 1);
    } else {
      updateUserTime();
      incrementSessionsCompleted();
      Alert.alert("Timer Complete", "Great job, you’ve completed your meditation session!", [
        {text: "Back", onPress: () => navigation.goBack()}, 
        {text: "Finish", style: "cancel", onPress: () => navigation.navigate("Profile")}
      ]);
      setTimerRunning(false);
      bellSound.unloadAsync();
      // console.log('else');
      loadFinishedSound(); // final 3 bells because of the 2 sec setTimeout below.
      clear();
      setTimeout(() => {
        finishedSound.unloadAsync(); // cuts off the sound
        bellSound.unloadAsync(); // 
        // navigation.navigate("MeditateTimerSetScreen");
      }, 4000);
    }
    setSessionSecs(sessionSecs => sessionSecs += 1);
  }



  // BELL SOUND - useInterval()  
  const bellSound = new Audio.Sound();
  Audio.setAudioModeAsync({playsInSilentModeIOS: true, staysActiveInBackground: true});

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


  // FINISHED BELL SOUND
  const finishedSound = new Audio.Sound();
  Audio.setAudioModeAsync({playsInSilentModeIOS: true, staysActiveInBackground: true});

  const loadFinishedSound = async () => {
    try {
      await finishedSound.loadAsync(require('../../../assets/audio/meditation-finished-sound.mp3'));
      await finishedSound.playAsync()
      console.log("finished bell loaded!")
    } catch (error) {
      console.log(error);
    }
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

  useEffect(() => {
    // UNMOUNT FINAL BELL
    return () => finishedSound.unloadAsync();
  }, [])

  const [toggleClock, runningClock, clear] = useInterval(() => {
    countDown();
  }, 1000);

  const [toggleBell, runningBell] = useInterval(() => {
    timerRunning ? loadSound() : null;
  }, bellInterv);

  const toggle = () => {
    toggleClock();
    bellInterv === null ? null : toggleBell();
    setTimerRunning(!timerRunning);
  }







  const currUser = firebase.auth().currentUser;
  const progressRef = currUser ? firebase.database().ref(currUser.uid).child('progress') : null;


  const [sessionSecs, setSessionSecs] = useState(0);

  // WITH SAFETY CHECK ADDED - for users with no existing progress data objects
  // INSTEAD OF DB POST REQUESTING EVERY SECOND with incrementUserTime(), THIS INCREMENTS LOCALLY, THEN WHEN USER FINISHES EXERCISE WITH ALERT POPUP ORRR UNMOUNTS EXERCISE, THEN UPDATE THE PRACTICE TIME BY ADDING THE SO FAR WITH THIS LOCALLY INCREMENTED SECONDS TRACKER.
  async function updateUserTime() {
    if (currUser) {
      let timeSoFar;
      await progressRef.once('value', async snapshot => {
        if (snapshot.val() === null) {
          progressRef.set({
            practiceTime: 0,
            sessionsCompleted: 0,
            currentStreak: 0,
            bestStreak: 0
          })
          timeSoFar = await snapshot.val() !== null ? snapshot.val().practiceTime : 0;
        } else {
          timeSoFar = await snapshot.val() !== null ? snapshot.val().practiceTime : 0;
        }

        await progressRef.update({
          practiceTime: timeSoFar += sessionSecs
        })
      })
      setSessionSecs(0);
    } 
  };


  // WITH SAFETY CHECK ADDED - for users with no existing progress data objects
  // Increment sessions user completed - triggers when that 'finish' popup modal comes out
  async function incrementSessionsCompleted() {
    if (currUser) {
      let sessionsCompletedSoFar;
      await progressRef.once('value', async snapshot => {
        if (snapshot.val() === null) {
          progressRef.set({
            practiceTime: 0,
            sessionsCompleted: 0,
            currentStreak: 0,
            bestStreak: 0
          })
          sessionsCompletedSoFar = await snapshot.val() !== null ? snapshot.val().sessionsCompleted : 0;
        } else {
          sessionsCompletedSoFar = await snapshot.val() !== null ? snapshot.val().sessionsCompleted : 0;
        }

        await progressRef.update({
          sessionsCompleted: sessionsCompletedSoFar += 1
        })
      });
    } 
  };


  const goBack = () => {
    updateUserTime();
    navigation.goBack();
  }








  return (
    <ImageBackground source={bgImage} style={{ flex: 1, resizeMode: "cover", position: "relative", zIndex: -10}}>
      {isFocused ? <StatusBar hidden={false} barStyle="light-content"/> : null} 

      <Animated.View style={{ width: width, flexDirection: "row", alignItems: "center", marginTop: height * 0.07, position: "absolute", zIndex: 100, opacity: overlayFade}}>
        <TouchableOpacity onPress={goBack} style={{ padding: 15}}>
          <Image source={require('../../../assets/screen-icons/back-arrow-white.png')} style={{height: 20, marginLeft: 0}} resizeMode="contain"/>
        </TouchableOpacity>
        <Text style={{textAlign: "center", fontSize: 23, fontFamily: "Assistant-SemiBold", color: 'white', position: "absolute", zIndex: -1, width: width}}>Meditate</Text>
      </Animated.View>
      

      <View style={{ justifyContent: "center", position: "absolute", height: height, width: width}}>
        <View style={{ padding: 20, alignItems: "center" }}>
        <Text style={{fontFamily: "Assistant", color: "white", fontSize: 67}}>{`${leadingZero(mins)}:${leadingZero(secs)}`}</Text>
        {/* <Text style={{fontFamily: "Assistant", color: "white", fontSize: 67}}>{`${leadingZero(mins)}:${leadingZero(secs)}`}</Text> */}
        {/* <Text style={{fontFamily: "Assistant", color: "white", fontSize: 67}}>{`${leadingZero(clock.mins)}:${leadingZero(clock.secs)}`}</Text> */}
          
          {/* <TouchableOpacity onPress={() => pause()}> */}
          <TouchableOpacity onPress={() => toggle()} >
            {timerRunning ? 
            <Image source={require('../../../assets/screen-icons/pause-circle.png')} style={{height: 66, width: 66}} resizeMode="contain"/>
            :
            <Image source={require('../../../assets/screen-icons/play-circle.png')} style={{height: 66, width: 66}} resizeMode="contain"/>
            }
          </TouchableOpacity>


        </View>


      </View>

        <TouchableWithoutFeedback onPress={touchScreenToggleControls}>
          <View style={{ height: height * 0.51, width: width, position: "absolute", }}>
            {/* <Text style={{color: "lightgreen", fontSize: 30}}>TOUCH!</Text> */}
          </View>
        </TouchableWithoutFeedback>

        <TouchableWithoutFeedback onPress={touchScreenToggleControls}>
          <View style={{ height: height * 0.39, width: width, position: "absolute", bottom: 0 }}>
            {/* <Text style={{color: "lightgreen", fontSize: 30}}>TOUCH!</Text> */}
          </View>
        </TouchableWithoutFeedback>

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






// the callback was countDown() or loadSound()
// toggle() is called whenever the pause and play button is pressed
// useRef.current() to store a value that persists between renders. 


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

  // Remember the latest function. Store it in the useRef().current
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

  return [toggleRunning, !!currentDelay, clear];
}