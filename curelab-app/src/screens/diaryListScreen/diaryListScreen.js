import React, { useState, useCallback, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { UserContext } from '../../context/userContext';
import { listDiaryEntries } from '../../services/diaryServices';

export default function DiaryListScreen({ navigation }) {
    const { user } = useContext(UserContext);
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(true);

    useFocusEffect(
        useCallback(() => {
            let isActive = true;

            async function fetchEntries() {
                if (!user?.id) return;

                setLoading(true);
                try {
                    const data = await listDiaryEntries(user.id);
                    if (isActive) setEntries(data);
                } catch (error) {
                    console.log('Erro ao buscar diários:', error);
                } finally {
                    if (isActive) setLoading(false);
                }
            }

            fetchEntries();
            return () => { isActive = false; };
        }, [user?.id])
    );

    function formatDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        return isNaN(date.getTime()) ? '' : date.toLocaleDateString('pt-BR');
    }

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#2E7D32" />
            </View>
        );
    }

    return (
        <FlatList
            style={styles.container}
            contentContainerStyle={styles.listContent}
            data={entries}
            keyExtractor={(item) => String(item.id)}
            ListEmptyComponent={
                <Text style={styles.empty}>Nenhum registro no diário ainda.</Text>
            }
            renderItem={({ item }) => (
                <TouchableOpacity
                    style={styles.entryCard}
                    onPress={() => navigation.navigate('DiaryDetail', { diaryId: item.id })}
                >
                    <Text style={styles.entryTitle}>{item.title}</Text>
                    <Text style={styles.date}>
                        {formatDate(item.created_at)}
                    </Text>
                </TouchableOpacity>
            )}
        />
    );
}

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
    },
    listContent: {
        padding: 16,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    empty: { 
        textAlign: 'center', 
        marginTop: 32, 
        color: '#888',
        fontSize: 14 
    },
    entryCard: { 
        backgroundColor: '#FFF',
        borderRadius: 8,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    entryTitle: { 
        fontSize: 16, 
        fontWeight: 'bold',
        color: '#333'
    },
    date: { 
        fontSize: 12, 
        color: '#888', 
        marginTop: 6 
    },
});