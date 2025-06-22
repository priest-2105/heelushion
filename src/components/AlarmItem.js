import React from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { useTheme } from '@react-navigation/native';

const AlarmItem = ({ alarm, onToggle, onDelete }) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity onLongPress={onDelete} activeOpacity={0.7}>
      <View style={[styles.container, { borderBottomColor: colors.border }]}>
        <View>
          <Text style={[styles.time, { color: colors.text }]}>{alarm.displayTime}</Text>
          <Text style={[styles.label, { color: colors.text }]}>Alarm</Text>
        </View>
        <Switch
          value={alarm.enabled}
          onValueChange={onToggle}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={alarm.enabled ? '#f5dd4b' : '#f4f3f4'}
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
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  time: {
    fontSize: 42,
    fontWeight: '200',
  },
  label: {
    fontSize: 16,
    opacity: 0.8,
  },
});

export default AlarmItem; 