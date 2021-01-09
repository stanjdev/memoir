import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import React, { useEffect, useState, useMemo } from 'react';

import OnboardingStackScreen from './OnboardingStackScreen';
import { View, ActivityIndicator, Alert } from 'react-native';

import { AuthContext } from '../components/context';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { fireApp } from '../firebase';
import firebase from 'firebase';


export default function Navigation({navigation}) {
  // Going with useReducer global state instead, this was just simple demonstration.
  // const [userToken, setUserToken] = React.useState(null);
  // const [isLoading, setIsLoading] = React.useState(true);
  

  const initialLoginState = {
    userEmail: null,
    userToken: null,
    userFirstName: null,
    isLoading: true,
    signInFail: null
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
      case 'SIGNINFAIL':
        return {
          ...prevState,
          signInFail: action.fail
        }
      case 'SIGNINFAILRESET':
        return {
          ...prevState,
          signInFail: null
        }
      case 'UPDATEUSERNAME':
        return {
          ...prevState,
          userFirstName: action.firstName,
        }
      case 'UPDATEUSEREMAIL':
        return {
          ...prevState,
          userEmail: action.email
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
        // console.log(e);
        dispatch({ type: "SIGNINFAIL", fail: e })
        Alert.alert("User Not Found", "Your Account Info Does Not Match Our Records. Please Enter a Valid Username/Password.", [
          {text: "Okay"}, {style: "destructive"}
        ]);
        return;
      }

      const currUser = fireApp.auth().currentUser;
      let userFirstName, userEmail, userToken;
      if (currUser !== null) {
        // console.log(currUser);
        userFirstName = currUser.displayName;
        userEmail = currUser.email;
        userToken = currUser.uid
        AsyncStorage.setItem('userToken', userToken);
        userFirstName && AsyncStorage.setItem('userName', userFirstName);
        dispatch({ type: "SIGNIN", email: userEmail, token: userToken, firstName: userFirstName })
      }
    },
    signInFail: loginState.signInFail,
    resetSignInFail: async () => {
      dispatch({ type: "SIGNINFAILRESET" })
    },

    signOut: async () => {
      // setUserToken(null);
      // setIsLoading(false);
      try {
        await fireApp.auth().signOut()
        await AsyncStorage.removeItem('userToken');
        await AsyncStorage.removeItem('userName');
        
        // sign in anonymously whenever user signs out
        firebase.auth().signInAnonymously()
          .then(user => {
            console.log("logged out, new anonymous made!", user.uid)
          })
          .catch(err => console.log(err.code, err.message));
      } catch(e) {
        console.log(e);
      }
      dispatch({ type: "SIGNOUT" })
    },

    signUp: async (inputEmail, inputPassword, inputFirstName) => {
      // try {
      //   const result = await fireApp
      //     .auth()
      //     .createUserWithEmailAndPassword(inputEmail, inputPassword)
      //   await result.user.updateProfile({
      //     displayName: inputFirstName
      //   });
      //   // console.log(result)
      //   fireApp.auth().currentUser.linkWithCredential(result)
      //   .then(usercred => {
      //     const user = usercred.user;
      //     console.log("Anonymous account successfully upgraded", user);
      //   })
      // } catch (error) {
      //   console.log(error);
      // }
      
      try {
        const credential = firebase.auth.EmailAuthProvider.credential(inputEmail, inputPassword);
        firebase.auth().currentUser.linkWithCredential(credential)
          .then(async usercred => {
            const user = usercred.user;
            await user.updateProfile({
              displayName: inputFirstName,
              email: inputEmail
            }).then(async results => {
              const currUser = fireApp.auth().currentUser;
              let userFirstName, userEmail, userToken;
              if (currUser !== null) {
                userFirstName = currUser.displayName;
                userToken = currUser.uid;
                userEmail = currUser.email;
                AsyncStorage.setItem('userToken', userToken);
                userFirstName && AsyncStorage.setItem('userName', userFirstName);
                dispatch({ type: "SIGNUP", email: userEmail, token: userToken, firstName: userFirstName })
              }
            })
            console.log("Anonymous account successfully upgraded with Email!", user);
          })
      } catch (error) {
        console.log("Error upgrading anonymous account with email", error);
      }
    },

    userToken: loginState.userToken,
    userFirstName: loginState.userFirstName,

    appleSignUp: async (inputEmail, givenName, familyName, credentialUserID) => {
      // try {
      //   const result = await fireApp
      //     .auth()
      //     .createUserWithEmailAndPassword(`${credentialUserID}@appleid.com`, credentialUserID)
      //   await result.user.updateProfile({
      //     displayName: givenName,
      //     lastName: familyName,
      //     privateRelayEmail: inputEmail
      //   });
      // } catch (error) {
      //   console.log(error);
      // }
      if ((await fireApp.auth().fetchSignInMethodsForEmail(`${credentialUserID}@appleid.com`)).length > 0) {
        await fireApp
          .auth()
          .signInWithEmailAndPassword(`${credentialUserID}@appleid.com`, credentialUserID);

          const currUser = fireApp.auth().currentUser;
          let userFirstName, userEmail, userToken;
          if (currUser !== null) {
            userFirstName = currUser.displayName;
            userEmail = inputEmail;
            userToken = currUser.uid;
            AsyncStorage.setItem('userToken', userToken);
            userFirstName && AsyncStorage.setItem('userName', userFirstName);
            dispatch({ type: "SIGNUP", email: userEmail, token: userToken, firstName: userFirstName })
          }

      } else {
        try {
          const credential = firebase.auth.EmailAuthProvider.credential(`${credentialUserID}@appleid.com`, credentialUserID);
          firebase.auth().currentUser.linkWithCredential(credential)
            .then(async usercred => {
              const user = usercred.user;
              await user.updateProfile({
                displayName: givenName,
                lastName: familyName,
                privateRelayEmail: inputEmail // just to hold onto just in case
              }).then(async results => {
                const currUser = fireApp.auth().currentUser;
                let userFirstName, userEmail, userToken;
                if (currUser !== null) {
                  userFirstName = currUser.displayName;
                  userEmail = inputEmail;
                  userToken = currUser.uid;
                  AsyncStorage.setItem('userToken', userToken);
                  userFirstName && AsyncStorage.setItem('userName', userFirstName);
                  dispatch({ type: "SIGNUP", email: userEmail, token: userToken, firstName: userFirstName })
                }
              })
              console.log("Anonymous account successfully upgraded with Apple!", user);
            })
        } catch (error) {
          console.log("Error upgrading anonymous account with Apple", error);
          return;
        }
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
        return;
      }

      const currUser = fireApp.auth().currentUser;
      let userFirstName, userToken;
      if (currUser !== null) {
        userFirstName = currUser.displayName;
        // userEmail = currUser.email;
        userToken = currUser.uid;
        AsyncStorage.setItem('userToken', userToken);
        userFirstName && AsyncStorage.setItem('userName', userFirstName);
        dispatch({ type: "SIGNIN", token: userToken, firstName: userFirstName })
      }
    },

    fbSignUp: async (email, first_name, last_name, userId, token) => {
      // console.log("fetchSignInMethodsForEmail: " + JSON.stringify(await fireApp.auth().fetchSignInMethodsForEmail(email)))
      // console.log(userId);

      if ((await fireApp.auth().fetchSignInMethodsForEmail(email || `${userId}@fbid.com`)).length > 0) {
        await fireApp
          .auth()
          .signInWithEmailAndPassword(email || `${userId}@fbid.com`, userId);
          
        const currUser = fireApp.auth().currentUser;
        let userFirstName, userEmail, userToken;
        if (currUser !== null) {
          userFirstName = currUser.displayName;
          userToken = token;
          userEmail = currUser.privateRelayEmail;
          AsyncStorage.setItem('userToken', userToken);
          userFirstName && AsyncStorage.setItem('userName', userFirstName);
          dispatch({ type: "SIGNUP", email: userEmail, token: userToken, firstName: userFirstName })
        }
        return;

      } else {
        // do link with credential here instead since they will start as anonymous, then link.
          // const result = await fireApp
          //   .auth()
          //   .createUserWithEmailAndPassword(email || `${userId}@fbid.com`, userId);
          //   await result.user.updateProfile({
          //     displayName: first_name,
          //     lastName: last_name,
          //     privateRelayEmail: email || `${userId}@fbid.com` // just to hold to onto just in case
          // });

          try {
            const credential = firebase.auth.EmailAuthProvider.credential(email || `${userId}@fbid.com`, userId);
            await firebase.auth().currentUser.linkWithCredential(credential)
              .then(async usercred => {
                const user = usercred.user;
                await user.updateProfile({
                  displayName: first_name,
                  lastName: last_name,
                  privateRelayEmail: email || `${userId}@fbid.com` // just to hold to onto just in case
                }).then(async results => {
                  const currUser = fireApp.auth().currentUser;
                  let userFirstName, userEmail, userToken;
                  if (currUser !== null) {
                    userFirstName = currUser.displayName;
                    userToken = token;
                    userEmail = currUser.privateRelayEmail;
                    AsyncStorage.setItem('userToken', userToken);
                    userFirstName && AsyncStorage.setItem('userName', userFirstName);
                    dispatch({ type: "SIGNUP", email: userEmail, token: userToken, firstName: userFirstName })
                  }
                })
                console.log("Anonymous account successfully upgraded with Facebook!", user);
              })
              return;
          } catch (error) {
            console.log("Error upgrading anonymous account with Facebook", error);
            return;
          }
      };
    },

    updateNameAndEmail: async (inputName, inputEmail, inputPassword) => {
      const currUser = fireApp.auth().currentUser;
      if (currUser) {
        
        // Updating first name
        if (currUser.displayName !== inputName) {
          currUser.updateProfile({
            displayName: inputName,
          }).then(() => {
            inputName && AsyncStorage.setItem('userName', inputName);
            dispatch({ type: "UPDATEUSERNAME", firstName: currUser.displayName })
            console.log(`First name changed to ${currUser.displayName}!`)
            Alert.alert("Success!", `First name changed to ${currUser.displayName}!`, [
              {text: "Okay"}
            ]);
          })
        }
        
        // updating email
        let credential;
        try {
          credential = firebase.auth.EmailAuthProvider.credential(currUser.email, inputPassword)
          // console.log("credential:", credential)
        } catch (error) {
          alert(error);
          return;
        }
  
        if (currUser.email !== inputEmail && credential) {
          currUser.reauthenticateWithCredential(credential).then(() => {
            console.log("reauthenticated user!")
          }).then(() => {
            currUser.updateEmail(inputEmail).then(function() {
              dispatch({ type: "UPDATEUSEREMAIL", email: currUser.email })
              console.log(`email changed to ${inputEmail}!`)
              Alert.alert("Success!", `email changed to ${inputEmail}!`, [
                {text: "Okay"}
              ]);
            }).catch(function(error) {
              alert(error);
              return;
            })
          })
        }
        // dispatch({ type: "UPDATEUSERINFO", email: currUser.email, firstName: currUser.displayName })
      };
    }
  }));












  // WHEN FIRST OPENING THE APP
  // LOADING WHEEL INTRO - if user was already previously logged in
  useEffect(() => {
    setTimeout( async () => {
      // setIsLoading(false);
      
      let userFirstName, userEmail, userToken;
      const currUser = fireApp.auth().currentUser;

      // if (currUser) {
      //   console.log("existing curr user!", currUser.uid);
      // //   userEmail = currUser.email;
      // //   userToken = currUser.uid;
      //   AsyncStorage.setItem('userName', currUser.displayName || '');
      //   AsyncStorage.setItem('userToken', currUser.uid);
      // //   dispatch({ type: "SIGNIN", email: userEmail, token: userToken, firstName: userFirstName })
      // }

    
      try {
        userToken = await AsyncStorage.getItem('userToken');
        userFirstName = await AsyncStorage.getItem('userName');
        // userToken = currUser ? currUser.uid : null;
        // if (currUser !== null) userFirstName = currUser.displayName;
        
        if (!userToken && !currUser) {
          // WHEN USER TRIES APP FOR FIRST TIME
          firebase.auth().signInAnonymously()
            .then(user => {
              console.log("new Anonymous made!", user.uid)
            })
            .catch(err => console.log(err.code, err.message));
        } else {
            console.log("existing curr user!", currUser.uid || "currUser ID not loaded");
            await AsyncStorage.setItem('userName', currUser.displayName || '');
            await AsyncStorage.setItem('userToken', currUser.uid || "currUser ID not loaded");
        }

      } catch(e) {
        console.log(e);
      }

      dispatch({ type: "RETRIEVE_TOKEN", token: userToken, firstName: userFirstName })
      console.log("user token:", userToken)
      console.log("user email:", currUser && currUser.email)
      console.log("user firstName, logged in as:", userFirstName)
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





import BottomTabNavigator from './BottomTabNavigator';
import ProfileScreen from './tab-screens/ProfileScreen';
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
      <Stack.Screen options={{headerShown:false, ...TransitionPresets.ScaleFromCenterAndroid }} name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  )
}