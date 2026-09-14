import { useState, useContext } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { createDiaryEntry } from '../../services/diaryServices'
import { UserContext } from '../../context/userContext';

export default function NewDiaryScreen() {
    const { userId } = useContext(UserContext);
    const [content, setContent] = useState('');

    async function handleSubmit() {
        if (!content.trim()) {
            Alert.alert('Atenção', 'Escreva algo antes de salvar.');
            return;
        }

        try {
            const result = await createDiaryEntry(userId, content);
            setContent('');

            let message = `Streak atual: ${result.current_streak} dia(s).\n\n${result.motivational_message}`;

            if (result.new_achievements && result.new_achievements.length > 0) {
                const titles = result.new_achievements.map((a) => a.title).join(', ');
                message += `\n\n🏆 Nova conquista: ${titles}!`;
            }

            Alert.alert('Diário salvo!', message);
        } catch (error) {
            Alert.alert('Erro', error.message);
        }
    }

        return (
        <View style={styles.container}>
            <Text style={styles.title}>Como foi seu dia?</Text>
            <TextInput
                style={styles.textArea}
                placeholder="Escreva aqui..."
                value={content}
                onChangeText={setContent}
                multiline
                textAlignVertical="top"
            />
            <Button title="Salvar diário" onPress={handleSubmit} />
        </View>
    );

    }

    const styles = StyleSheet.create({
    container: { 
        flex: 1,
        padding: 24 
    },
    title: { 
        fontSize: 20, 
        marginBottom: 16 
    },

    textArea: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 12,
        minHeight: 200,
        marginBottom: 16,
    },
});