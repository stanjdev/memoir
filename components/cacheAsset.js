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