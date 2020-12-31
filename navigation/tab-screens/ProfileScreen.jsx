import React, { useEffect,useState, useContext } from 'react';
import { Text, View, StatusBar, Button, Alert, Image, Dimensions, StyleSheet, ImageBackground, TouchableOpacity, ScrollView } from 'react-native';
import AppButton from '../../components/AppButton';
import { AuthContext } from '../../components/context';
import { useIsFocused } from '@react-navigation/native';
import CreateAccountPopup from '../../components/CreateAccountPopup';

import { useFonts } from 'expo-font';

const { width, height } = Dimensions.get('window');
const bgImage = require('../../assets/splash/memoir-splash-thin-4x.png')
import ProfileStatsBlock from '../../components/ProfileStatsBlock';

import firebase from 'firebase';


export default function ProfileScreen({navigation}) {
  const isFocused = useIsFocused();
  const { signOut, userToken, userFirstName } = useContext(AuthContext);

  const [showPopUp, setShowPopup] = useState(false);
  
  useEffect(() => {
    if (currUser && currUser.isAnonymous || !userToken) {
      setTimeout(() => {
        isFocused ? setShowPopup(true) : setShowPopup(false)
      }, 500);
    } else {
      setShowPopup(false);
    }
  }, [isFocused])


  let [fontsLoaded] = useFonts({
    'Assistant': require('../../assets/fonts/Assistant/Assistant-VariableFont_wght.ttf'),
    'Assistant-Regular': require('../../assets/fonts/Assistant/static/Assistant-Regular.ttf'),
    'Assistant-SemiBold': require('../../assets/fonts/Assistant/static/Assistant-SemiBold.ttf'),
  });



  const [userProgress, setUserProgress] = useState({
    practiceTime: 0,
    sessionsCompleted: 0,
    currentStreak: 0,
    bestStreak: 0,
    lastDateExercised: 0,
    bestStreakDate: 0,
    bestStreakMonth: 0,
    bestStreakYear: 2020
  });

  const { practiceTime, sessionsCompleted, currentStreak, bestStreak, lastDateExercised, bestStreakDate, bestStreakMonth, bestStreakYear } = userProgress

  const currUser = firebase.auth().currentUser;
  const progressRef = currUser ? firebase.database().ref(currUser.uid).child('progress') : null;


  const getProgress = () => {
    progressRef.on('value', snapshot => {
      if (snapshot.val()) {
        setUserProgress({
          practiceTime: snapshot.val().practiceTime || 0,
          sessionsCompleted: snapshot.val().sessionsCompleted || 0,
          currentStreak: snapshot.val().currentStreak || 0,
          bestStreak: snapshot.val().bestStreak || 0,
          lastDateExercised: snapshot.val().lastDateExercised || 0,
          bestStreakDate: snapshot.val().bestStreakDate || 0,
          bestStreakMonth: snapshot.val().bestStreakMonth || 0,
          bestStreakYear: snapshot.val().bestStreakYear || 0
        })
      } 
      // else {
      //   setUserProgress({
      //     practiceTime: 0,
      //     sessionsCompleted: 0,
      //     currentStreak: 0,
      //     bestStreak: 0,
      //   })
      // }
    })
  };


  useEffect(() => {
    if (currUser) {
      getProgress();
    }

  }, [userToken, currUser])

  

  // useEffect(() => {
  //   // console.log(userProgress)

  //   // fakeAddProgressData();
  // }, [])





  const fakeAddProgressData = async () => {
    const progressPushRef = await firebase.database().ref(currUser.uid).child('progress');

    progressPushRef.set({
      practiceTime: 2.7,
      sessionsCompleted: 21,
      currentStreak: 5,
      bestStreak: 7
    })
  }


  const renderPracticeTime = () => {
    let past5Hours = practiceTime;
    let fiveHours = 18000;

    let count = 1;
    while (past5Hours > fiveHours) {
      past5Hours -= fiveHours;
      count++;
    }
    let ceil = (count * fiveHours / 60 / 60);

    return practiceTime < 1800 ? <ProfileStatsBlock icon={require('../../assets/screen-icons/profile-timer.png')} title="Total Practice Time" number={(practiceTime / 60 ).toFixed(0)} subtitle="Minutes" subText="30 min Goal" progress={(Math.max(practiceTime, 0.01) / 60 / 60) / 0.5}/> 
    : practiceTime >= 1800 && practiceTime < 7200 ? <ProfileStatsBlock icon={require('../../assets/screen-icons/profile-timer.png')} title="Total Practice Time" number={(practiceTime / 60 / 60).toFixed(1)} subtitle="Hours" subText="2hr Goal" progress={(practiceTime / 60 / 60) / 2}/> 
    : practiceTime >= 7200 && practiceTime < 18000 ? <ProfileStatsBlock icon={require('../../assets/screen-icons/profile-timer.png')} title="Total Practice Time" number={(practiceTime / 60 / 60).toFixed(1)} subtitle="Hours" subText="5hr Goal" progress={(practiceTime / 60 / 60) / 5}/> 
    : practiceTime >= fiveHours ? <ProfileStatsBlock icon={require('../../assets/screen-icons/profile-timer.png')} title="Total Practice Time" number={(practiceTime / 60 / 60).toFixed(1)} subtitle="Hours" subText={`${ceil}hr Goal`} progress={(practiceTime / 60 / 60) / ceil}/> 
    : <ProfileStatsBlock icon={require('../../assets/screen-icons/profile-timer.png')} title="Total Practice Time" number="0" subtitle="Hours" subText="5hr Goal" progress={0.01}/>
  }

  const [dismissed, setDismissed] = useState(false);
  // const [prevCeil, setPrevCeil] = useState();

  const renderMovingSessionsGoal = (sessionsCompleted) => {
    let seshString = String(sessionsCompleted);
    let rightMostNum = seshString[seshString.length - 1];
    let remainder = 10 - rightMostNum;
    let ceil = sessionsCompleted + remainder;


    // ATTEMPT AT CONGRATS SPRITES
    // let prevCeil = ceil - 10;

    // // setPrevCeil(ceil - 10);
    // // if (sessionsCompleted == prevCeil) setDismissed(false);
    // console.log("dismissed: ", dismissed)
    // console.log("prevCeil: ", prevCeil)
    // console.log("ceil: ", ceil)

    // if (isFocused && sessionsCompleted == prevCeil && !dismissed) {
    //   Alert.alert("Congrats!", `You've completed ${sessionsCompleted} sessions!`, [
    //     {text: "Awesome!", style: "cancel", onPress: () => setDismissed(true)}
    //   ]);
    // }
    

    return <ProfileStatsBlock icon={require('../../assets/screen-icons/profile-hash.png')} title="Sessions Completed" number={sessionsCompleted} subtitle={sessionsCompleted === 1 ? "Session" : "Sessions"} subText={`${ceil} Session Goal`} progress={ Math.max(sessionsCompleted, 0.01) / ceil }/>
  }

  const renderMovingStreakGoal = (currentStreak) => {
    let streakString = String(currentStreak);
    let rightMostNum = streakString[streakString.length - 1];
    let remainder = 10 - rightMostNum;
    let ceil = currentStreak + remainder;

    return <ProfileStatsBlock icon={require('../../assets/screen-icons/profile-arrow.png')} title="Current Streak" number={currentStreak} subtitle={currentStreak === 1 ? "Day" : "Days"} subText={`${ceil} Day Streak Goal`} progress={ Math.max(currentStreak, 0.01) / ceil}/>
  }



  return (
    // <ImageBackground source={bgImage} style={{ flex: 1, resizeMode: "cover", justifyContent: "flex-start",}}>
    // </ImageBackground>
    <View source={bgImage} style={{ backgroundColor:"white", flex: 1, resizeMode: "cover", justifyContent: "flex-start",}}>
      {isFocused ? <StatusBar barStyle="dark-content" hidden={false}/> : null}
      <TouchableOpacity onPress={() => userToken ? navigation.goBack() : null} style={{position: "absolute", left: width * 0.02, top: height * 0.045, zIndex: 100, padding: 15}}>
        <Image source={require('../../assets/screen-icons/back-arrow.png')} style={{height: 20,}} resizeMode="contain"/>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => userToken ? navigation.navigate('SettingsScreen') : null} style={{ position: "absolute", right: width * 0.05, top: height * 0.045, zIndex: 100, paddingBottom: 10, paddingTop: 10 }}>
        <Image source={require('../../assets/screen-icons/gear-grey.png')} style={{height: 32, width: 60}} resizeMode="contain"/>
      </TouchableOpacity>

      <Text style={{textAlign: "center", fontSize: 23, fontFamily: "Assistant-SemiBold", position: "absolute", width: width, top: height * 0.057, color: '#535353'}}>{userFirstName ? String(userFirstName).charAt(0).toUpperCase() + String(userFirstName).slice(1) + "'s Progress" : "Your Progress"}</Text>
    
      <View style={{height: height, marginTop: Math.min(height * 0.05, 20)}}>
        {/* <ScrollView> */}
          <View style={{ height: height, justifyContent: "center", flexDirection:"column", alignItems: "center", }}>
            {/* { userToken ? 
            <View style={{flexDirection:"row", flexWrap: "wrap", justifyContent: "center"}}>
              {renderPracticeTime()}
              {renderMovingSessionsGoal(sessionsCompleted)}
              {renderMovingStreakGoal(currentStreak)}
              <ProfileStatsBlock icon={require('../../assets/screen-icons/profile-rocket.png')} title="Best Streak" number={bestStreak} subtitle={bestStreak === 1 ? "Day" : "Days"} subText={bestStreakDate === 0 ? "" : `Achieved ${bestStreakMonth}/${bestStreakDate}/${bestStreakYear}`} />
            </View>
                :
            <View style={{flexDirection:"row", flexWrap: "wrap", justifyContent: "center",}}>
              <ProfileStatsBlock icon={require('../../assets/screen-icons/profile-timer.png')} title="Total Practice Time" number="0" subtitle="Hours" subText="5hr Goal" progress={0.01}/>
              <ProfileStatsBlock icon={require('../../assets/screen-icons/profile-hash.png')} title="Sessions Completed" number="0" subtitle="Sessions" subText="30 Session Goal" progress={0.01}/>
              <ProfileStatsBlock icon={require('../../assets/screen-icons/profile-arrow.png')} title="Current Streak" number="0" subtitle="Days" subText="10 Day Streak Goal" progress={0.01}/>
              <ProfileStatsBlock icon={require('../../assets/screen-icons/profile-rocket.png')} title="Best Streak" number="0" subtitle="Days" subText="No Streak" />
            </View>
            } */}

            <View style={{flexDirection:"row", flexWrap: "wrap", justifyContent: "center"}}>
              {renderPracticeTime()}
              {renderMovingSessionsGoal(sessionsCompleted)}
              {renderMovingStreakGoal(currentStreak)}
              <ProfileStatsBlock icon={require('../../assets/screen-icons/profile-rocket.png')} title="Best Streak" number={bestStreak} subtitle={bestStreak === 1 ? "Day" : "Days"} subText={bestStreakDate === 0 ? "" : `Achieved ${bestStreakMonth}/${bestStreakDate}/${bestStreakYear}`} />
            </View>
  
            {/* <TouchableOpacity style={{ width: 80, justifyContent: "center", alignItems: "center", padding: 5}} onPress={() => ""}>
              <View style={{flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
                <Image source={require('../../assets/screen-icons/share.png')} resizeMode="contain" style={{height: 17, width: 17, margin: 7}}/>
                <Text style={{fontFamily: "Assistant-SemiBold", color: "#535353", fontSize: 19}}>Share</Text>
              </View>
            </TouchableOpacity> */}

            <View style={{ alignItems: "center", height: 150, justifyContent: "space-evenly"}}> 
              <Text style={{color: "#535353", fontFamily: "Assistant-SemiBold", fontSize: 17.5, lineHeight: 22, width: 220, textAlign: "center", }}>
              Upgrade to Unlimited and
              gain access to the full library.
              </Text>

              <AppButton 
                  title="Get Memoir Unlimited" 
                  buttonStyles={styles.blueButton}
                  buttonTextStyles={styles.buttonText}
                  onPress={() => navigation.navigate('ProMemberScreen')}
                />
            </View>
          </View>

        {/* </ScrollView> */}

      </View>

      { showPopUp ? <CreateAccountPopup /> : null }
      {/* { !userToken ? <CreateAccountPopup /> : null } */}

    </View>
    
  )
}


const styles = StyleSheet.create({
  blueButton: {
    backgroundColor: "#3681C7",
    height: Math.min(height * 0.07, 58),
    width: 283,
    borderRadius: 15,
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
    fontSize: 21,
    fontFamily: "Assistant-SemiBold"
  }
})