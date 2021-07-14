import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {HOST_URL} from '../../config';
import {format} from 'timeago.js';
import {RSAParse} from '../../helper';
// cryptico dependencies
import {decrypt, decryptAESCBC} from 'cryptico';

const ChatItem = (props) => {
    const [user, setUser] = useState(null);
    const [latestMessage, setLastestMessage] = useState(null);
    const currentUser = props.currentUser;
    const conversation = props.conversation;

    const decryptMessage = (ciphertext, type='RSA') => {
        if (type === 'RSA') {
            const userKey = RSAParse(localStorage.getItem(`${currentUser._id}_key`));
            const decryptedMessage = decrypt(ciphertext, userKey);
            return decryptedMessage.plaintext;
        }

        const privateAesKey = JSON.parse(localStorage.getItem(`${currentUser._id}_aes_key`));
        return decryptAESCBC(ciphertext, privateAesKey);


    }

    useEffect(() => {
        const fetchData = async () => {
            const friendId = conversation.members.find((m) => m !== currentUser._id);
            try {
                const res = await axios.get(`${HOST_URL}/users/${friendId}`);
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
                const res = await axios.get(`${HOST_URL}/messages/${conversation._id}/latest?userId=${currentUser._id}`);
                let message = res.data;
                message.text = decryptMessage(message.text, message.type);
                setLastestMessage(message);
            } catch (err) {
                console.log(err);
            }
        }
        fetchLatestMessage();
    }, [user]);

    const formatMessage = message => {
        if (message && message.length > 15) {
            return message.substring(0, 15) + '...';
        }
        return message;
        
    }
    return (
        <div>
            <a className="btn btn-link text-decoration-none p-0 text-info">{user?.name}</a>
            
            <p style={{display: "flex", justifyContent: "space-between", alignItems: "baseline"}}>
                <span> {latestMessage?.sender === currentUser._id ? 'You' : user?.name}: {formatMessage(latestMessage?.text)} </span>
                <span style={{fontSize: '12px'}}>{format(latestMessage?.createdAt)}</span>
            </p>
        </div>
    );
};

export default ChatItem;