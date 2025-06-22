import React from 'react';
import { StatusBar } from 'expo-status-bar';
import AppNavigator from './src/navigation/AppNavigator';
import { AlarmsProvider } from './src/context/AlarmsContext';

export default function App() {
  return (
    <AlarmsProvider>
      <StatusBar style="light" />
      <AppNavigator />
    </AlarmsProvider>
  );
}
