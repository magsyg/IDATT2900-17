import React from 'react'
import { StyleSheet } from 'react-native'
import { Button as PaperButton } from 'react-native-paper'
import { theme } from '../core/theme'

export default function Button({ mode, style, textColor, ...props }) {
  return (
    <PaperButton
      style={[
        styles.button,
        mode !== 'outlined' && { backgroundColor: theme.colors.secondary },
        style,
      ]}
      labelStyle={[styles.text, {color:theme.colors.white}]}
      mode={mode} 
      {...props}
    />
  )
}

const styles = StyleSheet.create({
  button: {
    width: '100%',
    marginVertical: 10,
    paddingVertical: 2,
    borderRadius:32,
    backgroundColor:theme.colors.white,
  },
  text: {
    fontSize: 15,
    lineHeight: 26,
    color:theme.colors.white
  },
})
