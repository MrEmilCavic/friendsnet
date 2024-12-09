/*
    Change signUpSuccess logic: initially choose Sign In or Sign Up
    then for Sign In display "Hello again :) ... "
    for Sign Up show "We are happy to have you! ..."
*/

import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function SignIn () {
    const [signUpData, setSignUpData] = useState({
        userIdentification:'',
        secret:'',
        confirmPassword:''
    });
    const [signInData, setSignInData] = useState({
        userIdentification: '',
        secret: ''
    });

    const { login, logout, userProfile } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [hoverUser, setHoverUser] = useState(false);

    const handleChange = (e, setData) => {
        const { name, value } = e.target;
        setData(prevData => ({
            ...prevData,
            [name] : value
        }));
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        const { userIdentification, secret, confirmPassword } = signUpData;
        let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if(!userIdentification) {
            setError('Please fill in your e-mail address');
            console.log(error);
            return;
        }
        if(!re.test(userIdentification)) {
            setError('Please check - are you using a valid e-mail address?');
            console.log(error);
            return;
        }
        if (secret !== confirmPassword) {
            setError('Careful now! The passwords you entered do not match');
            console.log(error);
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post('https://localhost:7117/api/NewUser/register', signUpData);
            if (response.status === 200) {
                alert('Sign-up successful, welcome to the community!');
                setLoading(false);
                setError('');
                setSignUpData({
                    userIdentification: '',
                    secret: '',
                    confirmPassword: ''
                })
            };
        } catch (error) {
            console.error('Error signing up: ', error);
            setError('Aiaiai! Something went wrong during signing up. Please contact us!');
            setLoading(false);
        }
    };

    const handleSignIn = async (e) => {
        e.preventDefault();
        const { userIdentification, secret } = signInData;
        let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if(!userIdentification) {
            setError('Please fill in your e-mail address');
            console.log(error);
            return;
        }
        if(!re.test(userIdentification)) {
            setError('Please check - are you using a valid e-mail address?');
            console.log(error);
            return;
        }
        setLoading(true);
        try {
            const response = await axios.post('https://localhost:7117/api/Auth/signin', signInData);
            if (response.status === 200) {
                const token = response.data.token;
                login(token);
                setSignUpData({
                    userIdentification: '',
                    secret: ''
                });
                alert('Sign-in successful, welcome back!');
                setError('');
                } else {
                    setError('Sign in unsuccesful, try using your correct email and password (:');
                };
            }
            catch (error) {
            console.error('Error signing in: ', error);
            setError('This is strange... Something went wrong signing you in');
            } finally {
                setLoading(false);
        }
    };

    const navigateToProfile = () => {
        navigate(`/Profile/${userProfile.userID}`);
    };

    return (
        <div>
        { !userProfile.firstName &&
            <section id="signUp">
            <h2>We are happy to have you!</h2>
            <h4>Let's get you started:</h4>
            {error && <p className="text-red-600">Error: {error}</p>}
            <form onSubmit={handleSignUp}>
                <div>
                    <label htmlFor="email"> e-mail: </label>
                    <input type="text" name="userIdentification" value={signUpData.userIdentification} onChange={(e) => handleChange(e, setSignUpData)} />
                    <label htmlFor="password"> Password: </label>
                    <input type="password" name="secret" value={signUpData.secret} onChange={(e) => handleChange(e, setSignUpData)} />
                    <label htmlFor="confirmPassword"> Confirm Password: </label>
                    <input type="password" name="confirmPassword" value={signUpData.confirmPassword} onChange={(e) => handleChange(e, setSignUpData)} />
                </div>
                <button type="submit" disabled={loading}>Sign me up!</button>
            </form>
            </section>
        }
        { !userProfile.firstName &&
            <section id="signIn">
                <h2>Hello again :)</h2>
                {error && <p className="text-red-600">Error: {error}</p>}
                <form onSubmit={handleSignIn}>
                    <div>
                        <label htmlFor="email"> e-mail: </label>
                        <input type="text" name="userIdentification" value={signInData.userIdentification} onChange={(e) => handleChange(e, setSignInData)} />
                        <label htmlFor="password"> Password: </label>
                        <input type="password" name="secret" value={signInData.secret} onChange={(e) => handleChange(e, setSignInData)} />
                    </div>
                    <button type="submit" disabled={loading}>Sign me in!</button>
                </form>
            </section>
        }
        { userProfile.firstName &&
            <section id="signedIn" className="flex flex-col justify-end items-end px-4">
                    <span className="flex items-center flex-row mr-2 cursor-pointer" onMouseEnter={() => setHoverUser(true)} onMouseLeave={() => setHoverUser(false)}>Welcome back {userProfile.firstName} {userProfile.lastName}! <img src={userProfile.avatar} className="w-20 h-auto rounded-full" /></span>
                {hoverUser &&
                    <p className="flex flex-row items-end mr-2" onMouseEnter={() => setHoverUser(true)} onMouseLeave={() => setHoverUser(false)}>
                        <span onClick={navigateToProfile} className="cursor-pointer text-amber-800">Edit my profile</span>
                        <span onClick={logout} className="cursor-pointer px-2 text-amber-800"> Goodbye </span>
                    </p>
                }
            </section>

        }
        </div>
    )
}

export default SignIn;