import { useState, useCallback, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { UserContext } from '../../context/userContext';
import { listAchievements } from '../../services/achievementServices';

export default function AchievementsScreen() {
    const { userId } = useContext(UserContext);
    const [achievements, setAchievements] = useState([]);
    const [loading, setLoading] = useState(true);

    useFocusEffect(
        useCallback(() => {
            let isActive = true;
            async function fetchAchievements() {
                setLoading(true);
                try {
                    const data = await listAchievements(userId);
                    if (isActive) setAchievements(data);
                } catch (error) {
                    console.log('Erro ao buscar conquistas:', error);
                } finally {
                    if (isActive) setLoading(false);
                }
            }
            fetchAchievements();
            return () => { isActive = false; };
        }, [userId])
    );

    if (loading) {
        return <ActivityIndicator style={{ flex: 1 }} />;
    }

    return (
        <FlatList
            style={styles.container}
            data={achievements}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
                
                <View style={[styles.card, !item.unlocked && styles.cardLocked]}>
                    <Text style={styles.title}>
                        {item.unlocked ? '🏆' : '🔒'} {item.title}
                    </Text>
                    <Text style={styles.description}>{item.description}</Text>
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

    card: { 
        backgroundColor: '#FFF9E6', 
        borderRadius: 8, 
        padding: 16, 
        marginBottom: 12 
    },

    cardLocked: { 
        backgroundColor: '#F0F0F0', 
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
});