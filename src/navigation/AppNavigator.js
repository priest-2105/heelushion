import React, { useEffect, useRef } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import * as Notifications from 'expo-notifications';
import AlarmListScreen from '../screens/AlarmListScreen';
import AddAlarmScreen from '../screens/AddAlarmScreen';
import AlarmRingingScreen from '../screens/AlarmRingingScreen';

const Stack = createStackNavigator();

const DarkTheme = {
  ...DefaultTheme,
  dark: true,
  colors: {
    ...DefaultTheme.colors,
    primary: '#ff9500',
    background: '#000000',
    card: '#1c1c1e',
    text: '#ffffff',
    border: '#2c2c2e',
    notification: '#ff3b30',
  },
};

const AppNavigator = () => {
  const navigationRef = useRef();

  useEffect(() => {
    // Listener for when a notification is received while the app is foregrounded
    const notificationListener = Notifications.addNotificationReceivedListener(notification => {
      // You might want to do something with the notification here
      // For instance, navigate to the ringing screen directly
      const { alarm } = notification.request.content.data;
      if (alarm && navigationRef.current) {
        navigationRef.current.navigate('AlarmRinging', { alarm });
      }
    });

    // Listener for when a user taps on a notification
    const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      const { alarm } = response.notification.request.content.data;
      if (alarm && navigationRef.current) {
        navigationRef.current.navigate('AlarmRinging', { alarm });
      }
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, []);

  return (
    <NavigationContainer theme={DarkTheme} ref={navigationRef}>
      <Stack.Navigator>
        <Stack.Screen
          name="AlarmList"
          component={AlarmListScreen}
          options={{ title: 'Alarms' }}
        />
        <Stack.Screen
          name="AddAlarm"
          component={AddAlarmScreen}
          options={{ presentation: 'modal', title: 'Add Alarm' }}
        />
        <Stack.Screen
          name="AlarmRinging"
          component={AlarmRingingScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator; 