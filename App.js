import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import OnboardingStackScreen from './navigation/OnboardingStackScreen';

import Navigation from './navigation';
import * as SplashScreen from 'expo-splash-screen';

export default function App() {
  // useEffect(() => {
  //   setTimeout(async () => {
  //     try {
  //       await SplashScreen.preventAutoHideAsync();
  //     } catch (error) {
  //       console.warn(error);
  //     }
  //   }, 0);

  //   return () => SplashScreen.hideAsync();
  // }, [])

  useEffect(() => {
    setTimeout(async () => {
      await SplashScreen.preventAutoHideAsync();
      // await SplashScreen.hideAsync();
    }, 0);
    return () => SplashScreen.hideAsync();
  }, [])

  return (
    <SafeAreaProvider>
      <Navigation />
      <StatusBar style="none"/>
    </SafeAreaProvider>
  );
}