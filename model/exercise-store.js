import firebase from 'firebase';
// import fireApp from '../firebase';

// const retrieveFile = async (fileName) => {
//   let fileRef = fireApp.storage().ref('/' + fileName);
//   const url = await fileRef.getDownloadURL().then(url => {
//     // console.log(url);
//     return url;
//   });
// }

const retrieveFile = async (fileName) => {
  let fileRef = firebase.storage().ref('/' + fileName);
  const url = await fileRef.getDownloadURL();
  return url;
}

// firebase.storage().ref('/' + fileName).getDownloadURL().then(url => url)

const loadFile = (fileName) => {
  setTimeout(() => {
    return retrieveFile(fileName).then(response => response["_W"])
  }, 0);
}

export const Exercises = {
  1: {
    id: 1,
    image: require("../assets/exercises-images/flower-4x.png"),
    title: "Flower of Life",
    subTitle: "Relax Your Mind",
    videoFile: require('../assets/video-exercises/flower-of-life.mp4'),
    modalIcon: require('../assets/exercises-images/modal-icons/flower.png'),
    iconHeight: 60,
    customVolume: 0.23
  },
  2: {
    id: 2,
    image: require("../assets/exercises-images/breathe-4x.png"),
    title: "Breathe for Focus",
    subTitle: "Get in the Zone",
    videoFile: require('../assets/video-exercises/circles.mp4'),
    modalIcon: require('../assets/exercises-images/modal-icons/audi.png'),
    iconHeight: 39
  },
  3: {
    id: 3,
    image: require("../assets/exercises-images/minute-break-4x.png"),
    title: "1 Minute Break",
    subTitle: "60 Seconds of Zen",
    videoFile: require('../assets/video-exercises/4-7-9-wheel.mp4'),
    modalIcon: require('../assets/exercises-images/modal-icons/zen-circle.png'),
    iconHeight: 48
  },
  4: {
    id: 4,
    image: require("../assets/exercises-images/jungle-green.png"),
    title: "Box Breathing",
    subTitle: "4 Second Box Pattern",
    videoFile: require('../assets/video-exercises/box-breathing.mp4'),
    modalIcon: require('../assets/exercises-images/modal-icons/arrow-squares.png'),
    iconHeight: 42
  },
  5: {
    id: 5,
    image: require("../assets/exercises-images/forest-orange.png"),
    title: "Ride the Wave",
    subTitle: "Slow Deep Breathing",
    videoFile: require('../assets/video-exercises/yin-yang.mp4'),
    
    // videoFile: retrieveFile('videos/yin-yang.mp4'),
    // videoFile: retrieveFile('videos/yin-yang.mp4'),

    // videoFile: {uri: retrieveFile('videos/yin-yang.mp4')},
    /* returns:
    video file: {"uri":{"_U":0,"_V":1,"_W":"https://firebasestorage.googleapis.com/v0/b/memoir-mobile.appspot.com/o/videos%2Fyin-yang.mp4?alt=media&token=6a78b856-dfb9-430d-879e-c5ca5df9a31a","_X":null}}
    */

    // videoFile: loadFile('videos/yin-yang.mp4'),
    modalIcon: require('../assets/exercises-images/modal-icons/wave.png'),
    iconHeight: 35
  },
  6: {
    id: 6,
    image: require("../assets/exercises-images/moon-4x.png"),
    title: "Sweet Dreams",
    subTitle: "For Better Sleep",
    videoFile: require('../assets/video-exercises/crescent-moon.mp4'),
    modalIcon: require('../assets/exercises-images/modal-icons/moon.png'),
    iconHeight: 38
  },
  7: {
    id: 7,
    image: require("../assets/exercises-images/daily-exhale.png"),
    uniqueImg: require("../assets/exercises-images/daily-exhale.png"),
    title: "Daily Exhale",
    subTitle: "2 Min Session",
    videoFile: require('../assets/video-exercises/daily-exhale.mp4'),
    modalIcon: require('../assets/exercises-images/modal-icons/breathe-waves.png'),
    autoCountDown: "2m"
    /* 
      <TouchableOpacity onPress={() => navigation.navigate("ExerciseVideo", { videoFile: require('../../assets/video-exercises/daily-exhale.mp4'), modalIcon: require('../../assets/exercises-images/modal-icons/breathe-waves.png') })}>
        <Image 
          source={require('../../assets/exercises-images/daily-exhale-4x.png')}
          style={{ height: height * 0.4, width: width * 0.9, }}
          resizeMode="contain"
        />
      </TouchableOpacity>
    */
  },
  8: {
    id: 8,
    image: require("../assets/exercises-images/moon-4x.png"),
    uniqueImg: require("../assets/exercises-images/horiz-focus-session.png"),
    title: "Sweet Dreams",
    subTitle: "30 Min Session",
    videoFile: require('../assets/video-exercises/crescent-moon.mp4'),
    modalIcon: require('../assets/exercises-images/modal-icons/moon.png'),
    iconHeight: 38,
    customWidth: 0.855,
    autoCountDown: "30m"
  },
  9: {
    id: 9,
    image: require("../assets/exercises-images/horiz-deep-breaths.png"),
    title: "6 Deep Breaths PLACEHOLDER",
    subTitle: "",
    videoFile: require('../assets/video-exercises/crescent-moon.mp4'),
    modalIcon: require('../assets/exercises-images/modal-icons/breathe-waves.png'),
    iconHeight: 38,
    customWidth: 0.89,
  },
  10: {

  },
  11: {

  },
  12: {

  },
  13: {

  },
  14: {

  },
}