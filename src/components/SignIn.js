import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

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
    const { login } = useAuth();
    const { logout } = useAuth();
    const [ userProfile, setUserProfile ] = useState({
        firstName: '',
        lastName: '',
        avatar: ''
    })

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
            const response = await axios.post('https://localhost:7117/api/NewUser/register', signUpData);
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

    const getUserProfile = async (token) => {
        try {
            const decodeToken = jwtDecode(token);
            const userId = decodeToken.unique_name;
            const response = await axios.get(`https://localhost:7117/api/Profiles/${userId}`);
            console.log('reponse from profile get is ', response);
            if (response.status === 200) {
                    const data = response.data;
                    console.log('yes, we got profile!', data);
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
                        firstName: data.firstName,
                        lastName: data.lastName,
                        avatar: avatar
                    });
            }
        } catch(err) {
            console.error('Oh no! Did the token explode?', err);
            return;
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
                const data = response.data;
                const token = data.token;
                login(token);
                setSignUpData({
                    userIdentification: '',
                    secret: ''
                });
                alert('Sign-in successful, welcome back!');
                setSignUpSuccess(true);
                getUserProfile(token);
                setError('');
                } else {
                    setError('Sign in unsuccesful, try using your correct email and password (:');
                };
            }
            catch (error) {
            console.error('Error signing in: ', error);
            setError('This is strange... Something went wrong signing you in');
            setLoading(false);
        }
    }

    return (
        <div>
        { !signUpSuccess || !userProfile.firstName &&
            <section id="signUp">
            <h2>Sign Up</h2>
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
                <button type="submit">Sign me up!</button>
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
                    <button type="submit">Sign me in!</button>
                </form>
            </section>
        }
        { userProfile.firstName &&
            <section id="signedIn" className="flex flex-row-reverse items-center px-4">
                Welcome back {userProfile.firstName} {userProfile.lastName}! <img src={userProfile.avatar} className="w-20 h-auto rounded-full" />
                <p onClick={logout} className="cursor-pointer"> Goodbye!</p>
            </section>

        }
        </div>
    )
}

export default SignIn;