import React, { useState, useEffect, useContext } from 'react';
import { Text, View, Image, Dimensions, StyleSheet } from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { AuthContext } from '../components/context';

import { useFonts } from 'expo-font';
import { AppLoading } from 'expo';

import firebase from 'firebase';


export default function Exercise({ uniqueSize, image, title, subTitle, navigation, onPress, videoFile, modalIcon, iconHeight, id, autoCountDown, customWidth, customVolume, isLiked }) {
  
  const { userToken, userFavs } = useContext(AuthContext);

  const [liked, setLiked] = useState(false);

  const currUser = firebase.auth().currentUser;
  const favRef = currUser ? firebase.database().ref(currUser.uid).child('favorites') : null;

  // console.log("is Liked:", isLiked)
  // console.log("user Favs:", userFavs)

  let favIds = [];
  
  useEffect(() => {
    if (currUser) {
      favRef.on("value", snapshot => {
        snapshot.forEach(node => {
          favIds.push(node.val().id)
        })
      })
      setLiked(favIds.includes(id));
    }
    // console.log(`fav ids: ${favIds} includes id: ${id} = ${favIds.includes(id)} from Exercise.jsx!`);

    // return () => favRef.off()
  },)


  return ( 
    uniqueSize == "topBanner" ? 
    <TouchableOpacity onPress={() => navigation.navigate("ExerciseVideo", { videoFile, modalIcon, iconHeight, id, autoCountDown: autoCountDown || null })}>
      <Image 
        source={image}
        style={{ height: height * 0.4, width: width * 0.9, }}
        resizeMode="contain"
      />
    </TouchableOpacity> 
    
    : 

    uniqueSize == "horizontal" ? 
    <TouchableOpacity onPress={() => navigation.navigate("ExerciseVideo", { videoFile, modalIcon, iconHeight, id, autoCountDown: autoCountDown || null })}>
      <Image 
        source={image} 
        style={{width: width * customWidth, height: height * 0.17 }}
        resizeMode="contain" 
      />
    </TouchableOpacity>
    
    : 

    <View style={styles.imageSmallContainer}>
      <TouchableOpacity onPress={() => navigation.navigate("ExerciseVideo", { videoFile, modalIcon, iconHeight, id, autoCountDown: autoCountDown || null, customVolume: customVolume || null })}>
        <Image source={image} style={styles.imageSmall} resizeMode="contain"/>
        {liked ? 
        <Image source={require('../assets/exercises-images/liked-heart.png')} style={styles.heart} resizeMode="contain"/>
        : null}
      </TouchableOpacity>
      <Text style={styles.exerciseTitleFont}>{title}</Text>
      <Text style={styles.exerciseSubTitleFont}>{subTitle}</Text>
    </View>
  )
}


const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  imageSmall: {
    width: width * 0.44,
    height: height * 0.35,
    // borderWidth: 1, 
  },
  imageSmallContainer: {
    // borderWidth: 1, 
    // width: 185,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 25
  },
  exerciseTitleFont: {
    fontFamily: "Assistant-SemiBold",
    fontSize: 18,
  },
  exerciseSubTitleFont: {
    fontFamily: "Assistant-SemiBold",
    fontSize: 14,
    color: "#737373"
  },
  heart: {
    height: 26,
    width: 26,
    position: "absolute",
    bottom: "13%",
    right: "18%"
  }
}) 