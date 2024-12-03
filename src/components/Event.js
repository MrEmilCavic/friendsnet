import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function Event() {
    const [event, setEvent] = useState([]);
    const [eventDiscussion, setEventDiscussion] = useState([]);
    
    useEffect(() => {
        axios.get('https://localhost:7117/api/event/${id}')
        .then((res) => {
            setEvent(res.data);
        })
        .catch((err) => {
            console.error(`API error fetching event ID ${id}`, err);
        });
        axios.get('https://localhost:7117/api/eventdiscussion/${id}')
        .then((res) => {
            setEventDiscussion(res.data);
        })
        .catch((err) => {
            console.error(`API error fetching eventDiscussion ID ${id}`, err);
        });
    }, [id]);


    return (
        <div>
            {/*->event form should be editable by clicking on each component of the event 
            and saving by leaving the field
            -> add option "open to connect"
            -> need to add a post ID and a created and edited field, gif/emoji/sticker,
                    in later iterations can add a voice to text with AI abbreviating spoken text feature
            -> make datetime not required so you can use events as "group chat" for friends to stay in touch
            
            */}
            <p className="text-3xl">{event.title}</p>
            <p>created by {event.createdby}</p>
            <p>by {event.place} at {event.eventtime}</p>
            <img src={event.banner} />
            <section>{event.escription}</section>
            <div>
                {eventDiscussion.map((d,index) => (
                    <div key={index}>
                        <p>{d.userid} says:</p><p>{d.discussiontxt}</p>
                    </div>
                ))}
                <div>Insert "add a comment" function here</div>
            </div>
        </div>
    )
}

export default Event;
