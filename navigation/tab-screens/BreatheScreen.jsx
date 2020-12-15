import React, {useEffect, useState} from 'react';
import { Text, View, StatusBar, Image, Dimensions, StyleSheet, TouchableOpacity } from 'react-native';
const { width, height } = Dimensions.get('window');
import { Asset } from 'expo-asset';

import Exercise from '../../components/Exercise';
import { useIsFocused } from '@react-navigation/native';

import { Exercises } from '../../model/exercise-store';

import { ScrollView } from 'react-native-gesture-handler';

import { useFonts } from 'expo-font';
import { AppLoading } from 'expo';

import firebase from 'firebase';


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

  const [selectedCategory, setSelectedCategory] = useState("Sleep");

  const categoryOptions = {
    "Sleep": "Sleep",
    "New": "New",
    "Popular": "Popular",
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



  // SIGN IN ANONYMOUS USER IF NOT SIGNED IN!
  // const currUser = firebase.auth().currentUser;
  // if (currUser === null) {

  // }

  // const progressRef = currUser ? firebase.database().ref(currUser.uid).child('progress') : null;











  return(
    <ScrollView style={{backgroundColor: "white"}}>
      {isFocused ? <StatusBar hidden={false} barStyle="dark-content"/> : null} 
      {
        isReady ? 
        <View>
          
          <View style={{marginTop: 50, justifyContent: "center", alignItems: "center"}}>
            <Exercise uniqueSize="topBanner" navigation={navigation} image={Exercises[7].image} videoFile={Exercises[7].videoFile} modalIcon={Exercises[7].modalIcon} id={Exercises[7].id} autoCountDown={"2m"}/> 
          </View>
          
          <View style={{marginLeft: 25}}>
            <Text style={{fontFamily: "Assistant-SemiBold", fontSize: 26 }}>Recommended For You</Text>
          </View>
          
          <ScrollView horizontal={true} style={{flexDirection: "row", marginLeft: 25}} showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
            <Exercise id={Exercises[1].id} navigation={navigation} image={Exercises[1].image} title={Exercises[1].title} subTitle={Exercises[1].subTitle} videoFile={Exercises[1].videoFile} modalIcon={Exercises[1].modalIcon} iconHeight={Exercises[1].iconHeight} />
            <Exercise id={Exercises[2].id} navigation={navigation} image={Exercises[2].image} title={Exercises[2].title} subTitle={Exercises[2].subTitle} videoFile={Exercises[2].videoFile} modalIcon={Exercises[2].modalIcon} iconHeight={Exercises[2].iconHeight} />
            <Exercise id={Exercises[3].id} navigation={navigation} image={Exercises[3].image} title={Exercises[3].title} subTitle={Exercises[3].subTitle} videoFile={Exercises[3].videoFile} modalIcon={Exercises[3].modalIcon} iconHeight={Exercises[3].iconHeight} />
            <Exercise id={Exercises[4].id} navigation={navigation} image={Exercises[4].image} title={Exercises[4].title} subTitle={Exercises[4].subTitle} videoFile={Exercises[4].videoFile} modalIcon={Exercises[4].modalIcon} iconHeight={Exercises[4].iconHeight} />
            <Exercise id={Exercises[5].id} navigation={navigation} image={Exercises[5].image} title={Exercises[5].title} subTitle={Exercises[5].subTitle} videoFile={Exercises[5].videoFile} modalIcon={Exercises[5].modalIcon} iconHeight={Exercises[5].iconHeight} />
          </ScrollView>
        
          <View style={{alignItems: "center", }}>
            <Exercise uniqueSize="horizontal" navigation={navigation} image={Exercises[8].uniqueImg} videoFile={Exercises[8].videoFile} modalIcon={Exercises[8].modalIcon} id={Exercises[8].id} autoCountDown={"30m"} customWidth={Exercises[8].customWidth}/> 
          </View>
          <View style={{alignItems: "center", }}>
            <Exercise uniqueSize="horizontal" navigation={navigation} image={Exercises[9].image} videoFile={Exercises[9].videoFile} modalIcon={Exercises[9].modalIcon} id={Exercises[9].id} customWidth={Exercises[9].customWidth}/> 
            {/* <TouchableOpacity>
              <Image source={require("../../assets/exercises-images/horiz-deep-breaths.png")} resizeMode="contain" style={{width: width * 0.9, height: height * 0.17 }}/>
            </TouchableOpacity> */}
          </View>

          <View style={{marginLeft: 25, flexDirection: "row", }}>
            {renderCategoryOptions()}
          </View>
 
          { 
            selectedCategory === "Sleep" ? 
            <ScrollView horizontal={true} style={{flexDirection: "row", marginLeft: 25}} showsHorizontalScrollIndicator={false}>
              <Exercise id={Exercises[6].id} navigation={navigation} image={Exercises[6].image} title={Exercises[6].title} subTitle={Exercises[6].subTitle} videoFile={Exercises[6].videoFile} modalIcon={Exercises[6].modalIcon} iconHeight={Exercises[6].iconHeight} />
              <Exercise navigation={navigation} image={require("../../assets/exercises-images/purple-4x.png")} title="Cosmos" subTitle="Relax with the Universe"/>    
            </ScrollView>
            : selectedCategory === "New" ? 
            <ScrollView horizontal={true} style={{flexDirection: "row", marginLeft: 25}} showsHorizontalScrollIndicator={false}>
              <Exercise navigation={navigation} image={require("../../assets/exercises-images/forest-dawn-4x.png")} title="Box Breathing" subTitle="4 Second Box Pattern"/>
              <Exercise navigation={navigation} image={require("../../assets/exercises-images/redrock-4x.png")} title="1 Minute Break" subTitle="60 Seconds of Zen"/>
              <Exercise navigation={navigation} image={require("../../assets/exercises-images/aurora-4x.png")} title="No More Anxiety" subTitle="4-7-8 Tension Relief"/>
            </ScrollView>
            : selectedCategory === "Popular" ? 
            <ScrollView horizontal={true} style={{flexDirection: "row", marginLeft: 25}} showsHorizontalScrollIndicator={false}>
              <Exercise navigation={navigation} image={require("../../assets/exercises-images/aurora-4x.png")} title="No More Anxiety" subTitle="4-7-8 Tension Relief"/>
              <Exercise id={Exercises[6].id} navigation={navigation} image={Exercises[6].image} title={Exercises[6].title} subTitle={Exercises[6].subTitle} videoFile={Exercises[6].videoFile} modalIcon={Exercises[6].modalIcon} iconHeight={Exercises[6].iconHeight} />
              <Exercise navigation={navigation} image={require("../../assets/exercises-images/redrock-4x.png")} title="1 Minute Break" subTitle="60 Seconds of Zen"/>
              <Exercise navigation={navigation} image={require("../../assets/exercises-images/forest-dawn-4x.png")} title="Box Breathing" subTitle="4 Second Box Pattern"/>
              <Exercise navigation={navigation} image={require("../../assets/exercises-images/purple-4x.png")} title="Cosmos" subTitle="Relax with the Universe"/>    
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