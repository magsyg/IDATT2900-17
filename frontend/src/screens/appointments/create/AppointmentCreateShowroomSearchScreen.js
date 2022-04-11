import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { View, StyleSheet, ScrollView, TouchableOpacity, Modal, FlatList } from 'react-native'
import { Text, Subheading, Searchbar, Avatar, IconButton } from 'react-native-paper'
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

export default function AppointmentCreateShowroomSearchScreen({ route, navigation }) {
  const { ap_type, passed_team } = route.params;
  const [meta, setMeta] = useState({company:{id:-1, members:[]}, user: {id:-1, first_name:'User'}}) // add placeholders

  // Search
  const [brandSearchResults, setBrandSearchResults] = useState([]);
  const [searchBrandText, setSearchBrandText] = React.useState('');
  const onChangeBrandSearch = text => {
    const formattedQuery = text.toLowerCase();
    
    axios.get(`companies/brands?name=${text}`).then((response) => {
      setBrandSearchResults(response.data);
      console.log(response.data);
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
    setSearchBrandText(text)
  };

  useEffect(() => {
    axios.get('companies/brands').then((response) => {
      setBrandSearchResults(response.data);
      console.log(response.data);
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
  }, []);

  const selectBrand = brand => {
    navigation.navigate('AppointmentCreateForm', {
      passed_team: passed_team,
      ap_type: ap_type, 
      brand_id: brand.id,
    })
  }
  return (
<Background>
  <View style= {styles.column}>
      <BackHeader goBack={navigation.goBack}>        
        <Searchbar 
        placeholder="Search"
        style={{backgroundColor:theme.colors.grey, marginHorizontal:32,borderRadius:100}}
        onChangeText={onChangeBrandSearch}
        value={searchBrandText}
        />
      </BackHeader>
      <View style={{marginTop:16}}>
        <FlatList
              data={brandSearchResults}
              numColumns={1}
              scrollEnabled={true}
              renderItem={({item, index}) => 
                  <TouchableOpacity onPress={() => selectBrand(item)} key={index} style={[styles.brandRow, {justifyContent:'flex-start'}]}>
                    <Avatar.Image 
                      size={40} 
                      source={require('../../../assets/default_profile.png')}  
                    />
                    <Subheading style={{marginLeft:16}}>{item.name}</Subheading>
                  </TouchableOpacity>
              }
          />
    </View>
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
