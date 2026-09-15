import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DiaryListScreen from '../screens/diaryListScreen/diaryListScreen';
import DiaryDetailScreen from '../screens/diaryDetailScreen/diaryDetailScreen';

const Stack = createNativeStackNavigator();

export default function DiaryStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="DiaryList" component={DiaryListScreen} options={{ title: 'Diários' }} />
            <Stack.Screen name="DiaryDetail" component={DiaryDetailScreen} options={{ title: 'Diário' }} />
        </Stack.Navigator>
    );
}