import React, { useState, useContext } from 'react';
import {
    View,
    Text,
    TextInput,
    Button,
    Alert,
    StyleSheet,
    ScrollView,
    Image,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { createDiaryEntry } from '../../services/diaryServices';
import { UserContext } from '../../context/userContext';

export default function NewDiaryScreen() {
    const { user } = useContext(UserContext);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);

    async function pickImage() {
        if (images.length >= 4) {
            Alert.alert('Atenção', 'Máximo de 4 imagens.');
            return;
        }

        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync(); 
        if (!permission.granted) {
            Alert.alert('Permissão necessária', 'Precisamos de acesso às suas fotos.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({ 
            mediaTypes: ['images'], 
            quality: 0.7,
        });

        if (!result.canceled) {
            const asset = result.assets[0];
            
            const fileName = asset.uri.split('/').pop() || `image_${Date.now()}.jpg`;

            const ext = fileName.split('.').pop()?.toLowerCase() || 'jpg';

            const mimeTypes = {
                jpg: 'image/jpeg',
                jpeg: 'image/jpeg',
                png: 'image/png',
                webp: 'image/webp',
                gif: 'image/gif',
                heic: 'image/heic',
            };

            const imageFile = {
                uri: asset.uri,
                name: fileName,
                type: mimeTypes[ext] || 'image/jpeg',
            };

            setImages((current) => [...current, imageFile]);
        }
    }

    function removeImage(uriToRemove) {
        setImages((current) => current.filter((img) => img.uri !== uriToRemove));
    }

    async function handleSubmit() {
        if (!title.trim()) { 
            Alert.alert('Atenção', 'Dê um título ao seu diário.');
            return;
        }
        if (!content.trim()) {
            Alert.alert('Atenção', 'Escreva algo antes de salvar.');
            return;
        }
        if (!user?.id) {
            Alert.alert('Erro', 'Usuário não autenticado.');
            return;
        }

        setLoading(true);

        try {
            const result = await createDiaryEntry(user.id, title, content, images);
            setTitle('');
            setContent('');
            setImages([]);

            let message = `Streak atual: ${result.current_streak} dia(s).\n\n${result.motivational_message}`;

            if (result.new_achievements && result.new_achievements.length > 0) {
                const titles = result.new_achievements.map((a) => a.title).join(', ');
                message += `\n\n🏆 Nova conquista: ${titles}!`;
            }

            Alert.alert('Diário salvo!', message);
        } catch (error) {
            Alert.alert('Erro', error.message || 'Falha ao salvar registro.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Como foi seu dia?</Text>

            <TextInput
                style={styles.input}
                placeholder="Título"
                value={title}
                onChangeText={setTitle}
                editable={!loading}
            />

            <TextInput
                style={styles.textArea}
                placeholder="Escreva aqui..."
                value={content}
                onChangeText={setContent}
                multiline
                textAlignVertical="top"
                editable={!loading}
            />

            <Text style={styles.label}>Imagens ({images.length}/4)</Text>
            <View style={styles.imageRow}>
                {images.map((image) => (
                    <TouchableOpacity key={image.uri} onPress={() => removeImage(image.uri)} disabled={loading}>
                        <Image source={{ uri: image.uri }} style={styles.thumbnail} />
                    </TouchableOpacity>
                ))}
                {images.length < 4 && (
                    <TouchableOpacity style={styles.addButton} onPress={pickImage} disabled={loading}>
                        <Text style={styles.addButtonText}>+</Text>
                    </TouchableOpacity>
                )}
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <Button title="Salvar diário" onPress={handleSubmit} color="#2E7D32" />
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        padding: 24 
    },
    title: { 
        fontSize: 20, 
        marginBottom: 16,
        fontWeight: 'bold' 
    },
    label: { 
        fontSize: 14, 
        marginBottom: 8, 
        color: '#555' 
    },
    input: { 
        borderWidth: 1, 
        borderColor: '#ccc', 
        borderRadius: 8, 
        padding: 12, 
        marginBottom: 12 
    },
    textArea: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 12,
        minHeight: 150,
        marginBottom: 16,
    },
    imageRow: { 
        flexDirection: 'row', 
        flexWrap: 'wrap', 
        gap: 8, 
        marginBottom: 24 
    },
    thumbnail: { 
        width: 70, 
        height: 70, 
        borderRadius: 8 
    },
    addButton: {
        width: 70,
        height: 70,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ccc',
        borderStyle: 'dashed',
        justifyContent: 'center',
        alignItems: 'center',
    },
    addButtonText: { 
        fontSize: 28, 
        color: '#999' 
    },
});