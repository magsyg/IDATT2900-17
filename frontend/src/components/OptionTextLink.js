import React from 'react'
import { StyleSheet, View, TouchableOpacity, FlatList} from 'react-native'
import { Text, Icon } from 'react-native-paper'
import { theme } from '../core/theme'

export default function OptionTextLink({onPress, text1, text2}) {
    return (
        <View>
            <TouchableOpacity style={[styles.row]} onPress={onPress}>
                <Text style={styles.text}>{text1}</Text>
                <Text style={styles.text}>{text2}</Text>
            </TouchableOpacity>
            <View style={styles.hr}/>
        </View>
     );
}

const styles = StyleSheet.create({
    text:{
        color: theme.colors.text,
        padding:16,
        paddingLeft:0,
        paddingBottom:12,
        fontSize: 15,
    },
    row:{
        flexDirection: 'row',
        justifyContent:'space-between',
        alignItems:'center',
        borderBottomColor: theme.colors.grey,
        borderBottomWidth: 1,
        marginBottom:4,
    },
    hr:{
        height:1,
        width:'100%',
    },
});