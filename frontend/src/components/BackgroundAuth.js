import React, { useEffect } from 'react'
import {ScrollView, Text, View, StyleSheet, KeyboardAvoidingView } from 'react-native'
import { theme } from '../core/theme'
import CurrentUserContext  from '../../Context'
import Background from './Background'
import { ActivityIndicator } from 'react-native-paper'
import {useNavigation} from '@react-navigation/native';

export default function BackgroundAuth({ children }) {
  // Background used for pages where auth is required, returns to login if there is no current user
  const { authIsLoading, currentUser } = React.useContext(CurrentUserContext);
  const navigation = useNavigation();
  
  // Checks if user is authenticated, if not return to loginscreen
  useEffect(() => {
    console.log("USER");
    console.log(currentUser);
    if(!authIsLoading && currentUser === null) {
      console.log("lolololo");
      navigation.navigate('Authentication');
    }
  }, [authIsLoading, currentUser]);

  if (authIsLoading  || currentUser === null) {
    return <ActivityIndicator style={styles.loading}size='large' animating={true} color={theme.colors.secondary} />
  } else {
    return (
    <Background withBottomBar={true}>
      {children}
    </Background>
    )
  }
}

const styles = StyleSheet.create({
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center'
  }
})
