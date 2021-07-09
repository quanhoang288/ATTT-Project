import React from 'react';

const ChatHeader = (props) => {
    if (props.displayChat){
        return (
            <div>
                <label>Chats</label>
                <div class="ml-auto">
                    <button class="btn btn-link border-0 p-0 text-decoration-none" onClick={handleUserClick} style={{color:"black"}} id="users">
                        <i class="fas fa-users"></i>
                        <span className="ml-1">Users</span>
                    </button>
                </div>
            </div>
        );
    }
    return (
        <div>
            
        </div>
    );
};

export default ChatHeader;