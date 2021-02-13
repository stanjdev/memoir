import React, { useState, useEffect } from 'react';
import { View, Text, Image, Dimensions, StyleSheet } from 'react-native';
import { useFonts } from 'expo-font';
import { useIsFocused } from '@react-navigation/native'
import { ProgressBar } from 'react-native-paper';
import MaskedView from '@react-native-community/masked-view';
import * as Animatable from 'react-native-animatable';
const { height, width } = Dimensions.get("window");

export default function ProfileStatsBlock({icon, title, seconds, number, subtitle, subText, progress}) {
  let [fontsLoaded] = useFonts({
    'Assistant': require('../assets/fonts/Assistant/Assistant-VariableFont_wght.ttf'),
    'Assistant-Regular': require('../assets/fonts/Assistant/static/Assistant-Regular.ttf'),
    'Assistant-SemiBold': require('../assets/fonts/Assistant/static/Assistant-SemiBold.ttf'),
  });

  const isFocused = useIsFocused();
  const [progressAnimation, setProgressAnimation] = useState(0.01);
  const [numBar, setNumBar] = useState();
  const [animation, setAnimation] = useState("");
  
  useEffect(() => {
    renderNumBar(number);
    animate();
    // 'progress' and 'number' are props passed down by the parent that are required for the animations
  }, [isFocused, progress, number])


  const renderNumBar = (number) => {
    // Render the "bar" of numbers
    let nums = [];
    if (number > 0) {
      for (let i = 0; i <= number; i += number / 5) {
        nums.push(<Text key={`${title} ${i}`} style={styles.numStyles}>{ Math.trunc(number) !== number ? i.toFixed(1) : Math.trunc(i) }</Text>);
      }
    }
    setNumBar(nums);
  };

  
  const animate = () => {
    // Animate the numbers and progress bar if the user visits this screen, else initialize them to 0
    isFocused 
    ?
    setTimeout(() => {
      setProgressAnimation(progress);
      setAnimation(slideNums);
    }, 250)
    :
    setProgressAnimation(0.01);
    setAnimation("");
  };

  const slideNums = {
    // The animation settings to slide the "bar" on the Y axis
    from: { translateY: 0 },
    to: { translateY: height < 600 ? -166 : -210 }
  };


  return (
      <View style={styles.container}>
        
        <View style={styles.headerView}>
          <Image source={icon} style={styles.imageStyle} resizeMode="contain"/>
          <Text style={styles.titleStyle}>{title}</Text>
        </View>

        <View style={{...styles.rowAndFlexEnd, justifyContent: "space-between"}}>
          <View style={styles.rowAndFlexEnd}>
            <MaskedView
              style={{ 
                flexDirection: 'column', 
                height: 40, 
                width: seconds && seconds < 3 ? 30 
                        : Math.trunc(number) !== number && number > 0 ? width * (String(number).length + 1) / 25 
                        : number > 0 ? width * String(number).length / 15.5
                        : 30, 
              }}
              maskElement={
                <View>
                  {
                    number > 0 ?
                    <Animatable.View animation={animation}>
                      {numBar}
                    </Animatable.View>
                    : <Text key={`${title} ${number}`} style={styles.numStyles}>{ seconds && seconds == 0 ? number : 0 }</Text>
                  }
                </View>
              }
            >
              <View style={styles.numBarMaskStyle} /> 
            </MaskedView>
            <Text style={styles.subTitleStyle}>{subtitle}</Text>
          </View>
          <Text style={styles.subTextStyle}>{subText}</Text>
        </View>

        <View>
          {progress ? 
            <ProgressBar
              progress={progressAnimation}
              color={"#3681C7"}
              style={styles.progressBarStyle}
              width={"100%"}
            />
          : null}
        </View>

      </View>
  )
};


const styles = StyleSheet.create({
  container: {
    width: width * 0.77, 
    height: Math.min(height * 0.13, 177), 
    margin: 7
  },
  headerView: { 
    flexDirection: "row", 
    alignItems: "center", 
    marginTop: height < 600 ? 20 : null
  },
  rowAndFlexEnd: {
    flexDirection: "row", 
    alignItems: "flex-end"
  },
  imageStyle: {
    height: height < 600 ? 20 : 22, 
    width: 26, 
    marginRight: 10
  },
  titleStyle: {
    fontFamily: "Assistant-SemiBold", 
    fontSize: height < 600 ? 19 : 22, 
    color: "#717171"
  },
  numBarMaskStyle: {
    flex: 1, backgroundColor: "#3681C7"
  },
  subTitleStyle: {
    fontFamily: "Assistant-SemiBold", 
    fontSize: height < 600 ? 19 : 21.45, 
    color: "#3681C7"
  },
  subTextStyle: {
    fontFamily: "Assistant-SemiBold", 
    fontSize: 12.03, 
    color: "#717171"
  },
  numStyles: {
    fontFamily: "Assistant-SemiBold", 
    fontSize: height < 600 ? 30 : 36, 
    color: "#3681C7", 
    marginRight: 7, 
    marginBottom: -6, 
  },
  progressBarStyle: {
    backgroundColor: "#CCCCCC", 
    borderRadius: 7, 
    height: 3, 
    marginTop: 10
  }
});