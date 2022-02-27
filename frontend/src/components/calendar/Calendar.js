import React, {useState, Fragment, useCallback} from 'react';
import {StyleSheet, View, ScrollView, Text, TouchableOpacity} from 'react-native';
import {Calendar, CalendarProps} from 'react-native-calendars';
import testIDs from './testIDSs.js';

const INITIAL_DATE = '2022-02-22';

const CalendarsScreen = () => {
  const [selected, setSelected] = useState(INITIAL_DATE);

  const onDayPress: CalendarProps['onDayPress'] = day => {
    setSelected(day.dateString);
  };

  const renderCalendarWithSelectableDate = () => {
    return (
      <Fragment>
        <Calendar
          testID={testIDs.calendars.FIRST}
          enableSwipeMonths
          current={INITIAL_DATE}
          style={styles.calendar}
          onDayPress={onDayPress}
          showWeekNumbers
          markingType={'multi-dot'}
          markedDates={{
            [selected]: {
              selected: true,
              disableTouchEvent: true,
              selectedColor: 'orange',
              selectedTextColor: 'red'
            }
          }}
        />
      </Fragment>
    );
  };
/*
  const renderCalendarWithMultiDotMarking = () => {
    return (
      <Fragment>
        <Text style={styles.text}>Calendar with multi-dot marking</Text>
        <Calendar
          style={styles.calendar}
          current={'2012-05-16'}
          markingType={'multi-dot'}
          markedDates={{
            '2012-05-08': {
              selected: true,
              dots: [
                {key: 'vacation', color: 'blue', selectedDotColor: 'red'},
                {key: 'massage', color: 'red', selectedDotColor: 'white'}
              ]
            },
            '2012-05-09': {
              disabled: true,
              dots: [
                {key: 'vacation', color: 'green', selectedDotColor: 'red'},
                {key: 'massage', color: 'red', selectedDotColor: 'green'}
              ]
            }
          }}
        />
      </Fragment>
    );
  };
*/
/*
  const onPressArrowLeft = useCallback(
    (subtract, month) => {
      const newDate = getNewSelectedDate(month, false);
      setSelectedValue(newDate);
      subtract();
    },
    [getNewSelectedDate]
  );
  
  const onPressArrowRight = useCallback(
    (add, month) => {
      const newDate = getNewSelectedDate(month, true);
      setSelectedValue(newDate);
      add();
    },
    [getNewSelectedDate]
  );
*/
  const renderExamples = () => {
    return (
      <Fragment>
        {renderCalendarWithSelectableDate()}
      </Fragment>
    );
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false} testID={testIDs.calendars.CONTAINER}>
      {renderExamples()}
    </ScrollView>
  );
};
export default CalendarsScreen;

const styles = StyleSheet.create({
  calendar: {
    marginBottom: 10
  },
  switchContainer: {
    flexDirection: 'row',
    margin: 10,
    alignItems: 'center'
  },
  switchText: {
    margin: 10,
    fontSize: 16
  },
  text: {
    textAlign: 'center',
    padding: 10,
    backgroundColor: 'lightgrey',
    fontSize: 16
  },
  disabledText: {
    color: 'grey'
  },
  defaultText: {
    color: 'purple'
  },
  customCalendar: {
    height: 250,
    borderBottomWidth: 1,
    borderBottomColor: 'lightgrey'
  },
  customDay: {
    textAlign: 'center'
  },
  customHeader: {
    backgroundColor: '#FCC',
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: -4,
    padding: 8
  },
  customTitleContainer: {
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 10
  },
  customTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00BBF2'
  }
});