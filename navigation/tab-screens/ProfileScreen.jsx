import React, { useEffect, useState, useContext, useRef } from 'react';
import { Text, View, StatusBar, Image, Dimensions, StyleSheet, TouchableOpacity } from 'react-native';
import AppButton from '../../components/AppButton';
import { AuthContext } from '../../components/context';
import { useIsFocused } from '@react-navigation/native';
import CreateAccountPopup from '../../components/CreateAccountPopup';

import { useFonts } from 'expo-font';

const { width, height } = Dimensions.get('window');
// const bgImage = require('../../assets/splash/memoir-splash-thin-4x.png');
import ProfileStatsBlock from '../../components/ProfileStatsBlock';

import Modal from 'react-native-modal';
import * as WebBrowser from 'expo-web-browser';

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
    bestStreakYear: 2021
  });

  const { practiceTime, sessionsCompleted, currentStreak, bestStreak, lastDateExercised, bestStreakDate, bestStreakMonth, bestStreakYear } = userProgress;

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

  // const fakeAddProgressData = async () => {
  //   const progressPushRef = await firebase.database().ref(currUser.uid).child('progress');

  //   progressPushRef.set({
  //     practiceTime: 2.7,
  //     sessionsCompleted: 21,
  //     currentStreak: 5,
  //     bestStreak: 7
  //   })
  // }


  const fiveHrGoal = useRef();

  const renderPracticeTime = () => {
    let past5Hours = practiceTime;
    let fiveHours = 18000;

    let count = 1;
    while (past5Hours > fiveHours) {
      past5Hours -= fiveHours;
      count++;
    }
    let ceil = (count * fiveHours / 60 / 60);
    let totalMills = count * fiveHours;
    fiveHrGoal.current = totalMills;
    
    return practiceTime < 1800 ? <ProfileStatsBlock icon={require('../../assets/screen-icons/profile-timer.png')} title="Total Practice Time" mills={practiceTime} number={(practiceTime / 60 ).toFixed(1)} subtitle="Minutes" subText="30 min Goal" progress={(Math.max(practiceTime, 0.01) / 60 / 60) / 0.5}/> 
    : practiceTime >= 1800 && practiceTime < 7200 ? <ProfileStatsBlock icon={require('../../assets/screen-icons/profile-timer.png')} title="Total Practice Time" number={(practiceTime / 60 / 60).toFixed(1)} subtitle="Hours" subText="2hr Goal" progress={(practiceTime / 60 / 60) / 2}/> 
    : practiceTime >= 7200 && practiceTime < 18000 ? <ProfileStatsBlock icon={require('../../assets/screen-icons/profile-timer.png')} title="Total Practice Time" number={(practiceTime / 60 / 60).toFixed(1)} subtitle="Hours" subText="5hr Goal" progress={(practiceTime / 60 / 60) / 5}/> 
    : practiceTime >= fiveHours ? <ProfileStatsBlock icon={require('../../assets/screen-icons/profile-timer.png')} title="Total Practice Time" number={(practiceTime / 60 / 60).toFixed(1)} subtitle="Hours" subText={`${ceil}hr Goal`} progress={(practiceTime / 60 / 60) / ceil}/> 
    : <ProfileStatsBlock icon={require('../../assets/screen-icons/profile-timer.png')} title="Total Practice Time" number="0" subtitle="Hours" subText="5hr Goal" progress={0.01}/>
  }



  // Congratulation Alerts 1
  const [dismissedTimeGoal, setDismissedTimeGoal] = useState(false);
  const [dismissedSessions, setDismissedSessions] = useState(false);
  const [dismissedCurrStreak, setDismissedCurrStreak] = useState(false);
  const bestStreakSoFar = useRef();
  
  const timeConditions = practiceTime < 1800 ? 1800 : 
  practiceTime >= 1800 && practiceTime < 7200 ? 7200 :
  practiceTime >= 7200 && practiceTime < 18000 ? 18000 :
  practiceTime >= 18000 ? fiveHrGoal.current : null;
  
  const timeGoal = useRef();
  useEffect(() => {
    timeGoal.current = timeConditions
  }, [])


  useEffect(() => {
    if (sessionsCompleted == 0 || currentStreak == 0) return;
    if (sessionsCompleted % 10 !== 0) setDismissedSessions(false);
    if (currentStreak % 10 !== 0) setDismissedCurrStreak(false);


    if (isFocused && practiceTime >= timeGoal.current && !dismissedTimeGoal && Math.trunc(timeGoal.current) !== 0) {
      setTimeout(() => {
        setTimeGoalVisible(true);
      }, 1500);
      // Alert.alert("Congrats!", `You've practiced for ${practiceTime < 3600 ? Math.trunc(practiceTime / 60) : Math.trunc(practiceTime / 60 / 60)} ${practiceTime < 3600 ? "minutes" : "hours"}!`, [
      //   {text: "Awesome!", onPress: () => {
      //     setDismissedTimeGoal(true);
      //     setTimeout(() => {
      //       timeGoal.current = timeConditions;
      //       setDismissedTimeGoal(false);
      //     }, 1000);
      //   }}
      // ]);
    }
    console.log(practiceTime, fiveHrGoal.current, timeGoal.current);


    if (isFocused && sessionsCompleted % 10 == 0 && !dismissedSessions) {
      setTimeout(() => {
        setSessionsGoalVisible(true);
      }, 1500);
      // Alert.alert("Congrats!", `You've completed ${sessionsCompleted} sessions!`, [
      //   {text: "Awesome!", onPress: () => setDismissedSessions(true)}
      // ]);
    } 

    if (isFocused && currentStreak % 10 == 0 && !dismissedCurrStreak) {
      setTimeout(() => {
        setCurrStreakGoalVisible(true);
      }, 1500);
      // Alert.alert("Congrats!", `You've hit a ${currentStreak} day streak!`, [
      //   {text: "Awesome!", onPress: () => setDismissedCurrStreak(true)}
      // ]);
    }

    if (isFocused && bestStreakSoFar.current && bestStreak !== bestStreakSoFar.current) {
      setTimeout(() => {
        setBestStreakGoalVisible(true);
      }, 1500);
      // Alert.alert("Congrats!", `New Best Streak! ${bestStreak} days!`, [
      //   {text: "Awesome!"}
      // ]);
    }
    bestStreakSoFar.current = bestStreak;

  }, [isFocused])


  // Congratulations Alerts 2 - CustomAlerts
  const [timeGoalVisible, setTimeGoalVisible] = useState(false);
  const dismissTimeGoalAlert = () => {
    setTimeGoalVisible(false);
    setDismissedTimeGoal(true);
    setTimeout(() => {
      timeGoal.current = timeConditions;
      setDismissedTimeGoal(false);
    }, 1000);
  };

  const [sessionsGoalVisible, setSessionsGoalVisible] = useState(false);
  const dismissSessionsGoalAlert = () => {
    setSessionsGoalVisible(false);
    setDismissedSessions(true);
  };

  const [currStreakGoalVisible, setCurrStreakGoalVisible] = useState(false);
  const dismissCurrStreakGoalVisible = () => {
    setCurrStreakGoalVisible(false);
    setDismissedCurrStreak(true);
  };

  const [bestStreakGoalVisible, setBestStreakGoalVisible] = useState(false);
  const dismissBestStreakGoalVisible = () => {
    setBestStreakGoalVisible(false);
  };





  const renderMovingSessionsGoal = (sessionsCompleted) => {
    let rightMostNum = sessionsCompleted % 10;
    let remainder = 10 - rightMostNum;
    let ceil = sessionsCompleted + remainder;
    return <ProfileStatsBlock icon={require('../../assets/screen-icons/profile-hash.png')} title="Sessions Completed" number={sessionsCompleted} subtitle={sessionsCompleted === 1 ? "Session" : "Sessions"} subText={`${ceil} Session Goal`} progress={ Math.max(sessionsCompleted, 0.01) / ceil }/>
  }

  const renderMovingStreakGoal = (currentStreak) => {
    let rightMostNum = currentStreak % 10;
    let remainder = 10 - rightMostNum;
    let ceil = currentStreak + remainder;
    return <ProfileStatsBlock icon={require('../../assets/screen-icons/profile-arrow.png')} title="Current Streak" number={currentStreak} subtitle={currentStreak === 1 ? "Day" : "Days"} subText={`${ceil} Day Streak Goal`} progress={ Math.max(currentStreak, 0.01) / ceil}/>
  }



  return (
    // <ImageBackground source={bgImage} style={{ flex: 1, resizeMode: "cover", justifyContent: "flex-start",}}>
    // </ImageBackground>
    <View style={{ backgroundColor:"white", flex: 1, resizeMode: "cover", justifyContent: "flex-start",}}>
      {isFocused ? <StatusBar barStyle="dark-content" hidden={false}/> : null}
      <TouchableOpacity onPress={() => navigation.goBack()} style={{position: "absolute", left: width * 0.02, top: height * 0.045, zIndex: 100, padding: 15}}>
        <Image source={require('../../assets/screen-icons/back-arrow.png')} style={{height: 20,}} resizeMode="contain"/>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('SettingsScreen')} style={{ position: "absolute", right: width * 0.05, top: height * 0.045, zIndex: 100, paddingBottom: 10, paddingTop: 10 }}>
        <Image source={require('../../assets/screen-icons/gear-grey.png')} style={{height: 32, width: 60}} resizeMode="contain"/>
      </TouchableOpacity>

      <Text style={{textAlign: "center", fontSize: height < 600 ? 20 : 23, fontFamily: "Assistant-SemiBold", position: "absolute", width: width, top: height * 0.057, color: '#535353'}}>{userFirstName ? String(userFirstName).charAt(0).toUpperCase() + String(userFirstName).slice(1) + "'s Progress" : "Your Progress"}</Text>
    
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


            <CustomAlert 
              header="Great Job!"
              message={`${practiceTime < 3600 ? Math.trunc(practiceTime / 60) : Math.trunc(practiceTime / 60 / 60)} Minutes of Practice Time`}
              isVisible={timeGoalVisible}
              onPress={dismissTimeGoalAlert}
              />

            <CustomAlert 
              header="Well Done!"
              message={`${sessionsCompleted} Total Sessions`}
              isVisible={sessionsGoalVisible}
              onPress={dismissSessionsGoalAlert}
            />

            <CustomAlert 
              header="Nice Streak!"
              message={`a ${currentStreak}-Day Streak`}
              isVisible={currStreakGoalVisible}
              onPress={dismissCurrStreakGoalVisible}
            />

            <CustomAlert 
              header="New Best Streak! "
              message={`${bestStreak} Days!`}
              isVisible={bestStreakGoalVisible}
              onPress={dismissBestStreakGoalVisible}
            />


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
              {/* <Text style={{color: "#535353", fontFamily: "Assistant-SemiBold", fontSize: 17.5, lineHeight: 22, width: 220, textAlign: "center", }}>
              Upgrade to Unlimited and
              gain access to the full library.
              </Text>
              <AppButton 
                  title="Get Memoir Unlimited" 
                  buttonStyles={styles.blueButton}
                  buttonTextStyles={styles.buttonText}
                  onPress={() => navigation.navigate('ProMemberScreen')}
                /> */}

              <View style={styles.buttonCard}>
                <Text style={{width: 230, textAlign: "center", fontFamily: "Assistant-Regular", fontSize: 17, lineHeight: 19.96}}>We're currently in beta. Send us a suggestion or report a bug.</Text>
                <AppButton 
                    title="Send Us Feedback" 
                    buttonStyles={styles.blueButton}
                    buttonTextStyles={styles.buttonText}
                    onPress={() => WebBrowser.openBrowserAsync("https://memoirapp.squarespace.com/contact")}
                  />
              </View>

              {/* <View style={styles.buttonCard}>
                <Text style={{width: 230, textAlign: "center", fontFamily: "Assistant-Regular", fontSize: 17, lineHeight: 19.96}}>Are you enjoying Memoir? Leave us a review in the App Store.</Text>
                <AppButton 
                    title="Write a Review" 
                    buttonStyles={styles.blueButton}
                    buttonTextStyles={styles.buttonText}
                    onPress={() => alert("Opens iOS App Store")}
                  />
              </View> */}

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
    height: Math.min(height * 0.07, 44),
    width: 225,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",

  },
  buttonText: {    
    color: "#fff",
    flex: 1,
    textAlign: "center",
    fontSize: 21,
    fontFamily: "Assistant-SemiBold"
  },
  buttonCard: {
    // borderWidth: 1,
    backgroundColor: "white",
    height: Math.max(height * 0.2, 134),
    width: 293,
    borderRadius: 15,
    shadowRadius: 4,
    shadowColor: "black",
    shadowOpacity: 0.3,
    shadowOffset: {width: 2, height: 3},
    justifyContent: "space-evenly",
    alignItems: "center",
    marginTop: -20
  }
})



export function CustomAlert({header, message, isVisible, onPress}) {
  return(
    <Modal 
      isVisible={isVisible}
      deviceHeight={width}
      deviceHeight={height}
      style={{justifyContent: "center", alignItems: "center"}}
      backdropOpacity={0.6}
      animationInTiming={600}
      animationOutTiming={600}
      animationIn={"fadeInUp"}
      animationOut={"fadeOutDown"}
    >
      <View style={{height: 208, width: 317, borderRadius: 15, backgroundColor: "white", justifyContent:"space-evenly", alignItems: "center"}}>
        <View style={{justifyContent:"center", alignItems: "center"}}>
          <Text style={{color: "#3681C7", fontSize: 26, fontFamily: "Assistant-SemiBold"}}>{header}</Text>
          <Text style={{fontSize: 17, textAlign: "center", fontFamily: "Assistant-Regular", width: "70%"}}>You've accomplished{"\n"}{message}</Text>
        </View>
        <AppButton 
          title="Continue" 
          buttonStyles={styles.blueButton}
          buttonTextStyles={styles.buttonText}
          onPress={onPress}
        />
      </View>
    </Modal>
  )
};