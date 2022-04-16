import React, {useState, useEffect} from 'react'
import { StyleSheet, View, TouchableOpacity, Text, FlatList,  Modal,ScrollView } from 'react-native'
import { IconButton, Subheading } from 'react-native-paper'
import { theme } from '../core/theme'
import Header from './Header'
import ProfilePicture from './ProfilePicture'


export default function TeamSelect({start, containerStyle, company, selectedUsers, main_user, addMethod, removeMethod}) {
  const [teamVisible, setTeamVisible] = useState(false);
  const showTeamModal = () => setTeamVisible(true);
  const hideTeamModal = () => setTeamVisible(false);
  
  const [selected, setSelected] = useState([]);
  const add = (item) => {
    // May be unrensponsive, due to passed props are not dynamic and does not change
    // Does get adjusted on re render
    addMethod(item); // should make return error
    if(item.id !== main_user.id) {
      let temp_selected = selected.filter(ar => (ar.id !== main_user.id && ar.id !== item.id)); 
      temp_selected.push(item);
      setSelected(temp_selected);
    }
  }
  const select = (item) => {
    if(removeMethod !== undefined) {
      removeMethod(item);
      setSelected(selected.filter(ar => (ar.id !== main_user.id && ar.id !== item.id)));
    }

  }


  useEffect(() => {
    setSelected(selectedUsers);
  }, [selectedUsers]);
  
  return <View>
      <Modal visible={teamVisible} onDismiss={hideTeamModal}>
        <View style= {styles.column}>
          <View style={[styles.row, {flex:0,justifyContent:'flex-end',marginHorizontal: 32, marginTop:24, marginBottom:0}]}>
            <IconButton icon="close" size={30} color={theme.colors.grey} onPress={hideTeamModal}></IconButton>
          </View>
          <View>
            <Header style={{color:theme.colors.primary, textAlign:'center'}}>ADD TEAM MEMBERS</Header>
          </View>

          <View style={{flex:2, paddingHorizontal:32}}>
            <FlatList
              data={company.members.filter(ar => !selected.find(rm => (rm.id === ar.id))).filter(ar => ar.id !== main_user.id)}
              numColumns={1}
              scrollEnabled={true}
              renderItem={({item, index}) =>
                <View key={index} style={styles.teamRow}>
                    <ProfilePicture 
                      size={40} 
                      user={item}
                    />
                    <Subheading>{item.first_name} {item.last_name}</Subheading>
                    <IconButton icon='plus' onPress={() => add(item)} color={theme.colors.grey}/>
                </View>
              }
            />
          </View>
        </View>
      </Modal>
      <ScrollView nestedScrollEnabled = {true} horizontal={true} contentContainerStyle={[{flex: 1}, start ? styles.start : styles.end, containerStyle]}>
        {!start && 
        <IconButton icon='plus' onPress={showTeamModal} color={theme.colors.grey}/>
        }
        <View style={{margin:2}}>
            <ProfilePicture 
              size={48} 
              user={main_user}
            />
          </View>
          {
          selected.map((item, index) => {
              return(
                <TouchableOpacity key={index} style={{margin:2}} onPress={() => select(item)}>
                    <ProfilePicture 
                      size={48} 
                      user={item}
                    />
                </TouchableOpacity>
              );     
            })
          }
      {start && 
        <IconButton icon='plus' onPress={showTeamModal} color={theme.colors.grey}/>
      }
      </ScrollView>
    </View>
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
  teamRow: {
    flexDirection: 'row',
    justifyContent:'space-between',
    alignItems:'center',
    borderBottomColor: theme.colors.grey,
    borderBottomWidth: 1,
    marginBottom:8,
    padding:4, 
  },
  end: {
    justifyContent:'flex-end'
  },
  start: {
    justifyContent:'flex-start'
  }
})