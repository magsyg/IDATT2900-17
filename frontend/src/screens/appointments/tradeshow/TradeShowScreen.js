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


export default function TradeShowScreen({ route, navigation }) {
  const [meta, setMeta] = useState({'user': {}, 'company':{'members':[]}, 'appointment':{'id':-1,'retailer':{
    'retailer_participants':[]},'time':'09:00', 'date':'2022-04-10', 'brands':[], 'other_information':'lorem ipsum'}})

  // team
  const [teamVisible, setTeamVisible] = useState(false);
  const showTeamModal = () => setTeamVisible(true);
  const hideTeamModal = () => setTeamVisible(false);

  const inviteTeamRetailer = id => {
    const payload = {'user_id':id}
    axios.post(`/appointments/${meta.appointment.id}/retailer/invite/`, payload).then((response) => {
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
  }

  useEffect(() => {
    axios.get('/appointments/get/').then((response) => {
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
  }, []);
  
  const showBrand = (brand) => {
    navigation.navigate('TradeShowBrand', {'brand_id':brand.brand.id, 'tradeshow_id':meta.appointment.id});
  }

  return (
    <Background>
      <Modal visible={teamVisible} onDismiss={hideTeamModal}>
        <View style= {styles.column}>
          <View style={[styles.row, {flex:0,justifyContent:'flex-end',marginHorizontal: 32, marginTop:24, marginBottom:0}]}>
            <IconButton icon="close" size={30} color={theme.colors.grey} onPress={hideTeamModal}></IconButton>
          </View>
          <View style={{flex:0}}>
            <Header style={{color:theme.colors.primary, textAlign:'center'}}>ADD TEAM MEMBERS</Header>
          </View>
          <View style={{flex:1, paddingHorizontal:32}}>
            <FlatList
              data={meta.company.members.filter(ar => !meta.appointment.retailer.retailer_participants.find(rm => (rm.id === ar.id))).filter(ar => ar.id !== meta.appointment.retailer.organizer.id)}
              numColumns={1}
              scrollEnabled={true}
              renderItem={({item, index}) => 
                <View key={index} style={styles.teamRow}>
                    <Avatar.Image 
                      size={40} 
                      source={require('../../../assets/default_profile.png')}  
                    />
                    <Subheading>{item.first_name} {item.last_name}</Subheading>
                    <IconButton icon='plus' onPress={() => inviteTeamRetailer(item.id)} color={theme.colors.grey}/>
                </View>
              }
            />
          </View>
        </View>
      </Modal>
      <View style={styles.column}>
        <HeaderWithSub containerStyle={{marginTop:16}} header={meta.appointment.name} subheader={'Trade Show'} />
        <View style={[styles.row, {marginTop:16, justifyContent:'space-between', paddingHorizontal:32}]}>
          <Text>{meta.appointment.time.slice(0,5)}</Text>
          <Text>{transformNiceDate(meta.appointment.date)}</Text>
        </View>
        <View style={{marginTop:16}}>
          <Button style={{borderRadius:25, marginVertical:8}} labelStyle={{color:theme.colors.primary}} color={theme.colors.grey} mode="outlined">Address</Button>
          <Button  style={{borderRadius:25, marginVertical:8}} labelStyle={{color:theme.colors.primary}} color={theme.colors.grey} mode="outlined"> Pass </Button>
        </View>
        <View style={{marginTop:16}}>
        <ScrollView horizontal={true} contentContainerStyle={{flex: 1,justifyContent:'flex-end'}}>
          <IconButton icon='plus' onPress={showTeamModal} color={theme.colors.grey}/>
          <View style={{margin:2}}>
              <Avatar.Image 
                      size={48} 
                      source={require('../../../assets/default_profile.png')}  
              />
            </View>
            {
            meta.appointment.retailer.retailer_participants.map((item, index) => {
                return(
                  <TouchableOpacity key={index} style={{margin:2}}>
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
