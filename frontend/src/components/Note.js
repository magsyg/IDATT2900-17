import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Text, IconButton} from 'react-native-paper'
import { theme } from '../core/theme'
import Header2 from './Header2'
import Paragraph from './Paragraph'

export default function Note({containerStyle}) {
  //TODO maybe rename this
  return (     
    <View style={containerStyle}>      
      <View style={[styles.row, {justifyContent:'space-between'}]}>
        <Header2>MAKE A NOTE</Header2>
        <IconButton size={32} icon='plus' color={theme.colors.grey}/>
      </View>
      <Paragraph>
          TODO ADD FUNCTIONIONALITY FOR THIS
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
          sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
          Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum
      </Paragraph>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    fontSize: 31,
    color: theme.colors.primary,
    paddingVertical: 12,
  },
})
