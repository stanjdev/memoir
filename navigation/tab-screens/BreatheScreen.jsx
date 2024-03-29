import React, { useEffect, useState, useContext } from 'react';
import { Text, View, StatusBar, Dimensions, StyleSheet, TouchableOpacity } from 'react-native';
const { width, height } = Dimensions.get('window');
import { AuthContext } from '../../components/context';
import { useIsFocused } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';
import { useFonts } from 'expo-font';
import AppLoading from 'expo-app-loading';
import Exercise from '../../components/Exercise';
import { Exercises } from '../../model/exercise-store';

import firebase from 'firebase';

export default function BreatheScreen({navigation}) {
  const isFocused = useIsFocused();

  const [isReady, setIsReady] = useState(false);

  let [fontsLoaded] = useFonts({
    'Assistant': require('../../assets/fonts/Assistant/Assistant-VariableFont_wght.ttf'),
    'Assistant-Regular': require('../../assets/fonts/Assistant/static/Assistant-Regular.ttf'),
    'Assistant-SemiBold': require('../../assets/fonts/Assistant/static/Assistant-SemiBold.ttf'),
  });

  const currentHour = new Date().getHours();

  const [selectedCategory, setSelectedCategory] = useState(currentHour >= 20 || currentHour <= 3 ? "Sleep" : "New");
  const categoryOptions = {
    "Sleep": "Sleep",
    "New": "New",
    "Popular": "Popular",
  };
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
  };

  const handleSelectedOption = (optionName) => {
    setSelectedCategory(optionName)
  }

  const toggleSelected = (optionName) => {
    return selectedCategory === optionName ? styles.selected : styles.unSelected;
  }

  const toggleUnderline = (optionName) => {
    return selectedCategory === optionName ? styles.underline : null;
  }


  /* === FIREBASE === */
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
          setFavIds(arr => [...arr, node.val()])
          // console.log(favIds)
          // console.log(favIds.includes(2))
        })
      })
    }
  }, [])


  /* 
  Dailys:
  1-5, 7, 11-15, 17-24

  Evenings:
  6, 10, 12, 16, 24, 25

  New: 
  7, 11, 12, 13, 14, 15, 17, 18, 19, 20, 21, 22, 23, 24, 
  */

  // this way doesn't shuffle it every time you move from tab to tab
  const [dailyExhales, setDailyExhales] = useState([1, 2, 3, 4, 5, 7, 20]);
  const [eveningWindDowns, setEveningWindDowns] = useState([6, 10, 12, 6, 16, 24, 25]);
  const [recommendedToday, setRecommendedToday] = useState();
  const [popular, setPopular] = useState();
  const [sleepExercises, setSleepExercises] = useState();
  const [newExercises, setNewExercises] = useState();

  // currentHour >= 20 || currentHour <= 3 ? 

  useEffect(() => {
    // shuffle([1, 2, 3, 4, 5, 7], setDailyExhales);
    currentHour >= 20 || currentHour <= 3 ? 
      shuffle([1, 2, 3, 4, 5, 6, 10, 11, 12, 13], setRecommendedToday) : 
      shuffle([1, 2, 3, 4, 5, 7, 11, 12, 13, 14, 15, 17, 18, 19, 20, 21, 22, 23, 24], setRecommendedToday);
    shuffle([6, 10, 11, 12, 13, 14, 17, 18, 19], setPopular);
    shuffle([6, 10, 12, 16, 24, 25], setSleepExercises);
    shuffle([7, 11, 12, 13, 14, 15, 17, 18, 19, 20, 21, 22, 23, 24,], setNewExercises);
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
  };


  function renderExercises(array) {
    for (let i = 0; i < 5; i++) {
      if (Exercises[array[i]].color == Exercises[array[i + 1]].color || 
          Exercises[array[i]].shape == Exercises[array[i + 1]].shape) {
        array.push(...array.splice(i + 1, 1));
      }
    };

    array = array.slice(0, 5);
    return array.map(x => 
      <Exercise 
        id={Exercises[x].id} 
        key={Exercises[x].id}
        navigation={navigation} 
        image={Exercises[x].image || null} 
        uniqueImgEvening={Exercises[x].uniqueImgEvening || null}
        gif={Exercises[x].gif || undefined}
        title={Exercises[x].title} 
        subTitle={Exercises[x].subTitle} 
        videoFile={Exercises[x].videoFile || null} 
        modalIcon={Exercises[x].modalIcon || null} 
        iconHeight={Exercises[x].iconHeight || null} 
        customVolume={Exercises[x].customVolume || null}
        noFinishBell={Exercises[x].noFinishBell || null}
        isLiked={favIds.includes(x)}
      />
    )
  };

  
  // weekly reshuffle and pick solution for now.
  function renderDailyExhale(array) {
    const randIdx = Math.floor(Math.random() * (array.length - 1));
    let today = new Date().getDay();
    const chosenExNum = array[today];
    // console.log("chosenDailyExNum:", chosenExNum);

    return <Exercise 
            id={Exercises[chosenExNum].id} 
            key={Exercises[chosenExNum].id}
            navigation={navigation} 
            uniqueSize={Exercises[chosenExNum].uniqueImg && "topBanner"}
            image={currentHour >= 20 || currentHour <= 3 ? Exercises[chosenExNum].uniqueImgEvening : Exercises[chosenExNum].uniqueImg || null} 
            gif={Exercises[chosenExNum].gif || undefined}
            title={Exercises[chosenExNum].title} 
            subTitle={Exercises[chosenExNum].subTitle} 
            videoFile={Exercises[chosenExNum].videoFile || null} 
            modalIcon={Exercises[chosenExNum].modalIcon || null} 
            iconHeight={Exercises[chosenExNum].iconHeight || null} 
            customVolume={Exercises[chosenExNum].customVolume || null}
            isLiked={favIds.includes(chosenExNum)}
            autoCountDown={"2m"}
          />
  };


  return(
    <ScrollView style={{backgroundColor: "white"}}>
      {isFocused ? <StatusBar hidden={false} barStyle="dark-content"/> : null} 
      {
        isReady ? 
        <View>

          <View style={{marginTop: height > 850 ? 60 : 50, justifyContent: "center", alignItems: "center"}}>
            {/* <Exercise uniqueSize="topBanner" navigation={navigation} image={Exercises[7].image} videoFile={Exercises[7].videoFile} modalIcon={Exercises[7].modalIcon} id={Exercises[7].id} autoCountDown={"2m"}/>  */}
            { 
            currentHour >= 20 || currentHour <= 3 ? 
            renderDailyExhale(eveningWindDowns)
            : renderDailyExhale(dailyExhales)
            }
          </View>
          
          <View style={{marginLeft: 25, marginTop: 7, marginBottom: height < 700 ? 12 : 3}}>
            <Text style={{fontFamily: "Assistant-SemiBold", fontSize: width < 350 ? 22 : 23 }}>Recommended For You</Text>
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
            {/* {
              currentHour >= 20 || currentHour <= 3 ? 
              <Exercise uniqueSize="horizontal" navigation={navigation} image={Exercises[8].uniqueImg} videoFile={Exercises[8].videoFile} modalIcon={Exercises[8].modalIcon} id={Exercises[8].id} autoCountDown={"30m"} customWidth={Exercises[8].customWidth} noFinishBell={Exercises[8].noFinishBell}/> 
              : null
            } */}
            <Exercise uniqueSize="horizontal" navigation={navigation} image={Exercises[8].uniqueImg} videoFile={Exercises[8].videoFile} modalIcon={Exercises[8].modalIcon} id={Exercises[8].id} autoCountDown={Exercises[8].autoCountDown} customWidth={Exercises[8].customWidth} iconHeight={Exercises[8].iconHeight} noFinishBell={Exercises[8].noFinishBell}/> 
          </View>
          <View style={{alignItems: "center", }}>
            <Exercise uniqueSize="horizontal" navigation={navigation} image={Exercises[9].uniqueImg} videoFile={Exercises[9].videoFile} modalIcon={Exercises[9].modalIcon} id={Exercises[9].id} autoCountDown={Exercises[9].autoCountDown} customWidth={Exercises[9].customWidth} iconHeight={Exercises[9].iconHeight} /> 
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
              {/* <Exercise id={Exercises[6].id} navigation={navigation} image={Exercises[6].image} title={Exercises[6].title} subTitle={Exercises[6].subTitle} videoFile={Exercises[6].videoFile} modalIcon={Exercises[6].modalIcon} iconHeight={Exercises[6].iconHeight} noFinishBell={Exercises[6].noFinishBell}/>
              <Exercise id={Exercises[10].id} navigation={navigation} image={Exercises[10].image} title={Exercises[10].title} subTitle={Exercises[10].subTitle} videoFile={Exercises[10].videoFile} /> */}
              {renderExercises(sleepExercises)}
            </ScrollView>
            <ScrollView horizontal={true} style={selectedCategory === "New" ? styles.showScroll : styles.hideScroll} showsHorizontalScrollIndicator={false}>
              {/* <Exercise id={Exercises[11].id} navigation={navigation} image={Exercises[11].image} title={Exercises[11].title} subTitle={Exercises[11].subTitle} videoFile={Exercises[11].videoFile} modalIcon={Exercises[11].modalIcon} iconHeight={Exercises[11].iconHeight}/>
              <Exercise id={Exercises[13].id} navigation={navigation} image={Exercises[13].image} title={Exercises[13].title} subTitle={Exercises[13].subTitle} videoFile={Exercises[13].videoFile} />
              <Exercise id={Exercises[12].id} navigation={navigation} image={Exercises[12].image} title={Exercises[12].title} subTitle={Exercises[12].subTitle} videoFile={Exercises[12].videoFile} /> */}
              {renderExercises(newExercises)}
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
          startAsync={() => console.log("startAsync AppLoading BreatheScreen!")}
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
    fontSize: width < 350 ? 22 : 23, 
    color: "black",
  },
  unSelected: {
    fontFamily: "Assistant-SemiBold", 
    fontSize: width < 350 ? 22 : 23, 
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
});