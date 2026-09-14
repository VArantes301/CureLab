import { useState, useCallback, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { UserContext } from '../../context/userContext';
import { listDiaryEntries } from '../../services/diaryServices';

export default function DiaryListScreen() {
    const { userId } = useContext(UserContext);
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(true);

    useFocusEffect(
        useCallback(() => {
            let isActive = true;

            async function fetchEntries() {
                setLoading(true);
                try {
                    const data = await listDiaryEntries(userId);
                    if (isActive) setEntries(data);
                } catch (error) {
                    console.log('Erro ao buscar diários:', error);
                } finally {
                    if (isActive) setLoading(false);
                }
            }

            fetchEntries();
            return () => { isActive = false; };
        }, [userId])
    );

    if (loading) {
        return <ActivityIndicator style={{ flex: 1 }} />;
    }

    return (
        <FlatList
            style={styles.container}
            data={entries}
            keyExtractor={(item) => String(item.id)}
            ListEmptyComponent={<Text style={styles.empty}>Nenhum diário ainda.</Text>}
            renderItem={({ item }) => (
                <View style={styles.entry}>
                    <Text style={styles.date}>
                        {new Date(item.created_at).toLocaleDateString('pt-BR')}
                    </Text>
                    <Text style={styles.content}>{item.content}</Text>
                </View>
            )}
        />
    );
}

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        padding: 16 
    },

    empty: { 
        textAlign: 'center', 
        marginTop: 32, 
        color: '#888' 
    },

    entry: { 
        borderBottomWidth: 1, 
        borderBottomColor: '#eee', 
        paddingVertical: 12 
    },

    date: { 
        fontSize: 12, 
        color: '#888', 
        marginBottom: 4 
    },

    content: { 
        fontSize: 16 
    },

});