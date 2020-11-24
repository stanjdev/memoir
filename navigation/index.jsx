import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import BottomTabNavigator from './BottomTabNavigator';
import React, { useEffect, useState, useMemo } from 'react';

import OnboardingStackScreen from './OnboardingStackScreen';
import { View, ActivityIndicator } from 'react-native';

import { AuthContext } from '../components/context';

import AsyncStorage from '@react-native-async-storage/async-storage';

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
    signIn: async (foundUser) => {
      // setUserToken('asdf');
      // setIsLoading(false);

      const userToken = String(foundUser[0].userToken);
      const userEmail = foundUser[0].email;
      const userFirstName = foundUser[0].firstName;

      try {
        await AsyncStorage.setItem('userToken', userToken);
      } catch(e) {
        console.log(e);
      }
      dispatch({ type: "SIGNIN", email: userEmail, token: userToken, firstName: userFirstName })
    },
    signOut: async () => {
      // setUserToken(null);
      // setIsLoading(false);
      try {
        await AsyncStorage.removeItem('userToken');
      } catch(e) {
        console.log(e);
      }
      dispatch({ type: "SIGNOUT" })
    },
    signUp: () => {
      setUserToken('asdf');
      setIsLoading(false);
    },
    userToken: loginState.userToken,
    userFirstName: loginState.userFirstName
  }));

  // LOADING WHEEL INTRO - if user was already previously logged in
  useEffect(() => {
    setTimeout( async () => {
      // setIsLoading(false);
      let userToken;
      userToken = null;
      try {
        userToken = await AsyncStorage.getItem('userToken');
      } catch(e) {
        console.log(e);
      }
      dispatch({ type: "RETRIEVE_TOKEN", token: userToken })
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
}


import SplashScreen from './SplashScreen';
import SignInScreen from './SignInScreen';
import SignUpScreen from './SignUpScreen';
import UserWelcomeScreen from './UserWelcomeScreen';
import MeditateExerciseScreen from '../navigation/tab-screens/meditate-screens-more/MeditateExerciseScreen';
import ExerciseVideo from '../components/ExerciseVideo';

const Stack = createStackNavigator();

function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen options={{headerShown:false}} name="SplashScreen" component={SplashScreen} />
      <Stack.Screen options={{headerShown:false}} name="Memoir" component={BottomTabNavigator} />
      <Stack.Screen options={{headerShown:false}} name="MeditateExerciseScreen" component={MeditateExerciseScreen} />
      <Stack.Screen options={{headerShown:false}} name="ExerciseVideo" component={ExerciseVideo} />
      <Stack.Screen options={{headerShown:false}} name="SignUpScreen" component={SignUpScreen} />
      <Stack.Screen options={{headerShown:false}} name="SignInScreen" component={SignInScreen} />
      <Stack.Screen options={{headerShown:false}} name="UserWelcomeScreen" component={UserWelcomeScreen} />
    </Stack.Navigator>
  )
}