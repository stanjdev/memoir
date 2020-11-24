import * as React from 'react';
import { Text, View, StatusBar, Image, Dimensions, StyleSheet, TouchableOpacity } from 'react-native';
const { width, height } = Dimensions.get('window');

import Exercise from '../../components/Exercise';
import { useIsFocused } from '@react-navigation/native';


import { ScrollView } from 'react-native-gesture-handler';

import { useFonts } from 'expo-font';
import { AppLoading } from 'expo';


export default function BreatheScreen({navigation}) {
  const isFocused = useIsFocused();

  let [fontsLoaded] = useFonts({
    'Assistant': require('../../assets/fonts/Assistant/Assistant-VariableFont_wght.ttf'),
    'Assistant-Regular': require('../../assets/fonts/Assistant/static/Assistant-Regular.ttf'),
    'Assistant-SemiBold': require('../../assets/fonts/Assistant/static/Assistant-SemiBold.ttf'),
  });

  return(
    <ScrollView style={{backgroundColor: "white"}}>
      {isFocused ? <StatusBar hidden={false} barStyle="dark-content"/> : null} 
      {
        fontsLoaded ? 
        <View>
          
          <View style={{marginTop: 50, justifyContent: "center", alignItems: "center"}}>
            <TouchableOpacity>
              <Image 
                source={require('../../assets/exercises-images/daily-exhale-4x.png')}
                style={{ height: height * 0.4, width: width * 0.9, }}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
          
          <View style={{marginLeft: 25}}>
            <Text style={{fontFamily: "Assistant-SemiBold", fontSize: 26 }}>Recommended For You</Text>
          </View>
          
          <ScrollView horizontal={true} style={{flexDirection: "row", marginLeft: 25}} showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
            <Exercise image={require("../../assets/exercises-images/flower-4x.png")} title="Cosmos" subTitle="Relax with the Universe" onPress={() => navigation.navigate("ExerciseVideo")} />
            <Exercise image={require("../../assets/exercises-images/breathe-4x.png")} title="Breathe for Focus" subTitle="Get in the Zone"/>
            <Exercise image={require("../../assets/exercises-images/minute-break-4x.png")} title="1 Minute Break" subTitle="60 Seconds of Zen"/>
            <Exercise image={require("../../assets/exercises-images/jungle-green.png")} title="Box Breathing" subTitle="4 Second Box Pattern"/>
            <Exercise image={require("../../assets/exercises-images/forest-orange.png")} title="Ride the Wave" subTitle="Slow Deep Breathing"/>
          </ScrollView>
        
          <View style={{alignItems: "center", }}>
            <TouchableOpacity>
              <Image source={require("../../assets/exercises-images/horiz-focus-session.png")} resizeMode="contain" style={{width: width * 0.855, height: height * 0.17 }}/>
            </TouchableOpacity>
          </View>
          <View style={{alignItems: "center", }}>
            <TouchableOpacity>
              <Image source={require("../../assets/exercises-images/horiz-meditation-session.png")} resizeMode="contain" style={{width: width * 0.9, height: height * 0.17 }}/>
            </TouchableOpacity>
          </View>

          <View style={{marginLeft: 25, flexDirection: "row", }}>
            <TouchableOpacity>
              <Text style={{fontFamily: "Assistant-SemiBold", fontSize: 26, margin: 15 }}>Popular</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={{fontFamily: "Assistant-SemiBold", fontSize: 26, margin: 15 }}>New</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={{fontFamily: "Assistant-SemiBold", fontSize: 26, margin: 15 }}>Sleep</Text>
            </TouchableOpacity>
          </View>

          <ScrollView horizontal={true} style={{flexDirection: "row", marginLeft: 25}} showsHorizontalScrollIndicator={false}>
            <Exercise image={require("../../assets/exercises-images/redrock-4x.png")} title="1 Minute Break" subTitle="60 Seconds of Zen"/>
            <Exercise image={require("../../assets/exercises-images/aurora-4x.png")} title="Breathe for Focus" subTitle="Get in the Zone"/>
            <Exercise image={require("../../assets/exercises-images/moon-4x.png")} title="4-7-8 Breathing" subTitle="For Anxiety Relief"/>
            <Exercise image={require("../../assets/exercises-images/forest-dawn-4x.png")} title="Box Breathing" subTitle="4 Second Box Pattern"/>
            <Exercise image={require("../../assets/exercises-images/purple-4x.png")} title="Cosmos" subTitle="Relax with the Universe"/>
          </ScrollView>

        </View>
  
        :
        <AppLoading />
      }
     

    </ScrollView>
  )
};


