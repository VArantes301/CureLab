import React, { useContext } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { UserContext } from '../context/userContext';
import RegisterScreen from '../screens/registerScreen/registerScreen';
import CompleteProfile from '../screens/CompleteProfile/completeProfile';
import LoginScreen from '../screens/loginScreen/loginScreen';
import HomeTabs from './HomeTabs';
import DiaryStack from './DiaryStack';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
    const { user, loading } = useContext(UserContext);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <NavigationContainer>
            <Stack.Navigator>
                {user ? (
                    <>
                        <Stack.Screen
                            name="Home"
                            component={HomeTabs}
                            options={{ headerShown: false }}
                        />
                        
                        <Stack.Screen
                            name="CompleteProfile"
                            component={CompleteProfile}
                            options={{ title: 'Complete seu perfil' }}
                        />
                    </>
                ) : (
                    <>
                        <Stack.Screen
                            name="Login"
                            component={LoginScreen}
                            options={{ title: 'Entrar' }}
                        />
                        <Stack.Screen
                            name="Cadastro"
                            component={RegisterScreen}
                            options={{ title: 'Criar Conta' }}
                        />
                        <Stack.Screen
                            name="CompleteProfile"
                            component={CompleteProfile}
                            options={{ title: 'Faça seu perfil' }}
                        />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});