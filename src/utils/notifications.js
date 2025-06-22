import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

export const requestPermissions = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
        alert('You need to enable notifications in settings');
        return false;
    }
    return true;
};

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

export const scheduleAlarmNotification = async (alarm) => {
    const hasPermissions = await requestPermissions();
    if (!hasPermissions) return;

    const trigger = alarm.realTime;

    const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
            title: "It's time!",
            body: `Your alarm for ${alarm.displayTime} is going off.`,
            data: { alarm },
            sound: 'default' // This will use the default notification sound
        },
        trigger,
    });
    return notificationId;
};

export const cancelAlarmNotification = async (notificationId) => {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
}; 