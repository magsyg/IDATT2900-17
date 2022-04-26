import React from 'react';
import MapView, { Marker } from 'react-native-maps';
import { StyleSheet, View, Dimensions } from 'react-native';

export default function MapMini() {

  return (
      <View style={styles.container}>
        <MapView 
          style={styles.map} 
        />
      </View>
  );
} 

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: Dimensions.get('window').width * 0.75,
    height: Dimensions.get('window').height * 0.4,
  },
});