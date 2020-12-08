import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';

import SplashScreen from './SplashScreen';
import GetStartedScreen from './GetStartedScreen';
// import CreateIntroScreen from './CreateIntroScreen';
import SignInScreen from './SignInScreen';
import SignUpScreen from './SignUpScreen';
import UserWelcomeScreen from './UserWelcomeScreen';

const OnboardingStack = createStackNavigator();

const OnboardingStackScreen = ({navigation}) => (
  <OnboardingStack.Navigator headerMode="none">
    <OnboardingStack.Screen name="SplashScreen" component={SplashScreen} />
    <OnboardingStack.Screen name="GetStartedScreen" component={GetStartedScreen} />
    {/* <OnboardingStack.Screen name="CreateIntroScreen" component={CreateIntroScreen} /> */}
    <OnboardingStack.Screen name="SignUpScreen" component={SignUpScreen} />
    <OnboardingStack.Screen name="SignInScreen" component={SignInScreen} />
    <OnboardingStack.Screen name="UserWelcomeScreen" component={UserWelcomeScreen} />
  </OnboardingStack.Navigator>
);

export default OnboardingStackScreen; 