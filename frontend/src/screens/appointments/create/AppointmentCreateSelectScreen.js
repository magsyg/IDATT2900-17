import React, { useState, useEffect } from 'react'
import { View, StyleSheet, TouchableOpacity, FlatList } from 'react-native'
import { Text, Subheading, Searchbar, Avatar, IconButton } from 'react-native-paper'
import Background from '../../../components/Background'
import Icon from "react-native-vector-icons/MaterialIcons";
import Header from '../../../components/Header'
import OptionIconLink from '../../../components/OptionIconLink'
import BackButton from '../../../components/BackButton'
import { theme } from '../../../core/theme'
import { currentDate } from '../../../utils/date_management';

export default function AppointmentCreateSelectScreen({ route, navigation }) {
  
  const [availability, setAvailability] = useState({dates: []})

  useEffect(() => {
    const date =  new Date();
    const date_list = [];
    for (let i = 0; i <5; i++) {
      date_list.push({
        'date': date,
        'date_text': date.toLocaleString('en-us', {weekday: 'long'})[0]+'/'+date.getDate().toString()+'/'+date.getMonth().toString(),
        'time':[{'time':'17:00'},{'time':'17:00'},{'time':'17:00'}]
      })
      date.setDate(date.getDate() + 1);
    }
    console.log(date_list)
    setAvailability({dates:date_list})
  }, []);

  return (
<Background>
  <View style= {styles.column}>
  <View style={{flex:1, marginTop:16}}>
        <Searchbar placeholder="Search"       
          style={{backgroundColor:theme.colors.lightgrey, borderRadius:100}}
        />
      </View>
      <View style={{flex:2}}>
        <View style={styles.row}>
          <TouchableOpacity style={styles.box}>
              <Text style={styles.boxText}>Showroom</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.box}>
              <Text style={styles.boxText}>Showroom</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.row}>
          <TouchableOpacity style={styles.box}>
              <Text style={styles.boxText}>Showroom</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.box}>
              <Text style={styles.boxText}>Showroom</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={{flex:1, paddingVertical:32}}>
        <View style={[styles.row,{justifyContent:'flex-start'}]}>
          <Avatar.Image 
            size={48} 
            source={require('../../../assets/default_profile.png')}  
          />
          <IconButton icon='plus' color={theme.colors.grey}/>
        </View>
      </View>
      <View style={{flex:3}}>
        <Subheading style={{textAlign:'center'}}>AVAILABILITY</Subheading>
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
  box: {
    flex:1,
    backgroundColor: theme.colors.lightgrey,
    paddingVertical:'auto',
    borderRadius:16,
    flexDirection: 'column',
    justifyContent:'center',
    margin:4
  },
  boxText: {
    margin:'auto',
    textAlign: 'center',
    color:theme.colors.primary,
    alignItems:'center',
    fontSize:16,
  },
  link: {
    fontWeight: 'bold',
    color: theme.colors.link,
  },
})
