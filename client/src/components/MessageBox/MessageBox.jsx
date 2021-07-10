import React, { useEffect, useRef, useState } from 'react';
import './MessageBox.css';
import axios from 'axios';
import {HOST_URL} from '../../config'
const MessageBox = props => {

    const messages = props.messages;
    const conversation = props.conversation;
    const currentUser = props.currentUser;
    const newUserId = props.newUserId;
    const newMessage = props.newMessage;
    const [otherUser, setOtherUser] = useState(null);

    const scrollRef = useRef();

    useEffect(() => {
        const fetchData = async () => {
            const otherUserId = conversation.members.find((m) => m !== currentUser._id);
            try {
                const res = await axios.get(`${HOST_URL}/users/${otherUserId}`);
                setOtherUser(res.data);
            } catch (err) {
                console.log(err);
            }
        }
        if (conversation)
            fetchData();
        
    }, [conversation, currentUser]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`${HOST_URL}/users/${newUserId}`);
                setOtherUser(res.data);
            } catch (err) {
                console.log(err);
            }
        }
        if (newUserId)
            fetchData();
        
    }, [newUserId]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({behavior: 'smooth'});
    }, [messages])

    return (
        <div className="container">
            <div className="row">
                <div className="card w-100" style={{height: "100vh"}}>
                    <div className="card-header text-left">
                        <p className="m-0">{otherUser?.name}</p>
                    </div>
                    <div className="card-body">
                        <div className="col-md-12 p-0">
                            <ul className="list-group" id="messages">
                                {messages.map(m => {
                                    if (m.sender === currentUser._id)
                                        return (
                                            <div className="col p-0 offset-6 w-auto" ref={scrollRef}>
                                                <li className="list-group-item float-right" key={m._id}>{m.text}</li>
                                            </div>
                                        );
                                    return (
                                        <div className="col-md-6 p-0 w-auto" ref={scrollRef}>
                                            <li className="list-group-item" key={m._id}>{m.text}</li>
                                        </div>
                                    ); 

                                })}

                                
                            </ul>
                        </div>
                    
                    </div>

                    <div className="card-footer">
                        <form className="input-group mt-3" onSubmit={props.handleSubmit}>
                            <input type="text" name="message" id="message" className="form-control" onChange={props.handleNewMessageChange} value={newMessage} />
                            <div className="input-group-append">
                                <button type="submit" className="btn btn-outline-primary">Send</button>
                            </div>
                        </form>
                    </div>
                </div>
                
            </div>
           
           
        </div>
    );
};


export default MessageBox;