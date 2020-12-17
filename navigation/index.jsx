import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators, TransitionSpecs, TransitionPresets, HeaderStyleInterpolators } from '@react-navigation/stack';
import BottomTabNavigator from './BottomTabNavigator';
import React, { useEffect, useState, useMemo } from 'react';

import OnboardingStackScreen from './OnboardingStackScreen';
import { View, ActivityIndicator, Alert } from 'react-native';

import { AuthContext } from '../components/context';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { fireApp } from '../firebase';


export default function Navigation({navigation}) {
  // Going with useReducer global state instead, this was just simple demonstration.
  // const [userToken, setUserToken] = React.useState(null);
  // const [isLoading, setIsLoading] = React.useState(true);
  


  const initialLoginState = {
    userEmail: null,
    userToken: null,
    userFirstName: null,
    isLoading: true,
  }

  const loginReducer = (prevState, action) => {
    switch( action.type ) {
      case 'RETRIEVE_TOKEN':
        return {
          ...prevState,
          userToken: action.token,
          userFirstName: action.firstName,
          isLoading: false
        }
      case 'SIGNIN':
        return {
          ...prevState,
          userEmail: action.email,
          userToken: action.token,
          userFirstName: action.firstName,
          isLoading: false
        }
      case 'SIGNOUT':
        return {
          ...prevState,
          userEmail: null,
          userToken: null,
          userFirstName: null,
          isLoading: false
        }
      case 'SIGNUP':
        return {
          ...prevState,
          userEmail: action.email,
          userToken: action.token,
          userFirstName: action.firstName,
          isLoading: false
        }
    }
  }

  const [loginState, dispatch] = React.useReducer(loginReducer, initialLoginState);



  const authContext = React.useMemo(() => ({
    /* OLD WAY, for direct login demo purposes */
    // signIn: async (userEmail, password) => {
    //   // setUserToken('asdf');
    //   // setIsLoading(false);
    //   let userToken;
    //   userToken = null;
    //   if (userEmail === "stan@email.com" && password === "password") {
    //     try {
    //       userToken = "asdf"
    //       await AsyncStorage.setItem('userToken', userToken);
    //     } catch(e) {
    //       console.log(e);
    //     }
    //   }
    //   dispatch({ type: "SIGNIN", email: userEmail, token: userToken })
    // },

    /* 2nd version with async local storage: */
    // signIn: async (foundUser) => {
    //   // setUserToken('asdf');
    //   // setIsLoading(false);

    //   const userToken = String(foundUser[0].userToken);
    //   const userEmail = foundUser[0].email;
    //   const userFirstName = foundUser[0].firstName;

    //   try {
    //     await AsyncStorage.setItem('userToken', userToken);
    //   } catch(e) {
    //     console.log(e);
    //   }
    //   dispatch({ type: "SIGNIN", email: userEmail, token: userToken, firstName: userFirstName })
    // },

    signIn: async (inputEmail, inputPassword) => {
      try {
        await fireApp
          .auth()
          .signInWithEmailAndPassword(inputEmail, inputPassword);
      } catch(e) {
        console.log(e);
        // alert("Your Account Info Does Not Match Our Records. Please Enter a Valid Username/Password.");
        Alert.alert("User Not Found", "Your Account Info Does Not Match Our Records. Please Enter a Valid Username/Password.", [
          {text: "Okay"}, {style: "destructive"}
        ]);
      }

      const currUser = fireApp.auth().currentUser;
      let userFirstName, userEmail, userToken;
      if (currUser !== null) {
        // console.log(currUser);
        userFirstName = currUser.displayName;
        userEmail = currUser.email;
        userToken = currUser.uid
        AsyncStorage.setItem('userToken', userToken);
        AsyncStorage.setItem('userName', userFirstName);
        dispatch({ type: "SIGNIN", email: userEmail, token: userToken, firstName: userFirstName })
      }

      // fireApp.auth().onAuthStateChanged(function(user) {
      //   const userFirstName = user.displayName;
      //   const userToken = user.uid;
      //   AsyncStorage.setItem('userToken', userToken);
      //   dispatch({ type: "SIGNIN", email: inputEmail, token: userToken, firstName: userFirstName })
      // })

    },
    signOut: async () => {
      // setUserToken(null);
      // setIsLoading(false);
      try {
        await fireApp.auth().signOut()
        await AsyncStorage.removeItem('userToken');
        await AsyncStorage.removeItem('userName');
      } catch(e) {
        console.log(e);
      }
      dispatch({ type: "SIGNOUT" })
    },
    signUp: async (inputEmail, inputPassword, inputFirstName) => {
      try {
        const result = await fireApp
          .auth()
          .createUserWithEmailAndPassword(inputEmail, inputPassword)
        await result.user.updateProfile({
          displayName: inputFirstName
        });
      } catch (error) {
        console.log(error);
      }

      const currUser = fireApp.auth().currentUser;
      let userFirstName, userEmail, userToken;
      if (currUser !== null) {
        // console.log(currUser);
        userFirstName = currUser.displayName;
        userToken = currUser.uid;
        AsyncStorage.setItem('userToken', userToken);
        AsyncStorage.setItem('userName', userFirstName);
        dispatch({ type: "SIGNUP", email: userEmail, token: userToken, firstName: userFirstName })
      }

      // fireApp.auth().onAuthStateChanged(function(user) {
      //   const userFirstName = user.displayName;
      //   const userToken = user.uid;
      //   dispatch({ type: "SIGNUP", email: inputEmail, token: userToken, firstName: userFirstName })
      // })

      // setUserToken('asdf');
      // setIsLoading(false);
    },
    userToken: loginState.userToken,
    userFirstName: loginState.userFirstName,

    appleSignUp: async (inputEmail, givenName, familyName, credentialUserID) => {
      try {
        const result = await fireApp
          .auth()
          .createUserWithEmailAndPassword(`${credentialUserID}@appleid.com`, credentialUserID)
        await result.user.updateProfile({
          displayName: givenName,
          lastName: familyName,
          privateRelayEmail: inputEmail // just to hold to onto just in case
        });
      } catch (error) {
        console.log(error);
      }

      const currUser = fireApp.auth().currentUser;
      let userFirstName, userEmail, userToken;
      if (currUser !== null) {
        userFirstName = currUser.displayName;
        userEmail = inputEmail;
        userToken = currUser.uid;
        // userToken = credentialUserID
        dispatch({ type: "SIGNUP", email: userEmail, token: userToken, firstName: userFirstName })
      }
    },

    appleTokenIn: async (credentialUserID) => {
      try {
        await fireApp
          .auth()
          .signInWithEmailAndPassword(`${credentialUserID}@appleid.com`, credentialUserID);
      } catch(e) {
        console.log(e);
        // alert("Your Account Info Does Not Match Our Records. Please Enter a Valid Username/Password.");
        Alert.alert("User Not Found", "Your Account Info Does Not Match Our Records. Please Enter a Valid Username/Password.", [
          {text: "Okay"}, {style: "destructive"}
        ]);
      }

      const currUser = fireApp.auth().currentUser;
      let userFirstName, userToken;
      if (currUser !== null) {
        userFirstName = currUser.displayName;
        // userEmail = currUser.email;
        userToken = currUser.uid;
        AsyncStorage.setItem('userToken', userToken);
        AsyncStorage.setItem('userName', userFirstName);
        dispatch({ type: "SIGNIN", token: userToken, firstName: userFirstName })
      }
    },

    fbSignUp: async (email, first_name, last_name, userId, token) => {
      // console.log("fetchSignInMethodsForEmail: " + JSON.stringify(await fireApp.auth().fetchSignInMethodsForEmail(email)))
      // console.log(userId);
      try {
        if ((await fireApp.auth().fetchSignInMethodsForEmail(email)).length > 0) {
          await fireApp
            .auth()
            .signInWithEmailAndPassword(email || `${userId}@fbid.com`, userId);
        } else {
            const result = await fireApp
              .auth()
              .createUserWithEmailAndPassword(email || `${userId}@fbid.com`, userId);
              await result.user.updateProfile({
                displayName: first_name,
                lastName: last_name,
                privateRelayEmail: email || `${userId}@fbid.com` // just to hold to onto just in case
            });
        }
      } catch (error) {
          alert(error);
      }
      const currUser = fireApp.auth().currentUser;
      let userFirstName, userEmail, userToken;
      if (currUser !== null) {
        userFirstName = currUser.displayName;
        userEmail = currUser.privateRelayEmail;
        userToken = token;
        // userToken = currUser.uid;
        AsyncStorage.setItem('userToken', userToken); 
        AsyncStorage.setItem('userName', userFirstName);
        dispatch({ type: "SIGNUP", email: userEmail, token: userToken, firstName: userFirstName })
      }
    },
  }));




  // LOADING WHEEL INTRO - if user was already previously logged in
  useEffect(() => {
    setTimeout( async () => {
      // setIsLoading(false);

      const currUser = fireApp.auth().currentUser;
      let userFirstName, userEmail, userToken;
      if (currUser !== null) {
      //   // console.log(currUser);
      //   userEmail = currUser.email;
      //   userToken = currUser.uid
        AsyncStorage.setItem('userName', currUser.displayName);
        AsyncStorage.setItem('userToken', currUser.uid);  
      //   dispatch({ type: "SIGNIN", email: userEmail, token: userToken, firstName: userFirstName })
      }

      // let userToken;
      // userToken = null;
      try {
        userToken = await AsyncStorage.getItem('userToken');
        userFirstName = await AsyncStorage.getItem('userName');
        // userToken = currUser ? currUser.uid : null;
        // if (currUser !== null) userFirstName = currUser.displayName;
      } catch(e) {
        console.log("useEffect hit!")
        console.log(e);
      }
      dispatch({ type: "RETRIEVE_TOKEN", token: userToken, firstName: userFirstName })
      console.log("user token:", userToken)
      console.log("user firstName:", userFirstName)
    }, 0)
  }, [])
  
  if (loginState.isLoading) {
    return (
      <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
        <ActivityIndicator size="large" />
      </View>
    )
  }

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
          {/* {loginState.userToken ? <RootNavigator /> : <OnboardingStackScreen />} */}
           <RootNavigator />
      </NavigationContainer>
    </AuthContext.Provider>
  );
};



