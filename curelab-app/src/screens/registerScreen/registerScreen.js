import { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { createUser } from '../../services/userServices';

export default function RegisterScreen({ navigation }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    async function handleRegister() {
    console.log('cliquei no botão'); // linha nova, só pra debug
    try {
        const newUser = await createUser({ name, email, password });
        console.log('deu certo:', newUser); // linha nova
        Alert.alert('Sucesso', 'Usuário ' + newUser.name + ' criado')
    } catch (error) {
        console.log('caiu no catch:', error); // linha nova
        Alert.alert('Erro', error.message);
    }
}

    return(
        <View style ={styles.container}>
            <Text style={styles.title}>Cadastro</Text>

            <TextInput
                style={styles.input}
                placeholder='Nome'
                value={name}
                onChangeText={setName}
            />

            <TextInput
                style={styles.input}
                placeholder='Email'
                value={email}
                onChangeText={setEmail}
                autoCapitalize='none'    
            />

            <TextInput
                style={styles.input}
                placeholder='Senha'
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            <Button title='Cadastrar' onPress={handleRegister} />
        </View>
    )
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
        textAlign: 'center'
    },

    input: {
        borderWidth: 1,
        borderColor: '#7e7c7c',
        borderRadius: 8,
        padding: 12,
        marginBottom: 12
    }

})