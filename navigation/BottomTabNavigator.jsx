import * as React from 'react';
import { createStackNavigator, CreateStackNavigator, TransitionPresets } from '@react-navigation/stack';
import { BottomTabView, createBottomTabNavigator, CreateBottomTagNavigator } from '@react-navigation/bottom-tabs';


// ACTUAL SCREENS
import BreatheScreen from './tab-screens/BreatheScreen';
import ExerciseVideo from '../components/ExerciseVideo';

import MeditateScreen from './tab-screens/MeditateScreen';
import MeditateTimerSetScreen from './tab-screens/meditate-screens-more/MeditateTimerSetScreen';
import MeditateExerciseScreen from './tab-screens/meditate-screens-more/MeditateExerciseScreen';

import FavoritesScreen from './tab-screens/FavoritesScreen';

import ProfileScreen from './tab-screens/ProfileScreen';
import ProMemberScreen from './tab-screens/ProMemberScreen';
import SettingsScreen from './tab-screens/profile-screens-more/SettingsScreen';
import AccountInfoScreen from './tab-screens/profile-screens-more/setting-options/AccountInfoScreen';

// Custom Tab Icons
import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
import icoMoonConfig from '../assets/tabIcons/icomoon/selection.json';


// Stock Tab Icons
import { Entypo } from '@expo/vector-icons'; 

import { useFonts } from 'expo-font';
import AppLoading from 'expo-app-loading';












// ACTUAL TAB NAVIGATOR
const BottomTab = createBottomTabNavigator();
export default function BottomTabNavigator() {

  createIconSetFromIcoMoon(icoMoonConfig, 'memoir-tab-icons')

  let [tabIconsLoaded] = useFonts({
    'memoir-tab-icons': require('../assets/tabIcons/icomoon/fonts/icomoon.ttf'),
    'Assistant': require('../assets/fonts/Assistant/Assistant-VariableFont_wght.ttf'),
    'Assistant-Regular': require('../assets/fonts/Assistant/static/Assistant-Regular.ttf'),
    'Assistant-SemiBold': require('../assets/fonts/Assistant/static/Assistant-SemiBold.ttf'),
  });
  
  const CustomIcon = createIconSetFromIcoMoon(icoMoonConfig, 'memoir-tab-icons');

  return(
    tabIconsLoaded ? 

    <BottomTab.Navigator
      tabBarOptions={{
        activeTintColor: "black",
        inactiveTintColor: "#717171"
      }}
    >
      <BottomTab.Screen
        name="Explore"
        component={BreatheStackScreen}
        options={{
          // tabBarIcon: () => <TabBarIcon name="air" />
          tabBarIcon: ({ focused }) => <CustomIcon size={14} name="breathe-grey" style={{marginBottom: -10}} color={ focused ? "black" : "#717171"}/>
        }}
        fontFamily="Assistant-SemiBold"
      />
      <BottomTab.Screen 
        name="Meditate"
        component={MeditateStackScreen}
        options={{
          // tabBarIcon: () => <TabBarIcon name="dots-two-horizontal" />
          tabBarIcon: ({ focused }) => <CustomIcon size={18} name="meditate-grey" style={{marginBottom: -10}} color={ focused ? "black" : "#717171"} />
        }}
        
      />
      <BottomTab.Screen 
        name="Favorites"
        component={FavoritesStackScreen}
        options={{
          // tabBarIcon: () => <TabBarIcon name="heart-outlined" />
          tabBarIcon: ({ focused }) => <CustomIcon size={18} name="favorites-grey" style={{marginBottom: -10}} color={ focused ? "black" : "#717171"} />,
          // tabBarLabel: "Favorites",
        }}
      />
      <BottomTab.Screen 
        name="Profile"
        component={ProfileStackScreen}
        options={{
          // tabBarIcon: () => <TabBarIcon name="user" />
          tabBarIcon: ({ focused }) => <CustomIcon size={18} name="profile-grey" style={{marginBottom: -10}} color={ focused ? "black" : "#717171"} /> 
        }}
      />
    </BottomTab.Navigator>

    : <AppLoading />
  )
}

function TabBarIcon({name}) {
  return <Entypo name={name} size={24} color="black" />
}











// STACK NAVIGATORS
const BreatheStack = createStackNavigator();
function BreatheStackScreen() {
  return (
    <BreatheStack.Navigator>
      <BreatheStack.Screen name="Breathe" component={BreatheScreen} options={{headerShown: false}}/>
      {/* <BreatheStack.Screen name="ExerciseVideo" component={ExerciseVideo} options={{headerShown: false}}/> */}
    </BreatheStack.Navigator>
  )
}

const MeditateStack = createStackNavigator();
function MeditateStackScreen() {
  return (
    <MeditateStack.Navigator>
      <MeditateStack.Screen name="Meditate" component={MeditateScreen} options={{headerShown: false}}/>
      <MeditateStack.Screen name="MeditateTimerSetScreen" component={MeditateTimerSetScreen} options={{headerShown: false}}/>
      {/* <MeditateStack.Screen name="MeditateExerciseScreen" component={MeditateExerciseScreen} options={{headerShown: false}}/> */}
    </MeditateStack.Navigator>
  )
}

const FavoritesStack = createStackNavigator();
function FavoritesStackScreen() {
  return (
    <FavoritesStack.Navigator>
      <FavoritesStack.Screen name="Favorite" component={FavoritesScreen} options={{headerShown: false}}/>
    </FavoritesStack.Navigator>
  )
}

const ProfileStack = createStackNavigator();
function ProfileStackScreen() {
  return(
    <ProfileStack.Navigator>
      <ProfileStack.Screen name="Profile" component={ProfileScreen} options={{headerShown: false}}/>
      <ProfileStack.Screen name="ProMemberScreen" component={ProMemberScreen} options={{headerShown: false, ...TransitionPresets.ScaleFromCenterAndroid}}/>
      <ProfileStack.Screen name="SettingsScreen" component={SettingsScreen} options={{headerShown: false}}/>
      <ProfileStack.Screen name="AccountInfoScreen" component={AccountInfoScreen} options={{headerShown: false}}/>
    </ProfileStack.Navigator>
  )
}