import SplashScreen from './SplashScreen';
import SignInScreen from './SignInScreen';
import SignUpScreen from './SignUpScreen';
import SignUpScreen2 from './SignUpScreen2';
import UserWelcomeScreen from './UserWelcomeScreen';
import MeditateExerciseScreen from '../navigation/tab-screens/meditate-screens-more/MeditateExerciseScreen';
import ExerciseVideo from '../components/ExerciseVideo';


const Stack = createStackNavigator();

function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen options={{headerShown:false, ...TransitionPresets.ScaleFromCenterAndroid }} name="SplashScreen" component={SplashScreen} />
      <Stack.Screen options={{headerShown:false, ...TransitionPresets.ScaleFromCenterAndroid }} name="Memoir" component={BottomTabNavigator} />
      <Stack.Screen options={{headerShown:false, ...TransitionPresets.ScaleFromCenterAndroid }} name="MeditateExerciseScreen" component={MeditateExerciseScreen} />
      <Stack.Screen options={{headerShown:false, ...TransitionPresets.RevealFromBottomAndroid }} name="ExerciseVideo" component={ExerciseVideo} />
      <Stack.Screen options={{headerShown:false, ...TransitionPresets.ModalTransition }} name="SignUpScreen" component={SignUpScreen} />
      <Stack.Screen options={{headerShown:false, ...TransitionPresets.ModalTransition }} name="SignUpScreen2" component={SignUpScreen2} />
      <Stack.Screen options={{headerShown:false, ...TransitionPresets.RevealFromBottomAndroid }} name="SignInScreen" component={SignInScreen} />
      <Stack.Screen options={{headerShown:false, ...TransitionPresets.FadeFromBottomAndroid }} name="UserWelcomeScreen" component={UserWelcomeScreen} />
    </Stack.Navigator>
  )
}