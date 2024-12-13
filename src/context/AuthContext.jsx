import { createContext, useEffect, useState } from 'react';
import {jwtDecode} from 'jwt-decode';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import React from "react";

export const AuthContext = createContext({});

function AuthContextProvider({ children }) {
    const [isAuth, setAuth] = useState({
        loggedIn: false,
        user: {
            username: "",
            role: "",
        },
        status: 'pending',
    });

    const navigate = useNavigate();

    useEffect(() => {
        async function checkCred() {
            const token = localStorage.getItem("token");

            if (token && token !== "null") {
                if (isTokenExpired(token)) {
                    logout();
                } else {
                    try {
                        const decoded = jwtDecode(token);
                        if (decoded.sub) {
                            await fetchUserData(decoded.sub, token);
                        }
                    } catch (error) {
                        console.error("Error decoding token:", error);
                        logout();
                    }
                }
            } else {
                setAuth({
                    loggedIn: false,
                    user: { username: "", role: "", favourites: [] },
                    status: 'done',
                });
            }
        }

        checkCred();
    }, []);

    function isTokenExpired(token) {
        const decoded = jwtDecode(token);
        return decoded.exp * 1000 < Date.now(); // Expiry tijd in ms
    }

    async function login(JWT, redirectToProfile = true) {
        localStorage.setItem("token", JWT);

        if (JWT) {
            try {
                const decoded = jwtDecode(JWT);
                await fetchUserData(decoded.sub, JWT);
                if (redirectToProfile) navigateToProfile();
            } catch (error) {
                console.error("Error logging in:", error);
                logout();
            }
        }
    }

    function logout() {
        localStorage.clear();
        setAuth({
            loggedIn: false,
            user: { username: "", role: "", favourites: [] },
            status: 'done',
        });
        navigate('/');
    }

    async function fetchUserData(id, token) {
        try {
            const result = await axios.get(`http://localhost:8080/users/${id}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            localStorage.setItem("user_username", result.data.username);
            localStorage.setItem("user_role", result.data.role);

            setAuth({
                loggedIn: true,
                user: {
                    username: result.data.username,
                    role: result.data.role,
                },
                status: "done",
            });
        } catch (error) {
            logout(error);
        }
    }

    const navigateToProfile = () => {
        navigate('/profile');
    };

    const contextData = {
        isAuth,
        login,
        logout,
        loggedIn: isAuth.loggedIn,
        user: isAuth.user,
        fetchUserData,
    };

    return (
        <AuthContext.Provider value={contextData}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthContextProvider;



