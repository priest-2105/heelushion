import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, Button, Text, Platform, TouchableOpacity, UIManager, LayoutAnimation, Alert } from 'react-native';
import { AlarmsContext } from '../context/AlarmsContext';
import AlarmItem from '../components/AlarmItem';
import { useNavigation, useTheme } from '@react-navigation/native';

const AlarmListScreen = () => {
  const { alarms, loading, updateAlarm, deleteAlarm } = useContext(AlarmsContext);
  const navigation = useNavigation();
  const { colors } = useTheme();

  const [multiSelectMode, setMultiSelectMode] = useState(false);
  const [selectedAlarms, setSelectedAlarms] = useState([]);

  useEffect(() => {
    if (Platform.OS === 'android') {
      if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
      }
    }
  }, []);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        multiSelectMode ? (
          <TouchableOpacity onPress={handleBulkDelete} style={{ marginRight: 10 }}>
            <Text style={{ color: 'red', fontSize: 20 }}>Delete ({selectedAlarms.length})</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => navigation.navigate('AddAlarm')} style={{ marginRight: 10 }}>
            <Text style={{ color: colors.text, fontSize: 30 }}>+</Text>
          </TouchableOpacity>
        )
      ),
      title: multiSelectMode ? 'Select Alarms' : 'Alarm',
      headerLeft: () => (
        multiSelectMode ? (
          <TouchableOpacity onPress={exitMultiSelect} style={{ marginLeft: 10 }}>
            <Text style={{ color: colors.text, fontSize: 20 }}>Cancel</Text>
          </TouchableOpacity>
        ) : null
      ),
    });
  }, [navigation, colors, multiSelectMode, selectedAlarms.length]);

  useEffect(() => {
    if(!loading) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    }
  }, [alarms]);

  const getNextAlarmText = () => {
    const upcomingAlarms = alarms
      .filter(a => a.enabled && a.realTime > new Date())
      .sort((a, b) => a.realTime - b.realTime);

    if (upcomingAlarms.length === 0) {
      return null;
    }

    const nextAlarm = upcomingAlarms[0];
    const now = new Date();
    const diffMs = nextAlarm.realTime.getTime() - now.getTime();
    const diffMins = Math.round(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const remainingMins = diffMins % 60;

    let timeToGo = '';
    if (diffHours > 0) {
      timeToGo += `${diffHours} hour${diffHours > 1 ? 's' : ''} `;
    }
    if (remainingMins > 0) {
      timeToGo += `${remainingMins} minute${remainingMins > 1 ? 's' : ''}`;
    }

    return `Alarm in ${timeToGo}`;
  };

  const handleAlarmLongPress = (id) => {
    setMultiSelectMode(true);
    setSelectedAlarms([id]);
  };

  const handleAlarmPress = (id) => {
    if (multiSelectMode) {
      setSelectedAlarms((prev) =>
        prev.includes(id) ? prev.filter((aid) => aid !== id) : [...prev, id]
      );
    }
  };

  const handleBulkDelete = () => {
    Alert.alert(
      'Delete Alarms',
      `Are you sure you want to delete ${selectedAlarms.length} alarm(s)?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => {
          selectedAlarms.forEach(id => deleteAlarm(id));
          setMultiSelectMode(false);
          setSelectedAlarms([]);
        }}
      ]
    );
  };

  const exitMultiSelect = () => {
    setMultiSelectMode(false);
    setSelectedAlarms([]);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const nextAlarmText = getNextAlarmText();

  return (
    <View style={styles.container}>
      {nextAlarmText && <Text style={styles.nextAlarmText}>{nextAlarmText}</Text>}
      <FlatList
        data={alarms}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <AlarmItem
            alarm={item}
            onToggle={(enabled) => updateAlarm({ ...item, enabled })}
            onDelete={() => multiSelectMode ? handleAlarmPress(item.id) : deleteAlarm(item.id)}
            onLongPress={() => handleAlarmLongPress(item.id)}
            selected={selectedAlarms.includes(item.id)}
            multiSelectMode={multiSelectMode}
            onPress={() => handleAlarmPress(item.id)}
          />
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No Alarms</Text>}
        contentContainerStyle={{ paddingTop: nextAlarmText ? 0 : 20 }}
        extraData={{ selectedAlarms, multiSelectMode }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  nextAlarmText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 18,
    paddingVertical: 20,
  },
  emptyText: {
    color: 'white',
    textAlign: 'center',
    marginTop: 50,
  },
});

export default AlarmListScreen; 