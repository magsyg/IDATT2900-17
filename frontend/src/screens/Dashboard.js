import React from 'react'
import { TouchableOpacity, StyleSheet, View, Image} from 'react-native'
import { Avatar } from 'react-native-paper'
import Background from '../components/Background'
import Logo from '../components/Logo'
import Header from '../components/Header'
import Paragraph from '../components/Paragraph'
import Button from '../components/Button'
import PillLink from '../components/PillLink'
import { currentDate } from '../utils/date_management'
import { placeholder } from '../core/placeholders'
import { theme } from '../core/theme'
import CalendarFull from '../components/calendar/Calendar.js'
import AgendaScreen from '../components/calendar/Agenda.js'

export default function Dashboard({ navigation }) {
  const today = currentDate()
  // showCalendar = true displays the Calendar, showCalendar = false displays the Agenda
  let showCalendar = true;
  const changeCalendar = () => {
    console.log(showCalendar)
    return showCalendar = !showCalendar;
  }
 
  return (
    <Background>
      <View style = {styles.column}>
        <View style={[styles.row, {flex:2, paddingTop:32}]}>
          <View style={{flex: 3}}>
            <Header>Hi, {placeholder.first_name}</Header>
          </View>
          <View style={{flex: 1}}>
            <Avatar.Image 
              size={64} 
              source={require('../assets/default_profile.png')}  
            />
          </View>
        </View>
        <Header>Notifications</Header> 
        <View style={{flex:3}}>
          <PillLink>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </PillLink>
          <PillLink>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </PillLink>
        </View>
        <Header>Today, {today}</Header>
        <Button mode="contained" style = {styles.button}  onPress={changeCalendar}/>
        { showCalendar ? <CalendarFull /> : <AgendaScreen /> }
                         
      </View>
    </Background>
  )
}


const styles = StyleSheet.create({
  row: {
    flex: 1,
    flexDirection: "row",
    justifyContent: 'space-between'
  },
  column: {
    flex: 1,
    flexDirection: "column",
  },
  notification: {
    backgroundColor:theme.colors.grey,
  }
})