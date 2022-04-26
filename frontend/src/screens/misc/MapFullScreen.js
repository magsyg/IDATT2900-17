import React, { useState, useEffect } from 'react'
import { TouchableOpacity, StyleSheet, View, Dimensions } from 'react-native'
import { Button } from 'react-native-paper'
import MapView, { Animated, Marker } from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Constants from 'expo-constants';
//import GOOGLE_API_KEY from '@env';
import * as Location from 'expo-location';

const GOOGLE_PLACES_API_KEY = 'Key Goes Here';

export default function MapFullScreen({ navigation }) {

  const [location, setLocation] = useState(null)
  const [errorMsg, setErrorMsg] = useState(null)
  
  useEffect(() => {
    async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    };
  }, [])

  const onRegionChange = (region) => {
    this.state.region.setValue(region);
  }
  const onBack = () => {
    navigation.navigate('Calendar')
  }

  const fetchClicked = (data) => {
    fetch('https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/details/json?place_id=' + data.place_id + '&key=' + GOOGLE_PLACES_API_KEY)
      .then((response) => response.json())
      .then((responseJson) => { 
        setLocation(responseJson) = ({ name: responseJson.result.name, lat: responseJson.result.geometry.location.lat, lng: responseJson.result.geometry.location.lng })
        console.log(useState.location)
    })
  }

  return (
    <View style = {styles.column}>
      <View>
        <View style={styles.container2}>
          <MapView 
            style={styles.map}
            initialRegion={{
              latitude: 100,
              longitude: 100,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }} 
          />
        </View>
      </View>

      <View>
        <View style={styles.row}>
          <View>
            <Button onPress={ onBack } style={styles.button}>&#10006;</Button>
          </View>
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
      </View>
    </View>
    )
}

const styles = StyleSheet.create({
  row: {
    display: 'flex',
    flexDirection: 'row-reverse',
    alignItems: 'center',

    backgroundColor: '#ecf0f1',
    position: 'absolute',
    top: 0,
  },
  column: {
    flex: 1,
    flexDirection: "column"
  },
  container: {
    flex: 1,
    padding: 10,
    paddingTop: Constants.statusBarHeight + 10,
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    position: 'relative',
    top: Dimensions.get('window').height*0.6,
  },
  container2: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    flex: 1,
    padding: 10,
    paddingTop: Constants.statusBarHeight + 10,
  }
})