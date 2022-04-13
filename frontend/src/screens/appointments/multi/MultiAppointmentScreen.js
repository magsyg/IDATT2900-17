import React, { useState, useEffect } from 'react'
import axios from 'axios'
import filter from 'lodash.filter';
import { View, StyleSheet, Modal, ScrollView, TouchableOpacity, Text, FlatList } from 'react-native'
import { Avatar, Subheading, IconButton, Searchbar, Button } from 'react-native-paper'
import Background from '../../../components/Background'
import Icon from "react-native-vector-icons/MaterialIcons";
import Header from '../../../components/Header'
import { theme } from '../../../core/theme'
import OptionIconLink from '../../../components/OptionIconLink';
import Link from '../../../components/Link';
import { transformNiceDate } from '../../../utils/date_management';
import HeaderWithSub from '../../../components/HeaderWithSub';
import AddBrands from '../../../components/AddBrand';
import TeamSelect from '../../../components/TeamSelect';
import AppointmentInfo from '../../../components/AppointmentInfo';


export default function AppointmentScreen({ route, navigation }) {
  const {appointment_id} = route.params
  const [meta, setMeta] = useState({'user': {}, 'company':{'members':[]}, 'appointment':{'id':-1,'retailer':{
    'retailer_participants':[]},'start_time':'09:00','end_time':'10:00', 'date':'2022-04-10', 'appointment_type':'TS','brands':[], 'other_information':'lorem ipsum'}})

  const ap_types = {
    'TS':"Trade Show",
    'OT': "Other"
  }

  const inviteTeamRetailer = item => {
    const payload = {'user_id':item.id}
    axios.post(`/appointments/${meta.appointment.id}/retailer/invite/`, payload).then((response) => {
      let temp_meta = meta
      temp_meta.appointment.retailer.retailer_participants = response.data.retailer_participants
      setMeta(temp_meta);
    })  .catch(function (error) {
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
  }

  useEffect(() => {
    axios.get(`/appointments/${appointment_id}`).then((response) => {
      setMeta(response.data);
      console.log(response.data);
    })  .catch(function (error) {
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
  }, [appointment_id]);
  
  const showBrand = (brand) => {
    navigation.navigate('MultiAppointmentBrand', {'brand_id':brand.brand.id, 'appointment_id':meta.appointment.id});
  }

  const inviteBrand = (brand) => {
    const payload = {
      'appointment': meta.appointment.id,
      'brand': brand.id,
      'main_contact': brand.main_contact.id

    }
    axios.post('/appointments/brand/invite/', payload).then((response) => {
      navigation.navigate('MultiAppointmentBrand', {'brand_id':brand.id, 'tradeshow_id':meta.appointment.id});
    })  .catch(function (error) {
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
  }

  return (
    <Background>
      <View style={styles.column}>
        <HeaderWithSub containerStyle={{marginTop:16}} header={meta.appointment.name} subheader={ap_types[meta.appointment.appointment_type]+ ' appointment'} />
        <AppointmentInfo appointment={meta.appointment}/>
        
        <TeamSelect 
          containerStyle={{marginVertical:16}} 
          company={meta.company} 
          selectedUsers={meta.appointment.retailer.retailer_participants} 
          main_user={meta.appointment.retailer.organizer}
          addMethod={inviteTeamRetailer}
         />

        <View style={{marginTop:16}}>
          <View style={[styles.row, {justifyContent:'space-between'}]}>
            <Header>Brands</Header>
            <Link>Scan QR Code</Link>
          </View>
          <FlatList
            data={meta.appointment.brands}
            numColumns={1}
            scrollEnabled={true}
            renderItem={({item, index}) => 
              <OptionIconLink key={index} text={item.brand.name} onPress={() => showBrand(item)}><Icon name='keyboard-arrow-right' size={30} color={theme.colors.grey}/></OptionIconLink>
            }
          />
          <AddBrands completeAction={inviteBrand}/>
        </View>
       
        <View style={{marginTop:32}}>
            <Header>Other information</Header>
            <Text style={{color:theme.colors.grey}}>{meta.appointment.other_information.length > 0 ?
               meta.appointment.other_information:
               'No additional information'
              }
            </Text>
          
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
  button: {
    backgroundColor: theme.colors.grey,
    color: theme.colors.primary
  },
  teamRow: {
    flexDirection: 'row',
    justifyContent:'space-between',
    alignItems:'center',
    borderBottomColor: theme.colors.grey,
    borderBottomWidth: 1,
    marginBottom:8,
    padding:4, 
  },
  monthSelectStyle: {
    textAlign:'center', 
    fontSize:32
  }
})
