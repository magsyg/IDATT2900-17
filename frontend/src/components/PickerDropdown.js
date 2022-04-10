import React from 'react'
import { StyleSheet, View, TouchableOpacity, FlatList} from 'react-native'
import { Text, List } from 'react-native-paper'
import Icon from "react-native-vector-icons/MaterialIcons";
import { theme } from '../core/theme'
import TextInput from './TextInput';

export default function PickerDropdown({data, selectMethod, label, errors}) {
    const [expanded, setExpanded] = React.useState(false);
    const [value, setValue] = React.useState({label:"", value:-1});
    const handlePress = () => setExpanded(!expanded);

    const select = (label, v) => {
        setValue({label:label, value:v})
        selectMethod(v);
        setExpanded(false);
    }
    
    return (

        <View>
            <TouchableOpacity style={[styles.row, {borderBottomColor:theme.colors.grey,  borderBottomWidth:1}]} onPress={handlePress}>
                <TextInput
                    label={label}
                    returnKeyType="next"
                    value={value.label}
                    disabled={true}
                    errorText={errors}
                />
                <Icon name={expanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'} size={30} color={theme.colors.grey} />
            </TouchableOpacity>
             <View style={styles.parentHr}/>
             {
                 expanded &&
                 <View style={{}}>
                     <FlatList
                     data={data}
                     numColumns={1}
                     scrollEnabled={true}
                     renderItem={({item, index}) => 
                         <View key={index}>
                             <TouchableOpacity style={[styles.childRow]} onPress={() => select(item.label, item.value)}>
                                 <Text style={styles.childText}>{item.label}</Text>
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
        paddingRight:32,
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