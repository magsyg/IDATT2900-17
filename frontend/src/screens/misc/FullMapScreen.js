import React from 'react'
import { View, StyleSheet, useState } from 'react-native'
import { MapView, Marker } from 'react-native-maps'
import TextInput from '../../components/TextInput'

export default function FullMapScreen({ navigation }) {
  
  const [region, setRegion] = useState({
    latitude: 51.5079145,
    longitude: -0.0899163,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  })
  const backBtn = () => {
    navigation.navigate('Calendar')
  }

  return (
    <View>
      <View style={ styles.container }>
        <MapView 
          style={ styles.map }
          onRegionChangeComplete={(region) => setRegion(region)}
        />
      </View>
      <View style={ styles.searchbar}>
        <Button style={ styles.btn } onPress={ backBtn }>&#9587;</Button>
        <TextInput />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    flex: 1, //the container will fill the whole screen.
    justifyContent: "flex-end",
    alignItems: "center",
  },
  map: {
    ...StyleSheet.absoluteFillObject
  },
  searchbar: {
    display: 'flex',
    flexDirection: 'row',
  },
  btn: {

  }
})