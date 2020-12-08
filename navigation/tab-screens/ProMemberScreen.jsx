import * as React from 'react';
import { Text, View, StatusBar, Button, Alert, Image, Dimensions, StyleSheet, ImageBackground, TouchableOpacity, ScrollView } from 'react-native';
import AppButton from '../../components/AppButton';
import { AuthContext } from '../../components/context';
import { useIsFocused } from '@react-navigation/native';
import CreateAccountPopup from '../../components/CreateAccountPopup';

import { useFonts } from 'expo-font';

const { width, height } = Dimensions.get('window');
const bgImage = require('../../assets/splash/memoir-splash-thin-4x.png')
import ProfileStatsBlock from '../../components/ProfileStatsBlock';



export default function ProMemberScreen({navigation}) {
  const isFocused = useIsFocused();
  const { signOut, userToken, userFirstName } = React.useContext(AuthContext);

  const [showPopUp, setShowPopup] = React.useState(false);
  React.useEffect(() => {
    if (!userToken) {
      setTimeout(() => {
        isFocused ? setShowPopup(true) : setShowPopup(false)
      }, 500);
    }
  }, [isFocused])



  let [fontsLoaded] = useFonts({
    'Assistant': require('../../assets/fonts/Assistant/Assistant-VariableFont_wght.ttf'),
    'Assistant-Regular': require('../../assets/fonts/Assistant/static/Assistant-Regular.ttf'),
    'Assistant-SemiBold': require('../../assets/fonts/Assistant/static/Assistant-SemiBold.ttf'),
  });

  return (
    <ImageBackground source={bgImage} style={{ flex: 1, }} resizeMode="cover">
      {isFocused ? <StatusBar barStyle="light-content" hidden={false}/> : null}
      <TouchableOpacity onPress={() => userToken ? navigation.goBack() : null} style={{position: "absolute", left: width * 0.02, top: height * 0.045, zIndex: 100, padding: 15}}>
        <Image source={require('../../assets/screen-icons/back-arrow-white.png')} style={{height: 20,}} resizeMode="contain"/>
      </TouchableOpacity>

      <View style={{ height: height, justifyContent: "center" }}>
          <View style={{ justifyContent: "space-between", alignItems: "center", height: 250 }}>
            <Image source={require('../../assets/screen-icons/hexagon.png')} style={{height: 91}} resizeMode="contain"/>
            <Text style={{fontSize: 29, fontFamily: "Assistant-SemiBold", color: "#fff", textAlign: "center"}}>Access All 30+ Exercises</Text>
            <View style={{ width: 287, justifyContent:"space-between", height: 100}}>
              <CheckItem text="Unlock All Content with Memoir Unlimited"/>
              <CheckItem text="Heart Rate* &amp; Long-Hold Training"/>
              <CheckItem text="New Exercises Added Regularly"/>
              <CheckItem text="Cancel Anytime, Satisfaction Guaranteed"/>
            </View>
          </View>

          <View style={{ alignItems: "center", height: height * 0.4, justifyContent: "space-evenly"}}> 
            <Text style={{color: "#fff", fontFamily: "Assistant-SemiBold", fontSize: 17.5, lineHeight: 22, width: 287, textAlign: "center", }}>
              Choose Your Subscription Option:
            </Text>

          <TouchableOpacity style={styles.blueButton} onPress={() => console.log("stuff")}>
            <View style={{flexDirection: "row", alignItems: "flex-end"}}>
              <Text style={{fontFamily: "Assistant-SemiBold", color: "#fff", fontSize: 21, marginBottom: -3}}>$69.99 Annual</Text>
              <Text style={{fontFamily: "Assistant-SemiBold", color: "#fff", fontSize: 14, marginLeft: 5}}>(Save 53%)</Text>
            </View>
            <Text style={{fontFamily: "Assistant-SemiBold", color: "#fff", fontSize: 14}}>$5.83/month  |  First 14 Days Free</Text>
          </TouchableOpacity>

          <TouchableOpacity style={{...styles.blueButton, backgroundColor: "#F2F2F2"}} onPress={() => console.log("stuff")}>
            <Text style={{fontFamily: "Assistant-SemiBold", color: "#535353", fontSize: 21}}>$12.99 Monthly</Text>
            <Text style={{fontFamily: "Assistant-SemiBold", color: "#535353", fontSize: 14}}>No Commitment  |  First 7 Days Free</Text>
          </TouchableOpacity>

          <View style={{alignItems: "center"}}>
            <View style={{flexDirection: "row", alignItems: "center"}}>
              <TouchableOpacity style={{ justifyContent: "center", alignItems: "center", padding: 5}} onPress={() => ""}>
                <Text style={{fontFamily: "Assistant-SemiBold", color: "#fff", fontSize: 14}}>Restore Purchase</Text>
              </TouchableOpacity>
              <Text style={{fontFamily: "Assistant-SemiBold", color: "#fff", fontSize: 14}}>|</Text>
              <TouchableOpacity style={{ justifyContent: "center", alignItems: "center", padding: 5}} onPress={() => ""}>
                <Text style={{fontFamily: "Assistant-SemiBold", color: "#fff", fontSize: 14}}>Terms &amp; Conditions</Text>
              </TouchableOpacity>
            </View>
            <Text style={{color: "#fff", fontSize: 10.5, fontFamily: "Assistant-SemiBold"}}>*Apple Watch required for Heart Rate Training</Text>
          </View>
        </View>
      </View>

      { showPopUp ? <CreateAccountPopup /> : null }
    
    </ImageBackground>
  )
}


const CheckItem = ({ text }) => (
  <View style={{flexDirection: "row", alignItems: "center",}}>
    <Image source={require('../../assets/screen-icons/checkmark.png')} style={{height: 9.5, width: 12.46, marginRight: 10}} resizeMode="contain"/>
    <Text style={{color: "#fff", fontSize: 14.5, fontFamily: "Assistant-SemiBold"}}>{text}</Text>
  </View>
)



const styles = StyleSheet.create({
  blueButton: {
    backgroundColor: "#3681C7",
    // height: Math.min(height * 0.07, 58),
    height: 72,
    width: 309,
    borderRadius: 15,
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
    fontSize: 21,
    fontFamily: "Assistant-SemiBold"
  }
})