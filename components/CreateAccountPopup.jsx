import React, { useEffect, useContext } from 'react';
import { Text, View, Button, StyleSheet, StatusBar, Image, Dimensions, ImageBackground, TouchableOpacity, Alert } from 'react-native';
import AppButton from './AppButton';
const { width, height } = Dimensions.get('window');

import * as Animatable from 'react-native-animatable';
import { useFonts } from 'expo-font';
import { useNavigation } from '@react-navigation/native';

import { AuthContext } from '../components/context';

// Firebase setup for FB
import * as firebase from 'firebase';
const provider = new firebase.auth.FacebookAuthProvider();


// Expo way
import * as Facebook from 'expo-facebook';
import * as AppleAuthentication from 'expo-apple-authentication';



export default function CreateAccountPopup() {
  const navigation = useNavigation();

  let [fontsLoaded] = useFonts({
    'Assistant': require('../assets/fonts/Assistant/Assistant-VariableFont_wght.ttf'),
    'Assistant-Regular': require('../assets/fonts/Assistant/static/Assistant-Regular.ttf'),
    'Assistant-SemiBold': require('../assets/fonts/Assistant/static/Assistant-SemiBold.ttf'),
  });

  const { appleSignUp, appleTokenIn, userToken, fbSignUp, fbTokenIn } = useContext(AuthContext);





  const fbAppId = "200817071551403";
  const fbAppName = 'memoir'

  const signInWithFacebook = async () => {
    await Facebook.initializeAsync({fbAppId, fbAppName});
    const {type, token} =  await Facebook.logInWithReadPermissionsAsync({ permissions: ['public_profile', 'email', 'user_friends'] })
    // console.log("Token: ", token)
    if (type === "success") {
      const response = await fetch(`https://graph.facebook.com/me?access_token=${token}&fields=id,first_name,last_name,email`)
      const json = await response.json();
      console.log("facebook response: ", json);
      
      const first_name = json["first_name"];
      const last_name = json["last_name"];
      const email = json["email"] ? json["email"] : null;
      const userId = json["id"];
      
      // console.log("name!: ", first_name, last_name, email, userId, token);
      try {
        fbSignUp(email, first_name, last_name, userId, token);
      } catch (error) {
        console.log(error);
      }

    } else {
      alert(type);
    }
  }

/* 
From sign in with FB:
facebook response:  Object {
  "email": "yumdrums@gmail.com",
  "first_name": "Art",
  "id": "167275698465108",
  "last_name": "Boshy",
  "name": "Art Boshy",
  "picture": Object {
    "data": Object {
      "height": 50,
      "is_silhouette": true,
      "url": "https://scontent-lax3-1.xx.fbcdn.net/v/t1.30497-1/cp0/c15.0.50.50a/p50x50/84628273_176159830277856_972693363922829312_n.jpg?_nc_cat=1&ccb=2&_nc_sid=12b3be&_nc_ohc=tX0DMIu28LgAX-oIMMJ&_nc_ht=scontent-lax3-1.xx&tp=27&oh=3563f373140aacb411c7ef6bcb49a7b1&oe=5FFBD3B8",
      "width": 50,
    },
  },
}
*/



  // Not working with latest Expo SDK? 
  // async function fbSignIn () {
  //   try {
  //     await Facebook.initializeAsync({
  //       appId: '200817071551403',
  //     });
  //     const {type, token} = await Facebook.logInWithReadPermissionsAsync('200817071551403', { permissions: ['public_profile'] });

  //     if (type == "success") {
  //       const credential = firebase.auth.FacebookAuthProvider.credential(token)
    
  //       await firebase.auth().signUpWithCredential(credential).catch((error) => {
  //         console.log(error)
  //       })
  //     }
  //   } catch (error) {
  //     console.log(`Facebook Login Error: ${error}`)
  //   }
  // };




/* 
GOOGLE FIREBASE WEB APP FB WAY
auth/operation-not-supported-in-this-environment 
This operation is not supported in the environment this application is runningon. 
"location.protocol" must be http, https or chrome-extension and web storage must be enabled.
*/
  async function fbSignIn () {
    firebase.auth().signInWithPopup(provider)

    .then(function(result) {
      var token = result.credential.accessToken;
      var user = result.user;

      // console.log(token)
      // console.log(user)
    }).catch(function(error) {
      console.log(error.code);
      console.log(error.message);
    })
  };
  


// Firebase way failed
// const provider = new firebase.auth.OAuthProvider('apple.com');

// const signInWithAppleFireBase = () => {
//   firebase.auth().signInWithRedirect(provider);
// }







// EXPO AppleAuthentication + FIREBASE WEB APP WORKAROUND
const signInWithApple = async () => {
  try {
    const credential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
    });

    // signed in
    console.log(credential);
    if (credential.email !== null || credential.fullName.givenName !== null) {
      // create a new account with SignUp method with email, name, and userIdtoken.
      await appleSignUp(credential.email, credential.fullName.givenName, credential.fullName.familyName, credential.user)
      console.log("signUpWithApple!")
    } else {
      // just send over the userToken
      await appleTokenIn(credential.user);
      console.log("tokenwithApple!")
    }

    const appleUserInfoRef = await firebase.database().ref(credential.user).child('appleUserInfo');
    await appleUserInfoRef.once('value', async snapshot => {
      if (snapshot.val() === null) {
        console.log("no appleUserInfo Object!")
      }
    })

  } catch (e) {
    if (e.code === 'ERR_CANCELED') {
      // alert(e);
      // handle that the user canceled the sign-in flow
    } else {
      // handle other errors
    }
  }
}


