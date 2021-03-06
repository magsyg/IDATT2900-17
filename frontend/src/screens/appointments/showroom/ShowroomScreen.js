import React, { useState, useEffect } from 'react'
import { useIsFocused } from "@react-navigation/native";
import { View, StyleSheet, Modal, ScrollView, TouchableOpacity, Text, FlatList } from 'react-native'
import { Subheading, IconButton, Searchbar, configureFonts } from 'react-native-paper'
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
import CompanyLogo from '../../../components/CompanyLogo';
import CurrentUserContext from '../../../../Context';
import BackgroundAuth from '../../../components/BackgroundAuth';
import api from '../../../../api';
import LocationInfo from '../../../components/LocationInfo';
import Header2 from '../../../components/Header2';


export default function ShowroomScreen({ route, navigation }) {
  const { currentUser, authIsLoading } = React.useContext(CurrentUserContext);
  const {appointment_id} = route.params
  
  const [meta, setMeta] = useState({
    'user': {}, 
    'company':{'members':[]}, 
    'appointment':{
      'retailer': {
        'organizer':{'id':-1},
        'retailer_participants':[],
        'retailer':{'name':'SHOP NAME'}
      },
      'name':'Tradeshow Name','id':-1, 'start_time':'09:00','end_time':'09:00', 'date':'2022-10-10',
    },
    'brand':{'brand':{'name':'Brand Name'},'main_contact':{},'brand_participants':[]}})

  const isFocused = useIsFocused(); //method for determining if the screen is entered
  useEffect(() => {
    // Trigger only on enter
    if (isFocused) {
      api.get(`/appointments/showroom/${appointment_id}`).then((response) => {
        setMeta(response.data);
      })  .catch(function (error) {
        
        if (error.response) {
          console.log(error.response.data);
          console.log(error.response.status);
        } else if (error.request) {
          console.log(error.request);
        } else {
          console.log('Error', error.message);
        }
        navigation.goBack(); // If error in response, go back to last screen
        
      });
    }
  }, [appointment_id]);

  const inviteTeamRetailer = item => {
    const payload = {'user_id':item.id}
    api.post(`/appointments/${meta.appointment.id}/retailer/invite/`, payload).then((response) => {
      let temp_meta = meta
      temp_meta.appointment.retailer.retailer_participants = response.data.retailer_participants
      setMeta(temp_meta);
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
    return false;
  }
  // Render Method
  // Only render when authenticatated
  if (!authIsLoading && currentUser !== null) {
    return (
      <BackgroundAuth>
        <View style={styles.column}>
          <View style={styles.row}> 
            <BackHeader goBack={navigation.goBack}>  
              <CompanyLogo
                  size={64} 
                  company={currentUser.company_type =='RETAILER' ? meta.brand.brand : meta.appointment.retailer.retailer}
              />
            </BackHeader>
          </View>
          <HeaderWithSub header={currentUser.company_type =='RETAILER' ? meta.brand.brand.name : meta.appointment.retailer.retailer.name} subheader='Showroom appointment' />
          <AppointmentInfo containerStyle ={{marginVertical:32}}appointment={meta.appointment}/>
          {currentUser.company_type =='RETAILER' &&
            <TeamSelect 
              containerStyle={{marginVertical:16}} 
              company={currentUser.company} 
              selectedUsers={meta.appointment.retailer.retailer_participants} 
              main_user={meta.appointment.retailer.organizer}
              addMethod={inviteTeamRetailer}
            />
          }
          { currentUser.company_type =='RETAILER' && meta.brand.main_contact !== null &&
          <View style={{marginVertical:32}}>
            <Contact user={meta.brand.main_contact} contactType='Wholesale Contact'/>
          </View>
          } 
          { currentUser.company_type =='BRAND' && meta.appointment.retailer.organizer !== null &&
            <View style={{marginVertical:32}}>
              <Contact user={meta.appointment.retailer.organizer} contactType='Main Contact'/>
            </View>
          } 
          { currentUser.company_type =='RETAILER' &&
          <View style={[styles.row, {marginTop:32}]}>
            <OutlinedButton style={{flex:1, margin:4}} labelStyle={{fontSize:14}}>Lookbook</OutlinedButton>
            <OutlinedButton style={{flex:1, margin:4}} labelStyle={{fontSize:14}}>Line Sheet</OutlinedButton>
          </View>
          }
          { currentUser.company_type =='RETAILER' &&
          <View style={[styles.row, {marginTop:32}]}>
            <IconButton size={32} icon='plus' color={theme.colors.grey}/>
            <ScrollView nestedScrollEnabled = {true} horizontal={true} contentContainerStyle={{flex: 1}}>
              <View style={styles.imageBoxPlaceholder}/>
              <View style={styles.imageBoxPlaceholder}/>
              <View style={styles.imageBoxPlaceholder}/>
              <View style={styles.imageBoxPlaceholder}/>
            </ScrollView>
          </View>
          }

          <Note containerStyle={{marginVertical:32}} company={meta.company} />
          {currentUser.company_type =='BRAND' &&
            <View style={{marginVertical:32}}>
            <Header2>ATTENDING TEAM</Header2>
            <TeamSelect 
              company={currentUser.company} 
              selectedUsers={meta.brand.brand_participants} 
              main_user={meta.brand.main_contact}
              addMethod={inviteTeamRetailer}
              start={true}
            />
            </View>
          }
        </View>
      </BackgroundAuth>
    ) 
  } else {
    return (<Background/>)
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
  imageBoxPlaceholder : {
    height:160,
    width:160,
    borderColor:theme.colors.primary,
    borderWidth:2,
    backgroundColor:theme.colors.grey,
    margin:4
  }

})
