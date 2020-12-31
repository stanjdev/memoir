import React, { useEffect, useState } from 'react';
import { Text, View, StatusBar, Button, Alert, Image, Dimensions, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import { AuthContext } from '../../components/context';
import Exercise from '../../components/Exercise';
import { useIsFocused } from '@react-navigation/native';

import { ScrollView } from 'react-native-gesture-handler';

import { useFonts } from 'expo-font';
// import { AppLoading } from 'expo';

const { width, height } = Dimensions.get('window');

import CreateAccountPopup from '../../components/CreateAccountPopup';

import { Exercises } from '../../model/exercise-store';

import { fireApp } from '../../firebase';
import '@firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';




export default function FavoritesScreen({navigation}) {
  const isFocused = useIsFocused();
  
  let [fontsLoaded] = useFonts({
    'Assistant': require('../../assets/fonts/Assistant/Assistant-VariableFont_wght.ttf'),
    'Assistant-Regular': require('../../assets/fonts/Assistant/static/Assistant-Regular.ttf'),
    'Assistant-SemiBold': require('../../assets/fonts/Assistant/static/Assistant-SemiBold.ttf'),
  });
  
  const { userToken, userFirstName } = React.useContext(AuthContext)
  
  const [showPopUp, setShowPopup] = React.useState(false);

  const currentUser = fireApp.auth().currentUser;
  // console.log(currentUser && currentUser.isAnonymous);

  useEffect(() => {
    if (currentUser && currentUser.isAnonymous || !userToken) {
      setTimeout(() => {
        isFocused ? setShowPopup(true) : setShowPopup(false)
      }, 500);
    } else {
      setShowPopup(false);
    }
  }, [isFocused])





  const [favs, setFavs] = useState([]);
  let favIds = [];

  const currUser = fireApp.auth().currentUser;
  
  const getFavorites = async() => {

    const favRef = currUser && fireApp.database().ref(currUser.uid).child('favorites');
    // logged in check
    if (currUser !== null) {
      
      favRef.on("value", snapshot => {
        snapshot.forEach(node => {
          favIds.push(node.val().id)
        })
      })

      // if (favs.length > 0) {
      //   setFavs([]);
      // }

      favRef.on('value', function(data) {
        setFavs([]);
        // data.forEach(child => console.log(child))
        // data.forEach(child => setFavs([...favs, child.val()]));
        
        // console.log(data.toJSON())
        let favsArray = [];
          data.forEach(child => {
            let exId = child.val().id;
            let key = child.key;
            // console.log(favIds);
            // console.log(exId)
            // console.log(key)
            
            // favs.push(exId)
            
            console.log("favs length:", favs.length)
            // if (favIds.length !== favs.length) {
            setFavs(favs => [...favs, 
              <Exercise 
                key={key} 
                id={Exercises[exId].id}
                notSignedIn={currUser.isAnonymous}
                navigation={navigation}
                image={Exercises[exId].image}
                gif={Exercises[exId].gif || undefined}
                title={Exercises[exId].title}
                subTitle={Exercises[exId].subTitle} 
                videoFile={Exercises[exId].videoFile} 
                modalIcon={Exercises[exId].modalIcon} 
                iconHeight={Exercises[exId].iconHeight} 
                autoCountDown={Exercises[exId].autoCountDown} 
                customVolume={Exercises[exId].customVolume || null} 
                noFinishBell={Exercises[exId].noFinishBell || null} 
              />
            ])

            
            // favsArray.push(
            //   <Exercise 
            //     key={key} 
            //     id={Exercises[exId].id}
            //     notSignedIn={currUser.isAnonymous}
            //     navigation={navigation}
            //     image={Exercises[exId].image}
            //     gif={Exercises[exId].gif || undefined}
            //     title={Exercises[exId].title}
            //     subTitle={Exercises[exId].subTitle} 
            //     videoFile={Exercises[exId].videoFile} 
            //     modalIcon={Exercises[exId].modalIcon} 
            //     iconHeight={Exercises[exId].iconHeight} 
            //     autoCountDown={Exercises[exId].autoCountDown} 
            //     customVolume={Exercises[exId].customVolume || null} 
            //     noFinishBell={Exercises[exId].noFinishBell || null} 
            //   />
            // )
            // setFavs(favsArray);


              // favs.push(
              //   <Exercise key={key} id={Exercises[exId].id} navigation={navigation} image={Exercises[exId].image} title={Exercises[exId].title} subTitle={Exercises[exId].subTitle} videoFile={Exercises[exId].videoFile} modalIcon={Exercises[exId].modalIcon} iconHeight={Exercises[exId].iconHeight} />
              // )
            // }
          })
      })
    }
  }

  useEffect(() => {
    // if (userToken) {
      getFavorites();
    // } 
    
    // else if (favs.length < 1) {
    //   setFavs([ 
    //     <View key={"noFavs"}>
    //       <View style={{ backgroundColor: "lavender", borderRadius: 7, height: height, width: width, marginLeft: -25}}>
    //         <Text style={{textAlign: "center"}}>No Favorites</Text>
    //       </View>
    //     </View>
    //   ])
    // } else {
    //   setFavs([ 
    //     <View key={"noFavs"}>
    //       <View style={{ backgroundColor: "lavender", borderRadius: 7, height: height, width: width, marginLeft: -25, justifyContent: "center"}}>
    //         <Image source={require('../../assets/screen-icons/favorites-none-heart.png')} resizeMode="contain" style={{height: 56}} />
    //         <Text style={{textAlign: "center"}}>You have no favorites.</Text>
    //         <Text style={{textAlign: "center"}}>Tap the heart when viewing an exercise to add to this list.</Text>
    //       </View>
    //     </View>
    //   ])
    // }
    console.log(`favorites: ${favs}`)
  }, [userToken, currUser])


  // function renderFavs() {
  //   // console.log(favs)
  //   return favs.map(fav => fav);
  // }



  return (
    <View>
      <ScrollView style={{backgroundColor: "white", height: currentUser && !currentUser.isAnonymous ? height : height * 0.92}} scrollEnabled={userToken ? true : false}>
      <TouchableOpacity onPress={() => userToken ? navigation.goBack() : null} style={{position: "absolute", left: width * 0.02, top: height * 0.045, zIndex: 100, padding: 15}}>
        <Image source={require('../../assets/screen-icons/back-arrow.png')} style={{height: 20,}} resizeMode="contain"/>
      </TouchableOpacity>
        {isFocused ? <StatusBar barStyle="dark-content" hidden={false}/> : null}
        {fontsLoaded ?

        <View style={{marginTop: 50, }}>
          <Text style={{textAlign: "center", fontSize: 23, fontFamily: "Assistant-SemiBold", color: "#535353"}}>{userFirstName ? String(userFirstName).charAt(0).toUpperCase() + String(userFirstName).slice(1) + "'s Favorites" : "Favorites"}</Text>
          <View style={{ marginLeft: Math.min(5, width * 0.05) }}>
            <View style={{flex: 1, flexDirection: "row", justifyContent: "flex-start", alignContent: "stretch", padding: width * 0.05, flexWrap: "wrap", }}>
            
              {favs.length ? favs :
                <View style={{ borderRadius: 7, height: height * 0.9, width: width, marginLeft: -29, justifyContent: "center", alignItems: 'center', marginTop: -30}}>
                  <Image source={require('../../assets/screen-icons/favorites-none-heart.png')} resizeMode="contain" style={{height: 56}} />
                  <View style={{width: 255, height: 126, marginTop: 15}}>
                    <Text style={{textAlign: "center", fontFamily: "Assistant-Regular", fontSize: 23, color: "#535353"}}>You have no favorites.</Text>
                    <Text style={{textAlign: "center", fontFamily: "Assistant-Regular", fontSize: 23, color: "#535353", marginTop: 20}}>Tap the heart when viewing an exercise to add to this list.</Text>
                  </View>
                </View>
              }

              {/* {renderFavs()} */}
              
              {/* <Exercise image={require("../../assets/exercises-images/jungle-green.png")} title="Box Breathing" subTitle="4 Second Box Pattern"/>
              <Exercise image={require("../../assets/exercises-images/forest-orange.png")} title="Ride the Wave" subTitle="Slow Deep Breathing"/>
              <Exercise image={require("../../assets/exercises-images/breathe-4x.png")} title="Breathe for Focus" subTitle="Get in the Zone"/>
              <Exercise image={require("../../assets/exercises-images/minute-break-4x.png")} title="1 Minute Break" subTitle="60 Seconds of Zen"/>
              <Exercise image={require("../../assets/exercises-images/forest-dawn-4x.png")} title="Box Breathing" subTitle="4 Second Box Pattern"/>
              <Exercise image={require("../../assets/exercises-images/purple-4x.png")} title="Cosmos" subTitle="Relax with the Universe"/>
              <Exercise image={require("../../assets/exercises-images/redrock-4x.png")} title="1 Minute Break" subTitle="60 Seconds of Zen"/>
              <Exercise image={require("../../assets/exercises-images/aurora-4x.png")} title="Breathe for Focus" subTitle="Get in the Zone"/> */}

            </View>
          </View>

          </View>

        : null
        // <AppLoading />
        }
        
      </ScrollView>

      {showPopUp ? <CreateAccountPopup /> : null}

    </View>
  )
}