useEffect(() => {
  if (userToken) {
    navigation.navigate('UserWelcomeScreen')
  }
}, [userToken])






  return (
    <Animatable.View style={styles.footerIntro} animation="fadeInUpBig">
      <View>
        <Text style={{fontSize: 25, color: "#535353", textAlign: "center", width: 290, fontFamily: "Assistant-SemiBold", }}>Create a Free Account to View Your Favorites, Track Progress, and more.</Text>
      </View>
      <View style={{ height: 250, justifyContent: "space-between"}}>
        <AppButton 
          title="Sign in with Facebook" 
          buttonStyles={styles.facebookButton} 
          buttonTextStyles={styles.buttonText} 
          onPress={signInWithFacebook}
          icon={"FontAwesome"}
          name={"facebook-square"}
          size={28}
          color={"white"}
        />
        <AppButton 
          title="Sign in with Apple" 
          buttonStyles={styles.appleButton} 
          buttonTextStyles={styles.buttonText} 
          onPress={signInWithApple}
          icon={"Fontisto"}
          name={"apple"}
          size={28}
          color={"white"}
        />

      {/* <AppleAuthentication.AppleAuthenticationButton
        buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
        buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
        cornerRadius={5}
        style={{ width: 327, height: 63 }}
        onPress={}
      /> */}

        
        <AppButton 
          title="Sign up with Email" 
          buttonStyles={styles.emailButton} 
          buttonTextStyles={styles.emailButtonText} 
          onPress={() => navigation.navigate('SignUpScreen')}
          icon={"Fontisto"}
          name={"email"}
          size={28}
          color={"black"}
        />
      </View>
      <View style={{alignItems: "center"}}>
        <Text style={{fontSize: 15, color: "#535353", fontFamily: "Assistant-SemiBold"}}>Already Have an Account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('SignInScreen')}>
          <Text style={{fontSize: 20, color: "#535353", fontFamily: "Assistant-SemiBold", padding: 10, paddingLeft: 20, paddingRight: 20, }}>Log-In</Text>
        </TouchableOpacity>

        {/* <Button style={{fontSize: 20, color: "#535353", fontFamily: "Assistant-SemiBold"}} title="Log-In" onPress={() => navigation.navigate('SignInScreen')}></Button> */}
      
      </View>
    </Animatable.View>
  )
}




const styles = StyleSheet.create({

  footerIntro: {
    // borderWidth: 1,
    width: width,
    flex: 4.5,
    height: Math.min(height * 0.79, 600),
    // height: Math.min(height * 0.69),
    position: "absolute",
    bottom: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingVertical: 40,
    paddingHorizontal: 45,
    justifyContent: "space-evenly",
    alignItems: "center"
  },
  facebookButton: {
    backgroundColor: "#3681C7",
    height: 63,
    width: 327,
    borderRadius: 7,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    flex: 1,
    textAlign: "center",
    fontSize: 23,
    fontFamily: "Assistant-SemiBold"
  },
  appleButton: {
    backgroundColor: "#1E1E1E",
    height: 63,
    width: 327,
    borderRadius: 7,
    alignItems: "center",
    justifyContent: "center",
  },
  emailButton: {
    backgroundColor: "#FFF",
    height: 63,
    width: 327,
    borderWidth: 2,
    borderRadius: 7,
    alignItems: "center",
    justifyContent: "center",
  },
  emailButtonText: {
    color: "#1E1E1E",
    flex: 1,
    textAlign: "center",
    fontSize: 23,
    fontFamily: "Assistant-SemiBold"
  }
});