import React, { useState, useEffect } from 'react'

import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import { Text, Subheading, Avatar, Badge } from 'react-native-paper'
import Background from '../../../components/Background'
import Icon from "react-native-vector-icons/MaterialIcons";
import Header from '../../../components/Header'
import OptionIconLink from '../../../components/OptionIconLink'
import BackButton from '../../../components/BackButton'
import { theme } from '../../../core/theme'
import BackHeader from '../../../components/BackHeader'
import AppointmentInfo from '../../../components/AppointmentInfo'
import OutlinedButton from '../../../components/OutlinedButton'
import LocationInfo from '../../../components/LocationInfo'
import Header2 from '../../../components/Header2'
import { FlatList } from 'react-native-gesture-handler'
import OutlinedTouch from '../../../components/OutlinedTouch'
import Paragraph from '../../../components/Paragraph'
import PillLink from '../../../components/PillLink'
import Button from '../../../components/Button'
import ProfilePicture from '../../../components/ProfilePicture'
import CompanyLogo from '../../../components/CompanyLogo'
import CurrentUserContext from '../../../../Context'
import BackgroundAuth from '../../../components/BackgroundAuth'
import api from '../../../../api';

export default function ContactRetailerScreen({ route, navigation }) {
  const { currentUser, authIsLoading } = React.useContext(CurrentUserContext);
  const {retailer_id} = route.params
  
  const [retailer, setRetailer] = useState({'name':"SHOP NAME", "members":[], "bio":"COMPANY BIO","homepage":"www.gleu.app"});
  const [appointments, setAppointments] = useState([]);

  const goToAppointment = item => {
    if (item.appointment_type!=='SR') {
      navigation.navigate('MultiAppointment',{
        screen: 'MultiAppointmentScreen',
        params: {
          appointment_id:item.id
        }});
    } else {
      navigation.navigate('Showroom',{appointment_id:item.id});
    }
  }

  useEffect(() => {
    api.get(`/companies/retailer/${retailer_id}/profile/`).then((response) => {
      setRetailer(response.data.retailer)
      setAppointments(response.data.appointments)
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
  }, [retailer_id]);

  // Render Method
  // Only render when authenticatated
  if (!authIsLoading && currentUser !== null) {
    return (
      <BackgroundAuth>
        <View style= {styles.column}>
          <View style={styles.row}> 
            <BackHeader goBack={navigation.goBack}>  
              <CompanyLogo
                  size={64} 
                  company={retailer}
              />
            </BackHeader>
          </View>
          <Header style={{textAlign:'center'}}>{retailer.name}</Header>
  
          <View style={[styles.row, {marginTop:16}]}>
            <OutlinedButton style={{flex:1, marginEnd:6}} labelStyle={{fontSize:14}}>Lookbook</OutlinedButton>
            <OutlinedButton style={{flex:1, marginStart:6}} labelStyle={{fontSize:14}}>Line Sheet</OutlinedButton>
          </View>
          <View>
            <Button>Send Scheduling Reminder</Button>
          </View>
          <View style={{marginVertical:16}}>
            <Header2>BUYERS</Header2>
            <Avatar.Image 
                  size={48} 
                  source={require('../../../assets/default_profile.png')}  
            />
          </View> 

          <View style={{marginVertical:16}}>
            <Header2>APPOINTMENT HISTORY</Header2>
            <FlatList
              data={appointments}
              numColumns={1}
              scrollEnabled={true}
              renderItem={({item, index}) =>  
                <OutlinedTouch key={index} style={styles.appointmentButton} onPress={() => goToAppointment(item)}>
                  <Text style={styles.appointmentButtonText}>{item.date}</Text>
                  <Text style={styles.appointmentButtonText}>{item.name}</Text>
                </OutlinedTouch>
              }
            />
          </View>
          <View style={{marginVertical:16}}>
            <Header2>Retail Information</Header2>
          </View>
          <View style={{marginVertical:32, justifyContent:'flex-start'}}>
            <Header2>Company Profile</Header2>
            <Paragraph>{retailer.bio}</Paragraph>
            <PillLink>{retailer.homepage}</PillLink>
          </View>
        </View>
      </BackgroundAuth>
    )
  } else {
    return (<BackgroundAuth/>)
  }
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent:'center',
    alignItems:'center',
    marginTop: 4,
  },
  column: {
    flex: 1,
    flexDirection: "column",
    justifyContent: 'center',
    width:'100%'
  },
  link: {
    fontWeight: 'bold',
    color: theme.colors.link,
  },
  border: {
    borderWidth:1,
    borderColor:theme.colors.primary
  },
  appointmentButton: {
    padding:24,
    marginBottom:8,
    flexDirection:'row',
    justifyContent:'space-between'
  },
  appointmentButtonText: {
    fontSize:16,
    marginVertical:4,
  }
})
