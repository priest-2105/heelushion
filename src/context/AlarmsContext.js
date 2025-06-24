import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { scheduleAlarmNotification, cancelAlarmNotification } from '../utils/notifications';

const ALARMS_STORAGE_KEY = '@Heelushion:alarms';

export const AlarmsContext = createContext();

export const AlarmsProvider = ({ children }) => {
  const [alarms, setAlarms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAlarms = async () => {
      try {
        const storedAlarms = await AsyncStorage.getItem(ALARMS_STORAGE_KEY);
        if (storedAlarms !== null) {
          setAlarms(JSON.parse(storedAlarms).map(alarm => ({
            ...alarm,
            realTime: new Date(alarm.realTime),
            displayTime: new Date(alarm.displayTime),
          })));
        }
      } catch (e) {
        console.error('Failed to load alarms.', e);
      } finally {
        setLoading(false);
      }
    };

    loadAlarms();
  }, []);

  const saveAlarms = async (newAlarms) => {
    try {
      const jsonValue = JSON.stringify(newAlarms);
      await AsyncStorage.setItem(ALARMS_STORAGE_KEY, jsonValue);
      return newAlarms;
    } catch (e) {
      console.error('Failed to save alarms.', e);
      return alarms;
    }
  };

  const addAlarm = async (alarm) => {
    let notificationId = null;
    if (alarm.enabled) {
      notificationId = await scheduleAlarmNotification(alarm);
    }
    const newAlarm = { ...alarm, id: Date.now().toString(), notificationId };
    const newAlarms = [...alarms, newAlarm];
    setAlarms(await saveAlarms(newAlarms));
  };

  const updateAlarm = async (updatedAlarm) => {
    if (updatedAlarm.enabled && !updatedAlarm.notificationId) {
      updatedAlarm.notificationId = await scheduleAlarmNotification(updatedAlarm);
    } else if (!updatedAlarm.enabled && updatedAlarm.notificationId) {
      await cancelAlarmNotification(updatedAlarm.notificationId);
      updatedAlarm.notificationId = null;
    }

    const newAlarms = alarms.map((alarm) =>
      alarm.id === updatedAlarm.id ? updatedAlarm : alarm
    );
    setAlarms(await saveAlarms(newAlarms));
  };

  const deleteAlarm = async (id) => {
    const alarmToDelete = alarms.find((alarm) => alarm.id === id);
    if (alarmToDelete && alarmToDelete.notificationId) {
      await cancelAlarmNotification(alarmToDelete.notificationId);
    }
    const newAlarms = alarms.filter((alarm) => alarm.id !== id);
    setAlarms(await saveAlarms(newAlarms));
  };

  return (
    <AlarmsContext.Provider value={{ alarms, loading, addAlarm, updateAlarm, deleteAlarm }}>
      {children}
    </AlarmsContext.Provider>
  );
}; 