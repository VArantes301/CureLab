import React, { useState, useEffect, useContext } from 'react';
import {
    View,
    Text,
    Image,
    ScrollView,
    StyleSheet,
    ActivityIndicator,
    TouchableOpacity,
    Modal,
    Pressable,
} from 'react-native';
import { UserContext } from '../../context/userContext';
import { getDiaryEntry } from '../../services/diaryServices';
import { getMoodEmoji } from '../../utils/moodIcons';

export default function DiaryDetailScreen({ route }) {
    const { diaryId } = route.params;
    const { user } = useContext(UserContext);
    const [diary, setDiary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [expandedImage, setExpandedImage] = useState(null);

    useEffect(() => {
        async function fetchDiary() {
            if (!user?.id || !diaryId) return;

            try {
                const data = await getDiaryEntry(user.id, diaryId);
                setDiary(data);
            } catch (error) {
                console.log('Erro ao buscar diário:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchDiary();
    }, [user?.id, diaryId]);

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

    if (!diary) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Diário não encontrado.</Text>
            </View>
        );
    }

    return (
        <>
            <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
                <Text style={styles.title}>{diary.title}</Text>
                <Text style={styles.date}>{formatDate(diary.created_at)}</Text>
                <Text style={styles.moodEmojiLarge}>{getMoodEmoji(diary.mood)}</Text>

                <Text style={styles.content}>{diary.content}</Text>

                {diary.images && diary.images.length > 0 && (
                    <View style={styles.imageRow}>
                        {diary.images.map((image) => (
                            <TouchableOpacity
                                key={image.id}
                                onPress={() => setExpandedImage(image.image_url)}
                            >
                                <Image source={{ uri: image.image_url }} style={styles.image} />
                            </TouchableOpacity>
                        ))}
                    </View>
                )}
            </ScrollView>

            <Modal
                visible={!!expandedImage}
                transparent
                animationType="fade"
                onRequestClose={() => setExpandedImage(null)}
            >
                <Pressable style={styles.modalBackground} onPress={() => setExpandedImage(null)}>
                    <Image
                        source={{ uri: expandedImage }}
                        style={styles.expandedImage}
                        resizeMode="contain"
                    />
                </Pressable>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        padding: 16,
        paddingBottom: 32,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    emptyText: {
        fontSize: 16,
        color: '#777',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 4,
        color: '#333',
    },
    date: {
        fontSize: 12,
        color: '#888',
        marginBottom: 16,
    },
    content: {
        fontSize: 16,
        lineHeight: 24,
        color: '#444',
        marginBottom: 20,
    },
    imageRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 8,
    },
    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.9)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    expandedImage: {
        width: '100%',
        height: '80%',
    },
    moodEmojiLarge: { 
        fontSize: 40, 
        marginBottom: 12 
    },
});