import React, { useState, useEffect } from 'react'

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
import CurrentUserContext from '../../../../Context'
import BackgroundAuth from '../../../components/BackgroundAuth'

export default function AppointmentCreateShowroomSearchScreen({ route, navigation }) {
  const { passed_team } = route.params;
  const { currentUser, authIsLoading } = React.useContext(CurrentUserContext);
  
  const selectBrand = brand => {
    if (currentUser.company.contacts.map(x => x.id).includes(brand.id)) {
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

  return (
  <BackgroundAuth>
    {!authIsLoading &&
    <View style= {styles.column}>
      <BrandSearch exitMethod={navigation.goBack} selectMethod={selectBrand}/>
      <OutlinedButton onPress={goToForm}>Create Showroom Appointment</OutlinedButton>
    </View>
  }
  </BackgroundAuth>
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
