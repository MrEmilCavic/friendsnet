import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [authenticated, setAuthenticated] = useState(false);
    const [userProfile, setUserProfile] = useState({});

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setAuthenticated(true);
            fetchUserProfile(storedToken);
        } else {
            setAuthenticated(false);
            setUserProfile({});
        }
    }, [token]);

    const login = (newToken) => {
        setToken(newToken);
        localStorage.setItem('token', newToken);
    };

    const logout = () => {
        setToken(null);
        localStorage.removeItem('token');
        setAuthenticated(false);
        setUserProfile({});
        window.location.reload();
    };

    const fetchUserProfile = async (token) => {
        try {
            const decodeToken = jwtDecode(token);
            const userId = decodeToken.unique_name;
            const response = await axios.get(`https://localhost:7117/api/Profiles/${userId}`);

            if (response.status === 200) {
                const data = response.data;
                const fallbackSnegle = [
                    'https://res.cloudinary.com/science-portfolio/image/upload/v1733402754/friendsnet/profilepics/kanelsnegl_best_vintage_oezf9u.jpg',
                    'https://res.cloudinary.com/science-portfolio/image/upload/v1733397619/friendsnet/profilepics/kanelsnelg_noveau_v4iwqm.jpg',
                    'https://res.cloudinary.com/science-portfolio/image/upload/v1733397619/friendsnet/profilepics/kanelsnegl_vintage_wicgy0.jpg',
                    'https://res.cloudinary.com/science-portfolio/image/upload/v1733397619/friendsnet/profilepics/kanelsnegl_popart_h3soqs.jpg',
                    'https://res.cloudinary.com/science-portfolio/image/upload/v1733397619/friendsnet/profilepics/kanelsnegl_bew_comic_bpsdj5.jpg',
                    'https://res.cloudinary.com/science-portfolio/image/upload/v1733397618/friendsnet/profilepics/kanelsnegl_bew_vintage_fcfjr0.jpg',
                    'https://res.cloudinary.com/science-portfolio/image/upload/v1733397618/friendsnet/profilepics/kanelsnegl_comic_otxu6c.jpg'
                ];
                const avatar = data.profileImg && data.profileImg.trim() 
                    ? data.profileImg
                    : fallbackSnegle[Math.floor(Math.random()*fallbackSnegle.length)];
                                setUserProfile ({
                    ...data,
                    avatar: avatar
                });
            }
        } catch(err) {
            console.error('Oh no! Did the server explode?', err);
            return;
        }
    };

    const updateUserProfile = (newProfile) => {
        setUserProfile(newProfile);
    };

    return (
        <AuthContext.Provider value={{ authenticated, token, login, logout, userProfile }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};

