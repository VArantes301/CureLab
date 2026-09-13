import { API_URL } from "./api";

export async function listAchievements(userId) {
    const response = await fetch(`${API_URL}/users/${userId}/achievements`);
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.erro || 'Erro ao listar conquistas')
    }
    
    return data;

}