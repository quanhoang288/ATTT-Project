import React, { useContext, useEffect, useState } from 'react';
import MessageBox from '../../components/MessageBox/MessageBox';
import ChatList from '../../components/ChatList/ChatList';
import Header from '../../components/Header/Header';
import { HOST_URL } from '../../config';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import './Chat.css';

const Chat = props => {
    const {user} = useContext(AuthContext);
    const [currentChat, setCurrentChat] = useState(null);
    const [newUserId, setNewUserId] = useState(null);
    const [displayChat, setDisplayChat] = useState(true);
    const [userList, setUserList] = useState([]);
    const [chatList, setChatList] = useState([]);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const fetchConversations = async () => {
        try {
            const res = await axios.get(`${HOST_URL}/conversations/${user._id}`);
            setChatList(res.data);
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        fetchConversations();
    }, []);

    useEffect( ()=> {
        const fetchConversationMessages = async (id) => {
            try {
                const res = await axios.get(`${HOST_URL}/messages/${id}`);
                if (res.data)
                    setMessages(res.data);
            } catch (err) {
                console.log(err);
            }
        }
        if (currentChat) 
            fetchConversationMessages(currentChat._id);
    }, [currentChat]);



    const toggleDisplay = () => {
        setDisplayChat(!displayChat);
    }

    const handleUserClick = async () => {
        try{
            const res = await axios.get(`${HOST_URL}/users`);
            setUserList(res.data);
        } catch (err) {
            console.log(err);
        }
        
        toggleDisplay();
    };

    const handleBackClick = () => {
        fetchConversations();
        toggleDisplay();
    }

    const handleFetchConversation = (converation) => {
        setCurrentChat(converation);
    }

    const handleFetchNewConversation = async (currentUser) => {
        setNewMessage('');
        try {
            
            const res = await axios.get(`${HOST_URL}/conversations?firstUser=${currentUser._id}&secondUser=${user._id}`);
            setCurrentChat(res.data);
            setNewUserId(null);

        } catch (err) {

            setNewUserId(currentUser._id);
            setCurrentChat(null);
            setMessages([]);
        }

            

    }

    const handleNewMessageChange = (e) => {
        setNewMessage(e.target.value);
    }

    const saveMessage = async (senderId, conversationId, text) => {
        const newMessage = {
            sender: senderId, 
            conversationId: conversationId, 
            text: text
        };
        
        try {
            const res = await axios.post(`${HOST_URL}/messages`, newMessage);
            setNewMessage('');
            return res.data;
        } catch (err) {
            console.log(err);
        }
    }

    const initializeConversation = async (senderId, receiverId) => {
        const newConversation = {
            senderId: senderId, 
            receiverId: receiverId, 
        };
        try {
            const res = await axios.post(`${HOST_URL}/conversations`, newConversation);
            return res.data;
        } catch (err) {
            console.log(err);
        }
    }

    const addNewMessage = message => {
        let newMessages = [...messages];
        newMessages.push(message);
        setMessages(newMessages);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newMessage !== '') {
            if (currentChat) {
                const savedMessage = await saveMessage(user._id, currentChat._id, newMessage);
                addNewMessage(savedMessage);
            }
            else {
                const newConversation = await initializeConversation(user._id, newUserId);
                const savedMessage = await saveMessage(user._id, newConversation._id, newMessage);
                addNewMessage(savedMessage);
            }
        }

    }




    return (
        <div className="container-fluid">
            <Header/>
            <div className="row">
                <div className="col-md-3 p-0" id="chat-panel">
                    <ChatList 
                        currentUser = {user}
                        displayChat={displayChat} 
                        toggleDisplay={toggleDisplay} 
                        userList={userList} 
                        chatList={chatList} 
                        handleUserClick={handleUserClick}
                        handleBackClick = {handleBackClick}
                        handleFetchConversation = {handleFetchConversation}
                        handleFetchNewConversation = {handleFetchNewConversation}
                    />
                </div>
                <div className="col-md-9 p-0" id="message-panel">
                    {currentChat ? 
                        <MessageBox 
                            messages={messages} 
                            conversation={currentChat} 
                            currentUser = {user}
                            newMessage = {newMessage}
                            handleNewMessageChange = {handleNewMessageChange}
                            handleSubmit = {handleSubmit}
                           
                        /> : 
                        newUserId ? 
                            <MessageBox 
                                messages={messages} 
                                conversation={currentChat} 
                                currentUser = {user}
                                newUserId = {newUserId}
                                newMessage = {newMessage}
                                handleNewMessageChange = {handleNewMessageChange}
                                handleSubmit = {handleSubmit}
                            /> :
                            <p id="prompt-message" className="text-center">Open a conversation to chat</p>
                    }
                    
                </div>
            </div>
            
        </div>
    );
};



export default Chat;