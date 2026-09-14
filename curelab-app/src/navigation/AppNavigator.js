import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RegisterScreen from '../screens/registerScreen/registerScreen';
import CompleteProfile from '../screens/CompleteProfile/completeProfile';
import LoginScreen from '../screens/loginScreen/loginScreen';
import HomeTabs from './HomeTabs';

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

                <Stack.Screen
                    name="Home"
                    component={HomeTabs}
                    options={{ headerShown: false }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}