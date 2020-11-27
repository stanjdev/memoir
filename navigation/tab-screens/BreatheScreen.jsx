import React, {useEffect, useState} from 'react';
import { Text, View, StatusBar, Image, Dimensions, StyleSheet, TouchableOpacity } from 'react-native';
const { width, height } = Dimensions.get('window');
import { Asset } from 'expo-asset';

import Exercise from '../../components/Exercise';
import { useIsFocused } from '@react-navigation/native';


import { ScrollView } from 'react-native-gesture-handler';

import { useFonts } from 'expo-font';
import { AppLoading } from 'expo';


// https://docs.expo.io/guides/preloading-and-caching-assets/?redirected#publishing-assets
function cacheImages(images) {
  return images.map(image => Asset.fromModule(image).downloadAsync());
}


export default function BreatheScreen({navigation}) {
  const isFocused = useIsFocused();

  const [isReady, setIsReady] = useState(false);

  async function _loadAssetsAsync() {
    const imageAssets = cacheImages([
      require("../../assets/exercises-images/flower-4x.png"),
      require("../../assets/exercises-images/breathe-4x.png"),
      require("../../assets/exercises-images/minute-break-4x.png"),
      require("../../assets/exercises-images/jungle-green.png"),
      require("../../assets/exercises-images/forest-orange.png"),
      require("../../assets/exercises-images/horiz-deep-breaths.png"),
      require('../../assets/exercises-images/daily-exhale-4x.png'),
      require("../../assets/exercises-images/redrock-4x.png"),
      require("../../assets/exercises-images/aurora-4x.png"),
      require("../../assets/exercises-images/moon-4x.png"),
      require("../../assets/exercises-images/forest-dawn-4x.png"),
      require("../../assets/exercises-images/purple-4x.png"),
    ]);
    await Promise.all([...imageAssets]);
  }


  let [fontsLoaded] = useFonts({
    'Assistant': require('../../assets/fonts/Assistant/Assistant-VariableFont_wght.ttf'),
    'Assistant-Regular': require('../../assets/fonts/Assistant/static/Assistant-Regular.ttf'),
    'Assistant-SemiBold': require('../../assets/fonts/Assistant/static/Assistant-SemiBold.ttf'),
  });

  const [selectedCategory, setSelectedCategory] = useState("Popular");

  const categoryOptions = {
    "Popular": "Popular",
    "New": "New",
    "Sleep": "Sleep",
  }

  const renderCategoryOptions = () => {
    return Object.keys(categoryOptions).map((option, i) => {
      return (
        <TouchableOpacity key={`${i} ${option}`} onPress={() => handleSelectedOption(option)}>
          <View style={styles.selection}>
            <Text style={toggleSelected(option)}>{option}</Text>
            <View style={toggleUnderline(option)}></View>
          </View>
        </TouchableOpacity>
      )
    })
  }

  const handleSelectedOption = (optionName) => {
    setSelectedCategory(optionName)
  }

  const toggleSelected = (optionName) => {
    return selectedCategory === optionName ? styles.selected : styles.unSelected;
  }

  const toggleUnderline = (optionName) => {
    return selectedCategory === optionName ? styles.underline : null;
  }




  return(
    <ScrollView style={{backgroundColor: "white"}}>
      {isFocused ? <StatusBar hidden={false} barStyle="dark-content"/> : null} 
      {
        isReady ? 
        <View>
          
          <View style={{marginTop: 50, justifyContent: "center", alignItems: "center"}}>
            <TouchableOpacity onPress={() => navigation.navigate("ExerciseVideo", { videoFile: require('../../assets/video-exercises/daily-exhale.mp4') })}>
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
            <Exercise image={require("../../assets/exercises-images/flower-4x.png")} title="Flower of Life" subTitle="Relax Your Mind" onPress={() => navigation.navigate("ExerciseVideo", { videoFile: require('../../assets/video-exercises/flower-of-life.mp4') })} />
            <Exercise image={require("../../assets/exercises-images/breathe-4x.png")} title="Breathe for Focus" subTitle="Get in the Zone" onPress={() => navigation.navigate("ExerciseVideo", { videoFile: require('../../assets/video-exercises/circles.mp4') })} />
            <Exercise image={require("../../assets/exercises-images/minute-break-4x.png")} title="1 Minute Break" subTitle="60 Seconds of Zen" onPress={() => navigation.navigate("ExerciseVideo", { videoFile: require('../../assets/video-exercises/4-7-9-wheel.mp4') })} />
            <Exercise image={require("../../assets/exercises-images/jungle-green.png")} title="Box Breathing" subTitle="4 Second Box Pattern" onPress={() => navigation.navigate("ExerciseVideo", { videoFile: require('../../assets/video-exercises/box-breathing.mp4') })} />
            <Exercise image={require("../../assets/exercises-images/forest-orange.png")} title="Ride the Wave" subTitle="Slow Deep Breathing" onPress={() => navigation.navigate("ExerciseVideo", { videoFile: require('../../assets/video-exercises/yin-yang.mp4') })} />
          </ScrollView>
        
          <View style={{alignItems: "center", }}>
            <TouchableOpacity>
              <Image source={require("../../assets/exercises-images/horiz-focus-session.png")} resizeMode="contain" style={{width: width * 0.855, height: height * 0.17 }}/>
            </TouchableOpacity>
          </View>
          <View style={{alignItems: "center", }}>
            <TouchableOpacity>
              <Image source={require("../../assets/exercises-images/horiz-deep-breaths.png")} resizeMode="contain" style={{width: width * 0.9, height: height * 0.17 }}/>
            </TouchableOpacity>
          </View>

          <View style={{marginLeft: 25, flexDirection: "row", }}>
            {renderCategoryOptions()}
          </View>
 
          { 
            selectedCategory === "Popular" ? 
            <ScrollView horizontal={true} style={{flexDirection: "row", marginLeft: 25}} showsHorizontalScrollIndicator={false}>
              <Exercise image={require("../../assets/exercises-images/redrock-4x.png")} title="1 Minute Break" subTitle="60 Seconds of Zen"/>
              <Exercise image={require("../../assets/exercises-images/aurora-4x.png")} title="Breathe for Focus" subTitle="Get in the Zone"/>
              <Exercise image={require("../../assets/exercises-images/moon-4x.png")} title="Good Night" subTitle="For Better Sleep" onPress={() => navigation.navigate("ExerciseVideo", {videoFile: require("../../assets/video-exercises/crescent-moon.mp4")})}/>
              <Exercise image={require("../../assets/exercises-images/forest-dawn-4x.png")} title="Box Breathing" subTitle="4 Second Box Pattern"/>
              <Exercise image={require("../../assets/exercises-images/purple-4x.png")} title="Cosmos" subTitle="Relax with the Universe"/>    
            </ScrollView>
            : selectedCategory === "New" ? 
            <ScrollView horizontal={true} style={{flexDirection: "row", marginLeft: 25}} showsHorizontalScrollIndicator={false}>
              <Exercise image={require("../../assets/exercises-images/redrock-4x.png")} title="1 Minute Break" subTitle="60 Seconds of Zen"/>
              <Exercise image={require("../../assets/exercises-images/aurora-4x.png")} title="Breathe for Focus" subTitle="Get in the Zone"/>
              <Exercise image={require("../../assets/exercises-images/forest-dawn-4x.png")} title="Box Breathing" subTitle="4 Second Box Pattern"/>
            </ScrollView>
            : selectedCategory === "Sleep" ? 
            <ScrollView horizontal={true} style={{flexDirection: "row", marginLeft: 25}} showsHorizontalScrollIndicator={false}>
              <Exercise image={require("../../assets/exercises-images/moon-4x.png")} title="Good Night" subTitle="For Better Sleep" onPress={() => navigation.navigate("ExerciseVideo", {videoFile: require("../../assets/video-exercises/crescent-moon.mp4")})}/>
              <Exercise image={require("../../assets/exercises-images/purple-4x.png")} title="Cosmos" subTitle="Relax with the Universe"/>    
            </ScrollView>
            : null
          }
          
        </View>
  
        : 
        // null
        <AppLoading 
          startAsync={_loadAssetsAsync}
          onFinish={() => setIsReady(true)}
          onError={console.warn}
        />
      }
     

    </ScrollView>
  )
};


const styles = StyleSheet.create({
  selection: { 
    margin: 15, 
    alignItems: "center"
  },
  selected: {
    fontFamily: "Assistant-SemiBold", 
    fontSize: 26, 
    color: "black",
  },
  unSelected: {
    fontFamily: "Assistant-SemiBold", 
    fontSize: 26, 
    color: "#717171"
  },
  underline: {
    marginTop: 3,
    borderTopWidth: 2,
    width: "85%"
  }
})