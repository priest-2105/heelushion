import React, { useState, useContext } from 'react';
import { View, StyleSheet, Text, Platform, TouchableOpacity, SafeAreaView, Switch } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { AlarmsContext } from '../context/AlarmsContext';
import { useNavigation, useTheme } from '@react-navigation/native';

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
  
  const { addAlarm } = useContext(AlarmsContext);
  const navigation = useNavigation();
  const { colors } = useTheme();

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

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.settingsContainer}>
            <SettingRow 
                label="Date"
                value={formatDate(realTime)}
                onPress={() => setShowRealPicker(true)} // For now, this just opens the time picker
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
                value="Never >"
                onPress={() => alert('Repeating alarms coming soon!')}
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
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  settingsContainer: {
    paddingTop: 20,
    flex: 1,
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

export default AddAlarmScreen; 