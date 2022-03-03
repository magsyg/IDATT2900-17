import React, {Component} from 'react';
import {Platform, StyleSheet, View, ScrollView, TouchableOpacity, Text, Image} from 'react-native';
import {Navigation} from 'react-native-navigation';
import testIDs from './testIDSs.js';
import appIcon from './img/logo.png';


interface Props {
  componentId?: string;
  weekView?: boolean;
}

export default class MenuScreen extends Component<Props> {
  render() {
    return (
      <ScrollView>
        <View style={styles.container} testID={testIDs.menu.CONTAINER}>
          <Image source={appIcon} style={styles.image} />
          <TouchableOpacity
            testID={testIDs.menu.CALENDARS}
            style={styles.menu}
            onPress={this.onCalendarsPress.bind(this)}
          />
        </View>
      </ScrollView>
    );
  }

  pushScreen(screen, props) {
    Navigation.push(this.props.componentId, {
      component: {
        name: screen,
        passProps: props,
        options: {
          topBar: {
            title: {
              text: props?.weekView ? 'WeekCalendar' : screen
            },
            backButton: {
              testID: 'back',
              showTitle: false, // iOS only
              color: Platform.OS === 'ios' ? '#2d4150' : undefined
            }
          }
        }
      }
    });
  }

  onCalendarsPress() {
    this.pushScreen('Calendars');
  }

  onAgendaPress() {
    this.pushScreen('Agenda');
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center'
  },
  image: {
    margin: 30,
    width: 90,
    height: 90
  },
  menu: {
    width: 300,
    padding: 10,
    margin: 10,
    // backgroundColor: '#f2F4f5',
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#7a92a5'
  },
  menuText: {
    fontSize: 18,
    color: '#2d4150'
  }
});