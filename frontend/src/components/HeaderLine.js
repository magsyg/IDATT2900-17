import React from 'react'
import { StyleSheet, View} from 'react-native'
import { Text } from 'react-native-paper'
import { theme } from '../core/theme'

export default function HeaderLine({lineStyle, containerStyle, textStyle, children}) {

    return (<View style={[styles.header, containerStyle]}>
        <View style={[styles.line, lineStyle]} />
            <View>
                <Text style={[styles.text, textStyle]}>{children}</Text>
            </View>
        <View style={styles.line} />
    </View>)
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row', 
    alignItems: 'center'
  },
  line: {
    flex: 1, 
    height: 1, 
    backgroundColor: 'black'
  },
  textStyle: { //TODO Find a way to create more space in line
    width: 50, 
    marginHorizontal:20,
    textAlign: 'center'
  }
})
