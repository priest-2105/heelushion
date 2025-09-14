import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

export const requestPermissions = async () => {
    // For Android, we must create a channel before asking for permissions
    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('alarm-channel', {
            name: 'Alarms',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            sound: 'default', // Use default notification sound
            lightColor: '#FF231F7C',
            lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
        });
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }
    if (finalStatus !== 'granted') {
        alert('You need to enable notifications in settings for alarms to work.');
        return false;
    }
    return true;
};

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

export const scheduleAlarmNotification = async (alarm) => {
    const hasPermissions = await requestPermissions();
    if (!hasPermissions) return;

    const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
            title: "It's time!",
            body: `Your alarm for ${alarm.displayTime} is going off.`,
            data: { alarm },
            sound: 'default' // This will use the default notification sound
        },
        trigger: {
            date: alarm.realTime,
            channelId: 'alarm-channel',
        }
    });
    return notificationId;
};

export const cancelAlarmNotification = async (notificationId) => {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
}; 