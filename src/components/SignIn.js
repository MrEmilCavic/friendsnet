import React, { useState } from 'react';
import axios from 'axios';

function SignIn () {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [signedIgn ,setSignedIn] = useState(false);
    const [signUpData, setSignUpData] = useState({
        userIdentification:'',
        secret:'',
        confirmPassword:''
    });
    const [signInData, setSignInData] = useState({
        userIdentification: '',
        secret: ''
    });
    const [token, setToken] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [signUpSuccess, setSignUpSuccess] = useState(false);

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
            console.log('sending to post:', signUpData);
            const response = await axios.post('https://localhost:7117/api/NewUser/register', signUpData);
            console.log('API response: ', response.data);
            if (response.status === 200) {
                alert('Sign-up successful, welcome to the community!');
                setLoading(false);
                setSignUpSuccess(true);
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
            setToken(response.data.token);
            localStorage.setItem('token', response.data.token);
            setSignUpData({
                userIdentification: '',
                secret: ''
            });
            alert('Sign-in successful, welcome back!');
            setError('');
            }
            catch (error) {
            console.error('Error signing in: ', error);
            setError('This is strange... Something went wrong signing you in');
            setLoading(false);
        }

    }

    return (
        <div>
            <section id="signUp">
            <h2>Sign Up</h2>
            {error && <p>Error: {error}</p>}
            <form onSubmit={handleSignUp}>
                <div>
                    <label htmlFor="email"> e-mail: </label>
                    <input type="text" name="userIdentification" value={signUpData.userIdentification} onChange={(e) => handleChange(e, setSignUpData)} />
                    <label htmlFor="password"> Password: </label>
                    <input type="password" name="secret" value={signUpData.secret} onChange={(e) => handleChange(e, setSignUpData)} />
                    <label htmlFor="confirmPassword"> Confirm Password: </label>
                    <input type="password" name="confirmPassword" value={signUpData.confirmPassword} onChange={(e) => handleChange(e, setSignUpData)} />
                </div>
                <button type="submit">Sign me up!</button>
            </form>
            </section>
            <section id="signIn">
                <h2>Hello again :)</h2>
                {error && <p>Error: {error}</p>}
                <form onSubmit={handleSignIn}>
                    <div>
                        <label htmlFor="email"> e-mail: </label>
                        <input type="text" name="userIdentification" value={signInData.userIdentification} onChange={(e) => handleChange(e, setSignInData)} />
                        <label htmlFor="password"> Password: </label>
                        <input type="password" name="secret" value={signInData.secret} onChange={(e) => handleChange(e, setSignInData)} />
                    </div>
                    <button type="submit">Sign me in!</button>
                </form>
            </section>
        </div>
    )
}

export default SignIn;