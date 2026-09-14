import { useState, useContext } from 'react';
import { View, Text, TextInput, Button, Alert, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { updateAddiction, updateMascot, updatePhone1 } from '../../services/userServices';
import { UserContext } from '../../context/userContext';
import { API_URL } from '../../services/api';

const MASCOTS = [
    { value: 'cachorro', image: `${API_URL}/static/mascosts/cachorro.jpeg` },
    { value: 'capivara', image: `${API_URL}/static/mascosts/capivara.jpeg` },
    { value: 'coelho', image: `${API_URL}/static/mascosts/coelho.jpeg` },
    { value: 'gato', image: `${API_URL}/static/mascosts/gato.jpeg` },
    { value: 'lontra', image: `${API_URL}/static/mascosts/lontra.jpeg` },
    { value: 'sapo', image: `${API_URL}/static/mascosts/sapo.jpeg` },
];

export default function SettingsScreen() {
    const { userId } = useContext(UserContext);
    const [addictionType, setAddictionType] = useState('');
    const [phone1, setPhone1] = useState('');
    const [selectedMascot, setSelectedMascot] = useState(null);

    async function handleSave() {
        try {
            if (addictionType.trim()) await updateAddiction(userId, addictionType);
            if (phone1.trim()) await updatePhone1(userId, phone1);
            if (selectedMascot) await updateMascot(userId, selectedMascot);
            Alert.alert('Sucesso', 'Configurações salvas!');
        } catch (error) {
            Alert.alert('Erro', error.message);
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Tipo de vício</Text>
            <TextInput style={styles.input} value={addictionType} onChangeText={setAddictionType} />

            <Text style={styles.label}>Telefone</Text>
            <TextInput style={styles.input} value={phone1} onChangeText={setPhone1} keyboardType="phone-pad" />

            <Text style={styles.label}>Mascote</Text>
            <View style={styles.mascotGrid}>
                {MASCOTS.map((mascot) => (
                    <TouchableOpacity
                        key={mascot.value}
                        onPress={() => setSelectedMascot(mascot.value)}
                        style={[styles.mascotItem, selectedMascot === mascot.value && styles.mascotItemSelected]}
                    >
                        <Image source={{ uri: mascot.image }} style={styles.mascotImage} />
                    </TouchableOpacity>
                ))}
            </View>

            <Button title="Salvar alterações" onPress={handleSave} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        padding: 24 
    },

    label: { 
        fontSize: 16, 
        marginTop: 12, 
        marginBottom: 8 
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
        gap: 12, 
        marginBottom: 24 
    },

    mascotItem: { 
        borderWidth: 2, 
        borderColor: 'transparent', 
        borderRadius: 12, 
        padding: 4 
    },

    mascotItemSelected: { 
        borderColor: '#4CAF50' 
    },

    mascotImage: { 
        width: 70, 
        height: 70, 
        borderRadius: 8 
    },

});