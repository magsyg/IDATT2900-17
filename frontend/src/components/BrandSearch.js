import React, {useState, useEffect} from 'react'
import axios from 'axios'
import { StyleSheet, View, Modal, FlatList, TouchableOpacity} from 'react-native'
import { Text, Button, Searchbar, IconButton, Subheading} from 'react-native-paper'
import { theme } from '../core/theme'
import CompanyLogo from './CompanyLogo'


export default function BrandSearch({selectMethod, exitMethod, mode}) {  
  const [brandSearchResults, setBrandSearchResults] = useState([]);
  const [searchBrandText, setSearchBrandText] = React.useState('');

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
    const select = (item) => {
      selectMethod(item)
    }

  useEffect(() => {
    axios.get('companies/brands').then((response) => {
      setBrandSearchResults(response.data);
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
  
  return (
    <View>
      <View style= {styles.column}>
        <View style={[styles.row, {flex:0,justifyContent:'space-between', marginVertical:18}]}>
          {mode !== 'close' && <IconButton icon="arrow-left" size={30} color={theme.colors.grey} onPress={exitMethod}></IconButton>}
          <Searchbar placeholder="Search"       
              onChangeText={onChangeBrandSearch}
              value={searchBrandText}
              style={{backgroundColor:theme.colors.grey, flex:1, borderRadius:100}}
            />
          {mode === 'close' && <IconButton icon="close" size={30} color={theme.colors.grey} onPress={exitMethod}></IconButton>}
        </View>
        <View style={{flex:1}}>
          <FlatList
            data={brandSearchResults}
            numColumns={1}
            scrollEnabled={true}
            renderItem={({item, index}) => 
                <TouchableOpacity onPress={() => select(item)} key={index} style={[styles.brandRow, {justifyContent:'flex-start'}]}>
                  <CompanyLogo
                    size={40} 
                    company={item}
                  />
                  <Subheading style={{marginLeft:16}}>{item.name}</Subheading>
                </TouchableOpacity>
            }
          />
        </View>
      </View>
    </View>
  )
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
