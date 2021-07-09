import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {HOST_URL} from '../../config';
import {format} from 'timeago.js';
const ChatItem = (props) => {
    const [user, setUser] = useState(null);
    const [latestMessage, setLastestMessage] = useState(null);
    const currentUser = props.currentUser;
    const conversation = props.conversation;
    useEffect(() => {
        const fetchData = async () => {
            const friendId = conversation.members.find((m) => m !== currentUser._id);
            // console.log(friendId);
            try {
                const res = await axios.get(`${HOST_URL}/users/${friendId ? friendId : currentUser._id}`);
                setUser(res.data);
            } catch (err) {
                console.log(err);
            }
        }
        fetchData();
        
    }, [currentUser, conversation]);

    useEffect(() => {
        const fetchLatestMessage = async () => {
            try {
                const res = await axios.get(`${HOST_URL}/messages/${conversation._id}/latest`);
                setLastestMessage(res.data);
            } catch (err) {
                console.log(err);
            }
        }
        fetchLatestMessage();
    }, [user]);
    return (
        <div>
            <a className="btn btn-link text-decoration-none p-0 text-info">{user?.name}</a>
            
            <p style={{display: "flex", justifyContent: "space-between", alignItems: "baseline"}}>
                <span> {latestMessage?.sender === currentUser._id ? 'You' : user?.name}: {latestMessage?.text} </span>
                <span style={{fontSize: '12px'}}>{format(latestMessage?.createdAt)}</span>
            </p>
        </div>
    );
};

export default ChatItem;