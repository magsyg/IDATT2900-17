import React, {useState, useEffect} from 'react'
import axios from 'axios'
import { FlatList, Modal, StyleSheet, View } from 'react-native'
import { Text, IconButton} from 'react-native-paper'
import { theme } from '../core/theme'
import BackHeader from './BackHeader'
import Header from './Header'
import Header2 from './Header2'
import Paragraph from './Paragraph'
import TextInput from './TextInput'
import Button from './Button'

export default function Note({containerStyle, company}) {
  //TODO maybe rename this
  const [newNote, setNewNote] = useState('');
  const [notes, setNotes] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    setModalVisible(false);
    axios.get(`/companies/${company.id}/notes/`).then((response) => {
      setNotes(response.data);
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
  }, [company]);

  const createNote = () => {
    const payload = {
      text:newNote
    }
    axios.post(`/companies/${company.id}/notes/`, payload).then((response) => {
      setNotes(response.data);
      setModalVisible(false);
      setNewNote('');
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
  }

  const hideModal = () => {
    setModalVisible(false);
  }
  const showModal = () => {
    setModalVisible(true);
  }

  return (    
    <View style={containerStyle}>  
      <Modal visible={modalVisible}>
        <BackHeader onPress={hideModal}/>
        <Header style={{textAlign:'center'}}>Create Note</Header>
        <TextInput
          label="Note"
          returnKeyType="next"
          value={newNote}
          multiline
          onChangeText={(text) => setNewNote(text)}
        />
        <Button onPress ={createNote}>Create</Button>
      </Modal>     
      <View style={[styles.row, {justifyContent:'space-between'}]}>
        <Header2>MAKE A NOTE</Header2>
        <IconButton size={32} icon='plus' color={theme.colors.grey} onPress={showModal}/>
      </View>
      <FlatList 
        data={notes}
        scrollEnabled={true}
        renderItem={({item, index}) =>
          <View style={styles.noteRow}>
            <Paragraph>
              {item.text}
            </Paragraph>
            <Text>- {item.creator} {item.timestamp.substring(0, 10)}</Text>
          </View>
        }
      />
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent:'center',

  },
  header: {
    fontSize: 31,
    color: theme.colors.primary,
    paddingVertical: 12,
  },
  noteRow: {
    borderBottomColor:theme.colors.lightgrey,
    borderBottomWidth:1,
    marginBottom:8
  },
  

})
