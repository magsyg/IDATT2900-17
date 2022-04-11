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


export default function TradeShowBrandScreen({ route, navigation }) {
  const {tradeshow_id, brand_id} = route.params
  const brand ={'name':'name'}
  const [meta, setMeta] = useState({'user': {}, 
    'company':{'members':[]}, 
    'appointment':{'name':'Tradeshow Name','id':-1},
    'brand':{'brand':{'name':'Brand Name'},'main_contact':{}}})

  const isFocused = useIsFocused(); //method for determining if the screen is entered
  useEffect(() => {
    // Trigger only on enter
    if (isFocused) {
      axios.get(`/appointments/tradeshow/${tradeshow_id}/brand/${brand_id}`).then((response) => {
        setMeta(response.data);
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
  }, [isFocused]);
  

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
        <HeaderWithSub header={meta.brand.brand.name} subheader={meta.appointment.name} />
        <View style={{marginTop:32}}>
          <Contact user={meta.brand.main_contact} contactType='Wholesale Contact'/>
        </View>
        <View style={[styles.row, {marginTop:32}]}>
          <OutlinedButton style={{flex:1, margin:4}} labelStyle={{fontSize:14}}>Lookbook</OutlinedButton>
          <OutlinedButton style={{flex:1, margin:4}} labelStyle={{fontSize:14}}>Line Sheet</OutlinedButton>
        </View>
        <View style={[styles.row, {marginTop:32}]}>
          <IconButton size={32} icon='plus' color={theme.colors.grey}/>
          <ScrollView horizontal={true} contentContainerStyle={{flex: 1}}>
            <View style={styles.imageBoxPlaceholder}/>
            <View style={styles.imageBoxPlaceholder}/>
            <View style={styles.imageBoxPlaceholder}/>
            <View style={styles.imageBoxPlaceholder}/>
          </ScrollView>
        </View>
        <View>
          <View style={[styles.row, {justifyContent:'space-between'}]}>
            <Header>Make a note?</Header>
            <IconButton size={32} icon='plus' color={theme.colors.grey}/>
          </View>
          <Text style={{color:theme.colors.grey}}>
            TODO ADD FUNCTIONIONALITY FOR THIS
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
            sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum


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
  imageBoxPlaceholder : {
    height:160,
    width:160,
    borderColor:theme.colors.primary,
    borderWidth:2,
    backgroundColor:theme.colors.grey,
    margin:4
  }

})
