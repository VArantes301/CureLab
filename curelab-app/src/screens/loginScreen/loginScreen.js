import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { loginUser } from '../../services/userServices';
import { UserContext } from '../../context/userContext';

export default function LoginScreen({ navigation }) {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useContext(UserContext);

    async function handleLogin() {
        if (!identifier.trim() || !password.trim()) {
            Alert.alert('Atenção', 'Preencha todos os campos.');
            return;
        }

        try {
            const user = await loginUser(identifier, password);

            await login(user);

            if (!user.addiction_type || !user.mascot) {
                navigation.reset({ index: 0, routes: [{ name: 'CompleteProfile' }] });
            } else {
                navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
            }
        } catch (error) {
            Alert.alert('Erro', error.message || 'Falha ao realizar login.');
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>

            <TextInput
                style={styles.input}
                placeholder="Nome ou e-mail"
                value={identifier}
                onChangeText={setIdentifier}
                autoCapitalize="none"
                autoCorrect={false}
            />

            <TextInput
                style={styles.input}
                placeholder="Senha"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
            />

            <Button title="Entrar" onPress={handleLogin} />

            <View style={{ marginTop: 12 }}>
                <Button
                    title="Não tenho conta"
                    onPress={() => navigation.navigate('Cadastro')}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        justifyContent: 'center', 
        padding: 24 
    },
    title: { 
        fontSize: 24, 
        marginBottom: 16, 
        textAlign: 'center',
        fontWeight: 'bold' 
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
    },
});