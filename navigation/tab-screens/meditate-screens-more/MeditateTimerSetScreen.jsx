import React, { useContext } from 'react';
import { Text, View, StatusBar, ScrollView, Button, Alert, Image, Dimensions, StyleSheet, ImageBackground, TouchableOpacity, NativeEventEmitter } from 'react-native';
import AppButton from '../../../components/AppButton';
import { useIsFocused } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { AuthContext } from '../../../components/context';


const bgImage = require('../../../assets/splash/memoir-splash-thin-4x.png')

import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';

const { width, height } = Dimensions.get('window');

import { LinearGradient } from 'expo-linear-gradient';



import firebase from 'firebase';


export default function MeditateTimerSetScreen({navigation}) {
  const [minutes, setMinutes] = React.useState(10);
  const [bellIntervDisplay, setBellIntervDisplay] = React.useState("30 Seconds");
  const [bellInterv, setBellInterv] = React.useState(30000);

  const { userToken } = useContext(AuthContext);

  // const renderMinsPickerItems = () => {
  //   let items = [];
  //   for (let i = 1; i <= 60; i++) {
  //     items.push(<Picker.Item key={i} label={`${i}`} value={`${i}`}/>)
  //   }
  //   return items;
  // }

  const renderMinsPickerItems = () => {
    let items = [];
    for (let i = 1; i <= 60; i++) {
      items.push(<Image key={i} source={require('../../../assets/meditate-timer-set/bar-1.png')} resizeMode="contain" style={{margin: 3, height: 17}} />)
      // items.push(<Text key={i}> | </Text>)
    }
    return items;
  }

  // const renderSecsPickerItems = () => {
  //   let items = [];
  //   for (let i = 30; i <= 90; i+=30) {
  //     items.push(<Picker.Item key={i} label={`${i}s`} value={`${i}`}/>)
  //   }
  //   return items;
  // }

  const renderSecsPickerItems = () => {
    let items = [];
    for (let i = 30; i <= 90; i+=30) {
      items.push(<Text key={i}> | </Text>)
    }
    return items;
  }

  const onChange = (value) => {
    if (value > 0 && value <= 60) 
    setMinutes(value)
  }

  const onChangeSecs = (value) => {
    const bellOptions = {
      // "30 Seconds": 5000, // short 5 sec test
      "30 Seconds": 30000,
      "60 Seconds": 60000,
      "90 Seconds": 90000,
      "2 Minutes": 120000,
      "3 Minutes": 180000,
      "5 Minutes": 300000,
      "OFF": null
    }
    let bellArray = Object.keys(bellOptions);
    if (value >= 0 && value < 7) {
      setBellIntervDisplay(bellArray[value])
      setBellInterv(bellOptions[bellArray[value]])
    }
    // console.log(bellIntervDisplay)
    // console.log(bellInterv)
  }

  const isFocused = useIsFocused();

  let [fontsLoaded] = useFonts({
    'Assistant': require('../../../assets/fonts/Assistant/Assistant-VariableFont_wght.ttf'),
    'Assistant-Regular': require('../../../assets/fonts/Assistant/static/Assistant-Regular.ttf'),
    'Assistant-SemiBold': require('../../../assets/fonts/Assistant/static/Assistant-SemiBold.ttf'),
  });



  const currUser = firebase.auth().currentUser;
  const progressRef = currUser ? firebase.database().ref(currUser.uid).child('progress') : null;

// WITH SAFETY CHECK ADDED - for users with no existing progress data objects
  // Increment current and best streaks - triggers when blue 'Start' button is pressed
  const incrementStreak = async () => {
    if (currUser && userToken) {
      let currentStreakSoFar;
      let lastDateExercised;
      let bestStreakSoFar;

      await progressRef.once('value', async snapshot => {
        if (snapshot.val() === null) {
          progressRef.set({
            practiceTime: 0,
            sessionsCompleted: 0,
            currentStreak: 1,
            bestStreak: 1,
            lastDateExercised: new Date().getDate(),
            bestStreakDate: new Date().getDate(),
            bestStreakMonth: new Date().getMonth() + 1,
            bestStreakYear: new Date().getFullYear()
          })
          currentStreakSoFar = await snapshot.val() !== null ? snapshot.val().currentStreak : 0;
          lastDateExercised = await snapshot.val() !== null ? snapshot.val().lastDateExercised : new Date().getDate();
          bestStreakSoFar = await snapshot.val() !== null ? snapshot.val().bestStreak : 1;
        } else {
          currentStreakSoFar = await snapshot.val() !== null ? snapshot.val().currentStreak : 0;
          lastDateExercised = await snapshot.val() !== null ? snapshot.val().lastDateExercised : new Date().getDate();
          bestStreakSoFar = await snapshot.val() !== null ? snapshot.val().bestStreak : 1;
        }

        let dateNow = new Date().getDate();

        if (dateNow - lastDateExercised == 1 || dateNow - lastDateExercised == -30 || dateNow - lastDateExercised == -29 || dateNow - lastDateExercised == -28 || dateNow - lastDateExercised == -27 || dateNow - lastDateExercised == -26) {
          await progressRef.update({
            currentStreak: currentStreakSoFar += 1,
          })
        } else if (dateNow - lastDateExercised > 1 || currentStreakSoFar == 0) {
          await progressRef.update({
            currentStreak: 1,
            bestStreak: Math.max(bestStreakSoFar, 1)
          })
        } else null

        if (bestStreakSoFar < currentStreakSoFar) {
          await progressRef.update({
            lastDateExercised: dateNow,
            bestStreak: Math.max(bestStreakSoFar, currentStreakSoFar),
            bestStreakDate: new Date().getDate(),
            bestStreakMonth: new Date().getMonth() + 1,
            bestStreakYear: new Date().getFullYear()
          })
        }

      });
    } 
  }


  const startMeditation = () => {
    // console.log("started meditation!");
    incrementStreak();
    setTimeout(() => {
      navigation.navigate('MeditateExerciseScreen', { minutes, bellInterv });
    }, 0);
  }






  return (
    <ImageBackground source={bgImage} style={{ flex: 1, resizeMode: "cover", justifyContent: "center" }}>
      {isFocused ? <StatusBar hidden={false} barStyle="light-content"/> : null} 
      <TouchableOpacity onPress={() => navigation.goBack()} style={{position: "absolute", top: height * 0.065, zIndex: 100, padding: 15}}>
        <Image source={require('../../../assets/screen-icons/back-arrow-white.png')} style={{height: 20, }} resizeMode="contain"/>
      </TouchableOpacity>
      <View style={{marginTop: 20}}>
        <Text style={{textAlign: "center", fontSize: 23, fontFamily: "Assistant-SemiBold", color: 'white'}}>Meditate</Text>
        <View style={{flexDirection: "row", padding: 20}}>
          <View style={{backgroundColor: "white", flex: 1, height: height * 0.7, borderRadius: 20, justifyContent: "space-evenly", alignItems: "center" }}>

            <View style={{width: width * 0.63, height: height * 0.45, justifyContent: "space-around", alignItems: "center", }}>
              <View style={{alignItems: "center"}}>
                <Image source={require('../../../assets/screen-icons/clock.png')} style={{height: 37, }} resizeMode="contain"/>
                <Text style={{fontFamily: "Assistant-SemiBold", fontSize: 20, textAlign: "center", color: "#535353"}}>Session Duration:</Text>
                <Text style={{fontFamily: "Assistant-SemiBold", fontSize: 25, textAlign: "center", color: "#535353"}}>{minutes} {minutes === 1 ? "Minute" : "Minutes" }</Text>
                
                {/* <Picker
                  style={{borderWidth: 1, width: width * 0.9, height: height * 0.2}}
                  selectedValue={minutes}
                  onValueChange={value => onChange(value)}
                >
                  {renderMinsPickerItems()}
                </Picker> */}

                <View >
                </View>

                {/* <LinearGradient 
                  colors={['#fff', 'transparent']}
                  start={[0.2, 0.9]}
                  // end={[0.1, 1]}
                  // locations={[0, 1]}
                  style={{
                    borderWidth: 1, 
                    height: height * 0.05, 
                    width: 100, 
                    position: "absolute", 
                    top: 100, 
                    right: 100, 
                  }}
                /> */}

                <ScrollView 
                  horizontal={true} 
                  showsHorizontalScrollIndicator={false}
                  onScroll={(e) => onChange(Math.floor(1 + e.nativeEvent.contentOffset.x / (e.nativeEvent.contentSize.width - e.nativeEvent.layoutMeasurement.width) * 59)) }
                  /* OG 1.00 = e.nativeEvent.contentOffset.x / (e.nativeEvent.contentSize.width - e.nativeEvent.layoutMeasurement.width) */
                  scrollEventThrottle={16}
                  style={{ width: 200, maxHeight: 50 }} 
                >
                  <View style={{flexDirection: "row", alignItems: "center",}}>
                    {renderMinsPickerItems()}
                  </View>
                </ScrollView>

              </View>
              
              <View style={{alignItems: "center"}}>
                <Image source={require('../../../assets/screen-icons/bell.png')} style={{height: 32, }} resizeMode="contain"/>
                <Text style={{fontFamily: "Assistant-SemiBold", fontSize: 20, textAlign: "center", color: "#535353"}}>Bell Sound Every:</Text>
                <Text style={{fontFamily: "Assistant-SemiBold", fontSize: 25, textAlign: "center", color: "#535353"}}>{bellIntervDisplay}</Text>
                

                <ScrollView 
                  horizontal={true} 
                  showsHorizontalScrollIndicator={false}
                  onScroll={(e) => onChangeSecs(Math.floor(e.nativeEvent.contentOffset.x / (e.nativeEvent.contentSize.width - e.nativeEvent.layoutMeasurement.width) * 7)) }
                  // OG 1.00 = e.nativeEvent.contentOffset.x / (e.nativeEvent.contentSize.width - e.nativeEvent.layoutMeasurement.width)
                  scrollEventThrottle={16}
                  style={{ width: 200, maxHeight: 50 }} 
                >
                  <View style={{flexDirection: "row", alignItems: "center",  }}>
                    {renderMinsPickerItems()}
                  </View>
                </ScrollView>


                {/* <Picker
                  style={{borderWidth: 1, width: width * 0.9, height: height * 0.2}}
                  selectedValue={seconds}
                  onValueChange={value => onChangeSecs(value)}
                >
                  {renderSecsPickerItems()}
                  <Picker.Item label={`2m`} value={`2`}/>
                  <Picker.Item label={`3m`} value={`3`}/>
                  <Picker.Item label={`5m`} value={`5`}/>
                  <Picker.Item label={`OFF`} value={`OFF`}/>
                </Picker> */}

              </View>
            </View>


            <AppButton 
              title="Start" 
              buttonStyles={styles.blueButton}
              buttonTextStyles={styles.buttonText}
              onPress={startMeditation}
            />

          </View>
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

