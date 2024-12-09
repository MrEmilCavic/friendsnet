import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from './AuthContext';
import axios from 'axios';

function Profile() {
    const { userId } = useParams();
    const { userProfile } = useAuth();
    const [profile, setProfile] = useState({});
    const [interests, setInterests] = useState([]);
    const hideProfileStuff = ['userID', 'avatar', 'profileImg', 'interestprofile'];

    useEffect (() => {
        setProfile(userProfile);
    }, []);
    const handleChange = (e, setData) => {
        const { name, value } = e.target;
        setData(prevData => ({
            ...prevData,
            [name] : value
        }));
    };
    const saveProfile = () => {
        return profile;
    }

    return (
        <div>
            <div id="profileInfo" className="flex items-center justify-center flex-col">
                <p className="text-3xl">Edit your profile here, {userProfile.firstName} {userProfile.lastName}!</p>
                <img src={userProfile.avatar} className="w-56 h-auto rounded-full" />
                <form id="profileData" className="" onSubmit={saveProfile}>
                    { Object.keys(userProfile).map((key) => {
                        if(!hideProfileStuff.includes(key)) {
                            return(
                            <div key={key}>
                                <label htmlFor={key}>{key}</label>
                                <input 
                                    type={key ==='email' ? 'email' : 'text'}
                                    id={key}
                                    name={key}
                                    value={profile[key] || ''}
                                    onChange={(e) => handleChange(e, setProfile)}
                                    className="input-field"
                                    />
                            </div>
                            );
                    }
                    return null;
                })}
                <button type="submit">Save</button>
                </form>
            </div>
            <div id="interests">
                {/*
                Need to expand interests table: 
                add area search, how many km from your position do you want to have events suggested
                add option: see events by people open to connect?
                add option: open to connect with: specify age, gender, religion, interests, area
                */}
                <p>Your interests:</p>
                {interests.map((i) =>(
                    <div key={i.interestid}>
                        {i.Title} <p>Delete</p>
                    </div>
                ))}
                <p>add...</p>
            </div>

        </div>
    );
}

export default Profile;