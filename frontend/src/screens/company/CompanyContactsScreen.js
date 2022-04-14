import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { View, StyleSheet, TouchableOpacity, ScrollView, FlatList } from 'react-native'
import { Text, Subheading, Searchbar, IconButton, Avatar } from 'react-native-paper'
import Background from '../../components/Background'
import Icon from "react-native-vector-icons/MaterialIcons";
import Header from '../../components/Header'
import OptionIconLink from '../../components/OptionIconLink'
import BackButton from '../../components/BackButton'
import { theme } from '../../core/theme'
import PillLink from '../../components/Link';

export default function CompanyContactsScreen({ route, navigation }) {
  const [meta, setMeta] = useState({company:{id:-1, members:[], contacts:[]}, user: {id:-1, first_name:'User'}}) // add placeholders

  const goToProfile = id => {
    navigation.navigate('ProfileScreen', {profile_id:id});
  }
  const goToContact = id => {
    navigation.navigate('Brand',{ 
      screen: 'ContactBrand',
      params:{brand_id:id}
    });
  }
  useEffect(() => {
    axios.get('/companies/user/company/').then((response) => {
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
      <View style={styles.column}>
        <View style={[styles.row,{marginTop:16}]}>
          <Searchbar placeholder='Search' style={{backgroundColor:theme.colors.grey, flex:1, borderRadius:100}}/>
          <IconButton size={24} color={theme.colors.primary}style={{marginLeft:32}} icon='dots-horizontal' onPress={() => navigation.navigate('Settings')}/>
        </View>
        <View style={{marginTop:16}}>
          <Header>MY TEAM</Header>
          <ScrollView nestedScrollEnabled = {true} horizontal={true} contentContainerStyle={{justifyContent:'flex-start'}}>
            <View style={{margin:6}}>
              <Avatar.Image 
                  size={56} 
                  source={require('../../assets/default_profile.png')}  
                />
            </View>
            {
            meta.company.members.map((item, index) => {
                if (item.id !== meta.user.id) {
                  return(
                    <TouchableOpacity key={index} style={{margin:6}} onPress={() => goToProfile(item.id)}>
                      <Avatar.Image 
                        size={56} 
                        source={require('../../assets/default_profile.png')}  
                      />
                    </TouchableOpacity>
                  );     
                }
              })
            }
          </ScrollView>
        </View>
        <View style={{marginTop:16}}>
          <View style={[styles.row,{marginTop:16, justifyContent:'space-between'}]}>
            <Header>OUR BRANDS</Header>
            <PillLink>Scan QR Code</PillLink>
          </View>
          <FlatList
            data={meta.company.contacts}
            numColumns={1}
            scrollEnabled={true}
            renderItem={({item, index}) => 
              <OptionIconLink onPress={()=>goToContact(item.id)}text={item.name}><Icon name='keyboard-arrow-right' size={30} color={theme.colors.grey}/></OptionIconLink>
            }
          />
      
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
})
