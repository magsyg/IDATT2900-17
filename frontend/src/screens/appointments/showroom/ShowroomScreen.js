import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useIsFocused } from "@react-navigation/native";
import { View, StyleSheet, Modal, ScrollView, TouchableOpacity, Text, FlatList } from 'react-native'
import { Avatar, Subheading, IconButton, Searchbar, configureFonts } from 'react-native-paper'
import Background from '../../../components/Background'
import Icon from "react-native-vector-icons/MaterialIcons";
import Header from '../../../components/Header'
import { theme } from '../../../core/theme'
import OptionIconLink from '../../../components/OptionIconLink';
import Link from '../../../components/Link';
import { transformNiceDate } from '../../../utils/date_management';
import BackButton from '../../../components/BackButton';
import Contact from '../../../components/Contact';
import BackHeader from '../../../components/BackHeader';
import HeaderWithSub from '../../../components/HeaderWithSub';
import Button from '../../../components/Button';
import OutlinedButton from '../../../components/OutlinedButton';
import AppointmentInfo from '../../../components/AppointmentInfo';
import TeamSelect from '../../../components/TeamSelect';
import AddBrands from '../../../components/AddBrand';
import Note from '../../../components/Note';


export default function ShowroomScreen({ route, navigation }) {
  const {appointment_id} = route.params
  
  const [meta, setMeta] = useState({
    'user': {}, 
    'company':{'members':[]}, 
    'appointment':{
      'retailer': {
        'organizer':{'id':-1},
        'retailer_participants':[]
      },
      'name':'Tradeshow Name','id':-1, 'start_time':'09:00','end_time':'09:00', 'date':'2022-10-10',
    },
    'brand':{'brand':{'name':'Brand Name'},'main_contact':{}}})

  const isFocused = useIsFocused(); //method for determining if the screen is entered
  useEffect(() => {
    // Trigger only on enter
    if (isFocused) {
      axios.get(`/appointments/showroom/${appointment_id}`).then((response) => {
        setMeta(response.data);
        console.log(response.data.company.members);
        console.log("found appointments")
      })  .catch(function (error) {
        console.log("-----axios----")
        if (error.response) {
          console.log(error.response.data);
          console.log(error.response.status);
        } else if (error.request) {
          console.log(error.request);
        } else {
          console.log('Error', error.message);
        }
        navigation.goBack(); // If error in response, go back to last screen
        console.log("-----axios----")
      });
    }
  }, [appointment_id]);

  const inviteTeamRetailer = item => {
    const payload = {'user_id':item.id}
    axios.post(`/appointments/${meta.appointment.id}/retailer/invite/`, payload).then((response) => {
      let temp_meta = meta
      temp_meta.appointment.retailer.retailer_participants = response.data.retailer_participants
      setMeta(temp_meta);
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
    return false;
  }

  return (
    <Background>
      <View style={styles.column}>
        <View style={styles.row}> 
          <BackHeader goBack={navigation.goBack}>  
            <Avatar.Image 
                size={64} 
                source={require('../../../assets/default_profile.png')}  
            />
          </BackHeader>
        </View>
        <HeaderWithSub header={meta.brand.brand.name} subheader='Showroom appointment' />
        <AppointmentInfo containerStyle ={{marginVertical:32}}appointment={meta.appointment}/>
        <TeamSelect 
          containerStyle={{marginVertical:16}} 
          company={meta.company} 
          selectedUsers={meta.appointment.retailer.retailer_participants} 
          main_user={meta.appointment.retailer.organizer}
          addMethod={inviteTeamRetailer}
         />
        <View style={{marginTop:32}}>
          <Contact user={meta.brand.main_contact} contactType='Wholesale Contact'/>
        </View>
        <View style={[styles.row, {marginTop:32}]}>
          <OutlinedButton style={{flex:1, margin:4}} labelStyle={{fontSize:14}}>Lookbook</OutlinedButton>
          <OutlinedButton style={{flex:1, margin:4}} labelStyle={{fontSize:14}}>Line Sheet</OutlinedButton>
        </View>
        <View style={[styles.row, {marginTop:32}]}>
          <IconButton size={32} icon='plus' color={theme.colors.grey}/>
          <ScrollView nestedScrollEnabled = {true} horizontal={true} contentContainerStyle={{flex: 1}}>
            <View style={styles.imageBoxPlaceholder}/>
            <View style={styles.imageBoxPlaceholder}/>
            <View style={styles.imageBoxPlaceholder}/>
            <View style={styles.imageBoxPlaceholder}/>
          </ScrollView>
        </View>
        <Note company={meta.company} />
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
  imageBoxPlaceholder : {
    height:160,
    width:160,
    borderColor:theme.colors.primary,
    borderWidth:2,
    backgroundColor:theme.colors.grey,
    margin:4
  }

})
