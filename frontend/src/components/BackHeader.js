import React from 'react'
import { TouchableOpacity, Image, StyleSheet, View, Text } from 'react-native'
import { IconButton } from 'react-native-paper'
import Icon from "react-native-vector-icons/MaterialIcons";
import { getStatusBarHeight } from 'react-native-status-bar-height'
import { theme } from '../core/theme'

export default function BackHeader({ goBack , children}) {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={goBack}>
        <Icon size={32} name='keyboard-backspace' color={theme.colors.grey}></Icon>
      </TouchableOpacity>
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingTop:24,
    marginBottom:32, 
    borderColor:theme.colors.grey,
    width:'100%',
    flexDirection: 'row',
    justifyContent:'space-between',
    alignItems:'center',
  },
})
