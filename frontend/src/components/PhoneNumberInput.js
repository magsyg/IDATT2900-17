import React from 'react'
import { View, StyleSheet, Text, Modal, TouchableOpacity, FlatList } from 'react-native'
import { IconButton, Searchbar } from 'react-native-paper';

import { countryCodes } from '../core/countrycodes'
import { theme } from '../core/theme'

import OptionTextLink from './OptionTextLink';
import TextInput from './TextInput'



export default function PhoneNumberInput({ containerStyle, phoneNumber, countryCode, setPhoneNumber, setCountryCode, label }) {

  const [CCvisible, setCCVisible] = React.useState(false);
  const [CCData, setCCData] = React.useState(countryCodes);
  const showCCModal = () => setCCVisible(true);
  const hideCCModal = () => setCCVisible(false);

  const updateCountryCode = (code) => {
    setCountryCode({value:code, error: ''});
    hideCCModal();
  }
  const updatePhoneNumber = (value, error) => {
    console.log(value);
    setPhoneNumber({value:value, error: error});
  }
  const [searchCC, setSearchCC] = React.useState('');
  const onChangeSearchCC = text => {
    const formattedQuery = text.toLowerCase();

    console.log(countryCodes.map(cc => cc.name));
    const filteredData = countryCodes.filter(cc => (
        cc.name.includes(text) || 
        cc.dial_code.includes(text) || 
        cc.code.includes(text)
        )
      );
    setCCData(filteredData);
    setSearchCC(text)
  };

  return (
    <View style={[containerStyle]}>
            <Modal visible={CCvisible} onDismiss={hideCCModal}>
        <View style={[styles.row, {marginHorizontal: 32, marginTop:24, marginBottom:0}]}>
          <View style={{flex:1}}>
            <Searchbar placeholder="Search"       
              onChangeText={onChangeSearchCC}
              value={searchCC}
              style={{backgroundColor:theme.colors.grey, borderRadius:100}}
            />
          </View>
          <IconButton icon="close" size={30} color={theme.colors.primary} onPress={hideCCModal}></IconButton>
        </View>
        <View style={{paddingHorizontal:16}}>
        <FlatList
            data={CCData}
            numColumns={1}
            contentContainerStyle={{marginHorizontal:16}}
            renderItem={({item, index}) => 
              <OptionTextLink  key={item.dial_code} onPress={()=>updateCountryCode(item.dial_code)} text1={item.name} text2={item.dial_code}/>
            }                             
        />
        </View>
      </Modal>
        <View style={styles.row}>  
            <TouchableOpacity style={{marginTop: 30}} onPress={showCCModal}>
              <Text style={{color:theme.colors.secondary}}>{countryCode.value}</Text>
            </TouchableOpacity>
            <TextInput
              label={label ? label:'Phone number'}
              returnKeyType="next"
              value={phoneNumber.value}
              onChangeText={(text) => updatePhoneNumber(text, '')}
              error={!!phoneNumber.error}
              errorText={phoneNumber.error}
            />
          </View>
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent:'center',
    marginTop: 4,
  },
})
