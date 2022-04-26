import React, { useState, useEffect } from 'react'
import { View, StyleSheet, TouchableOpacity, ScrollView, FlatList } from 'react-native'
import { Text, Subheading, Searchbar, IconButton } from 'react-native-paper'
import Icon from "react-native-vector-icons/MaterialIcons";
import Header from '../../../components/Header'
import OptionIconLink from '../../../components/OptionIconLink'
import Background from '../../../components/Background'
import { theme } from '../../../core/theme'
import PillLink from '../../../components/Link';
import ProfilePicture from '../../../components/ProfilePicture'
import CurrentUserContext from '../../../../Context';
import BackgroundAuth from '../../../components/BackgroundAuth';


export default function CompanyContactsScreen({ route, navigation }) {
  const { currentUser,authIsLoading } = React.useContext(CurrentUserContext);

  const goToProfile = id => {
    navigation.navigate('Members', {screen:'CompanyMember', params:{profile_id:id}});
  }
  const goToContact = id => {
    navigation.navigate('Brand',{ 
      screen: 'ContactBrand',
      params:{brand_id:id}
    });
  }
  if (!authIsLoading && currentUser !== null) {
  return (
    <BackgroundAuth>
      <View style={styles.column}>
        <View style={[styles.row,{marginTop:16}]}>
          <Searchbar placeholder='Search' style={{backgroundColor:theme.colors.grey, flex:1, borderRadius:100}}/>
          <IconButton size={24} color={theme.colors.primary}style={{marginLeft:32}} icon='dots-horizontal' onPress={() => navigation.navigate('Settings')}/>
        </View>
        <View style={{marginTop:16}}>
          <Header>MY TEAM</Header>
          <ScrollView nestedScrollEnabled = {true} horizontal={true} contentContainerStyle={{justifyContent:'flex-start'}}>
            <View style={{margin:6}}>
              <ProfilePicture
                  size={56} 
                  user={currentUser.user}
                />
            </View>
            {
            currentUser.company.members.map((item, index) => {
                if (item.id !== currentUser.user.id) {
                  return(
                    <TouchableOpacity key={index} style={{margin:6}} onPress={() => goToProfile(item.id)}>
                      <ProfilePicture 
                        size={56} 
                        user={item}
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
            data={currentUser.company.contacts}
            numColumns={1}
            scrollEnabled={true}
            renderItem={({item, index}) => 
              <OptionIconLink onPress={()=>goToContact(item.id)}text={item.name}><Icon name='keyboard-arrow-right' size={30} color={theme.colors.grey}/></OptionIconLink>
            }
          />
      
        </View>
      </View>
    </BackgroundAuth>
  ) 
  } else {
    return (<BackgroundAuth/>)
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
  link: {
    fontWeight: 'bold',
    color: theme.colors.link,
  },
})
