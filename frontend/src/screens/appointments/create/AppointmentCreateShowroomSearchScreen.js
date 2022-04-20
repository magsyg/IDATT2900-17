import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { View, StyleSheet, ScrollView, TouchableOpacity, Modal, FlatList } from 'react-native'
import { Text, Subheading, Searchbar, IconButton } from 'react-native-paper'
import Background from '../../../components/Background'
import Icon from "react-native-vector-icons/MaterialIcons";
import Header from '../../../components/Header'
import OptionIconLink from '../../../components/OptionIconLink'
import BackButton from '../../../components/BackButton'
import { theme } from '../../../core/theme'
import { currentDate } from '../../../utils/date_management';
import Availabilty from '../../../components/Availability'
import HoveringBar from '../../../components/HoveringBar'
import BackHeader from '../../../components/BackHeader'
import BrandSearch from '../../../components/BrandSearch'
import OutlinedButton from '../../../components/OutlinedButton'

export default function AppointmentCreateShowroomSearchScreen({ route, navigation }) {
  const { passed_team } = route.params;
  const [meta, setMeta] = useState({company:{id:-1, members:[]}, user: {id:-1, first_name:'User'}}) // add placeholders

  const selectBrand = brand => {
    if (meta.company.contacts.map(x => x.id).includes(brand.id)) {
      navigation.navigate('Brand',{
          screen: 'ScheduleContactBrand',
          params:{brand_id:brand.id, passed_team:passed_team}
        });
    } else {
      navigation.navigate('Brand',{
        screen: 'NewContactBrand',
        params:{brand_id:brand.id, passed_team:passed_team}
      });
    }
  }
  const goToForm = () => {
    navigation.navigate('AppointmentCreateForm',
      {
        passed_team:passed_team,
        ap_type:'SR'
      }
    );
  }
  useEffect(() => {
    axios.get('/accounts/current_user/').then((response) => {
      setMeta(response.data);
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
  }, []);
  return (
  <Background>
    <View style= {styles.column}>
      <BrandSearch exitMethod={navigation.goBack} selectMethod={selectBrand}/>
      <OutlinedButton onPress={goToForm}>Create Showroom Appointment</OutlinedButton>
    </View>
  </Background>
  )
}

const styles = StyleSheet.create({
  row: {
    flex:1,
    flexDirection: 'row',
    justifyContent:'center',
    marginTop: 4,
  },
  column: {
    flex: 1,
    flexDirection: "column",
    justifyContent: 'center',
    width:'100%'
  },
 brandRow: {
    flexDirection: 'row',
    justifyContent:'space-between',
    alignItems:'center',
    borderBottomColor: theme.colors.grey,
    borderBottomWidth: 1,
    marginBottom:8,
    padding:4, 
  },
})
