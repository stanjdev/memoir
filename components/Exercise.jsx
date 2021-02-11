import React, { useState, useEffect, useContext } from 'react';
import { Text, View, Image, Dimensions, StyleSheet } from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { AuthContext } from '../components/context';

import { useFonts } from 'expo-font';

import shorthash from 'shorthash';
import * as FileSystem from 'expo-file-system';


import firebase from 'firebase';

import AsyncStorage from '@react-native-async-storage/async-storage';


export default function Exercise({ uniqueSize, uniqueImgEvening, image, gif, title, subTitle, navigation, onPress, videoFile, modalIcon, iconHeight, id, autoCountDown, customWidth, customVolume, isLiked, noFinishBell, notSignedIn }) {
  
  const { userToken, userFavs } = useContext(AuthContext);

  const [liked, setLiked] = useState(false);

  const currUser = firebase.auth().currentUser;
  const favRef = currUser && firebase.database().ref(currUser.uid).child('favorites');

  // console.log("is Liked:", isLiked)
  // console.log("user Favs:", userFavs)

  
  let favIds = [];
  const updateLiked = () => {
    if (currUser) {
      favRef.on("value", snapshot => {
        snapshot.forEach(node => {
          favIds.push(node.val().id)
        })
        // console.log(favIds) // array of favs
      })
    }
    setLiked(favIds.includes(id) || isLiked);
  }

  const toggleLikedIcon = async (favIds) => {
    setLiked(favIds.includes(id));
  }

  // console.log(favIds.includes(id))

  useEffect(() => {
    updateLiked();
    // console.log(favIds.includes(id))
    // setLiked(favIds.includes(id));
    
    // console.log(id)
    // console.log("rerender!")

    // console.log(`fav ids: ${favIds} includes id: ${id} = ${favIds.includes(id)} from Exercise.jsx!`);

    // return () => favRef.off()
  })

  // useEffect(() => {
  //   toggleLikedIcon(favIds);
  // }, [updateLiked])




  const [imgUrl, setImgUrl] = useState();
  const [videoUrl, setVideoUrl] = useState();

  const storage = firebase.storage();

  const getImg = async () => {
    if (image && !imgUrl) {
      let storedImgUrl = await AsyncStorage.getItem(image);
      if (storedImgUrl == null) {
        const ref = storage.ref(`/exercise-images/${image}`);
        const url = await ref.getDownloadURL();
        await AsyncStorage.setItem(image, url);
        console.log("downloaded the image link and saved into AsyncStorage!", url)
      }
      console.log("stored Img Url:", storedImgUrl)
      setImgUrl(storedImgUrl);
    }
  };

  const getVid = async () => {
    if (videoFile && !videoUrl) {
      let storedVideoUrl = await AsyncStorage.getItem(videoFile);
      if (storedVideoUrl == null) {
        const videoRef = storage.ref(`/videos/${videoFile}`);
        const url = await videoRef.getDownloadURL();
        AsyncStorage.setItem(videoFile, url);
        console.log("downloaded the video link and saved into AsyncStorage!", url)
      }
      // console.log("stored Video Url:", storedVideoUrl)
      setVideoUrl(storedVideoUrl);
    }
  };


  const [cachedImg, setCachedImg] = useState();
  const [cachedVideo, setCachedVideo] = useState();


  const cacheAsset = async asset => {
    // console.log(asset)
    const fileType = asset && await asset.match(/[^.]+$/g)[0] === "png" ? "image" : 
                              asset.match(/[^.]+$/g)[0] === "gif" ? "image" : 
                              asset.match(/[^.]+$/g)[0] === "mp4" ? "video" : "unknown file type!";

    // cacheDirectory/flowers.png
    const path = `${FileSystem.cacheDirectory}${asset}`;
    // console.log("path", path);
    const file = await FileSystem.getInfoAsync(path);

    // If it was already cached, read from previous cache:
    if (file.exists) {
      // console.log(`Read ${fileType} from cache!`);
      if (fileType == "image") {
        setCachedImg( {uri: file.uri} );
      } else if (fileType == "video") {
        setCachedVideo( {uri: file.uri} );
      } else return;
      return; 
    }

    // else, if it wasn't cached, download a cached copy
    const folder = fileType == "image" || fileType == "gif" ? "exercise-images" : fileType == "video" ? "videos" : null;
    const ref = storage.ref(`/${folder}/${asset}`);
    const uri = await ref.getDownloadURL();
    // console.log(`downloading ${fileType} to cache! uri: ${uri}`);
    
    const newAsset = await FileSystem.downloadAsync(uri, path);
    console.log(`Finished downloading ${fileType} to cache! newAsset: ${newAsset.uri}`);
    // alert(`Finished downloading ${fileType} to cache! newAsset: ${newAsset.uri}`);
    if (fileType == "image")      setCachedImg( {uri: newAsset.uri} );
    else if (fileType == "video") setCachedVideo( {uri: newAsset.uri} );
    else return;
  }



  useEffect(() => {
    // checkAsync();
    // importData();
    // getData();
    
    cacheAsset(image);
    cacheAsset(videoFile);
    
    // getImg();
    // getVid();
    // console.log(imgUrl);
    // console.log(videoUrl);

    // console.log(videoName)
  }, [])








  async function checkAsync () {
    const allKeys = await AsyncStorage.getAllKeys();
    const result = await AsyncStorage.multiGet(allKeys);
    // console.log(allAsyncStorage)
    return result.map(req => JSON.parse(req)).forEach(console.log);
  }

  const importData = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const result = await AsyncStorage.multiGet(keys);
  
      return result.map(req => JSON.parse(req)).forEach(console.log);
    } catch (error) {
      console.error(error)
    }
  }
  
  const getData = async () => {
    try {
      await AsyncStorage.getAllKeys().then(async keys => {
        await AsyncStorage.multiGet(keys).then(key => {
          key.forEach(data => {
            console.log(data[1]); //values
          });
        });
      });
    } catch (error) {
      Alert.alert("Couldn't load data", error);
    }
  };


  const currentHour = new Date().getHours();


  return ( 
    uniqueSize == "topBanner" ? 
    <TouchableOpacity onPress={() => notSignedIn ? console.log("not signed in!") : navigation.navigate("ExerciseVideo", { videoFile, videoUrl, cachedVideo, modalIcon, iconHeight, id, autoCountDown: autoCountDown || null, customVolume: customVolume || null, noFinishBell: noFinishBell || null, modalText: currentHour >= 20 || currentHour <= 3 ? "eveningWindDown" : "dailyExhale" })}>
      <Image 
        // source={{uri: imgUrl}}
        source={ cachedImg }
        style={{ height: height * 0.4, width: width * 0.9, }}
        resizeMode="contain"
      />
    </TouchableOpacity> 
    
    : 

    uniqueSize == "horizontal" ? 
    <TouchableOpacity onPress={() => notSignedIn ? console.log("not signed in!") : navigation.navigate("ExerciseVideo", { videoFile, videoUrl, cachedVideo, modalIcon, iconHeight, id, autoCountDown: autoCountDown || null, noFinishBell: noFinishBell || null })}>
      <Image 
        // source={{uri: imgUrl}} 
        source={ cachedImg }
        style={{width: width * customWidth, height: height * 0.17 }}
        resizeMode="contain" 
      />
    </TouchableOpacity>
    
    : 

    <View style={styles.imageSmallContainer}>
      <TouchableOpacity onPress={() => notSignedIn ? console.log("not signed in!") : navigation.navigate("ExerciseVideo", { videoFile, videoUrl, cachedVideo, modalIcon, iconHeight, id, autoCountDown: autoCountDown || null, customVolume: customVolume || null, noFinishBell: noFinishBell || null, uniqueImgEvening: uniqueImgEvening || null })}>
        <Image 
          // source={{uri: imgUrl}} 
          source={ cachedImg }
          style={gif ? styles.gifSmall : styles.imageSmall } 
          resizeMode="contain"
        />
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
  gifSmall: {
    // borderWidth: 1, 
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
}) 

