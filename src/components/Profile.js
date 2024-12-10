import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from './AuthContext';
import axios from 'axios';

function Profile() {
    const { userId } = useParams();
    const { token, tokenExpiry, refreshToken, userProfile } = useAuth();
    const [profile, setProfile] = useState({});
    const [interests, setInterests] = useState({});
    const [success, setSuccess] = useState('');
    const [fail, setFail] = useState('');
    const hideProfileStuff = ['userID', 'avatar', 'profileImg', 'interestprofile'];

    useEffect (() => {
        setProfile(userProfile);
    }, [userProfile]);

    useEffect(() => {
        const fetchInterests = async () => {
            try {
                const response = await axios.get(`https://localhost:7117/api/InterestProfiles/${userId}`);
                setInterests(response.data);
            } catch (err) {
                console.error('Sacre bleu how is this possibleu? ', err);
            }
        };
        fetchInterests();
    }, [userId]);

    const handleChange = (e, setData) => {
        const { name, value } = e.target;
        setData(prevData => ({
            ...prevData,
            [name] : value
        }));
    };

    const saveProfile = async (e) => {
        e.preventDefault()

        if (tokenExpiry) {
            await refreshToken(token);
        }
        const response = await axios.put(`https://localhost:7117/api/Profiles/${userId}`, profile, {
            headers: {
                'Authorization' : `Bearer ${token}`,
                'Context-Type': 'application/json'
            }
        })
            .then(response => {
                if(response.status === 200) {
                setSuccess('Profile saved :)');
                } else {
                    setFail(`Tragedy struck! The profile changes couldn't be saved ):`);
                }
            }).catch(err => {
                console.error('Encountered resistance updating profile:', err);
            });

    }

    const saveInterests = () => {
        console.log('interests object is ', interests);
        return interests;
    }

    return (
        <div>
            <div id="profileInfo" className="flex items-center justify-center flex-col">
                <p className="text-3xl">Edit your profile here, {userProfile.firstName} {userProfile.lastName}!</p>
                {success && <p className="text-2xl text-lime-500">{success}</p>}
                <img src={userProfile.avatar} className="w-56 h-auto rounded-full" />
                <form id="profileData"  onSubmit={saveProfile}>
                    { Object.keys(userProfile).map((key) => {
                        if(!hideProfileStuff.includes(key)) {
                            return(
                            <div key={key} className="grid grid-cols-3 gap-4 items-center mb-4">
                                <label htmlFor={key} className="text-left col-span-1">{key}</label>
                                <input 
                                    type={key ==='email' ? 'email' : 'text'}
                                    id={key}
                                    name={key}
                                    value={profile[key] || ''}
                                    onChange={(e) => handleChange(e, setProfile)}
                                    className="text-left col-span-2 border border-gray-300 px-2 py-1"
                                    />
                            </div>
                            );
                    }
                    return null;
                })}
                <button type="submit" className="mt-4 px-4 py-2 bg-blue-500 text-white hover:bg-blue-600">Save</button>
                </form>
            </div>
            <div id="interests">
                {/*
                Need to expand interests table: 
                add area search, how many km from your position do you want to have events suggested
                add option: see events by people open to connect?
                add option: open to connect with: specify age, gender, religion, interests, area
                */}
                <p>Manage your interests:</p>
                <form onSubmit={saveInterests}>
                    <label htmlFor="new interest">new interest:</label>
                    <input type="text" />
                    <button type="submit">add</button>
                </form>
            </div>

        </div>
    );
}

export default Profile;