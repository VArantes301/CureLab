import React, { useState, useContext } from 'react';
import {
    View,
    Text,
    TextInput,
    Button,
    Alert,
    Image,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
} from 'react-native';
import { updateAddiction, updateMascot, updatePhone1 } from '../../services/userServices';
import { API_URL } from '../../services/api';
import { UserContext } from '../../context/userContext';

const MASCOTS = [
    { value: 'cachorro', image: `${API_URL}/mascots/cachorro.jpeg` },
    { value: 'capivara', image: `${API_URL}/mascots/capivara.jpeg` },
    { value: 'coelho', image: `${API_URL}/mascots/coelho.jpeg` },
    { value: 'gato', image: `${API_URL}/mascots/gato.jpeg` },
    { value: 'lontra', image: `${API_URL}/mascots/lontra.jpeg` },
    { value: 'sapo', image: `${API_URL}/mascots/sapo.jpeg` },
];

export default function CompleteProfile({ navigation }) {
    const { user, updateUser } = useContext(UserContext);

    const [addictionType, setAddictionType] = useState(user?.addiction_type || '');
    const [selectedMascot, setSelectedMascot] = useState(user?.mascot || null);
    const [phone1, setPhone1] = useState(user?.phone1 || '');
    const [loading, setLoading] = useState(false);

    async function handleSave() {
        if (!user?.id) {
            Alert.alert('Erro', 'Sessão inválida. Por favor, faça login novamente.');
            return;
        }

        if (!addictionType.trim()) {
            Alert.alert('Atenção', 'Preencha o hábito que deseja monitorar.');
            return;
        }

        if (!phone1.trim()) {
            Alert.alert('Atenção', 'Preencha o seu telefone.');
            return;
        }

        if (!selectedMascot) {
            Alert.alert('Atenção', 'Escolha um mascote.');
            return;
        }

        setLoading(true);

        try {
            await updateAddiction(user.id, addictionType);
            await updateMascot(user.id, selectedMascot);
            await updatePhone1(user.id, phone1);

            await updateUser({
                addiction_type: addictionType,
                mascot: selectedMascot,
                phone1: phone1,
            });

            Alert.alert('Sucesso', 'Perfil atualizado com sucesso!', [
                {
                    text: 'OK',
                    onPress: () => {
                        if (navigation.canGoBack()) {
                            navigation.goBack();
                        } else {
                            navigation.navigate('Home');
                        }
                    },
                },
            ]);
        } catch (error) {
            Alert.alert('Erro', error.message || 'Falha ao salvar perfil.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Complete o seu perfil</Text>

            <Text style={styles.label}>O que você quer monitorar?</Text>
            <TextInput
                style={styles.input}
                placeholder="Ex: redes sociais, compras, café..."
                value={addictionType}
                onChangeText={setAddictionType}
                editable={!loading}
            />

            <Text style={styles.label}>Telefone</Text>
            <TextInput
                style={styles.input}
                placeholder="Ex: 11999999999"
                value={phone1}
                onChangeText={setPhone1}
                keyboardType="phone-pad"
                editable={!loading}
            />

            <Text style={styles.label}>Escolha seu mascote</Text>
            <View style={styles.mascotGrid}>
                {MASCOTS.map((mascot) => {
                    const isSelected = selectedMascot === mascot.value;
                    return (
                        <TouchableOpacity
                            key={mascot.value}
                            onPress={() => setSelectedMascot(mascot.value)}
                            disabled={loading}
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

            {loading ? (
                <ActivityIndicator size="large" color="#2E7D32" />
            ) : (
                <Button title="Salvar e Continuar" onPress={handleSave} color="#2E7D32" />
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { 
        padding: 24,
        paddingBottom: 40 
    },
    title: { 
        fontSize: 24, 
        marginBottom: 16, 
        textAlign: 'center',
        fontWeight: 'bold',
        color: '#333'
    },
    label: { 
        fontSize: 16, 
        marginTop: 8, 
        marginBottom: 8,
        fontWeight: '500',
        color: '#555'
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
        backgroundColor: '#FFF'
    },
    mascotGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    mascotItem: {
        borderWidth: 3,
        borderColor: 'transparent',
        borderRadius: 12,
        padding: 2,
        marginBottom: 8,
    },
    mascotItemSelected: {
        borderColor: '#2E7D32',
    },
    mascotImage: {
        width: 80,
        height: 80,
        borderRadius: 8,
    },
});