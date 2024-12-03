import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function Profile() {
    const [profile, setProfile] = useState([]);
    const [interests, setInterests] = useState([]);

    useEffect(() => {
        axios.get('https://localhost:7117/api/profiles/${id}')
        .then((res) => {
            setProfile(res.data);
        })
        .catch((err) => {
            console.error('API Error fetching profile', err);
        });
    }, [id]);

    useEffect(() => {
        axios.get('https://localhost:7117/api/interests')
        .then((res) => {
            setInterests(res.data);
        })
        .catch((err) => {
            console.error('API Error fetching interests', err);
        });
    }, [id]);


    return (
        <div>
            <div id="profileInfo">
                <p className="text-3xl">Hello {profile.FirstName}!</p>
                <img src={profile.profileimg} />
                <p> First name </p>

                    Last name

                    Sex
                    
                    Birthday

                    E-Mail

                    Phone

                    Town

                    ZIP Code

                    Interests:

                    Description
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