import React, {useState, useEffect} from 'react'
import { StyleSheet, View, TouchableOpacity, Text, } from 'react-native'
import { IconButton, Subheading, Modal, Portal } from 'react-native-paper'
import { theme } from '../core/theme'
import Contact from './Contact'
import Header from './Header'
import ProfilePicture from './ProfilePicture'


export default function ProfileModal({user}) {
  const [visible, setVisible] = useState(false);

  const hideModal = () => setVisible(false);
  const showModal = () => setVisible(true);

  return <View>
      <Portal>
        <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={styles.modal}>
          <Contact user={user}/>
        </Modal>
      </Portal>
      <TouchableOpacity style={{margin:4}} onPress={showModal}>
        <ProfilePicture 
          size={48} 
          user={user}
        />
      </TouchableOpacity>
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
  modal : {
    backgroundColor: 'white', 
    padding: 20
  }
})