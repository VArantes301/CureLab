import { API_URL } from './api';

export async function createDiaryEntry(userId, title, content, mood, images = []) {
    const formData = new FormData();

    formData.append('title', title);
    formData.append('content', content);
    formData.append('mood', String(mood))

    images.forEach((image, index) => {
        formData.append('images', {
            uri: image.uri,
            name: image.name || `image_${index}.jpg`,
            type: image.type || 'image/jpeg',
        });
    });

    const response = await fetch(`${API_URL}/users/${userId}/diary`, {
        method: 'POST',
        body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.erro || 'Erro ao criar diário');
    }

    return data;
}

export async function listDiaryEntries(userId) {
    const response = await fetch(`${API_URL}/users/${userId}/diary`);

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.erro || 'Erro ao listar diários');
    }

    return data;
}

export async function getDiaryEntry(userId, diaryId) {
    const response = await fetch(
        `${API_URL}/users/${userId}/diary/${diaryId}`
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.erro || 'Erro ao buscar diário');
    }

    return data;
}