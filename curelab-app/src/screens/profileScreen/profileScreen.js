import { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    Button,
    Alert,
    Image,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import { updateAddiction, updateMascot, updatePhone1 } from '../../services/userServices';
import { API_URL } from '../../services/api';

const MASCOTS = [
    { value: 'cachorro', image: `${API_URL}/static/mascosts/cachorro.jpeg` },
    { value: 'capivara', image: `${API_URL}/static/mascosts/capivara.jpeg` },
    { value: 'coelho', image: `${API_URL}/static/mascosts/coelho.jpeg` },
    { value: 'gato', image: `${API_URL}/static/mascosts/gato.jpeg` },
    { value: 'lontra', image: `${API_URL}/static/mascosts/lontra.jpeg` },
    { value: 'sapo', image: `${API_URL}/static/mascosts/sapo.jpeg` },
];

export default function ProfileScreen({ route, navigation }) {
    const { userId } = route.params;

    const [addictionType, setAddictionType] = useState('');
    const [selectedMascot, setSelectedMascot] = useState(null);
    const [phone1, setPhone1] = useState('');

    async function handleSave() {
        if (!addictionType.trim()) {
            Alert.alert('Atenção', 'Preencha o tipo de vício.');
            return;
        }

        if (!selectedMascot) {
            Alert.alert('Atenção', 'Escolha um mascote.');
            return;
        }

        if (!phone1.trim()) {
            Alert.alert('Atenção', 'Preencha o seu telefone.');
            return;
        }

        try {
            await updateAddiction(userId, addictionType);
            await updateMascot(userId, selectedMascot);
            await updatePhone1(userId, phone1);

            Alert.alert('Sucesso', 'Perfil completo!');
        } catch (error) {
            Alert.alert('Erro', error.message);
        }
    }

    return (
        <View style={styles.container}>
        
            <Text style={styles.title}>Complete o perfil</Text>

            <Text style={styles.label}>Tipo de vício</Text>
            <TextInput
                style={styles.input}
                placeholder="Ex: álcool, tabaco..."
                value={addictionType}
                onChangeText={setAddictionType}
            />

            <Text style={styles.label}>Telefone</Text>
            <TextInput
                style={styles.input}
                placeholder="Ex: 11999999999"
                value={phone1}
                onChangeText={setPhone1}
                keyboardType="phone-pad" 
            />

            <Text style={styles.label}>Escolha seu mascote</Text>
            <View style={styles.mascotGrid}>
                {MASCOTS.map((mascot) => {
                    const isSelected = selectedMascot === mascot.value;
                    return (
                        <TouchableOpacity
                            key={mascot.value}
                            onPress={() => setSelectedMascot(mascot.value)}
                            style={[
                                styles.mascotItem,
                                isSelected && styles.mascotItemSelected,
                            ]}
                        >
                            <Image
                                source={{ uri: mascot.image }}
                                style={styles.mascotImage}
                            />
                        </TouchableOpacity>
                    );
                })}
            </View>

            <Button title="Salvar" onPress={handleSave} />
        </View>
    );
} 

const styles = StyleSheet.create({
    container: { flex: 1, padding: 24 },
    title: { fontSize: 24, marginBottom: 16, textAlign: 'center' },
    label: { fontSize: 16, marginTop: 8, marginBottom: 8 },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
    },
    mascotGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 24,
    },
    mascotItem: {
        borderWidth: 2,
        borderColor: 'transparent',
        borderRadius: 12,
        padding: 4,
    },
    mascotItemSelected: {
        borderColor: '#4CAF50',
    },
    mascotImage: {
        width: 70,
        height: 70,
        borderRadius: 8,
    },
});