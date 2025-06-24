import React, { useState, useContext, useEffect } from 'react';
import { View, StyleSheet, Text, Platform, TouchableOpacity, SafeAreaView, Switch } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { AlarmsContext } from '../context/AlarmsContext';
import { useNavigation, useTheme, useRoute } from '@react-navigation/native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  previewContainer: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
  previewTime: {
    fontSize: 82,
    fontWeight: 'bold',
  },
  previewAmPm: {
    fontSize: 24,
    alignSelf: 'flex-end',
    bottom: 15,
  },
  settingsContainer: {
    flex: 3,
    justifyContent: 'flex-end'
  },
  row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 15,
      paddingHorizontal: 20,
      borderBottomWidth: 1,
  },
  label: {
      fontSize: 16,
  },
  value: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 20,
    paddingTop: 10,
    paddingHorizontal: 20,
  },
  button: {
      paddingHorizontal: 20,
      paddingVertical: 10,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
  }
});

const SettingRow = ({ label, value, onPress, colors }) => (
    <TouchableOpacity onPress={onPress} style={[styles.row, { borderBottomColor: colors.border }]}>
        <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
        <Text style={[styles.value, { color: colors.primary }]}>{value}</Text>
    </TouchableOpacity>
);

const AddAlarmScreen = () => {
  const [displayTime, setDisplayTime] = useState(new Date());
  const [realTime, setRealTime] = useState(new Date());
  const [showDisplayPicker, setShowDisplayPicker] = useState(false);
  const [showRealPicker, setShowRealPicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [repeat, setRepeat] = useState({
    Mon: false, Tue: false, Wed: false, Thu: false, Fri: false, Sat: false, Sun: false,
  });
  
  const { addAlarm } = useContext(AlarmsContext);
  const navigation = useNavigation();
  const route = useRoute();
  const { colors } = useTheme();

  useEffect(() => {
    if (route.params?.repeat) {
      setRepeat(route.params.repeat);
    }
  }, [route.params?.repeat]);

  const formatTime = (dateToFormat) => {
    return dateToFormat.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  const formatDate = (dateToFormat) => {
      return dateToFormat.toLocaleDateString([], { weekday: 'short', month: 'long', day: 'numeric' });
  }

  const handleSave = () => {
    addAlarm({
      displayTime: formatTime(displayTime),
      realTime: realTime,
      enabled: true,
      repeat: repeat,
    });
    navigation.goBack();
  };

  const onDisplayTimeChange = (event, selectedDate) => {
    setShowDisplayPicker(false);
    if (selectedDate) {
        setDisplayTime(selectedDate);
    }
  };

  const onRealTimeChange = (event, selectedDate) => {
    setShowRealPicker(false);
    if (selectedDate) {
        setRealTime(selectedDate);
    }
  };

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
        const newRealTime = new Date(realTime);
        newRealTime.setFullYear(selectedDate.getFullYear());
        newRealTime.setMonth(selectedDate.getMonth());
        newRealTime.setDate(selectedDate.getDate());
        setRealTime(newRealTime);
    }
  };

  const formatRepeat = () => {
    const days = Object.keys(repeat).filter(day => repeat[day]);
    if (days.length === 7) return 'Every day';
    if (days.length === 0) return 'Never >';
    if (days.length === 2 && days.includes('Sat') && days.includes('Sun')) return 'Weekends';
    if (days.length === 5 && !days.includes('Sat') && !days.includes('Sun')) return 'Weekdays';
    return days.join(', ') + ' >';
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.previewContainer}>
        <Text style={[styles.previewTime, { color: colors.text }]}>{formatTime(displayTime).split(' ')[0]}</Text>
        <Text style={[styles.previewAmPm, { color: colors.text }]}>{formatTime(displayTime).split(' ')[1]}</Text>
      </View>
      
      <View style={styles.settingsContainer}>
        <SettingRow 
            label="Date"
            value={formatDate(realTime)}
            onPress={() => setShowDatePicker(true)} 
            colors={colors}
        />
         <SettingRow 
            label="Fake Time"
            value={formatTime(displayTime)}
            onPress={() => setShowDisplayPicker(true)}
            colors={colors}
        />
         <SettingRow 
            label="Real Time"
            value={formatTime(realTime)}
            onPress={() => setShowRealPicker(true)}
            colors={colors}
        />
         <SettingRow 
            label="Repeat"
            value={formatRepeat()}
            onPress={() => navigation.navigate('Repeat', { repeat })}
            colors={colors}
        />
      </View>

      {showDisplayPicker && (
          <DateTimePicker
              value={displayTime}
              mode="time"
              is24Hour={false}
              display="default"
              onChange={onDisplayTimeChange}
          />
      )}
      {showRealPicker && (
          <DateTimePicker
              value={realTime}
              mode="time"
              is24Hour={false}
              display="default"
              onChange={onRealTimeChange}
          />
      )}
      {showDatePicker && (
          <DateTimePicker
              value={realTime}
              mode="date"
              display="default"
              onChange={onDateChange}
          />
      )}
    
    <View style={styles.buttonContainer}>
      <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
          <Text style={[styles.buttonText, { color: colors.text }]}>Cancel</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={[styles.buttonText, { color: colors.text }]}>Save</Text>
      </TouchableOpacity>
    </View>
  </SafeAreaView>
);

}

export default AddAlarmScreen; 
