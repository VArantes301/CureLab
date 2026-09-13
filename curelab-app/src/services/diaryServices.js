import { API_URL } from './api';

export async function createDiaryEntry(userId, content) {
    const response = await fetch(`${API_URL}/users/${userId}/diary`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
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