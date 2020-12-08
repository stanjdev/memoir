import React from 'react';
import { View, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import { useFonts } from 'expo-font';

const { height, width } = Dimensions.get("window");

import { ProgressBar, Colors } from 'react-native-paper';

export default function ProfileStatsBlock({icon, title, number, subtitle, subText, progress}) {
  let [fontsLoaded] = useFonts({
    'Assistant': require('../assets/fonts/Assistant/Assistant-VariableFont_wght.ttf'),
    'Assistant-Regular': require('../assets/fonts/Assistant/static/Assistant-Regular.ttf'),
    'Assistant-SemiBold': require('../assets/fonts/Assistant/static/Assistant-SemiBold.ttf'),
  });
  return (
      <View style={{ width: width * 0.77, height: Math.min(height * 0.13, 177), margin: 7, }}>
        <View style={{flexDirection: "row", alignItems: "center"}}>
          <Image source={icon} style={{height: 22, width: 26, marginRight: 10}} resizeMode="contain"/>
          <Text style={{fontFamily: "Assistant-SemiBold", fontSize: 22, color: "#717171"}}>{title}</Text>
        </View>
        
        <View style={{flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between"}}>
          <View style={{flexDirection: "row", alignItems: "flex-end"}}>
            <Text style={{fontFamily: "Assistant-SemiBold", fontSize: 36, color: "#3681C7", marginRight: 7, marginBottom: -6, }}>{number}</Text>
            <Text style={{fontFamily: "Assistant-SemiBold", fontSize: 21.45, color: "#3681C7", }}>{subtitle}</Text>
          </View>
          <Text style={{fontFamily: "Assistant-SemiBold", fontSize: 12.03, color: "#717171"}}>{subText}</Text>
        </View>
        <View>
          {progress ? 
           <ProgressBar
            progress={progress}
            color={"#3681C7"}
            style={{backgroundColor: "#CCCCCC", borderRadius: 7, height: 3, marginTop: 10}}
            width={"100%"}
          />
          : null}
        </View>
      </View>



      // <View style={{backgroundColor: "white", width: 151, height: Math.min(height * 0.25, 177), borderRadius: 20, margin: 7, shadowOffset: {width: 1, height: 1}, shadowColor: "black", shadowOpacity: 0.5, shadowRadius: 4, padding: 20}}>
      //   <Image source={icon} style={{height: 42}} resizeMode="contain"/>
      //   <Text style={{fontFamily: "Assistant-SemiBold", fontSize: 16, color: "#717171"}}>{title}</Text>
      //   <Text style={{fontFamily: "Assistant-SemiBold", fontSize: 45, color: "#3681C7"}}>{number}</Text>
      //   <Text style={{fontFamily: "Assistant-SemiBold", fontSize: 14, color: "#717171"}}>{subtitle}</Text>
      // </View>
  )
}