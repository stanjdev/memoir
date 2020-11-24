import * as React from 'react';
import { Text, View, StatusBar, ScrollView, Button, Alert, Image, Dimensions, StyleSheet, ImageBackground, TouchableOpacity, NativeEventEmitter } from 'react-native';
import AppButton from '../../../components/AppButton';
import { useIsFocused } from '@react-navigation/native';
import { useFonts } from 'expo-font';
const bgImage = require('../../../assets/splash/memoir-splash-thin-4x.png')

import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';

const { width, height } = Dimensions.get('window');

export default function MeditateTimerSetScreen({navigation}) {
  const [minutes, setMinutes] = React.useState(10);
  const [bellIntervDisplay, setBellIntervDisplay] = React.useState("30s");
  const [bellInterv, setBellInterv] = React.useState(30000);

  // const renderMinsPickerItems = () => {
  //   let items = [];
  //   for (let i = 1; i <= 60; i++) {
  //     items.push(<Picker.Item key={i} label={`${i}`} value={`${i}`}/>)
  //   }
  //   return items;
  // }

  const renderMinsPickerItems = () => {
    let items = [];
    for (let i = 1; i <= 60; i++) {
      items.push(<Text key={i}> | </Text>)
    }
    return items;
  }

  // const renderSecsPickerItems = () => {
  //   let items = [];
  //   for (let i = 30; i <= 90; i+=30) {
  //     items.push(<Picker.Item key={i} label={`${i}s`} value={`${i}`}/>)
  //   }
  //   return items;
  // }

  const renderSecsPickerItems = () => {
    let items = [];
    for (let i = 30; i <= 90; i+=30) {
      items.push(<Text key={i}> | </Text>)
    }
    return items;
  }

  const onChange = (value) => {
    if (value > 0 && value <= 60) 
    setMinutes(value)
  }

  const onChangeSecs = (value) => {
    const bellOptions = {
      "30s": 30000,
      "60s": 60000,
      "90s": 90000,
      "2m": 120000,
      "3m": 180000,
      "5m": 300000,
      "OFF": null
    }
    let bellArray = Object.keys(bellOptions);
    if (value >= 0 && value < 7) {
      setBellIntervDisplay(bellArray[value])
      setBellInterv(bellOptions[bellArray[value]])
    }
    console.log(bellIntervDisplay)
    console.log(bellInterv)
  }

  const isFocused = useIsFocused();

  let [fontsLoaded] = useFonts({
    'Assistant': require('../../../assets/fonts/Assistant/Assistant-VariableFont_wght.ttf'),
    'Assistant-Regular': require('../../../assets/fonts/Assistant/static/Assistant-Regular.ttf'),
    'Assistant-SemiBold': require('../../../assets/fonts/Assistant/static/Assistant-SemiBold.ttf'),
  });

  return (
    <ImageBackground source={bgImage} style={{ flex: 1, resizeMode: "cover", justifyContent: "center" }}>
      {isFocused ? <StatusBar hidden={false} barStyle="light-content"/> : null} 
      <TouchableOpacity onPress={() => navigation.goBack()} style={{position: "absolute", top: height * 0.065, zIndex: 100, padding: 15}}>
        <Image source={require('../../../assets/screen-icons/back-arrow-white.png')} style={{height: 20, }} resizeMode="contain"/>
      </TouchableOpacity>
      <View style={{marginTop: 20}}>
        <Text style={{textAlign: "center", fontSize: 23, fontFamily: "Assistant-SemiBold", color: 'white'}}>Meditate</Text>
        <View style={{flexDirection: "row", padding: 20}}>
          <View style={{backgroundColor: "white", flex: 1, height: height * 0.7, borderRadius: 20, justifyContent: "space-evenly", alignItems: "center" }}>

            <View style={{width: width * 0.63, height: height * 0.45, justifyContent: "space-around", alignItems: "center", }}>
              <View style={{alignItems: "center"}}>
                <Image source={require('../../../assets/screen-icons/clock.png')} style={{height: 37, }} resizeMode="contain"/>
                <Text style={{fontFamily: "Assistant-SemiBold", fontSize: 20, textAlign: "center", color: "#535353"}}>Session Duration:</Text>
                <Text style={{fontFamily: "Assistant-SemiBold", fontSize: 25, textAlign: "center", color: "#535353"}}>{minutes} Minutes</Text>
                
                {/* <Picker
                  style={{borderWidth: 1, width: width * 0.9, height: height * 0.2}}
                  selectedValue={minutes}
                  onValueChange={value => onChange(value)}
                >
                  {renderMinsPickerItems()}
                </Picker> */}


                <ScrollView 
                  horizontal={true} 
                  showsHorizontalScrollIndicator={false}
                  onScroll={(e) => onChange(Math.floor(1 + e.nativeEvent.contentOffset.x / (e.nativeEvent.contentSize.width - e.nativeEvent.layoutMeasurement.width) * 59)) }
                  /* OG 1.00 = e.nativeEvent.contentOffset.x / (e.nativeEvent.contentSize.width - e.nativeEvent.layoutMeasurement.width) */
                  scrollEventThrottle={16}
                  style={{borderWidth: 1,  width: 200, maxHeight: 50}} 
                >
                  <View style={{flexDirection: "row", alignItems: "center",}}>
                    {renderMinsPickerItems()}
                  </View>
                </ScrollView>

              </View>
              
              <View style={{alignItems: "center"}}>
                <Image source={require('../../../assets/screen-icons/bell.png')} style={{height: 32, }} resizeMode="contain"/>
                <Text style={{fontFamily: "Assistant-SemiBold", fontSize: 20, textAlign: "center", color: "#535353"}}>Bell Sound Every:</Text>
                <Text style={{fontFamily: "Assistant-SemiBold", fontSize: 25, textAlign: "center", color: "#535353"}}>{bellIntervDisplay}</Text>
                

                <ScrollView 
                  horizontal={true} 
                  showsHorizontalScrollIndicator={false}
                  onScroll={(e) => onChangeSecs(Math.floor(e.nativeEvent.contentOffset.x / (e.nativeEvent.contentSize.width - e.nativeEvent.layoutMeasurement.width) * 7)) }
                  // OG 1.00 = e.nativeEvent.contentOffset.x / (e.nativeEvent.contentSize.width - e.nativeEvent.layoutMeasurement.width)
                  scrollEventThrottle={16}
                  style={{borderWidth: 1, width: 200, maxHeight: 50 }} 
                >
                  <View style={{flexDirection: "row", alignItems: "center",  }}>
                    {renderMinsPickerItems()}
                  </View>
                </ScrollView>


                {/* <Picker
                  style={{borderWidth: 1, width: width * 0.9, height: height * 0.2}}
                  selectedValue={seconds}
                  onValueChange={value => onChangeSecs(value)}
                >
                  {renderSecsPickerItems()}
                  <Picker.Item label={`2m`} value={`2`}/>
                  <Picker.Item label={`3m`} value={`3`}/>
                  <Picker.Item label={`5m`} value={`5`}/>
                  <Picker.Item label={`OFF`} value={`OFF`}/>
                </Picker> */}

              </View>
            </View>


            <AppButton 
              title="Start" 
              buttonStyles={styles.blueButton}
              buttonTextStyles={styles.buttonText}
              onPress={() => navigation.navigate('MeditateExerciseScreen', { minutes, bellInterv })}
            />

          </View>
        </View>
      </View>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  blueButton: {
    backgroundColor: "#3681C7",
    height: 51,
    width: 234,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    shadowRadius: 7,
    shadowColor: "black",
    shadowOpacity: 0.2,
    shadowOffset: {width: 3, height: 3}
  },
  buttonText: {
    color: "#fff",
    flex: 1,
    textAlign: "center",
    fontSize: 22,
    letterSpacing: 1,
    fontFamily: "Assistant-SemiBold"
  }
})

