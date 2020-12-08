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





export default function FavoritesScreen({navigation}) {
  const isFocused = useIsFocused();
  
  let [fontsLoaded] = useFonts({
    'Assistant': require('../../assets/fonts/Assistant/Assistant-VariableFont_wght.ttf'),
    'Assistant-Regular': require('../../assets/fonts/Assistant/static/Assistant-Regular.ttf'),
    'Assistant-SemiBold': require('../../assets/fonts/Assistant/static/Assistant-SemiBold.ttf'),
  });
  
  const { userToken, userFirstName } = React.useContext(AuthContext)
  
  const [showPopUp, setShowPopup] = React.useState(false);
  useEffect(() => {
    if (!userToken) {
      setTimeout(() => {
        isFocused ? setShowPopup(true) : setShowPopup(false)
      }, 500);
    }
  }, [isFocused])




  const [favs, setFavs] = useState([]);
  let favIds = [];

  const getFavorites = async() => {
    let currUser = await fireApp.auth().currentUser;

    const favRef = fireApp.database().ref(currUser.uid).child('favorites');
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
        
          data.forEach(child => {
            let exId = child.val().id;
            let key = child.key;
            // console.log(favIds);
            // console.log(exId)
            // console.log(key)
            
            // favs.push(exId)
            
            console.log(favs.length)
            // if (favIds.length !== favs.length) {
              setFavs(favs => [...favs, 
                <Exercise key={key} id={Exercises[exId].id} navigation={navigation} image={Exercises[exId].image} title={Exercises[exId].title} subTitle={Exercises[exId].subTitle} videoFile={Exercises[exId].videoFile} modalIcon={Exercises[exId].modalIcon} iconHeight={Exercises[exId].iconHeight} />
              ])
              // favs.push(
              //   <Exercise key={key} id={Exercises[exId].id} navigation={navigation} image={Exercises[exId].image} title={Exercises[exId].title} subTitle={Exercises[exId].subTitle} videoFile={Exercises[exId].videoFile} modalIcon={Exercises[exId].modalIcon} iconHeight={Exercises[exId].iconHeight} />
              // )
            // }
          })
      })
    }
  }

  useEffect(() => {
    if (userToken) {
      getFavorites();
    } else if (favs.length < 1) {
      setFavs([ 
        <View key={"noFavs"}>
          <View style={{ backgroundColor: "lavender", borderRadius: 7, height: height, width: width, marginLeft: -25}}>
            <Text style={{textAlign: "center"}}>No Favorites</Text>
          </View>
        </View>
      ])
    } else {
      setFavs([ 
        <View key={"noFavs"}>
          <View style={{ backgroundColor: "lavender", borderRadius: 7, height: height, width: width, marginLeft: -25}}>
            <Text style={{textAlign: "center"}}>No Favorites</Text>
          </View>
          {/* <Exercise image={require("../../assets/exercises-images/forest-orange.png")} title="Ride the Wave" subTitle="Slow Deep Breathing"/>
          <Exercise image={require("../../assets/exercises-images/forest-orange.png")} title="Ride the Wave" subTitle="Slow Deep Breathing"/>
          <Exercise image={require("../../assets/exercises-images/forest-orange.png")} title="Ride the Wave" subTitle="Slow Deep Breathing"/>
          <Exercise image={require("../../assets/exercises-images/forest-orange.png")} title="Ride the Wave" subTitle="Slow Deep Breathing"/> */}
        </View>
      ])
      // favs.push(
      //   <View key={"noFavs"}>
      //     <Text>No Favs!</Text>
      //     <Text>No Favs!</Text>
      //     <Exercise image={require("../../assets/exercises-images/forest-orange.png")} title="Ride the Wave" subTitle="Slow Deep Breathing"/>
      //     <Exercise image={require("../../assets/exercises-images/forest-orange.png")} title="Ride the Wave" subTitle="Slow Deep Breathing"/>
      //   </View>
      // )
    }
    console.log(`favorites: ${favs}`)
  }, [userToken])


  // function renderFavs() {
  //   // console.log(favs)
  //   return favs.map(fav => fav);
  // }



  return (
    <View>
      <ScrollView style={{backgroundColor: "white"}} scrollEnabled={userToken ? true : false}>
        {isFocused ? <StatusBar barStyle="dark-content" hidden={false}/> : null}
        {fontsLoaded ?

        <View style={{marginTop: 50, }}>
          <Text style={{textAlign: "center", fontSize: 23, fontFamily: "Assistant-SemiBold", color: "#535353"}}>{userFirstName ? String(userFirstName).charAt(0).toUpperCase() + String(userFirstName).slice(1) + "'s Favorites" : "Favorites"}</Text>
          <View style={{ marginLeft: Math.min(5, width * 0.05) }}>
            <View style={{flex: 1, flexDirection: "row", justifyContent: "flex-start", alignContent: "stretch", padding: 20, flexWrap: "wrap", }}>
            
              {favs}

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



