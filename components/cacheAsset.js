import React, { useState, useEffect } from 'react';
import * as FileSystem from 'expo-file-system';
import firebase from 'firebase';
const storage = firebase.storage();

export default function Exercise({ image, videoFile }) {
  const [cachedImg, setCachedImg] = useState();
  const [cachedVideo, setCachedVideo] = useState();

  // Run it on mount
  useEffect(() => {
    cacheAsset(image);
    cacheAsset(videoFile);
  }, [])

  const cacheAsset = async asset => {
    const fileType = asset && await asset.match(/[^.]+$/g)[0] === "png" ? "image" : 
                                    asset.match(/[^.]+$/g)[0] === "mp4" ? "video" : 
                                    "unknown file type!";

    // example filepath: cacheDirectory/yinyang.png
    const path = `${FileSystem.cacheDirectory}${asset}`;
    const file = await FileSystem.getInfoAsync(path);

    // If file was already cached, read from previous cache:
    if (file.exists) {
      if (fileType == "image") {
        setCachedImg( {uri: file.uri} );
      } else if (fileType == "video") {
        setCachedVideo( {uri: file.uri} );
      } else return; // Don't proceed further for unknown file type
      return; 
    }

    // else if it wasn't cached, get the download URL for the new file from Firebase Storage
    const folder = fileType == "image" ? "exercise-images" : fileType == "video" ? "videos" : null;
    const ref = storage.ref(`/${folder}/${asset}`);
    const uri = await ref.getDownloadURL();
    
    // Download that new file into the device's cache using the FileSystem API
    const newAsset = await FileSystem.downloadAsync(uri, path);
    if (fileType == "image")      setCachedImg( {uri: newAsset.uri} );
    else if (fileType == "video") setCachedVideo( {uri: newAsset.uri} );
    else return;
  }

  return (
    <TouchableOpacity onPress={() => 
      navigation.navigate("ExerciseVideo", { cachedVideo })}>
      <Image 
        source={ cachedImg }
        style={{ height: height * 0.4, width: width * 0.9 }}
        resizeMode="contain"
      />
    </TouchableOpacity> 
  )
};