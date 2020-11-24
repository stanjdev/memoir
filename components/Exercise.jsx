import React from 'react';
import { Text, View, Image, Dimensions, StyleSheet } from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';

import { useFonts } from 'expo-font';
import { AppLoading } from 'expo';

export default function Exercise({image, title, subTitle, navigation, onPress}) {
  return (
    <View style={styles.imageSmallContainer}>
      <TouchableOpacity onPress={onPress}>
        <Image source={image} style={styles.imageSmall} resizeMode="contain"/>
      </TouchableOpacity>
      <Text style={styles.exerciseTitleFont}>{title}</Text>
      <Text style={styles.exerciseSubTitleFont}>{subTitle}</Text>
    </View>
  )
}


const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  imageSmall: {
    width: width * 0.44,
    height: height * 0.35,
    // borderWidth: 1, 
  },
  imageSmallContainer: {
    // borderWidth: 1, 
    // width: 185,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 25
  },
  exerciseTitleFont: {
    fontFamily: "Assistant-SemiBold",
    fontSize: 18,
  },
  exerciseSubTitleFont: {
    fontFamily: "Assistant-SemiBold",
    fontSize: 14,
    color: "#737373"
  },
}) 