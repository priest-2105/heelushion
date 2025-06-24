import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, SafeAreaView } from 'react-native';
import { useNavigation, useRoute, useTheme } from '@react-navigation/native';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const RepeatScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { colors } = useTheme();
    const { repeat: initialRepeat } = route.params;

    const [repeat, setRepeat] = useState(initialRepeat);

    const toggleDay = (day) => {
        setRepeat(prev => ({ ...prev, [day]: !prev[day] }));
    };

    const handleDone = () => {
        navigation.navigate({
            name: 'AddAlarm',
            params: { repeat },
            merge: true,
        });
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={[styles.headerButton, { color: colors.primary }]}>Back</Text>
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Repeat</Text>
                <TouchableOpacity onPress={handleDone}>
                    <Text style={[styles.headerButton, { color: colors.primary }]}>Done</Text>
                </TouchableOpacity>
            </View>
            {days.map(day => (
                <View key={day} style={[styles.row, { borderBottomColor: colors.border }]}>
                    <Text style={[styles.label, { color: colors.text }]}>{day}</Text>
                    <Switch
                        value={repeat[day.substring(0, 3)]}
                        onValueChange={() => toggleDay(day.substring(0, 3))}
                        trackColor={{ false: '#767577', true: colors.primary }}
                        thumbColor={'#f4f3f4'}
                    />
                </View>
            ))}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        paddingHorizontal: 20,
    },
    headerButton: {
        fontSize: 18,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
    },
    label: {
        fontSize: 16,
    },
});

export default RepeatScreen; 