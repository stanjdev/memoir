import * as React from 'react';
import { Text, View, StatusBar, Button, Alert, Image, Dimensions, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import { AuthContext } from '../../components/context';
import Exercise from '../../components/Exercise';
import { useIsFocused } from '@react-navigation/native';

import { ScrollView } from 'react-native-gesture-handler';

import { useFonts } from 'expo-font';
// import { AppLoading } from 'expo';

const { width, height } = Dimensions.get('window');

import CreateAccountPopup from '../../components/CreateAccountPopup';


export default function FavoritesScreen() {
  const isFocused = useIsFocused();
  
  let [fontsLoaded] = useFonts({
    'Assistant': require('../../assets/fonts/Assistant/Assistant-VariableFont_wght.ttf'),
    'Assistant-Regular': require('../../assets/fonts/Assistant/static/Assistant-Regular.ttf'),
    'Assistant-SemiBold': require('../../assets/fonts/Assistant/static/Assistant-SemiBold.ttf'),
  });
  
  const { userToken } = React.useContext(AuthContext)
  
  const [showPopUp, setShowPopup] = React.useState(false);
  React.useEffect(() => {
    if (!userToken) {
      setTimeout(() => {
        isFocused ? setShowPopup(true) : setShowPopup(false)
      }, 500);
    }
  }, [isFocused])


  return (
    <View>
      <ScrollView style={{backgroundColor: "white"}} scrollEnabled={userToken ? true : false}>
        {isFocused ? <StatusBar barStyle="dark-content" hidden={false}/> : null}
        {fontsLoaded ?

        <View style={{marginTop: 50}}>
          <Text style={{textAlign: "center", fontSize: 23, fontFamily: "Assistant-SemiBold"}}>Favorites</Text>
          <View style={{flex: 1, flexDirection: "row", justifyContent: "center", alignContent: "stretch", padding: 20, flexWrap: "wrap"}}>
            
            <Exercise image={require("../../assets/exercises-images/jungle-green.png")} title="Box Breathing" subTitle="4 Second Box Pattern"/>
            <Exercise image={require("../../assets/exercises-images/forest-orange.png")} title="Ride the Wave" subTitle="Slow Deep Breathing"/>
            <Exercise image={require("../../assets/exercises-images/breathe-4x.png")} title="Breathe for Focus" subTitle="Get in the Zone"/>
            <Exercise image={require("../../assets/exercises-images/minute-break-4x.png")} title="1 Minute Break" subTitle="60 Seconds of Zen"/>
            <Exercise image={require("../../assets/exercises-images/forest-dawn-4x.png")} title="Box Breathing" subTitle="4 Second Box Pattern"/>
            <Exercise image={require("../../assets/exercises-images/purple-4x.png")} title="Cosmos" subTitle="Relax with the Universe"/>
            <Exercise image={require("../../assets/exercises-images/redrock-4x.png")} title="1 Minute Break" subTitle="60 Seconds of Zen"/>
            <Exercise image={require("../../assets/exercises-images/aurora-4x.png")} title="Breathe for Focus" subTitle="Get in the Zone"/>

          </View>


        </View>

        : null
        // <AppLoading />
        }
        
      </ScrollView>

      {showPopUp ? <CreateAccountPopup /> : null}
    </View>
  )
}



