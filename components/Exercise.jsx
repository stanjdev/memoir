import React, { useState, useEffect } from 'react';
import { Text, View, Image, Dimensions, StyleSheet } from 'react-native';
const { width, height } = Dimensions.get('window');
import { TouchableOpacity, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import * as FileSystem from 'expo-file-system';
import firebase from 'firebase';


export default function Exercise({ uniqueSize, uniqueImgEvening, image, gif, title, subTitle, navigation, videoFile, modalIcon, iconHeight, id, autoCountDown, customWidth, customVolume, isLiked, noFinishBell, notSignedIn }) {
  const currentHour = new Date().getHours();
  const [liked, setLiked] = useState(false);
  const currUser = firebase.auth().currentUser;
  const favRef = currUser && firebase.database().ref(currUser.uid).child('favorites');

  useEffect(() => {
    updateLiked();
  })

  let favIds = [];
  const updateLiked = () => {
    if (currUser) {
      favRef.on("value", snapshot => {
        snapshot.forEach(node => {
          favIds.push(node.val().id)
        })
      })
    }
    setLiked(favIds.includes(id) || isLiked);
  };


  /* CACHE ASSET */
  useEffect(() => {
    cacheAsset(image);
    cacheAsset(videoFile);
  }, [])
  
  const storage = firebase.storage();
  const [cachedImg, setCachedImg] = useState();
  const [cachedVideo, setCachedVideo] = useState();

  const cacheAsset = async asset => {
    const fileType = asset && await asset.match(/[^.]+$/g)[0] === "png" ? "image" : 
                              asset.match(/[^.]+$/g)[0] === "gif" ? "image" : 
                              asset.match(/[^.]+$/g)[0] === "mp4" ? "video" : "unknown file type!";

    // Example: cacheDirectory/flowers.png
    const path = `${FileSystem.cacheDirectory}${asset}`;
    const file = await FileSystem.getInfoAsync(path);

    if (file.exists) {
      // If it was already cached, read from the cache
      if (fileType == "image")      setCachedImg( {uri: file.uri} );
      else if (fileType == "video") setCachedVideo( {uri: file.uri} );
      else return;
      return; 
    } else {
      // Else, if it wasn't cached, getDownloadURL from Firebase and download/cache using FileSystem
      const folder = fileType == "image" || fileType == "gif" ? "exercise-images" : fileType == "video" ? "videos" : null;
      const ref = storage.ref(`/${folder}/${asset}`);
      const uri = await ref.getDownloadURL();
      const newAsset = await FileSystem.downloadAsync(uri, path);
      if (fileType == "image")      setCachedImg( {uri: newAsset.uri} );
      else if (fileType == "video") setCachedVideo( {uri: newAsset.uri} );
      else return;
      return;
    }
  };


  const JumboExercise = () => (
    <TouchableWithoutFeedback onPress={() => notSignedIn ? console.log("not signed in!") : 
      navigation.navigate("ExerciseVideo", { 
        id, 
        videoFile, 
        cachedVideo, 
        modalIcon, 
        iconHeight, 
        autoCountDown: autoCountDown || null, 
        customVolume: customVolume || null, 
        noFinishBell: noFinishBell || null, 
        modalText: currentHour >= 20 || currentHour <= 3 ? "eveningWindDown" : "dailyExhale" 
      })}>
      <Image 
        source={ cachedImg }
        style={{ height: height * 0.4, width: width * 0.9, }}
        resizeMode="contain"
      />
    </TouchableWithoutFeedback> 
  );

  const HorizontalExercise = () => (
    <TouchableWithoutFeedback onPress={() => notSignedIn ? console.log("not signed in!") : 
      navigation.navigate("ExerciseVideo", { 
        id, 
        videoFile, 
        cachedVideo, 
        modalIcon, 
        iconHeight, 
        autoCountDown: autoCountDown || null, 
        noFinishBell: noFinishBell || null 
      })}>
      <Image 
        source={ cachedImg }
        style={{width: width * customWidth, height: height * 0.17 }}
        resizeMode="contain" 
      />
    </TouchableWithoutFeedback>
  );

  const ThumbnailExercise = () => (
    <View style={styles.imageSmallContainer}>
      <TouchableWithoutFeedback onPress={() => notSignedIn ? console.log("not signed in!") : 
        navigation.navigate("ExerciseVideo", { 
          id, 
          videoFile, 
          cachedVideo, 
          modalIcon, 
          iconHeight, 
          autoCountDown: autoCountDown || null, 
          customVolume: customVolume || null, 
          noFinishBell: noFinishBell || null, 
          uniqueImgEvening: uniqueImgEvening || null 
        })}>
        <Image 
          source={ cachedImg }
          style={gif ? styles.gifSmall : styles.imageSmall } 
          resizeMode="contain"
        />
        {liked ? 
        <Image source={require('../assets/exercises-images/liked-heart.png')} style={styles.heart} resizeMode="contain"/>
        : null}
      </TouchableWithoutFeedback>
      <Text style={styles.exerciseTitleFont}>{title}</Text>
      <Text style={styles.exerciseSubTitleFont}>{subTitle}</Text>
    </View>
  );


  return ( 
    uniqueSize == "topBanner" ? <JumboExercise /> 
    : 
    uniqueSize == "horizontal" ? <HorizontalExercise /> 
    : 
    <ThumbnailExercise />
  )
};


const styles = StyleSheet.create({
  imageSmall: {
    width: width * 0.44,
    height: height * 0.35,
  },
  gifSmall: {
    width: width * 0.43,
    height: height * 0.31,
    marginBottom: 25,
    marginTop: 25
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
});