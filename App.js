import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import OnboardingStackScreen from './navigation/OnboardingStackScreen';

import Navigation from './navigation';
import * as SplashScreen from 'expo-splash-screen';

export default function App() {

  // useEffect( async () => {
  //   try {
  //     await SplashScreen.preventAutoHideAsync();
  //   } catch (error) {
  //     console.warn(e);
  //   }

  //   return () => SplashScreen.hideAsync();
  // }, [])

  useEffect(() => {
    SplashScreen.preventAutoHideAsync();
    setTimeout(() => {
      SplashScreen.hideAsync();
    }, 1500);
  }, [])

  return (
    <SafeAreaProvider>
      <Navigation />
      <StatusBar style="none"/>
    </SafeAreaProvider>
  );
}