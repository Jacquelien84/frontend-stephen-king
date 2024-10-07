import { createContext, useEffect, useState } from 'react';
import {jwtDecode} from 'jwt-decode'; // Corrigeer de import zonder accolades
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
            favourites: [],
        },
        status: 'pending',
    });

    const navigate = useNavigate();

    useEffect(() => {
        async function checkCred() {
            const token = localStorage.getItem("token");

            if (token && token !== "null") {
                if (isTokenExpired(token)) {
                    logout(); // Log the user out if the token is expired
                } else {
                    try {
                        const decoded = jwtDecode(token);
                        if (decoded.sub) {
                            await fetchUserData(decoded.sub, token);
                        }
                    } catch (error) {
                        console.error("Error decoding token:", error);
                        logout(); // Log out on error
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

// Function to check if token is expired
    function isTokenExpired(token) {
        const decoded = jwtDecode(token);
        return decoded.exp * 1000 < Date.now(); // Expiry time in ms
    }

    async function login(JWT, redirectToProfile = true) {
        localStorage.setItem("token", JWT);

        if (JWT) {
            try {
                const decoded = jwtDecode(JWT);
                await fetchUserData(decoded.sub, JWT);
                if (redirectToProfile) navigateToProfile(); // Conditional redirection
            } catch (error) {
                console.error("Error logging in:", error);
                logout(); // Log out on error
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

        console.log('User has been logged out!');
        navigate('/'); // Redirect to homepage after logout
    }
    useEffect(() => {
        const token = localStorage.getItem('token');

        if (token && token !== "null") {
            try {
                const decoded = jwtDecode(token);
                if (decoded.sub) {
                    fetchUserData(decoded.sub, token);
                }
            } catch (error) {
                console.error("Error decoding token:", error);
            }
        } else {
            setAuth({
                loggedIn: false,
                user: {
                    username: "",
                    role: "",
                    favourites: [],
                },
                status: 'done',
            });
        }
    }, []);

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
            localStorage.setItem("loggedin", "true");

            setAuth({
                loggedIn: true,
                user: {
                    username: result.data.username,
                    role: result.data.role,
                    favourites: result.data.favourites || [], // Haal de favorieten op
                },
                status: "done",
            });
        } catch (error) {
            console.log("Error occurred collecting user data:", error);
            setAuth({
                loggedIn: false,
                user: {
                    username: "",
                    role: "",
                    favourites: [],
                },
                status: 'done',
            });
        }
    }

    const addFavourite = async (bookId) => {
        try {
            const response = await axios.put(
                `http://localhost:8080/users/fav/${isAuth.user.username}/${bookId}`,
                {},
                { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
            );
            setAuth((prevAuth) => ({
                ...prevAuth,
                user: {
                    ...prevAuth.user,
                    favourites: [...prevAuth.user.favourites, response.data], // Voeg het boek toe aan de favorietenlijst
                },
            }));
        } catch (error) {
            console.error("Error adding to favourites:", error);
        }
    };

    const removeFavourite = async (bookId) => {
        try {
            await axios.delete(
                `http://localhost:8080/users/fav/${isAuth.user.username}/${bookId}`,
                { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
            );
            setAuth((prevAuth) => ({
                ...prevAuth,
                user: {
                    ...prevAuth.user,
                    favourites: prevAuth.user.favourites.filter((fav) => fav.id !== bookId), // Verwijder het boek uit de favorieten
                },
            }));
        } catch (error) {
            console.error("Error removing from favourites:", error);
        }
    };

    const navigateToProfile = () => {
        navigate('/profile');
    };

    const contextData = {
        isAuth: isAuth,
        login: login,
        logout: logout,
        loggedIn: isAuth.loggedIn,
        user: isAuth.user,
        favourites: isAuth.user.favourites, // Directe toegang tot de favorieten
        addFavourite: addFavourite,
        removeFavourite: removeFavourite,
        fetchUserData: fetchUserData,
    };

    return (
        <AuthContext.Provider value={contextData}>
            {(isAuth.status === 'done') && children}
            {(isAuth.status === 'pending') && <p>Loading...</p>}
        </AuthContext.Provider>
    );
}

export default AuthContextProvider;



