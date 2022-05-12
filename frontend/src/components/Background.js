import React from 'react'
import {ScrollView, View, StyleSheet, KeyboardAvoidingView } from 'react-native'
import { theme } from '../core/theme'

import CurrentUserContext  from '../../Context'
import HoveringBar from './HoveringBar';

export default function Background({ withBottomBar, children }) {
  const { currentUser } = React.useContext(CurrentUserContext);
  return (
    <View style={styles.background}>
        <ScrollView>
          <KeyboardAvoidingView style={styles.container} behavior="padding">
            {children}
          </KeyboardAvoidingView>
        </ScrollView>
        <HoveringBar/>
    </View>
  )
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    backgroundColor: theme.colors.surface,
  },
  container: {
    flex: 1,
    padding: 20,
    marginBottom:96,
    width: '100%',
    maxWidth: 360,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
