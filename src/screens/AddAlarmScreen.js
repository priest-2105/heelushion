import React, { useState } from 'react';
import { View, StyleSheet, Button, Text, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useAlarms } from '../hooks/useAlarms';
import { useNavigation, useTheme } from '@react-navigation/native';

// Fake time offset in minutes
const FAKE_TIME_OFFSET_MINUTES = 30;

const AddAlarmScreen = () => {
  const [date, setDate] = useState(new Date());
  const { addAlarm } = useAlarms();
  const navigation = useNavigation();
  const { colors } = useTheme();

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setDate(currentDate);
  };

  const formatTime = (dateToFormat) => {
    return dateToFormat.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  const handleSave = () => {
    const displayTime = date;
    const realTime = new Date(displayTime.getTime() - FAKE_TIME_OFFSET_MINUTES * 60000);

    addAlarm({
      displayTime: formatTime(displayTime),
      realTime: realTime,
      enabled: true,
    });
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.infoText, {color: colors.text}]}>
        The alarm will be set for {FAKE_TIME_OFFSET_MINUTES} minutes before the time you select.
      </Text>
      <DateTimePicker
        testID="dateTimePicker"
        value={date}
        mode="time"
        is24Hour={false}
        display="spinner"
        onChange={onChange}
        textColor={colors.text}
      />
      <View style={styles.buttonContainer}>
        <Button title="Cancel" onPress={() => navigation.goBack()} color={Platform.OS === 'ios' ? colors.primary : undefined} />
        <Button title="Save" onPress={handleSave} color={Platform.OS === 'ios' ? colors.primary : undefined} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  infoText: {
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 16,
    paddingHorizontal: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 30,
  }
});

export default AddAlarmScreen; 