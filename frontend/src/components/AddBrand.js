import React, {useState} from 'react'
import axios from 'axios'
import { StyleSheet, View, Modal, FlatList, TouchableOpacity} from 'react-native'
import { Text, Button, Avatar, Searchbar, IconButton, Subheading} from 'react-native-paper'
import { theme } from '../core/theme'
import PickerDropdown from '../components/PickerDropdown'
import Header from './Header'
import TextInput from './TextInput'

export default function AddBrands({completeAction}) {

    //Brand management
    const [selectedBrand, setSelectedBrand] = useState({});
    const [mainContact, setMainContact] = useState({value:{}, errors:''});

    const [brandVisible, setBrandVisible] = useState(false);

    // Brand search
    const [brandSearchResults, setBrandSearchResults] = useState([]);
    const [searchBrandText, setSearchBrandText] = React.useState('');
    const showBrandModal = () => setBrandVisible(true);
    const hideBrandModal = () => setBrandVisible(false);
  
    const onChangeBrandSearch = text => {
      const formattedQuery = text.toLowerCase();
      
      axios.get(`companies/brands?name=${text}`).then((response) => {
        setBrandSearchResults(response.data);
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
      setSearchBrandText(text)
    };
    const selectBrand = (item) => {
      setSelectedBrand(item);
    }
    const selectMainContact = (id) => {
      var result = selectedBrand.members.find(obj => {
        return obj.id === id
      })
      if (typeof result !== "undefined") setMainContact({value:result, errors:''});    
    }

    // Final Method
    const addBrand = () => {
      if (Object.keys(mainContact.value).length != 0) {
        let brand = {'id': selectedBrand.id, 'name':selectedBrand.name, 'main_contact':{'id':mainContact.value.id, 'name':mainContact.value.first_name+" "+mainContact.value.last_name}}
        completeAction(brand);
        setSelectedBrand({});
        setMainContact({value:{}, errors:''});
        hideBrandModal();
      } else {
        setMainContact({errors:'Must set a main contact'})
      }
    }
  return <View>
      <Modal visible={brandVisible} onDismiss={hideBrandModal}>
      {Object.keys(selectedBrand).length === 0  ?
        <View style= {styles.column}>
          <View style={[styles.row, {flex:0,justifyContent:'space-between',marginHorizontal: 8, marginVertical:18}]}>
            <Searchbar placeholder="Search"       
                onChangeText={onChangeBrandSearch}
                value={searchBrandText}
                style={{backgroundColor:theme.colors.grey, flex:1, borderRadius:100}}
              />
            <IconButton icon="close" size={30} color={theme.colors.grey} onPress={hideBrandModal}></IconButton>
          </View>
          <View style={{flex:1}}>
            <FlatList
              data={brandSearchResults}
              numColumns={1}
              scrollEnabled={true}
              renderItem={({item, index}) => 
                  <TouchableOpacity onPress={() => selectBrand(item)} key={index} style={[styles.brandRow, {justifyContent:'flex-start'}]}>
                    <Avatar.Image 
                      size={40} 
                      source={require('../assets/default_profile.png')}  
                    />
                    <Subheading style={{marginLeft:16}}>{item.name}</Subheading>
                  </TouchableOpacity>
              }
            />
          </View>
        </View>
      :
      <View style= {styles.column}>
        <View style={[styles.row, {flex:0,justifyContent:'flex-end',marginHorizontal: 32, marginTop:24, marginBottom:0}]}>
          <IconButton icon="close" size={30} color={theme.colors.grey} onPress={hideBrandModal}></IconButton>
        </View>
        <View style={{flex:0}}>
          <Header style={{color:theme.colors.primary, textAlign:'center'}}>Add Brand</Header>
        </View>
        <View style={{flex:1, padding:32}}>
          <TouchableOpacity style={{borderBottomColor:theme.colors.grey, borderBottomWidth:1}} onPress={() => selectBrand({})}>
            <TextInput
              label="Brand"
              returnKeyType="next"
              value={selectedBrand.name}
              disabled={true}
            />
          </TouchableOpacity>
          <PickerDropdown 
            selectMethod={selectMainContact}
            data = {
              selectedBrand.members.map(item => ({label:item.first_name + " "+ item.last_name, value:item.id}))
            }
            label="Main Contact"
            errors={mainContact.errors}
          />
          <Button icon="plus" style={{marginTop:16}} color={theme.colors.grey} mode="outlined" onPress={addBrand}>Add Brand</Button>
        </View>
      </View>
      }
  </Modal>
      <Button icon="plus" color={theme.colors.grey} mode="outlined" onPress={showBrandModal}>Add Brand</Button>
    </View>
}

const styles = StyleSheet.create({
  column: {
    flex: 1,
    flexDirection: "column",
    justifyContent: 'center',
    width:'100%'
  }, 
  row: {
    flex:1,
    flexDirection: 'row',
    justifyContent:'center',
    marginTop: 4,
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
