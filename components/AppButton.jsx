import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Fontisto } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';

const AppButton = ({onPress, title, buttonStyles, buttonTextStyles, icon, name, size, color, disabled}) => (
  <TouchableOpacity onPress={onPress} style={buttonStyles} disabled={disabled || false}>
    <View style={{flexDirection: "row", alignItems: "center", justifyContent: "center", paddingLeft: 25, paddingRight: 25}}>
      {icon === "MaterialCommunityIcons" ? <MaterialCommunityIcons name={name} size={size} color={color} /> : null}
      {icon === "Fontisto" ? <Fontisto name={name} size={size} color={color} /> : null}
      {icon === "FontAwesome" ? <FontAwesome name={name} size={size} color={color} /> : null}
      <Text style={buttonTextStyles}>{title}</Text>
    </View>
  </TouchableOpacity>
);

export default AppButton;