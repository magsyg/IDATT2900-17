import React, {useState, useEffect} from 'react'
import { StyleSheet, View, TouchableOpacity, Text, FlatList, Modal } from 'react-native'
import { Avatar, IconButton, Subheading } from 'react-native-paper'
import { theme } from '../core/theme'
import Header from './Header'
import Header2 from './Header2'


export default function DurationModal({containerStyle, onFinish}) {
  const [visible, setVisible] = useState(false);
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
    
  return <View style={containerStyle}>
      <Modal visible={visible} onDismiss={hideModal}>
        <View style= {styles.column}>
          <View style={[styles.row, {flex:0,justifyContent:'flex-end',marginHorizontal: 32, marginTop:24, marginBottom:0}]}>
            <IconButton icon="close" size={30} color={theme.colors.grey} onPress={hideModal}></IconButton>
          </View>
          <View style={styles.optionsContainer}>
            <View>
              <Header2 style={{textAlign:'center'}}>
                SELECT YOUR DESIRED MEETING LENGTH
              </Header2>
              <View style={styles.row}>
                <TouchableOpacity style={styles.box} onPress={() => onFinish(30)}>
                    <Text style={styles.boxText}>30 min</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.box} onPress={() => onFinish(60)}>
                    <Text style={styles.boxText}>1 hour</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.row}>
                <TouchableOpacity style={styles.box} onPress={() => onFinish(90)}>
                    <Text style={styles.boxText}>1.5 hours</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.box} onPress={() => onFinish(120)}>
                    <Text style={styles.boxText}>2 hours</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.row}>
                <TouchableOpacity style={styles.box} onPress={() => onFinish(150)}>
                    <Text style={styles.boxText}>2.5 hours</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.box} onPress={() => onFinish(180)}>
                    <Text style={styles.boxText}>3 hours</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
      <IconButton icon='arrow-right' size={48} onPress={showModal} color={theme.colors.grey}/>
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
  optionsContainer: {
    flex:1, 
    justifyContent:'center', 
    paddingHorizontal:32,
    marginBottom:128,
  },
  box: {
    flex:1,
    backgroundColor: theme.colors.lightgrey,
    paddingVertical:'auto',
    borderRadius:16,
    flexDirection: 'column',
    justifyContent:'center',
    margin:4,
    padding:16
  },
  boxText: {
    margin:'auto',
    textAlign: 'center',
    color:theme.colors.primary,
    alignItems:'center',
    fontSize:16,
  },
})