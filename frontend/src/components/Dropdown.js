import React from 'react'
import { StyleSheet, View, TouchableOpacity, FlatList} from 'react-native'
import { Text, List } from 'react-native-paper'
import Icon from "react-native-vector-icons/MaterialIcons";
import { theme } from '../core/theme'

export default function Dropdown({choices, headerText, props}) {
    const [expanded, setExpanded] = React.useState(false);

    const handlePress = () => setExpanded(!expanded);

    return (
        <View>
             <TouchableOpacity style={styles.row} onPress={handlePress}>
                 <Text style={[styles.title]}>{headerText}</Text>
                 <Icon name={expanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'} size={30} color={theme.colors.grey} />
             </TouchableOpacity>
             <View style={styles.parentHr}/>
             {
                 expanded &&
                 <View style={{}}>
                     <FlatList
                     data={choices}
                     numColumns={1}
                     scrollEnabled={false}
                     renderItem={({item, index}) => 
                         <View>
                             <TouchableOpacity style={[styles.childRow]} onPress={item.function}>
                                 <Text style={styles.childText}>{item.key}</Text>
                             </TouchableOpacity>
                             <View style={styles.childHr}/>
                         </View>
                     }/>
                 </View>
             }
             
        </View>
     );
}

const styles = StyleSheet.create({
    title:{
        fontSize: 18,
        fontStyle: 'italic',
    },
    row:{
        flexDirection: 'row',
        justifyContent:'space-between',
        height:56,
        paddingLeft:25,
        paddingRight:18,
        alignItems:'center',
        borderBottomColor: theme.colors.text,
        borderBottomWidth: 1,
    },
    parentHr:{
        height:1,
        width:'100%'
    },
    childText:{
        color: theme.colors.grey,
        fontStyle: 'italic',
        padding:16,
    },
    container:{
        justifyContent: 'center',
        alignItems: 'center'
    },
    button:{
        width:'100%',
        height:54,
        alignItems:'center',
        paddingLeft:35,
        paddingRight:35,
        fontSize: 12,
    },
    childRow:{
        flexDirection: 'row',
        justifyContent:'center',
        borderBottomColor: theme.colors.grey,
        borderBottomWidth: 1,
    },
    parentHr:{
        height:1,
        width:'100%'
    },
    childHr:{
        height:1,
        width:'100%',
    },
});