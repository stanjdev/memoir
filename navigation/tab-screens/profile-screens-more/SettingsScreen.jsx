import * as React from 'react';
import { Text, View, StatusBar, Button, Alert, Image, Dimensions, StyleSheet, ImageBackground, TouchableOpacity, ScrollView } from 'react-native';
import AppButton from '../../../components/AppButton';
import { AuthContext } from '../../../components/context';
import { useIsFocused } from '@react-navigation/native';
import CreateAccountPopup from '../../../components/CreateAccountPopup';

import { useFonts } from 'expo-font';

const { width, height } = Dimensions.get('window');
const bgImage = require('../../../assets/splash/memoir-splash-thin-4x.png')
import ProfileStatsBlock from '../../../components/ProfileStatsBlock';



export default function SettingsScreen({navigation}) {
  const isFocused = useIsFocused();
  const { signOut, userToken } = React.useContext(AuthContext);

  const signOutToHome = () => {
    signOut();
    navigation.navigate('SplashScreen')
  }

  const [showPopUp, setShowPopup] = React.useState(false);
  React.useEffect(() => {
    if (!userToken) {
      setTimeout(() => {
        isFocused ? setShowPopup(true) : setShowPopup(false)
      }, 1000);
    }
  }, [isFocused])



  let [fontsLoaded] = useFonts({
    'Assistant': require('../../../assets/fonts/Assistant/Assistant-VariableFont_wght.ttf'),
    'Assistant-Regular': require('../../../assets/fonts/Assistant/static/Assistant-Regular.ttf'),
    'Assistant-SemiBold': require('../../../assets/fonts/Assistant/static/Assistant-SemiBold.ttf'),
  });

  return (
    // <ImageBackground source={bgImage} style={{ flex: 1, resizeMode: "cover", justifyContent: "flex-start",}}>
    <View style={{ flex: 1, resizeMode: "cover", justifyContent: "flex-start", backgroundColor: "white"}}>
      {isFocused ? <StatusBar barStyle="dark-content" hidden={false}/> : null}
      <TouchableOpacity onPress={() => navigation.goBack()} style={{position: "absolute", top: height * 0.045,  zIndex: 100, padding: 15}}>
        <Image source={require('../../../assets/screen-icons/back-arrow.png')} style={{height: 20, }} resizeMode="contain"/>
      </TouchableOpacity>


      {/* <Text style={{textAlign: "center", fontSize: 23, fontFamily: "Assistant-SemiBold", position: "absolute", width: width, top: height * 0.055, color: 'black'}}>Settings</Text> */}
    

      <View style={{height: height, marginTop: Math.min(height * 0.05, 20)}}>
        {/* <ScrollView> */}
          <View style={{ height: height, justifyContent: "center", flexDirection:"column", alignItems: "center", }}>

            <View style={{ alignItems: "center", height: height * 0.75, justifyContent: "space-evenly",}}> 
              <SettingOption text={"Account Info"} action={() => console.log("nothing yet!")}/>
              <SettingOption text={"Notifications"} action={() => console.log("nothing yet!")}/>
              <SettingOption text={"Billing Info"} action={() => console.log("nothing yet!")}/>
              <SettingOption text={"Subscriptions"} action={() => console.log("nothing yet!")}/>
              <SettingOption text={"Restore Purchase"} action={() => console.log("nothing yet!")}/>
              <SettingOption text={"Support"} action={() => console.log("nothing yet!")}/>
              <SettingOption text={"Change Password"} action={() => console.log("nothing yet!")}/>
              <SettingOption text={"Terms & Conditions"} action={() => console.log("nothing yet!")}/>
              <SettingOption text={"Privacy Policy"} action={() => console.log("nothing yet!")}/>
              <SettingOption text={"Log Out"} action={signOutToHome}/>
            </View>
          </View>

        {/* </ScrollView> */}

      </View>

      { showPopUp ? <CreateAccountPopup /> : null }

    </View>
    // </ImageBackground>
  )
}

const SettingOption = ({ text, action }) => (
  <TouchableOpacity style={styles.item} onPress={action}>
    <Text style={styles.text}>{text}</Text>
    <Image style={styles.arrow} source={require("../../../assets/screen-icons/settings-arrow.png")} resizeMode="contain" />
  </TouchableOpacity>
)


const styles = StyleSheet.create({
  item: {
    width: 290,
    height: Math.min(height * 0.07, 58),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // borderWidth: 1,
    // margin: 5
  },
  text: {
    color: "#535353",
    textAlign: "center",
    fontSize: 21,
    fontFamily: "Assistant-SemiBold"
  },
  arrow: {
    height: 14
  }
})