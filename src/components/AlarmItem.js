import React from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { useTheme } from '@react-navigation/native';

const formatNextAlarmDate = (date) => {
  if (!date) return 'Alarm';
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const isToday = date.getFullYear() === now.getFullYear() &&
                  date.getMonth() === now.getMonth() &&
                  date.getDate() === now.getDate();

  const isTomorrow = date.getFullYear() === tomorrow.getFullYear() &&
                     date.getMonth() === tomorrow.getMonth() &&
                     date.getDate() === tomorrow.getDate();

  if (isToday) return 'Today';
  if (isTomorrow) return 'Tomorrow';
  
  return date.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
};

const AlarmItem = ({ alarm, onToggle, onDelete, onLongPress, selected, multiSelectMode, onPress }) => {
  const { colors } = useTheme();

  const formatTime = (dateToFormat) => {
    if (!dateToFormat) return { time: '', period: '' };
    const dateObj = dateToFormat instanceof Date ? dateToFormat : new Date(dateToFormat);
    if (isNaN(dateObj.getTime())) return { time: '', period: '' };
    const timeString = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    const [time, period] = timeString.split(' ');
    return { time, period };
  };

  const disabledColor = '#aaa';
  const alarmColor = alarm.enabled ? '#fff' : disabledColor;
  const { time, period } = formatTime(alarm.displayTime);

  return (
    <TouchableOpacity
      onLongPress={onLongPress}
      onPress={multiSelectMode ? onPress : undefined}
      activeOpacity={0.7}
    >
      <View style={[styles.container, { backgroundColor: colors.card }, selected && styles.selected]}>
        <View style={styles.timeContainer}>
          <Text style={[styles.time, { color: alarmColor }]}> 
            {time}
            <Text style={styles.timePeriod}> {period}</Text>
          </Text>
          <Text style={[styles.label, { color: alarmColor }]}> 
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
  selected: {
    borderWidth: 2,
    borderColor: '#ff9500',
  },
  timeContainer: {
    flexDirection: 'column',
  },
  time: {
    fontSize: 42,
    fontWeight: 'bold',
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