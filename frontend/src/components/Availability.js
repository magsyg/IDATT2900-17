import React, {useState, useEffect} from 'react'
import axios from 'axios'
import { FlatList, ScrollView, StyleSheet, Touchable, TouchableHighlight, TouchableOpacity, View } from 'react-native'
import { IconButton, Subheading, Text } from 'react-native-paper'
import { theme } from '../core/theme'
import Icon from "react-native-vector-icons/MaterialIcons"
import { transformNiceShortDate } from '../utils/date_management'
import PillLink from './PillLink'

export default function Availabilty({users, date, time, selectMethod}) {
  const [availability, setAvailability] = useState([])

  const[page, setPage] = useState(0);
  
  const switchPage = (value) => {
    if (availability.length>(page+value)*4 && (page+value)>=0) {
      setPage(page+value);
    }
  
  }
  useEffect(() => {
    const payload = {
      'users': users.map(x => x.id)
    }
    axios.post('/appointments/availability/',payload).then((response) => {
      setAvailability(response.data)
    })  .catch(function (error) {
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
  }, [users]);
  
  const selected = (testDate, testTime) => {
    if (typeof date !== undefined && time !== undefined) {
      let temp_date = date;
      let temp_time = time;
      if (typeof temp_date !== 'string') temp_date=temp_date.toISOString().substring(0, 10)
      if (typeof temp_time !== 'string') temp_time=temp_time.toTimeString().substring(0, 5)
      return testDate === temp_date && testTime.substring(0, 5) === temp_time
    } return false
  }

  return (
    <View>
      <Subheading style={styles.header}>AVAILABILITY</Subheading>
      <View style={styles.row}>
      
      <TouchableOpacity onPress={()=>switchPage(-1)} style={styles.pageSwitch}>
        {page > 0 && <Icon name={'keyboard-arrow-left'} size={24} color={theme.colors.primary} />}
      </TouchableOpacity>
        <View style={styles.row}>
        { 
          availability.slice(page*4,(page+1)*4).map((item, index) => {
            return(
              <View style={styles.col}>
                <View style={styles.colHeader}>
                  <Text style={styles.colHeaderText}>{transformNiceShortDate(item.date)}</Text>
                </View>
                <ScrollView 
                  nestedScrollEnabled = {true}
                  showsVerticalScrollIndicator={false}
                  showsHorizontalScrollIndicator={false}
                  style={styles.hoursCol}>

                  {
                   item.hours.map((item2, index) => {
                      return(
                        <PillLink mode = {selected(item.date, item2) ? 'highlight':'none'} onPress={() => selectMethod(item.date, item2)}>{item2.slice(0,5)}</PillLink>
                      );
                    })
                  }
                </ScrollView>
              </View>
            );     
          }) 
        }
        </View>
        <TouchableOpacity onPress={()=>switchPage(1)}style={styles.pageSwitch}>
          {(1+page)*4 < availability.length && <Icon name={'keyboard-arrow-right'} size={24} color={theme.colors.primary}/>}
        </TouchableOpacity>
      </View>
    </View>
    
  )
}

const styles = StyleSheet.create({
  header: {
    fontSize: 24,
    color: theme.colors.text,
    paddingVertical: 12,
    textAlign:'center'
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems:'center',
    flex:1,
    marginBottom:6,
  },
  col: {
    flex:1,
    marginHorizontal:0,
  },
  colHeader: {
    borderBottomColor:theme.colors.grey, 
    borderBottomWidth:1,
    padding:4
  },
  colHeaderText: {
    textAlign:'center',
    
  },
  hoursCol: {
    padding:4,
    height:164,
  },
  pageSwitch: {
    flexDirection:'column',
    height:"100%", 
    width:20,
    padding:0,
    justifyContent:'center'
  }
})
