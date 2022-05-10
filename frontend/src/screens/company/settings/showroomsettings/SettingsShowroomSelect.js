import React, { useState, useEffect } from 'react'
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native'
import { Avatar, Text, Subheading, IconButton } from 'react-native-paper'
import { useIsFocused } from "@react-navigation/native";
import Background from '../../../../components/Background'
import Header from '../../../../components/Header'
import OptionIconLink from '../../../../components/OptionIconLink'
import Icon from "react-native-vector-icons/MaterialIcons";
import BackButton from '../../../../components/BackButton'
import { theme } from '../../../../core/theme'
import Paragraph from '../../../../components/Paragraph'
import ProfilePicture from '../../../../components/ProfilePicture'
import CompanyLogo from '../../../../components/CompanyLogo'
import TextInput from '../../../../components/TextInput'
import Button from '../../../../components/Button'
import BackgroundAuth from '../../../../components/BackgroundAuth'
import CurrentUserContext from '../../../../../Context'
import api from '../../../../../api'
import BackHeader from '../../../../components/BackHeader';

export default function SettingsShowroomSelect({ route, navigation }) {
  const { currentUser, authIsLoading } = React.useContext(CurrentUserContext);
  const [showrooms, setShowrooms] = useState([]);

  const isFocused = useIsFocused(); //method for determining if the screen is entered

  useEffect(() => {
    // Fetches details about user
    api.get('/companies/showrooms/').then((response) => {
      setShowrooms(response.data)
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
  }, [isFocused]);

  if (!authIsLoading && currentUser !== null) {
    return (
      <BackgroundAuth>
          <BackHeader goBack={navigation.goBack}>               
            <CompanyLogo
              size={48} 
              company={currentUser.company}  
            />
          </BackHeader>
        <View style={styles.column}>
          <View style={styles.row}>
            <Header>Showrooms</Header>
          </View>
          <FlatList
            data={showrooms}
            numColumns={1}
            scrollEnabled={true}
            renderItem={({item, index}) => 
              <TouchableOpacity key={index} style={styles.showroomRow} onPress={() => navigation.navigate('SettingsShowroomEdit',{'showroom_id':item.id})}>
                <View style={{flex:1}}>
                  <Subheading style={{marginLeft:16}}>{item.address}/{item.city}</Subheading>
                </View>
                {item.is_current &&
                   <Icon size={16} name='circle' color={theme.colors.secondary}></Icon>
                }
              </TouchableOpacity>
            }
          />
        
          <View style={[styles.row,{marginTop:16}]}>  
            <Button
              mode="contained"
              onPress={() => navigation.navigate('SettingsShowroomCreate')}
            >
              Create Showroom
            </Button>
          </View>
        </View>
      </BackgroundAuth>
    )
  } else {
    return(
      <BackgroundAuth/>
    )
  }
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent:'center',
    marginBottom:8,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent:'space-between',
    alignItems:'center',
    marginBottom:4
  },
  column: {
    flex: 1,
    flexDirection: "column",
    width:'100%'
  },
  link: {
    fontWeight: 'bold',
    color: theme.colors.link,
  },
  button: {
    backgroundColor: theme.colors.grey,
    color: theme.colors.primary
  },
  showroomRow: {
    flexDirection: 'row',
    alignItems:'center',
    borderRadius:2, 
    borderWidth:1,
    marginVertical:8, 
    paddingHorizontal:8,
    paddingVertical:4,
    borderColor:theme.colors.lightgrey,
    justifyContent:'space-between',
  }
})
