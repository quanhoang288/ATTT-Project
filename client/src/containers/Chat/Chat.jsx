import React, { useContext, useEffect, useRef, useState } from 'react';
import MessageBox from '../../components/MessageBox/MessageBox';
import ChatList from '../../components/ChatList/ChatList';
import Header from '../../components/Header/Header';
import { HOST_URL } from '../../config';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import './Chat.css';
import {io} from 'socket.io-client';
import {RSAParse} from '../../helper';
// cryptico dependencies
import {encrypt, decrypt, encryptAESCBC, decryptAESCBC} from 'cryptico';



const Chat = props => {
    
    
    const {user} = useContext(AuthContext);
    const [currentChat, setCurrentChat] = useState(null);
    const [newUserId, setNewUserId] = useState(null);
    const [displayChat, setDisplayChat] = useState(true);
    const [userList, setUserList] = useState([]);
    const [chatList, setChatList] = useState([]);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [arrivalMessage, setArrivalMessage] = useState(null);
    const socket = useRef();
    
    
    


    const fetchConversations = async () => {
        try {
            const res = await axios.get(`${HOST_URL}/conversations/${user._id}`);
            setChatList(res.data);
        } catch (err) {
            console.log(err);
        }
    }

    const toggleDisplay = () => {
        setDisplayChat(!displayChat);
    }

    const handleUserClick = async () => {
        try{
            const res = await axios.get(`${HOST_URL}/users`);
            const users = res.data.filter(u => u._id !== user._id);
            setUserList(users);
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

    const saveMessage = async (senderId, conversationId, text, type) => {
        const newEncryptedMessage = {
            sender: senderId, 
            conversationId: conversationId, 
            text: text,
            type: type
        };

        try {
            const res = await axios.post(`${HOST_URL}/messages`, newEncryptedMessage);
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



    const decryptMessage = (ciphertext, type='RSA') => {
        if (type === 'RSA') {
            const userKey = RSAParse(localStorage.getItem(`${user._id}_key`));
            console.log(userKey);
            const decryptedMessage = decrypt(ciphertext, userKey);
            return decryptedMessage.plaintext;
        }

        const privateAesKey = JSON.parse(localStorage.getItem(`${user._id}_aes_key`));
        return decryptAESCBC(ciphertext, privateAesKey);


    }

    const getReceiverPublicKey = async receiverId => {
        const res = await axios.get(`${HOST_URL}/keys/${receiverId}`);
        return res.data;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        let receiverId = currentChat ? currentChat.members.find(member => member !== user._id) : newUserId;

        if (newMessage !== '') {

            


            // new rsa encryption code 
            let receiverPublicKey = await getReceiverPublicKey(receiverId);
            const rsaEncryptedMessage = encrypt(newMessage, receiverPublicKey);

            // new aes encryption code
            const privateAesKey = JSON.parse(localStorage.getItem(`${user._id}_aes_key`));
            const aesEncryptedMessage = encryptAESCBC(newMessage, privateAesKey);
            

            socket.current.emit('sendEncryptedMessage', {
                senderId: user._id, 
                receiverId: receiverId, 
                message: rsaEncryptedMessage.cipher,
            });



            if (currentChat) {
                // const savedMessage = await saveMessage(user._id, currentChat._id, newMessage);
                
                // new rsa encrypted message
                await saveMessage(user._id, currentChat._id, rsaEncryptedMessage.cipher, 'RSA');

                // new aes encrypted message 
                await saveMessage(user._id, currentChat._id, aesEncryptedMessage, 'AES');
                
                addNewMessage({
                    sender: user._id,
                    text: newMessage, 
                    createdAt: Date.now(),
                });
            }
            else {
                const newConversation = await initializeConversation(user._id, newUserId);

             

                // new rsa encrypted message
                await saveMessage(user._id, newConversation._id, rsaEncryptedMessage.cipher, 'RSA');


                // new aes encrypted message 
                await saveMessage(user._id, newConversation._id, aesEncryptedMessage, 'AES');
                


                setCurrentChat(newConversation);
                setNewUserId(null);
            }
        }

    }



    useEffect(async () => {
        
        // console.log('first render hook');
        fetchConversations();
        socket.current = io('ws://localhost:2000');


        //receive new message from server 
        socket.current.on('getMessage', async (data) => {

            setArrivalMessage({
                sender: data.senderId,
                text: data.text, 
                createdAt: Date.now(),
            });
        });

        socket.current.on('getUsers', users => {
            console.log(users);
        });

        // get encrypted message
        socket.current.on('getEncryptedMessage', async data => {
            console.log('getting encrypted message...');
            console.log(data);
            const message = data.message;
            let decryptedMessage = decryptMessage(message);
            console.log(decryptedMessage);

            setArrivalMessage({
                sender: data.senderId,
                text: decryptedMessage, 
                createdAt: Date.now(),
            });

            
        });



    }, []);



    // // new signal code 
    // useEffect(() => {

    //     // get encrypted message
    //     socket.current.on('getEncryptedMessage', async data => {
    //         console.log('getting encrypted message...');
    //         console.log(data);
    //         const message = data.message;
    //         if (signalProtocolManagerUser) {
    //             let decryptedMessage = await signalProtocolManagerUser.decryptMessageAsync(data.senderId, message);
    //             console.log(decryptedMessage);

    //             setArrivalMessage({
    //                 sender: data.senderId,
    //                 text: decryptedMessage, 
    //                 createdAt: Date.now(),
    //             });
    //         }

            
    //     });
    // }, [signalProtocolManagerUser]);



    useEffect(() => {
        // console.log('new user hook');
        socket.current.emit("addUser", user._id);
        
        // new signal code 
        // const initSignalManager = async (user) => {
        //     console.log('initializing new signal manager...');
        //     const signalProtocolManagerUser = await createSignalProtocolManager(user._id, new SignalServerStore());
        //     console.log(signalProtocolManagerUser);
        //     setSignalProtocolManagerUser(signalProtocolManagerUser);
        // }
        // initSignalManager(user);

    }, [user]);


    useEffect(() => {
        // console.log('arrival message hook');
        fetchConversations();
        arrivalMessage && (currentChat?.members.includes(arrivalMessage.sender) || (newUserId && arrivalMessage.sender == newUserId)) &&
        setMessages(prev => [...prev, arrivalMessage]);
        
    }, [arrivalMessage]);

    useEffect(() => {
        // console.log('messages hook');
        fetchConversations();
    }, [messages]);




    useEffect(() => {
        const fetchConversationMessages = async (id) => {
            try {
                const res = await axios.get(`${HOST_URL}/messages/${id}?userId=${user._id}`);
                if (res.data) {
                    const messages = res.data;
                    const decryptedMessages = messages.map(m => ({
                        ...m,
                        text: decryptMessage(m.text, m.type)
                    }));
                    console.log(decryptedMessages);
                    setMessages(decryptedMessages);
                    // setMessages(res.data);
                }
                    
            } catch (err) {
                console.log(err);
            }
        }
        if (currentChat) {
            fetchConversationMessages(currentChat._id);
        }

    }, [currentChat]);

   



    




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