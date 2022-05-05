import React, {useEffect, useState} from 'react'
import { StyleSheet, View, TouchableOpacity, Text, FlatList } from 'react-native'
import { theme } from '../core/theme'
import api from '../../api';
import CurrentUserContext from '../../Context';
import ShowroomRequest from './ShowroomRequest';

export default function ShowroomRequests() {
  const { currentUser } = React.useContext(CurrentUserContext);
  const [appointmentRequests, setAppointmentRequests] = useState([]);
  const updateState = () => {
    api.get('/appointments/user/requests/').then((response) => {
      setAppointmentRequests(response.data)
    }).catch(function (error) {
      
      if (error.response) {
        // Request made and server responded
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        console.log(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message);
      }
      
    });
  }

  useEffect(() => {
    updateState();
  }, []);

  return (
    <FlatList
      data={appointmentRequests}
      numColumns={1}
      scrollEnabled={true}
      renderItem={({item, index}) => 
          <ShowroomRequest key={index} appointment={item} onUpdate={updateState}/>
      }
    />
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent:'center',
    alignItems:'center',
    marginTop: 4,
  },
  name : {
    textAlign:'center',
  },
  contactType: {
    textAlign:'center',
    color:theme.colors.grey,
    fontStyle: 'italic'
  },
  buttonText: {
    color:theme.colors.primary, 
    fontSize:12
  },
  buttonStyle: {
    borderRadius:25, 
    marginVertical:8, 
  }
})