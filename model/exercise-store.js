// import firebase from 'firebase';

// const retrieveFile = async (fileName) => {
//   let fileRef = firebase.storage().ref('/' + fileName);
//   const url = await fileRef.getDownloadURL();
//   return url;
// }

export const Exercises = {
  1: {
    id: 1,
    image: "flower-of-life.png",
    uniqueImg: "daily-exhale-flower-of-life-green.png",
    title: "Flower of Life",
    subTitle: "Relax Your Mind",
    videoFile: "flower-of-life.mp4",
    modalIcon: require('../assets/exercises-images/modal-icons/flower.png'),
    iconHeight: 70,
    customVolume: 0.22,
    color: "green",
    shape: "flower"
  },
  2: {
    id: 2,
    image: "circles.png",
    uniqueImg: "daily-exhale-om-pink.png",
    // image: "circles.gif",
    // gif: "gifs/circles.gif",
    // image: require("../assets/exercises-images/circles.gif"),
    title: "Breathe for Focus",
    subTitle: "Get in the Zone",
    videoFile: 'circles.mp4',
    modalIcon: require('../assets/exercises-images/modal-icons/audi.png'),
    iconHeight: 39,
    color: "purple",
    shape: "circle"
  },
  3: {
    id: 3,
    // image: require("../assets/exercises-images/minute-break-4x.png"),
    // image: require("../assets/exercises-images/4-7-9-wheel.png"),
    image: "4-7-9-wheel.png",
    uniqueImg: "daily-exhale-478-orange.png",
    title: "1 Minute Break",
    subTitle: "60 Seconds of Zen",
    // videoFile: require('../assets/video-exercises/4-7-9-wheel.mp4'),
    videoFile: '4-7-9-wheel.mp4',
    modalIcon: require('../assets/exercises-images/modal-icons/zen-circle.png'),
    iconHeight: 48,
    color: "orange",
    shape: "circle"
  },
  4: {
    id: 4,
    // image: require("../assets/exercises-images/jungle-green.png"),
    // image: require("../assets/exercises-images/box-breathing.png"),
    image: "box-breathing.png",
    uniqueImg: "daily-exhale-box-breathing-green.png",
    title: "Box Breathing",
    subTitle: "4 Second Box Pattern",
    // videoFile: require('../assets/video-exercises/box-breathing.mp4'),
    videoFile: "box-breathing.mp4",
    modalIcon: require('../assets/exercises-images/modal-icons/arrow-squares.png'),
    iconHeight: 60,
    color: "green",
    shape: "square"
  },
  5: {
    id: 5,
    // image: require("../assets/exercises-images/yin-yang.png"),
    image: "yin-yang.png",
    uniqueImg: "daily-exhale-yinyang.png",
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

    modalIcon: require('../assets/exercises-images/modal-icons/wave.png'),
    iconHeight: 35,
    color: "orange",
    shape: "yinyang"
  },
  6: {
    id: 6,
    // image: require("../assets/exercises-images/moon-4x.png"),
    // image: require("../assets/exercises-images/crescent-moon.png"),
    image: "crescent-moon.png",
    uniqueImg: "evening-wind-down-crescent-moon.png",
    uniqueImgEvening: "evening-wind-down-crescent-moon.png",
    title: "Sweet Dreams",
    subTitle: "For Better Sleep",
    // videoFile: require('../assets/video-exercises/crescent-moon.mp4'),
    videoFile: 'crescent-moon.mp4',
    modalIcon: require('../assets/exercises-images/modal-icons/moon.png'),
    iconHeight: 38,
    noFinishBell: true,
    color: "blue",
    shape: "crescent"
  },
  7: {
    id: 7,
    image: "pyramid-blue.png",
    uniqueImg: "daily-exhale-pyramid-blue.png",
    title: "Morning Zen",
    subTitle: "Start Your AM Flow",
    // videoFile: require('../assets/video-exercises/daily-exhale.mp4'),
    videoFile: 'daily-exhale.mp4',
    modalIcon: require('../assets/exercises-images/modal-icons/pyramid.png'),
    autoCountDown: "2m",
    iconHeight: 95,
    color: "blue",
    shape: "triangle"
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
    image: "triangle-blue6b.png",
    uniqueImg: "horiz-6-deep-breaths.png",
    title: "6 Deep Breaths",
    subTitle: "Timed Session",
    videoFile: 'triangle-blue6b.mp4',
    modalIcon: require('../assets/exercises-images/modal-icons/cut-triangle.png'),
    iconHeight: 85,
    customWidth: 0.89,
    autoCountDown: "2m",
  },
  10: {
    id: 10,
    image: "cosmos.png",
    uniqueImg: "evening-wind-down-cosmos.png",
    uniqueImgEvening: "evening-wind-down-cosmos.png",
    title: "Cosmos",
    subTitle: "Relax with the Universe",
    videoFile: 'cosmos.mp4',
    // videoFile: require('../assets/video-exercises/box-breathing.mp4'),
    modalIcon: require('../assets/exercises-images/modal-icons/arrow-squares.png'),
    iconHeight: 60,
    noFinishBell: true,
    color: "purple"
    /*
    <Exercise navigation={navigation} image={require("../../assets/exercises-images/cosmos.png")} title="Cosmos" subTitle="Relax with the Universe"/>     
     */
  },
  11: {
    id: 11,
    image: "triangle-blue6b.png",
    uniqueImg: "daily-exhale-triangle-blue6b.png",
    title: "6 Breaths to Calm",
    subTitle: "Achieve a Calm State",
    videoFile: 'triangle-blue6b.mp4',
    // videoFile: require('../assets/video-exercises/box-breathing.mp4'),
    modalIcon: require('../assets/exercises-images/modal-icons/cut-triangle.png'),
    iconHeight: 85,
    color: "green",
    shape: "triangle"
    /* 
<Exerciseimage={require("../../assets/exercises-images/forest-dawn-4x.png")} subTitle="4 Second Box Pattern"/>
*/
  },
  12: {
    id: 12,
    image: "hexagon-green.png",
    uniqueImg: "daily-exhale-hexagon-green.png",
    uniqueImgEvening: "evening-wind-down-hexagon-green.png",
    title: "No More Anxiety",
    subTitle: "4-7-8 Tension Relief",
    videoFile: "hexagon-green.mp4",
    modalIcon: require('../assets/exercises-images/modal-icons/hexagon.png'),
    iconHeight: 80,
    noFinishBell: true,
    color: "green",
    shape: "hexagon"
  },
  13: {
    id: 13,
    image: "flower-of-life-yellow.png",
    uniqueImg: "daily-exhale-flower-of-life-yellow.png",
    title: "Flower of Life",
    subTitle: "Relax Your Mind",
    videoFile: "flower-of-life-warm-forest.mp4",
    modalIcon: require('../assets/exercises-images/modal-icons/flower.png'),
    iconHeight: 70,
    customVolume: 0.4,
    color: "yellow",
    shape: "flower"
  },
  14: {
    id: 14,
    image: "box-breathing-orange.png",
    uniqueImg: "daily-exhale-box-breathing-orange.png",
    title: "Box Breathing",
    subTitle: "4 Second Box Pattern",
    videoFile: "box-breathing-3.mp4",
    modalIcon: require('../assets/exercises-images/modal-icons/arrow-squares.png'),
    iconHeight: 60,
    color: "blue",
    shape: "square"
  },
  15: {
    id: 15,
    image: "pyramid-yellow.png",
    uniqueImg: "daily-exhale-pyramid-yellow.png",
    title: "Morning Zen",
    subTitle: "Start Your AM Flow",
    videoFile: 'pyramid-yellow.mp4',
    modalIcon: require('../assets/exercises-images/modal-icons/pyramid.png'),
    autoCountDown: "2m",
    iconHeight: 95,
    color: "yellow",
    shape: "triangle"
  },
  16: {
    id: 16,
    image: "om-blue.png",
    uniqueImg: "evening-wind-down-om-blue.png",
    uniqueImgEvening: "evening-wind-down-om-blue.png",
    title: "Breathe for Focus",
    subTitle: "Get in the Zone",
    videoFile: "om-blue-sleep.mp4",
    modalIcon: require('../assets/exercises-images/modal-icons/audi.png'),
    iconHeight: 38,
    noFinishBell: true,
    color: "blue",
    shape: "circle"
  },
  17: {
    id: 17,
    image: "478-green.png",
    uniqueImg: "daily-exhale-478-green.png",
    title: "Classic 4-7-8",
    subTitle: "Time Tested Calm",
    videoFile: '4-7-8-forest.mp4',
    modalIcon: require('../assets/exercises-images/modal-icons/zen-circle.png'),
    iconHeight: 48,
    color: "green",
    shape: "circle"
  },
  18: {
    id: 18,
    image: "triangle-warm.png",
    uniqueImg: "daily-exhale-triangle-warm.png",
    title: "Study Stress Relief",
    subTitle: "A Break from the Books",
    videoFile: "triangle-warm.mp4",
    modalIcon: require('../assets/exercises-images/modal-icons/cut-triangle.png'),
    iconHeight: 85,
    color: "orange",
    shape: "triangle"
  },
  19: {
    id: 19,
    image: "triangle-green.png",
    uniqueImg: "daily-exhale-triangle-green.png",
    title: "Study Stress Relief",
    subTitle: "A Break from the Books",
    videoFile: "triangle-green.mp4",
    modalIcon: require('../assets/exercises-images/modal-icons/cut-triangle.png'),
    iconHeight: 85,
    color: "green",
    shape: "triangle"
  },
  20: {
    id: 20,
    image: "accordion-yellow.png",
    uniqueImg: "daily-exhale-accordion-yellow.png",
    title: "Energize",
    subTitle: "Refresh & Reinvigorate",
    videoFile: "accordion-1.mp4",
    modalIcon: require('../assets/exercises-images/modal-icons/breathe-waves.png'),
    color: "orange",
    shape: "mixed"
  },
  21: {
    id: 21,
    image: "yinyang-orange.png",
    uniqueImg: "daily-exhale-yinyang-orange.png",
    title: "Ride the Wave",
    subTitle: "Slow Deep Breathing",
    videoFile: "yinyang-orange.mp4",
    modalIcon: require('../assets/exercises-images/modal-icons/wave.png'),
    iconHeight: 35,
    color: "orange",
    shape: "yinyang"
  },
  22: {
    id: 22,
    image: "3-circles-green.png",
    uniqueImg: "daily-exhale-3-circles-green.png",
    title: "Breathe for Focus",
    subTitle: "Get in the Zone",
    videoFile: "3-circles.mp4",
    modalIcon: require('../assets/exercises-images/modal-icons/3-circles.png'),
    iconHeight: 65,
    color: "green",
    shape: "flower"
  },
  23: {
    id: 23,
    image: "crazy-triangles.png",
    uniqueImg: "daily-exhale-crazy-triangles.png",
    title: "Breathe for Focus",
    subTitle: "Get in the Zone",
    videoFile: "crazy-triangles.mp4",
    modalIcon: require('../assets/exercises-images/modal-icons/breathe-waves.png'),
    // iconHeight: 39,
    color: "pink",
    shape: "circle"
  },
  24: {
    id: 24,
    image: "purple-peace.png",
    uniqueImg: "daily-exhale-funky-loop-purple.png",
    uniqueImgEvening: "evening-wind-down-funky-loop-purple.png",
    title: "Purple Peace",
    subTitle: "Deep Cadence",
    videoFile: "purple-morph.mp4",
    modalIcon: require('../assets/exercises-images/modal-icons/breathe-waves.png'),
    noFinishBell: true,
    color: "purple",
    shape: "mixed"
  },
  25: {
    id: 25,
    image: "infinity-purple.png",
    uniqueImg: "evening-wind-down-infinity-purple.png",
    uniqueImgEvening: "evening-wind-down-infinity-purple.png",
    title: "Infinite Loop",
    subTitle: "Evening Wind Down",
    videoFile: "infinity-purple.mp4",
    modalIcon: require('../assets/exercises-images/modal-icons/infinity.png'),
    noFinishBell: true,
    color: "dark",
    shape: "circle"
  },
  26: {

  },
};