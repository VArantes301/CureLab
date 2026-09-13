import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RegisterScreen from '../screens/registerScreen/registerScreen';
import CompleteProfile from '../screens/CompleteProfile/CompleteProfile';
import LoginScreen from '../screens/loginScreen/loginScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Login">
                <Stack.Screen
                    name="Cadastro"
                    component={RegisterScreen}
                    options={{ title: 'Criar Conta' }}
                />
                <Stack.Screen
                    name="CompleteProfile"
                    component={CompleteProfile}
                    options={{ title: 'faça seu perfil'}}
                />
                <Stack.Screen
                    name="Login"
                    component={LoginScreen}
                    options={{ title: 'Entrar' }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}