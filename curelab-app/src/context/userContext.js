import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const UserContext = createContext(null);

export function UserProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadStorageData() {
            try {
                const storedUser = await AsyncStorage.getItem("@App:user");
                if (storedUser) {
                    setUser(JSON.parse(storedUser));
                }
            } catch (error) {
                console.error("Erro ao carregar usuário do storage:", error);
            } finally {
                setLoading(false);
            }
        }

        loadStorageData();
    }, []);

    const login = async (userData) => {
        setUser(userData);
        await AsyncStorage.setItem("@App:user", JSON.stringify(userData));
    };

    const updateUser = async (updatedData) => {
        const newUser = { ...user, ...updatedData };
        setUser(newUser);
        await AsyncStorage.setItem("@App:user", JSON.stringify(newUser));
    };

    const logout = async () => {
        setUser(null);
        await AsyncStorage.removeItem("@App:user");
    };

    return (
        <UserContext.Provider value={{ user, userId: user?.id, login, logout, updateUser, loading }}>
            {children}
        </UserContext.Provider>
    );
}