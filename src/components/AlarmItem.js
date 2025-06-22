import React from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { getAmPmSymbol, formatNextAlarmDate } from '../utils/time';

const AlarmItem = ({ alarm, onToggle, onDelete }) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity onLongPress={onDelete} activeOpacity={0.7}>
      <View style={[styles.container, { backgroundColor: colors.card }]}>
        <View style={styles.timeContainer}>
          <Text style={[styles.time, { color: alarm.enabled ? colors.text : colors.border }]}>
            <Text style={styles.amPm}>{getAmPmSymbol(alarm.realTime)} </Text>
            {alarm.displayTime.split(' ')[0]}
            <Text style={styles.timePeriod}> {alarm.displayTime.split(' ')[1]}</Text>
          </Text>
          <Text style={[styles.label, { color: alarm.enabled ? colors.text : colors.border }]}>
            {formatNextAlarmDate(alarm.realTime)}
          </Text>
        </View>
        <Switch
          value={alarm.enabled}
          onValueChange={onToggle}
          trackColor={{ false: '#3e3e3e', true: '#81b0ff' }}
          thumbColor={alarm.enabled ? '#3478f6' : '#999999'}
          ios_backgroundColor="#3e3e3e"
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 20,
  },
  timeContainer: {
    flexDirection: 'column',
  },
  time: {
    fontSize: 42,
    fontWeight: 'bold',
  },
  amPm: {
    fontSize: 24,
  },
  timePeriod: {
    fontSize: 20,
    fontWeight: 'normal',
  },
  label: {
    fontSize: 16,
    opacity: 0.8,
    marginTop: 4,
  },
});

export default AlarmItem; 