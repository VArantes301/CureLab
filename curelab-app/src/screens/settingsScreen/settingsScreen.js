import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, Alert, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { updateAddiction, updateMascot, updatePhone1 } from '../../services/userServices';
import { UserContext } from '../../context/userContext';
import { API_URL } from '../../services/api';

const MASCOTS = [
    { value: 'cachorro', image: `${API_URL}/mascots/cachorro.jpeg` },
    { value: 'capivara', image: `${API_URL}/mascots/capivara.jpeg` },
    { value: 'coelho', image: `${API_URL}/mascots/coelho.jpeg` },
    { value: 'gato', image: `${API_URL}/mascots/gato.jpeg` },
    { value: 'lontra', image: `${API_URL}/mascots/lontra.jpeg` },
    { value: 'sapo', image: `${API_URL}/mascots/sapo.jpeg` },
];

export default function SettingsScreen() {
    const { user, updateUser, logout } = useContext(UserContext);

    const [addictionType, setAddictionType] = useState(user?.addiction_type || '');
    const [phone1, setPhone1] = useState(user?.phone1 || '');
    const [selectedMascot, setSelectedMascot] = useState(user?.mascot || null);

    async function handleSave() {
        try {
            const updates = {};

            if (addictionType.trim()) {
                await updateAddiction(user.id, addictionType);
                updates.addiction_type = addictionType;
            }
            if (phone1.trim()) {
                await updatePhone1(user.id, phone1);
                updates.phone1 = phone1;
            }
            if (selectedMascot) {
                await updateMascot(user.id, selectedMascot);
                updates.mascot = selectedMascot;
            }

            await updateUser(updates);

            Alert.alert('Sucesso', 'Configurações atualizadas!');
        } catch (error) {
            Alert.alert('Erro', error.message || 'Falha ao atualizar configurações');
        }
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.label}>O que você quer monitorar?</Text>
            <TextInput 
                style={styles.input} 
                value={addictionType} 
                onChangeText={setAddictionType}
                placeholder="Ex: álcool, tabaco..."
            />

            <Text style={styles.label}>Telefone</Text>
            <TextInput 
                style={styles.input} 
                value={phone1} 
                onChangeText={setPhone1} 
                keyboardType="phone-pad"
                placeholder="Ex: 11999999999"
            />

            <Text style={styles.label}>Mascote</Text>
            <View style={styles.mascotGrid}>
                {MASCOTS.map((mascot) => (
                    <TouchableOpacity
                        key={mascot.value}
                        onPress={() => setSelectedMascot(mascot.value)}
                        style={[
                            styles.mascotItem, 
                            selectedMascot === mascot.value && styles.mascotItemSelected
                        ]}
                    >
                        <Image source={{ uri: mascot.image }} style={styles.mascotImage} />
                    </TouchableOpacity>
                ))}
            </View>

            <Button title="Salvar alterações" onPress={handleSave} color="#2E7D32" />

            <View style={styles.logoutContainer}>
                <Button title="Sair da Conta" onPress={logout} color="#D32F2F" />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { 
        padding: 24,
        paddingBottom: 40
    },
    label: { 
        fontSize: 16, 
        marginTop: 12, 
        marginBottom: 8,
        fontWeight: '500'
    },
    input: { 
        borderWidth: 1, 
        borderColor: '#ccc', 
        borderRadius: 8, 
        padding: 12, 
        marginBottom: 8 
    },
    mascotGrid: { 
        flexDirection: 'row', 
        flexWrap: 'wrap', 
        justifyContent: 'space-between', 
        marginBottom: 24 
    },
    mascotItem: { 
        borderWidth: 2, 
        borderColor: 'transparent', 
        borderRadius: 12, 
        padding: 4,
        marginBottom: 8
    },
    mascotItemSelected: { 
        borderColor: '#4CAF50' 
    },
    mascotImage: { 
        width: 80, 
        height: 80, 
        borderRadius: 8 
    },
    logoutContainer: {
        marginTop: 24,
    }
});