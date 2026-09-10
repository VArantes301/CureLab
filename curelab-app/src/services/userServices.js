
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

export async function updateAddiction(userId, addiction_type) {
    const response = await fetch(`${API_URL}/users/${userId}/addiction`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ addiction_type: addiction_type }),

    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.erro || 'Erro ao salvar tipo de vício');
    }
    return data;

}

export async function updateMascot(userId, mascot) {
    const response = await fetch(`${API_URL}/users/${userId}/mascot`, {
        method: 'PATCH',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({ mascot: mascot})

    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.erro || 'erro ao salvar mascote')
    }
    return data;
}

export async function updatePhone1(userId, phone1) {
    const response = await fetch(`${ API_URL }/users/${userId}/phone`, {
        method: 'PATCH',
        headers: { 'content-Type': 'application/json' },
        body: JSON.stringify({ phone1: phone1})
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.erro || 'erro ao salvar o numero')
    }
    return data;
}

