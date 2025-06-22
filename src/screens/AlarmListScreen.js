import React from 'react';
import { View, StyleSheet, FlatList, Button, Text } from 'react-native';
import { useAlarms } from '../hooks/useAlarms';
import AlarmItem from '../components/AlarmItem';
import { useNavigation } from '@react-navigation/native';

const AlarmListScreen = () => {
  const { alarms, loading, updateAlarm, deleteAlarm } = useAlarms();
  const navigation = useNavigation();

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button onPress={() => navigation.navigate('AddAlarm')} title="Add" />
      ),
    });
  }, [navigation]);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={alarms}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <AlarmItem
            alarm={item}
            onToggle={(enabled) => updateAlarm({ ...item, enabled })}
            onDelete={() => deleteAlarm(item.id)}
          />
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No Alarms</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyText: {
    color: 'white',
    textAlign: 'center',
    marginTop: 50,
  },
});

export default AlarmListScreen; 