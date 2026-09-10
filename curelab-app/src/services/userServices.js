
import { API_URL } from "./api";

export async function createUser(userData) {

    const response = await fetch(`${API_URL}/users/create`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData), 
        });

    const data = await response.json();

    if (!response.ok) {

    throw new Error(data.erro || 'erro ao criar usuario')
    }
    return data
}

