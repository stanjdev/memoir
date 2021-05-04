import * as FileSystem from 'expo-file-system';
// import firebase from 'firebase';
import { fireApp } from '../firebase';

const storage = fireApp.storage();


export const cacheAsset = async (asset, setter, directory) => {
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
    setter( {uri: file.uri} );
    return;
  }

  // else, if it wasn't cached, download a cached copy
  console.log(`downloading ${fileType} to cache!`);

  const folder = fileType == "image" || fileType == "gif" ? directory : fileType == "video" ? "videos" : null;
  const ref = storage.ref(`/${folder}/${asset}`);
  const uri = await ref.getDownloadURL();

  const newAsset = await FileSystem.downloadAsync(uri, path);
  setter( {uri: newAsset.uri} );
}










/* OLD CASE STUDY ONE */
import React, { useState, useEffect } from 'react';
import * as FileSystem from 'expo-file-system';
import firebase from 'firebase';
const storage = firebase.storage();

export default function Exercise({ image, videoFile }) {
  const [cachedImg, setCachedImg] = useState();
  const [cachedVideo, setCachedVideo] = useState();

  // Run cacheAsset functions on mount
  useEffect(() => {
    cacheAsset(image);
    cacheAsset(videoFile);
  }, [])

  const cacheAsset = async (asset) => {
    const fileType = asset && await asset.match(/[^.]+$/g)[0] === "png" ? "image" : 
                                    asset.match(/[^.]+$/g)[0] === "mp4" ? "video" : 
                                    "unknown file type!";

    // example: cacheDirectory/yinyang.png
    const path = FileSystem.cacheDirectory + "/" + asset;
    const file = await FileSystem.getInfoAsync(path);

    // If file was already cached, read from previous cache:
    if (file.exists) {
      if (fileType == "image") {
        setCachedImg( {uri: file.uri} );
      } else if (fileType == "video") {
        setCachedVideo( {uri: file.uri} );
      } else return; // Don't proceed further unknown file type
      return; 
    }

    // else if it wasn't cached, get the download URL for the new file from Firebase Storage
    const folder = fileType == "image" ? "exercise-images" : fileType == "video" ? "videos" : null;
    const ref = storage.ref("/" + folder + "/" + asset);
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








// ONLY IMAGE FILE
import React, { useState, useEffect } from 'react';
import * as FileSystem from 'expo-file-system';
import firebase from 'firebase';
const storage = firebase.storage();

export default function Exercise({ image }) {
  const [cachedImg, setCachedImg] = useState();

  // Run cacheAsset function on mount
  useEffect(() => {
    cacheAsset(image);
  }, [])

  const cacheAsset = async (asset) => {
    const path = FileSystem.cacheDirectory + "/" + asset;
    const file = await FileSystem.getInfoAsync(path);

    // If image was already cached, read from previous cache and return.
    if (file.exists) {
      setCachedImg( {uri: file.uri} );
      return;
    }

    // else if it wasn't cached, get the download URL for the new file from Firebase Storage
    const ref = storage.ref("/" + "exercise-images" + "/" + asset);
    const uri = await ref.getDownloadURL();
    
    // Download that new file into the device's cache using the FileSystem API
    const newAsset = await FileSystem.downloadAsync(uri, path);
    setCachedImg( {uri: newAsset.uri} );
    return;
  }

  return <Image 
            source={ cachedImg }
            style={{ height: height * 0.4, width: width * 0.9 }}
            resizeMode="contain"
          />
};