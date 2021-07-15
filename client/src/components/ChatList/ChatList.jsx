import React from 'react';
import ChatItem from '../ChatItem/ChatItem';
import './ChatList.css'

const ChatList = props => {

    

    const generateChatHeader = (displayChat) => {
        if (displayChat) {
            return (
                <>
                    <label>Chats</label>
                    <div class="ml-auto">
                        <button class="btn btn-link border-0 p-0 text-decoration-none" onClick={props.handleUserClick} style={{color:"black"}} id="users">
                            <i class="fas fa-users"></i>
                            <span className="ml-1">Users</span>
                        </button>
                    </div>
                </>
            );
        }
        return (
            <>
                <div className="mr-auto">
                    <button class="btn btn-link border-0 p-0 text-decoration-none" onClick={props.handleBackClick} style={{color:"black"}}>
                        <i class="fas fa-arrow-left"></i>
                        <span></span>
                    </button>
                </div>
                <label>Users</label>
            </>
        );
    }

    const chatList = props.chatList;
    const userList = props.userList;
    return (
        <div className="card" style={{height: "100vh"}}>
            <div className="card-header text-left d-flex">
                {generateChatHeader(props.displayChat)}
            </div>

            {props.displayChat ?
            <ul className="list-group" id="chat-list">
                {chatList.map((conversation) => (
                    <li className="list-group-item" key={conversation._id} onClick={() => {props.handleFetchConversation(conversation)}}>
                        <ChatItem conversation={conversation} currentUser={props.currentUser} username="Quan AP" latestMessage="Hello there"/>
                    </li>
                ))}
            </ul> 
            :
            <ul className="list-group" id="user-list">
                {userList.map(user => (
                    <li className="list-group-item user" key={user._id} onClick={() => {props.handleFetchNewConversation(user)}}> <a className="btn btn-link text-decoration-none p-0 text-info">{user.name}</a></li>
                ))}
            </ul>
            }
        </div>
    );
};

export default ChatList;