import * as React from 'react';
import { Text, View, StatusBar, Alert, Image, Dimensions, StyleSheet, TouchableOpacity } from 'react-native';
import { useFonts } from 'expo-font';
import { AuthContext } from '../../../components/context';
import { useIsFocused } from '@react-navigation/native';
import * as WebBrowser from 'expo-web-browser';

const { width, height } = Dimensions.get('window');

import firebase from 'firebase';

export default function SettingsScreen({ navigation }) {
  const isFocused = useIsFocused();
  const { signOut, userToken } = React.useContext(AuthContext);

  const logOutAlert = () => {
    Alert.alert("Are you sure you want to logout?", "", [
        {text: "Yes", onPress: () => signOutToHome()}, 
        {text: "Cancel", style: "cancel"}
      ]
    );
  };

  const signOutToHome = () => {
    signOut();
    navigation.navigate("SplashScreen", { fromLogout: true });

    // setTimeout(() => {
    //   navigation.navigate("Profile");
    // }, 2000);
    // then, back to "Progress" screen
  };

  // const [showPopUp, setShowPopup] = React.useState(false);
  // React.useEffect(() => {
  //   if (!userToken) {
  //     setTimeout(() => {
  //       isFocused ? setShowPopup(true) : setShowPopup(false)
  //     }, 1000);
  //   }
  // }, [isFocused])


  let [fontsLoaded] = useFonts({
    'Assistant': require('../../../assets/fonts/Assistant/Assistant-VariableFont_wght.ttf'),
    'Assistant-Regular': require('../../../assets/fonts/Assistant/static/Assistant-Regular.ttf'),
    'Assistant-SemiBold': require('../../../assets/fonts/Assistant/static/Assistant-SemiBold.ttf'),
  });


  // Change Password button
  const currUser = firebase.auth().currentUser;
  const currUserEmail = currUser ? currUser.email : null;

  const resetPassword = (email) => {
    firebase.auth().sendPasswordResetEmail(email).then(error => error ? null : alert("Password email sent. Check your email!")).catch(error => alert(error))
  }


  return (
    // <ImageBackground source={bgImage} style={{ flex: 1, resizeMode: "cover", justifyContent: "flex-start",}}>
    <View style={{ flex: 1, resizeMode: "cover", justifyContent: "flex-start", backgroundColor: "white"}}>
      {isFocused ? <StatusBar barStyle="dark-content" hidden={false}/> : null}
      <TouchableOpacity onPress={() => navigation.goBack()} style={{position: "absolute", top: height * 0.045,  zIndex: 100, padding: 15}}>
        <Image source={require('../../../assets/screen-icons/back-arrow.png')} style={{height: 20, }} resizeMode="contain"/>
      </TouchableOpacity>


      {/* <Text style={{textAlign: "center", fontSize: 23, fontFamily: "Assistant-SemiBold", position: "absolute", width: width, top: height * 0.055, color: 'black'}}>Settings</Text> */}
    

      <View style={{height: height, marginTop: Math.min(height * 0.05, 0)}}>
        {/* <ScrollView> */}
          <View style={{ height: height, justifyContent: "center", flexDirection: "column", alignItems: "center", }}>
          
            <View style={{ alignItems: "center", height: height * 0.73, }}> 
              {userToken ? 
              <View>
                <SettingOption text={"Account Info"} action={() => navigation.navigate("AccountInfoScreen")}/>
                {/* <SettingOption text={"Notifications"} action={() => console.log("nothing yet!")}/> */}
                {/* <SettingOption text={"Billing Info"} action={() => console.log("nothing yet!")}/> */}
                {/* <SettingOption text={"Subscriptions"} action={() => console.log("nothing yet!")}/> */}
                {/* <SettingOption text={"Restore Purchase"} action={() => console.log("nothing yet!")}/> */}
                {/* <SettingOption text={"Change Password"} action={() => resetPassword(currUserEmail)}/> */}
                <SettingOption text={"Change Password"} action={() => navigation.navigate("ChangePasswordScreen")}/>
                <SettingOption text={"Support"} action={() => WebBrowser.openBrowserAsync("https://memoirapp.squarespace.com/contact")}/>
                <SettingOption text={"Terms & Conditions"} action={() => WebBrowser.openBrowserAsync("https://memoirapp.squarespace.com/terms-of-service")}/>
                <SettingOption text={"Privacy Policy"} action={() => WebBrowser.openBrowserAsync("https://memoirapp.squarespace.com/privacy-policy")}/>
                {/* <SettingOption text={"Privacy Policy"} action={() => WebBrowser.openBrowserAsync("https://www.privacypolicygenerator.info/live.php?token=JVOQUQnNzluF7M5IuHUKPcBXSlNLZBgX")}/> */}
                <SettingOption text={"Log Out"} action={logOutAlert}/>
              </View>
              : 
              <View>
                {/* <SettingOption text={"Notifications"} action={() => console.log("nothing yet!")}/> */}
                <SettingOption text={"Support"} action={() => WebBrowser.openBrowserAsync("https://memoirapp.squarespace.com/contact")}/>
                <SettingOption text={"Terms & Conditions"} action={() => WebBrowser.openBrowserAsync("https://memoirapp.squarespace.com/terms-of-service")}/>
                <SettingOption text={"Privacy Policy"} action={() => WebBrowser.openBrowserAsync("https://memoirapp.squarespace.com/privacy-policy")}/>
                <SettingOption text={"Log In"} action={() => navigation.goBack()}/>
              </View>
              }
             

            </View>
          </View>
        {/* </ScrollView> */}
      </View>

      {/* { showPopUp ? <CreateAccountPopup /> : null } */}

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
    width: width < 330 ? width * 0.8 : 290,
    height: Math.min(height * 0.09, 61),
    // height: height * 0.05,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // borderWidth: 1,
    // margin: 5
    // borderWidth: 1
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