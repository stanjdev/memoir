import React, { useEffect, useState, useContext } from 'react';
import { Text, View, StatusBar, Image, Dimensions, StyleSheet, TouchableOpacity, RefreshControl } from 'react-native';
const { width, height } = Dimensions.get('window');
import { Asset } from 'expo-asset';
import { AuthContext } from '../../components/context';

import Exercise from '../../components/Exercise';
import { useIsFocused } from '@react-navigation/native';

import { Exercises } from '../../model/exercise-store';

import { ScrollView } from 'react-native-gesture-handler';

import { useFonts } from 'expo-font';
import { AppLoading } from 'expo';

import firebase from 'firebase';

import AsyncStorage from '@react-native-async-storage/async-storage';


// https://docs.expo.io/guides/preloading-and-caching-assets/?redirected#publishing-assets
function cacheImages(images) {
  return images.map(image => Asset.fromModule(image).downloadAsync());
}

export default function BreatheScreen({navigation}) {
  const isFocused = useIsFocused();

  const { userToken } = useContext(AuthContext);

  const [isReady, setIsReady] = useState(false);

  async function _loadAssetsAsync() {
    const imageAssets = cacheImages([
      // require("../../assets/exercises-images/flower-of-life.png"),
      // require("../../assets/exercises-images/circles.png"),
      // require("../../assets/exercises-images/4-7-9-wheel.png"),
      // require("../../assets/exercises-images/box-breathing.png"),
      // require("../../assets/exercises-images/yin-yang.png"),
      // require("../../assets/exercises-images/horiz-deep-breaths.png"),
      // require("../../assets/exercises-images/redrock-4x.png"),
      // require("../../assets/exercises-images/aurora-4x.png"),
      // require("../../assets/exercises-images/crescent-moon.png"),
      // require("../../assets/exercises-images/forest-dawn-4x.png"),
      // require("../../assets/exercises-images/cosmos.png"),
    ]);
    await Promise.all([...imageAssets]);
  }


  let [fontsLoaded] = useFonts({
    'Assistant': require('../../assets/fonts/Assistant/Assistant-VariableFont_wght.ttf'),
    'Assistant-Regular': require('../../assets/fonts/Assistant/static/Assistant-Regular.ttf'),
    'Assistant-SemiBold': require('../../assets/fonts/Assistant/static/Assistant-SemiBold.ttf'),
  });

  const currentHour = new Date().getHours();
  // console.log(currentHour)

  const [selectedCategory, setSelectedCategory] = useState(currentHour >= 20 ? "Sleep" : "New");

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




  const currUser = firebase.auth().currentUser;
  const favRef = currUser ? firebase.database().ref(currUser.uid).child('favorites') : null;

  // let favIds = [];
  const [favIds, setFavIds] = useState([]);

  useEffect(() => {
    if (currUser) {
      favRef.on("value", snapshot => {
        setFavIds([]);
        snapshot.forEach(node => {
          // favIds.push(node.val().id)
          setFavIds(arr => [...arr, node.val().id])
          console.log(favIds)
          // console.log(favIds.includes(2))
        })
      })
    }
  }, [])

  const checkIfLiked = (exId) => {
    console.log("Breathe Screen favs:", favIds.includes(exId))
    return favIds.includes(exId);
  }



  // const [refreshing, setRefreshing] = React.useState(false);

  // const onRefresh = React.useCallback(() => {
  //   setRefreshing(true);

  //   setTimeout(() => {
  //     setRefreshing(false)
  //   }, 0);
  // }, []);

  // useEffect(() => {
  //   onRefresh();
  // }, [])


  // this way doesn't shuffle it every time you move from tab to tab
  const [recommendedToday, setRecommendedToday] = useState();
  const [popular, setPopular] = useState();


  useEffect(() => {
    // setRecommendedToday(shuffle([1, 2, 3, 4, 5]));
    // setPopular(shuffle([6, 10, 11, 12, 13]));

    shuffle([1, 2, 3, 4, 5], setRecommendedToday);
    shuffle([6, 10, 11, 12, 13], setPopular);
    // console.log("breathing exercises shuffle rendered!")
  }, [])


  // useEffect(() => {
  //   setRecommendedToday(arr => recommendedToday)
  // }, [favRef])


  // function shuffle(arr) {
  //   let currIdx = arr.length, tempValue, randomIdx;
  //   while (currIdx !== 0) {
  //     randomIdx = Math.floor(Math.random() * currIdx);
  //     currIdx -= 1;

  //     tempValue = arr[currIdx];
  //     arr[currIdx] = arr[randomIdx];
  //     arr[randomIdx] = tempValue;
  //   }
  //   return arr.map(x => 
  //     <Exercise 
  //       id={Exercises[x].id} 
  //       key={Exercises[x].id}
  //       navigation={navigation} 
  //       image={Exercises[x].image || null} 
  //       gif={Exercises[x].gif || undefined}
  //       title={Exercises[x].title} 
  //       subTitle={Exercises[x].subTitle} 
  //       videoFile={Exercises[x].videoFile || null} 
  //       modalIcon={Exercises[x].modalIcon || null} 
  //       iconHeight={Exercises[x].iconHeight || null} 
  //       customVolume={Exercises[x].customVolume || null}
  //     />
  //   );
  // }

  
  const shuffle = (arr, setter) => {
    let currIdx = arr.length, tempValue, randomIdx;
    while (currIdx !== 0) {
      randomIdx = Math.floor(Math.random() * currIdx);
      currIdx -= 1;

      tempValue = arr[currIdx];
      arr[currIdx] = arr[randomIdx];
      arr[randomIdx] = tempValue;
    }
    setter(arr);
  }

  function renderExercises(array) {
    return array.map(x => 
      <Exercise 
        id={Exercises[x].id} 
        key={Exercises[x].id}
        navigation={navigation} 
        image={Exercises[x].image || null} 
        gif={Exercises[x].gif || undefined}
        title={Exercises[x].title} 
        subTitle={Exercises[x].subTitle} 
        videoFile={Exercises[x].videoFile || null} 
        modalIcon={Exercises[x].modalIcon || null} 
        iconHeight={Exercises[x].iconHeight || null} 
        customVolume={Exercises[x].customVolume || null}
        isLiked={favIds.includes(x)}
      />
    )
  }




  return(
    <ScrollView style={{backgroundColor: "white"}}>
      {isFocused ? <StatusBar hidden={false} barStyle="dark-content"/> : null} 
      {/* <RefreshControl refreshing={refreshing} /> */}
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
            {/* <Exercise id={Exercises[1].id} navigation={navigation} image={Exercises[1].image} title={Exercises[1].title} subTitle={Exercises[1].subTitle} videoFile={Exercises[1].videoFile} modalIcon={Exercises[1].modalIcon} iconHeight={Exercises[1].iconHeight} customVolume={Exercises[1].customVolume}/>
            <Exercise id={Exercises[2].id} navigation={navigation} image={Exercises[2].image} gif={Exercises[2].gif || null} title={Exercises[2].title} subTitle={Exercises[2].subTitle} videoFile={Exercises[2].videoFile} modalIcon={Exercises[2].modalIcon} iconHeight={Exercises[2].iconHeight} />
            <Exercise id={Exercises[3].id} navigation={navigation} image={Exercises[3].image} title={Exercises[3].title} subTitle={Exercises[3].subTitle} videoFile={Exercises[3].videoFile} modalIcon={Exercises[3].modalIcon} iconHeight={Exercises[3].iconHeight} />
            <Exercise id={Exercises[4].id} navigation={navigation} image={Exercises[4].image} title={Exercises[4].title} subTitle={Exercises[4].subTitle} videoFile={Exercises[4].videoFile} modalIcon={Exercises[4].modalIcon} iconHeight={Exercises[4].iconHeight} />
            <Exercise id={Exercises[5].id} navigation={navigation} image={Exercises[5].image} title={Exercises[5].title} subTitle={Exercises[5].subTitle} videoFile={Exercises[5].videoFile} modalIcon={Exercises[5].modalIcon} iconHeight={Exercises[5].iconHeight} /> */}
            {/* {recommendedPicker()} */}
            {/* {recommendedToday} */}
            {renderExercises(recommendedToday)}
          </ScrollView>
        
          <View style={{alignItems: "center", }}>
            {
              currentHour >= 20 ? 
              <Exercise uniqueSize="horizontal" navigation={navigation} image={Exercises[8].uniqueImg} videoFile={Exercises[8].videoFile} modalIcon={Exercises[8].modalIcon} id={Exercises[8].id} autoCountDown={"30m"} customWidth={Exercises[8].customWidth} noFinishBell={Exercises[8].noFinishBell}/> 
              : null
            }
          </View>
          <View style={{alignItems: "center", }}>
            <Exercise uniqueSize="horizontal" navigation={navigation} image={Exercises[9].image} videoFile={Exercises[9].videoFile} modalIcon={Exercises[9].modalIcon} id={Exercises[9].id} customWidth={Exercises[9].customWidth}/> 
          </View>

          <View style={{marginLeft: 25, flexDirection: "row", }}>
            {renderCategoryOptions()}
          </View>
 
          {/* { 
            selectedCategory === "Sleep" ? 
            <ScrollView horizontal={true} style={{flexDirection: "row", marginLeft: 25}} showsHorizontalScrollIndicator={false}>
              <Exercise id={Exercises[6].id} navigation={navigation} image={Exercises[6].image} title={Exercises[6].title} subTitle={Exercises[6].subTitle} videoFile={Exercises[6].videoFile} modalIcon={Exercises[6].modalIcon} iconHeight={Exercises[6].iconHeight} noFinishBell={Exercises[6].noFinishBell}/>
              <Exercise id={Exercises[10].id} navigation={navigation} image={Exercises[10].image} title={Exercises[10].title} subTitle={Exercises[10].subTitle} />
            </ScrollView>
            : selectedCategory === "New" ? 
            <ScrollView horizontal={true} style={{flexDirection: "row", marginLeft: 25}} showsHorizontalScrollIndicator={false}>
              <Exercise id={Exercises[11].id} navigation={navigation} image={Exercises[11].image} title={Exercises[11].title} subTitle={Exercises[11].subTitle} modalIcon={Exercises[11].modalIcon} iconHeight={Exercises[11].iconHeight}/>
              <Exercise id={Exercises[13].id} navigation={navigation} image={Exercises[13].image} title={Exercises[13].title} subTitle={Exercises[13].subTitle} />
              <Exercise id={Exercises[12].id} navigation={navigation} image={Exercises[12].image} title={Exercises[12].title} subTitle={Exercises[12].subTitle} />
            </ScrollView>
            : selectedCategory === "Popular" ? 
            <ScrollView horizontal={true} style={{flexDirection: "row", marginLeft: 25}} showsHorizontalScrollIndicator={false}>
              {popular}
            </ScrollView>
            : null
          } */}


            <ScrollView horizontal={true} style={selectedCategory === "Sleep" ? styles.showScroll : styles.hideScroll} showsHorizontalScrollIndicator={false}>
              <Exercise id={Exercises[6].id} navigation={navigation} image={Exercises[6].image} title={Exercises[6].title} subTitle={Exercises[6].subTitle} videoFile={Exercises[6].videoFile} modalIcon={Exercises[6].modalIcon} iconHeight={Exercises[6].iconHeight} noFinishBell={Exercises[6].noFinishBell}/>
              <Exercise id={Exercises[10].id} navigation={navigation} image={Exercises[10].image} title={Exercises[10].title} subTitle={Exercises[10].subTitle} videoFile={Exercises[10].videoFile} />
            </ScrollView>
            <ScrollView horizontal={true} style={selectedCategory === "New" ? styles.showScroll : styles.hideScroll} showsHorizontalScrollIndicator={false}>
              <Exercise id={Exercises[11].id} navigation={navigation} image={Exercises[11].image} title={Exercises[11].title} subTitle={Exercises[11].subTitle} videoFile={Exercises[11].videoFile} modalIcon={Exercises[11].modalIcon} iconHeight={Exercises[11].iconHeight}/>
              <Exercise id={Exercises[13].id} navigation={navigation} image={Exercises[13].image} title={Exercises[13].title} subTitle={Exercises[13].subTitle} videoFile={Exercises[13].videoFile} />
              <Exercise id={Exercises[12].id} navigation={navigation} image={Exercises[12].image} title={Exercises[12].title} subTitle={Exercises[12].subTitle} videoFile={Exercises[12].videoFile} />
            </ScrollView>
            <ScrollView horizontal={true} style={selectedCategory === "Popular" ? styles.showScroll : styles.hideScroll} showsHorizontalScrollIndicator={false}>
              {/* {popular} */}
              {renderExercises(popular)}
            </ScrollView>
         
            
          
            {/* <ScrollView horizontal={true} style={{flexDirection: "row", marginLeft: 25}} showsHorizontalScrollIndicator={false}>
              {
                selectedCategory === "Sleep" ? recommendedToday
                : selectedCategory === "New" ? popular
                : selectedCategory === "Popular" ? popular : null
              }
            </ScrollView> */}

          
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
  },
  showScroll: {
    flexDirection: "row", 
    marginLeft: 25
  },
  hideScroll: {
    flexDirection: "row", 
    marginLeft: 25,
    display: "none"
  }
})