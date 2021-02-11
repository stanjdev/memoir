import React, { useState, useEffect } from 'react';
import { View, Text, Image, Dimensions } from 'react-native';
import { useFonts } from 'expo-font';
import { useIsFocused } from '@react-navigation/native'
import { ProgressBar } from 'react-native-paper';
import MaskedView from '@react-native-community/masked-view';
import * as Animatable from 'react-native-animatable';

const { height, width } = Dimensions.get("window");

export default function ProfileStatsBlock({icon, title, mills, number, subtitle, subText, progress}) {
  let [fontsLoaded] = useFonts({
    'Assistant': require('../assets/fonts/Assistant/Assistant-VariableFont_wght.ttf'),
    'Assistant-Regular': require('../assets/fonts/Assistant/static/Assistant-Regular.ttf'),
    'Assistant-SemiBold': require('../assets/fonts/Assistant/static/Assistant-SemiBold.ttf'),
  });

  const isFocused = useIsFocused();

  const [prog, setProg] = useState(0.01);
  const [numBar, setNumBar] = useState();
  const [animation, setAnimation] = useState("");
  
  const loadProgress = () => {
    isFocused 
    ?
    setTimeout(() => {
      setProg(progress);
      // setAnimation("slideOutUp");
      setAnimation(slideNums);
    }, 250)
    :
    setProg(0.01);
    setAnimation("");
  };

  const slideNums = {
    from: {
      translateY: 0
    },
    to: {
      translateY: height < 600 ? -166 : -210
    },
  }

  // const rollNums = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadProgress();
    renderNumBar(number);
    // console.log("number:", number);

    // Animated.timing(rollNums, {
    //     toValue: -210,
    //     duration: 1000,
    //     useNativeDriver: true
    //   }
    // ).start();

  }, [isFocused, progress, number])

  // failed attempt, can delete.
  // const renderNumBar = (number) => {
  //   let nums = [];
  //   for (let i = 0; i <= number; i += number / 5) {
  //     nums.push(<Text key={`${title} ${i}`} style={{fontFamily: "Assistant-SemiBold", fontSize: 36, color: "#3681C7", marginRight: 7, marginBottom: -6, }}>{Math.trunc(i)}</Text>);
  //   }
  //   return (
  //     <MaskedView
  //       style={{ flexDirection: 'column', height: 40, width: 40 }}
  //       maskElement={
  //         <View
  //           style={{
  //             // Transparent background because mask is based off alpha channel.
  //             borderWidth: 1,
  //             backgroundColor: 'transparent',
  //             flex: 1,
  //             // justifyContent: 'center',
  //             // justifyContent: 'flex-end',
  //             // alignItems: 'center',
  //             // width: 40
  //           }}
  //         >
  //           <View 
  //             style={{
  //               transform: [
  //                 { translateY: rollNums }
  //               ]
  //             }}
  //           >
  //             {nums}
  //           </View>
  //         </View>
  //       }
  //     >
  //       {/* Shows behind the mask, you can put anything here, such as an image */}
  //       <View style={{ flex: 1, backgroundColor: "#3681C7" }} />
  //       {/* <View style={{ flex: 1, height: '100%', backgroundColor: '#F5DD90' }} />
  //       <View style={{ flex: 1, height: '100%', backgroundColor: '#F76C5E' }} />
  //       <View style={{ flex: 1, height: '100%', backgroundColor: '#e1e1e1' }} /> */}
  //     </MaskedView>
  //   )
  // }

  const renderNumBar = (number) => {
    let nums = [];
    // console.log("renderNumber:", number);
    if (number > 0) {
      for (let i = 0; i < number; i += number / 5) {
        // console.log( Math.trunc(number) !== number ? i.toFixed(1) : Math.trunc(i) );
        nums.push(<Text key={`${title} ${i}`} style={{fontFamily: "Assistant-SemiBold", fontSize: height < 600 ? 30 : 36, color: "#3681C7", marginRight: 7, marginBottom: -6, }}>{ Math.trunc(number) !== number ? i.toFixed(1) : Math.trunc(i) }</Text>);
      }
      // console.log( Math.trunc(number) !== number ? number : Math.trunc(number) );
      nums.push(<Text key={`${title} ${number}`} style={{fontFamily: "Assistant-SemiBold", fontSize: height < 600 ? 30 : 36, color: "#3681C7", marginRight: 7, marginBottom: -6, }}>{ number }</Text>);
    }
    setNumBar(nums);
  }


  return (
      <View style={{ width: width * 0.77, height: Math.min(height * 0.13, 177), margin: 7, }}>
        <View style={{flexDirection: "row", alignItems: "center", marginTop: height < 600 ? 20 : null}}>
          <Image source={icon} style={{height: height < 600 ? 20 : 22, width: 26, marginRight: 10}} resizeMode="contain"/>
          <Text style={{fontFamily: "Assistant-SemiBold", fontSize: height < 600 ? 19 : 22, color: "#717171"}}>{title}</Text>
        </View>
        
        <View style={{flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between",}}>
          <View style={{flexDirection: "row", alignItems: "flex-end", }}>

            <MaskedView
              style={{ 
                flexDirection: 'column', 
                height: 40, 
                width: mills && mills < 3 ? 30 
                        : Math.trunc(number) !== number && number > 0 ? width * (String(number).length + 1) / 25 
                        : number > 0 ? width * (String(number).length) / 16
                        : 30, 
              }}
              maskElement={
                <View
                  style={{
                    backgroundColor: 'transparent',
                    flex: 1,
                    // borderWidth: 1,
                    // width: "100%"
                  }}
                >
                  {
                    number > 0 ?
                    <Animatable.View animation={animation}>
                      {numBar}
                    </Animatable.View>
                    : <Text key={`${title} ${number}`} style={{fontFamily: "Assistant-SemiBold", fontSize: 36, color: "#3681C7", marginRight: 7, marginBottom: -6, }}>{ mills && mills == 0 ? number : 0 }</Text>
                  }
                </View>
              }
            >
              {/* Shows behind the mask, you can put anything here, such as an image */}
              <View style={{ flex: 1, backgroundColor: "#3681C7" }} />
            </MaskedView>

            {/* <Text style={{fontFamily: "Assistant-SemiBold", fontSize: 36, color: "#3681C7", marginRight: 7, marginBottom: -6, }}>{number}</Text> */}
            
            <Text style={{fontFamily: "Assistant-SemiBold", fontSize: height < 600 ? 19 : 21.45, color: "#3681C7", }}>{subtitle}</Text>
          </View>
          <Text style={{fontFamily: "Assistant-SemiBold", fontSize: 12.03, color: "#717171"}}>{subText}</Text>
        </View>
        <View>
          {progress ? 
           <ProgressBar
            progress={prog}
            color={"#3681C7"}
            style={{backgroundColor: "#CCCCCC", borderRadius: 7, height: 3, marginTop: 10}}
            width={"100%"}
          />
          : null}
        </View>
      </View>
  )
};




/* MOVE TO OTHER FILE: */
/* 
OG SQUARE PROGRESS components
      // <View style={{backgroundColor: "white", width: 151, height: Math.min(height * 0.25, 177), borderRadius: 20, margin: 7, shadowOffset: {width: 1, height: 1}, shadowColor: "black", shadowOpacity: 0.5, shadowRadius: 4, padding: 20}}>
      //   <Image source={icon} style={{height: 42}} resizeMode="contain"/>
      //   <Text style={{fontFamily: "Assistant-SemiBold", fontSize: 16, color: "#717171"}}>{title}</Text>
      //   <Text style={{fontFamily: "Assistant-SemiBold", fontSize: 45, color: "#3681C7"}}>{number}</Text>
      //   <Text style={{fontFamily: "Assistant-SemiBold", fontSize: 14, color: "#717171"}}>{subtitle}</Text>
      // </View>
*/
