import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper'
import Constants from 'expo-constants';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import {useNavigation} from '@react-navigation/native';

const GOOGLE_PLACES_API_KEY = 'GOOGLE API KEY';

export default function Autocomplete() {

  const navigation = useNavigation()
  const onBack = () => {
    navigation.navigate('Calendar')
  }
    
  const fetchClicked = (data) => {
    fetch('https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/details/json?place_id=' + data.place_id + '&key=' + GOOGLE_PLACES_API_KEY)
      .then((response) => response.json())
      .then((responseJson) => { 
        const selectedLocation = ({ name: responseJson.result.name, lat: responseJson.result.geometry.location.lat, lng: responseJson.result.geometry.location.lng })
        console.log(selectedLocation)
    })
  }

  return (
    <View style={styles.row}>
      <Button onPress={ onBack }>&#10006;</Button>
      <View style={styles.container}>

        <GooglePlacesAutocomplete
          placeholder="Search Map"
          autoFocus={false}
          query={{
            key: GOOGLE_PLACES_API_KEY,
            language: 'en', // language of the results
          }}
          onPress={(data, details = null) => fetchClicked(data)
          }
          onFail={(error) => console.error(error)}
          nearbyPlacesAPI="GoogleMapsPlacesSearch"
          requestUrl={{
            url:
              'https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api',
            useOnPlatform: 'all', // or 'all'
          }} // this in only required for use on the web. See https://git.io/JflFv more for details.
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    paddingTop: Constants.statusBarHeight + 10,
  },
  row: {
    display: 'flex',
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: '#ecf0f1',
  },
 
});

