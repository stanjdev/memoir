import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import OnboardingStackScreen from './navigation/OnboardingStackScreen';

import Navigation from './navigation';

// Firebase
import * as firebase from 'firebase';
import "firebase/auth";
import { firebaseConfig } from './config';
firebase.initializeApp(firebaseConfig);


export default function App() {
  return (
    <SafeAreaProvider>
      <Navigation />
      <StatusBar style="none"/>
    </SafeAreaProvider>
  );
}