import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, AppState } from 'react-native';
import { Audio } from 'expo-av';
import { useNavigation, useRoute, useTheme } from '@react-navigation/native';

const AlarmRingingScreen = () => {
  const [sound, setSound] = useState();
  const navigation = useNavigation();
  const route = useRoute();
  const { colors } = useTheme();
  const { alarm } = route.params;

  async function playSound() {
    console.log('Loading Sound');
    // NOTE: Add a sound file at assets/sounds/alarm.mp3
    // You can find free alarm sounds online.
    try {
      const { sound } = await Audio.Sound.createAsync(
         require('../../assets/sounds/alarm.mp3'),
         { shouldPlay: true, isLooping: true }
      );
      setSound(sound);
      console.log('Playing Sound');
      await sound.playAsync();
    } catch (error) {
        console.log('Could not play sound, maybe the file is missing?', error)
    }
  }

  useEffect(() => {
    playSound();

    const subscription = AppState.addEventListener('change', (nextAppState) => {
        if (nextAppState.match(/inactive|background/)) {
            // App is going to the background, stop the sound
            if (sound) {
                console.log('Stopping sound due to app state change');
                sound.stopAsync();
            }
        }
    });


    return () => {
      if (sound) {
        console.log('Unloading Sound');
        sound.unloadAsync();
      }
      subscription.remove();
    };
  }, []);

  const handleStopAlarm = () => {
    if (sound) {
      sound.stopAsync();
    }
    navigation.navigate('AlarmList');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.time, { color: colors.text }]}>{alarm.displayTime}</Text>
      <Text style={[styles.label, { color: colors.text }]}>Alarm</Text>
      <View style={styles.buttonContainer}>
        <Button title="Stop" onPress={handleStopAlarm} color={colors.primary} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  time: {
    fontSize: 72,
    fontWeight: 'bold',
  },
  label: {
    fontSize: 24,
    marginTop: 10,
  },
  buttonContainer: {
    marginTop: 100,
    width: '50%',
  }
});

export default AlarmRingingScreen; 