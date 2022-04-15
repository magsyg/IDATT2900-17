import React, { useState, useEffect } from 'react'
import axios from 'axios'
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

export default function ContactBrandScreen({ route, navigation }) {
  const {brand_id} = route.params
  const [brand, setBrand] = useState({'name':"BRAND NAME", "members":[], "bio":"COMPANY BIO","homepage":"www.gleu.app"});
  const [appointments, setAppointments] = useState([]);

  const goToAppointment = item => {
    if (item.appointment_type!=='SR') {
      navigation.navigate('Appointment',{ 
        screen: 'MultiAppointment',
        params: {
          screen: 'MultiAppointmentScreen',
          params:{appointment_id:item.id}
        },
      });
    } else {
      navigation.navigate('Appointment',{ 
        screen: 'Showroom',
        params: {
          screen: 'ShowroomScreen',
          params:{appointment_id:item.id}
        },
      });
    }
  }
  const goToScheduleContact = () => {
    navigation.navigate('ScheduleContactBrand',{brand_id:brand_id}
    );
  }

  useEffect(() => {
    axios.get(`/companies/brand/${brand_id}/profile/`).then((response) => {
      setBrand(response.data.brand)
      setAppointments(response.data.appointments)
    }).catch(function (error) {
      console.log("-----axios----")
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
      console.log("-----axios----")
    });
  }, [brand_id]);

  return (
    <Background>
      <View style= {styles.column}>
        <View style={styles.row}> 
          <BackHeader goBack={navigation.goBack}>  
            <Avatar.Image 
                size={64} 
                source={require('../../../assets/default_profile.png')}  
            />
          </BackHeader>
        </View>
        <Header style={{textAlign:'center'}}>{brand.name}</Header>
        <LocationInfo item={brand}/>
        <View style={[styles.row, {marginTop:16}]}>
          <OutlinedButton style={{flex:1, marginEnd:6}} labelStyle={{fontSize:14}}>Lookbook</OutlinedButton>
          <OutlinedButton style={{flex:1, marginStart:6}} labelStyle={{fontSize:14}}>Line Sheet</OutlinedButton>
        </View>
        <View>
          <Button onPress={goToScheduleContact}>Schedule</Button>
        </View>
        <View style={{marginVertical:16}}>
          <Header2>NEXT SHIPMENT: MM/DD/YY</Header2>
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
          <Header2>WHOLESALE TEAM</Header2>
          <ScrollView nestedScrollEnabled = {true} horizontal={true} contentContainerStyle={{flex: 1,justifyContent:'flex-start'}}>
          {brand.members.map((item, index) => {
              return(
                <TouchableOpacity key={index} style={{margin:2}} onPress={() => select(item)}>
                  <Avatar.Image 
                    size={48} 
                    source={require('../../../assets/default_profile.png')}  
                  />
                </TouchableOpacity>
              );     
            })
          }
          </ScrollView>
        </View>
        <View style={{marginVertical:32, justifyContent:'flex-start'}}>
          <Header2>Company Profile</Header2>
          <Paragraph>{brand.bio}</Paragraph>
          <PillLink>{brand.homepage}</PillLink>
        </View>
      </View>

    </Background>
  )
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