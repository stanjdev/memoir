import React from 'react';
import { View, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import { useFonts } from 'expo-font';

const { height, width } = Dimensions.get("window");

export default function ProfileStatsBlock({icon, title, number, subtitle}) {
  let [fontsLoaded] = useFonts({
    'Assistant': require('../assets/fonts/Assistant/Assistant-VariableFont_wght.ttf'),
    'Assistant-Regular': require('../assets/fonts/Assistant/static/Assistant-Regular.ttf'),
    'Assistant-SemiBold': require('../assets/fonts/Assistant/static/Assistant-SemiBold.ttf'),
  });
  return (
      <View style={{backgroundColor: "white", width: 151, height: Math.min(height * 0.25, 177), borderRadius: 20, margin: 7, shadowOffset: {width: 1, height: 1}, shadowColor: "black", shadowOpacity: 0.5, shadowRadius: 4, padding: 20}}>
        <Image source={icon} style={{height: 42}} resizeMode="contain"/>
        <Text style={{fontFamily: "Assistant-SemiBold", fontSize: 16, color: "#717171"}}>{title}</Text>
        <Text style={{fontFamily: "Assistant-SemiBold", fontSize: 45, color: "#3681C7"}}>{number}</Text>
        <Text style={{fontFamily: "Assistant-SemiBold", fontSize: 14, color: "#717171"}}>{subtitle}</Text>
      </View>
  )
}