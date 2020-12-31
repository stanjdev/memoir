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
    // image: require("../assets/exercises-images/flower-of-life.png"),
    image: "flower-of-life.png",
    title: "Flower of Life",
    subTitle: "Relax Your Mind",
    // videoFile: require('../assets/video-exercises/flower-of-life.mp4'),
    videoFile: 'flower-of-life.mp4',
    modalIcon: require('../assets/exercises-images/modal-icons/flower.png'),
    iconHeight: 60,
    customVolume: 0.23
  },
  2: {
    id: 2,
    // image: require("../assets/exercises-images/circles.png"),
    image: "circles.png",
    // image: "circles.gif",
    // gif: "gifs/circles.gif",
    // image: require("../assets/exercises-images/circles.gif"),
    title: "Breathe for Focus",
    subTitle: "Get in the Zone",
    // videoFile: require('../assets/video-exercises/circles.mp4'),
    videoFile: 'circles.mp4',
    modalIcon: require('../assets/exercises-images/modal-icons/audi.png'),
    iconHeight: 39
  },
  3: {
    id: 3,
    // image: require("../assets/exercises-images/minute-break-4x.png"),
    // image: require("../assets/exercises-images/4-7-9-wheel.png"),
    image: "4-7-9-wheel.png",
    title: "1 Minute Break",
    subTitle: "60 Seconds of Zen",
    // videoFile: require('../assets/video-exercises/4-7-9-wheel.mp4'),
    videoFile: '4-7-9-wheel.mp4',
    modalIcon: require('../assets/exercises-images/modal-icons/zen-circle.png'),
    iconHeight: 48
  },
  4: {
    id: 4,
    // image: require("../assets/exercises-images/jungle-green.png"),
    // image: require("../assets/exercises-images/box-breathing.png"),
    image: "box-breathing.png",
    title: "Box Breathing",
    subTitle: "4 Second Box Pattern",
    // videoFile: require('../assets/video-exercises/box-breathing.mp4'),
    videoFile: 'box-breathing.mp4',
    modalIcon: require('../assets/exercises-images/modal-icons/arrow-squares.png'),
    iconHeight: 42
  },
  5: {
    id: 5,
    // image: require("../assets/exercises-images/yin-yang.png"),
    image: "yin-yang.png",
    title: "Ride the Wave",
    subTitle: "Slow Deep Breathing",
    // videoFile: require('../assets/video-exercises/yin-yang.mp4'),
    videoFile: 'yin-yang.mp4',
    
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
    // image: require("../assets/exercises-images/moon-4x.png"),
    // image: require("../assets/exercises-images/crescent-moon.png"),
    image: "crescent-moon.png",
    title: "Sweet Dreams",
    subTitle: "For Better Sleep",
    // videoFile: require('../assets/video-exercises/crescent-moon.mp4'),
    videoFile: 'crescent-moon.mp4',
    modalIcon: require('../assets/exercises-images/modal-icons/moon.png'),
    iconHeight: 38,
    noFinishBell: true
  },
  7: {
    id: 7,
    // image: require("../assets/exercises-images/daily-exhale.png"),
    image: "daily-exhale.png",
    // uniqueImg: require("../assets/exercises-images/daily-exhale.png"),
    uniqueImg: "daily-exhale.png",
    title: "Daily Exhale",
    subTitle: "2 Min Session",
    // videoFile: require('../assets/video-exercises/daily-exhale.mp4'),
    videoFile: 'daily-exhale.mp4',
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
    // image: require("../assets/exercises-images/crescent-moon.png"),
    image: "crescent-moon.png",
    // uniqueImg: require("../assets/exercises-images/horiz-sleep-session.png"),
    uniqueImg: "horiz-sleep-session.png",
    title: "30 Min Sleep",
    subTitle: "Timed Session",
    // videoFile: require('../assets/video-exercises/crescent-moon.mp4'),
    videoFile: 'crescent-moon.mp4',
    modalIcon: require('../assets/exercises-images/modal-icons/moon.png'),
    iconHeight: 38,
    customWidth: 0.855,
    autoCountDown: "30m",
    noFinishBell: true
  },
  9: {
    id: 9,
    // image: require("../assets/exercises-images/horiz-deep-breaths.png"),
    image: "horiz-deep-breaths.png",
    title: "6 Deep Breaths PLACEHOLDER",
    subTitle: "",
    // videoFile: require('../assets/video-exercises/crescent-moon.mp4'),
    videoFile: 'crescent-moon.mp4',
    modalIcon: require('../assets/exercises-images/modal-icons/breathe-waves.png'),
    iconHeight: 38,
    customWidth: 0.89,
  },
  10: {
    id: 10,
    image: "cosmos.png",
    title: "Cosmos",
    subTitle: "Relax with the Universe",
    videoFile: 'crescent-moon.mp4',
    // videoFile: require('../assets/video-exercises/box-breathing.mp4'),
    modalIcon: require('../assets/exercises-images/modal-icons/arrow-squares.png'),
    iconHeight: 42
    /*
    <Exercise navigation={navigation} image={require("../../assets/exercises-images/cosmos.png")} title="Cosmos" subTitle="Relax with the Universe"/>     
     */
  },
  11: {
    id: 11,
    image: "grey-placeholder.png",
    title: "6 Breaths to Calm",
    subTitle: "Achieve a Calm State",
    videoFile: 'crescent-moon.mp4',
    // videoFile: require('../assets/video-exercises/box-breathing.mp4'),
    modalIcon: require('../assets/exercises-images/modal-icons/cut-triangle.png'),
    iconHeight: 96
    /* 
<Exerciseimage={require("../../assets/exercises-images/forest-dawn-4x.png")} subTitle="4 Second Box Pattern"/>
*/
  },
  12: {
    id: 12,
    image: "grey-placeholder.png",
    title: "No More Anxiety",
    subTitle: "4-7-8 Tension Relief",
    videoFile: 'crescent-moon.mp4',
    // videoFile: require('../assets/video-exercises/box-breathing.mp4'),
    modalIcon: require('../assets/exercises-images/modal-icons/cut-triangle.png'),
    iconHeight: 96
    /* 
    <Exercise navigation={navigation} image={require("../../assets/exercises-images/aurora-4x.png")} title="No More Anxiety" subTitle="4-7-8 Tension Relief"/>
    */
  },
  13: {
    id: 13,
    image: "grey-placeholder.png",
    title: "1 Minute Break",
    subTitle: "60 Seconds of Zen",
    videoFile: 'crescent-moon.mp4',
    // videoFile: require('../assets/video-exercises/box-breathing.mp4'),
    modalIcon: require('../assets/exercises-images/modal-icons/cut-triangle.png'),
    iconHeight: 96
    /* 
    <Exercise navigation={navigation} image={require("../../assets/exercises-images/redrock-4x.png")} title="1 Minute Break" subTitle="60 Seconds of Zen"/>
    */

  },
  14: {

  },
}