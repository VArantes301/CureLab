import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import NewDiaryScreen from '../screens/newDiaryScreen/newDiaryScreen';
import DiaryListScreen from '../screens/diaryListScreen/diaryListScreen';
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
            })}
        >
            <Tab.Screen name="NovoDiario" component={NewDiaryScreen} options={{ title: 'Novo Diário' }} />
            <Tab.Screen name="Diarios" component={DiaryListScreen} options={{ title: 'Diários' }} />
            <Tab.Screen name="Conquistas" component={AchievementsScreen} options={{ title: 'Conquistas' }} />
            <Tab.Screen name="Configuracoes" component={SettingsScreen} options={{ title: 'Configurações' }} />
        </Tab.Navigator>
    );
}