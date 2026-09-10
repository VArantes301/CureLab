import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RegisterScreen from '../screens/registerScreen/registerScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Cadastro">
                <Stack.Screen
                    name="Cadastro"
                    component={RegisterScreen}
                    options={{ title: 'Criar Conta' }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}