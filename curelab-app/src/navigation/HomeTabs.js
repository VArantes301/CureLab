import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import NewDiaryScreen from '../screens/newDiaryScreen/newDiaryScreen';
import DiaryStack from './DiaryStack';
import AchievementsScreen from '../screens/achievementsScreen/achievementsScreen';
import SettingsScreen from '../screens/settingsScreen/settingsScreen';

const Tab = createBottomTabNavigator();

const ICONS = {
    NovoDiario: 'create-outline',
    Diarios: 'book-outline',
    Conquistas: 'trophy-outline',
    Configuracoes: 'settings-outline',
};

export default function HomeTabs() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ color, size }) => (
                    <Ionicons name={ICONS[route.name]} size={size} color={color} />
                ),
                tabBarActiveTintColor: '#2E7D32',
                tabBarInactiveTintColor: 'gray',
            })}
        >
            <Tab.Screen 
                name="NovoDiario" 
                component={NewDiaryScreen} 
                options={{ 
                    title: 'Novo Diário',
                    unmountOnBlur: true 
                }} 
            />
            <Tab.Screen 
                name="Diarios" 
                component={DiaryStack} 
                options={{ 
                    title: 'Diários', 
                    headerShown: false 
                }} 
            />
            <Tab.Screen 
                name="Conquistas" 
                component={AchievementsScreen} 
                options={{ title: 'Conquistas' }} 
            />
            <Tab.Screen 
                name="Configuracoes" 
                component={SettingsScreen} 
                options={{ title: 'Configurações' }} 
            />
        </Tab.Navigator>
    );
}