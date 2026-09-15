import React, { useState, useCallback, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { UserContext } from '../../context/userContext';
import { listAchievements } from '../../services/achievementServices';

export default function AchievementsScreen() {
    const { user } = useContext(UserContext);
    const [achievements, setAchievements] = useState([]);
    const [loading, setLoading] = useState(true);

    useFocusEffect(
        useCallback(() => {
            let isActive = true;

            async function fetchAchievements() {
                if (!user?.id) return;

                setLoading(true);
                try {
                    const data = await listAchievements(user.id);
                    if (isActive) setAchievements(data);
                } catch (error) {
                    console.log('Erro ao buscar conquistas:', error);
                } finally {
                    if (isActive) setLoading(false);
                }
            }

            fetchAchievements();
            return () => { isActive = false; };
        }, [user?.id])
    );

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
            data={achievements}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => (
                <View style={[styles.card, !item.unlocked && styles.cardLocked]}>
                    <Text style={styles.title}>
                        {item.unlocked ? '🏆' : '🔒'} {item.title}
                    </Text>
                    <Text style={styles.description}>{item.description}</Text>
                </View>
            )}
            ListEmptyComponent={
                <Text style={styles.emptyText}>Nenhuma conquista encontrada.</Text>
            }
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
    card: { 
        backgroundColor: '#FFF9E6', 
        borderRadius: 8, 
        padding: 16, 
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#FFE082',
    },
    cardLocked: { 
        backgroundColor: '#F0F0F0', 
        borderColor: '#E0E0E0',
        opacity: 0.6 
    },
    title: { 
        fontSize: 16, 
        fontWeight: 'bold', 
        marginBottom: 4 
    },
    description: { 
        fontSize: 14, 
        color: '#555' 
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 32,
        color: '#777',
        fontSize: 14,
    },
});