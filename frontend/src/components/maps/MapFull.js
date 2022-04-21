import React from 'react';
import MapView, { Animated, Marker } from 'react-native-maps';
import { StyleSheet, View, Dimensions } from 'react-native';
import Autocomplete from './Autocomplete';

export default function Map() {
  
  const selectedLocation = JSON.parse(
    Storage.getItem('SelectedLocation'))

  onRegionChange = (region) => {
    this.state.region.setValue(region);
  }

  return (
    <View style={styles.container}>
      <Animated
        region={this.state.region}
        onRegionChange={this.onRegionChange}
      />
      <MapView 
        style={styles.map}
        initialRegion={{
          latitude: selectedLocation.lat,
          longitude: selectedLocation.lng,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }} 
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
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    position: 'absolute',
    top: 50,
  },
});