import moment from "moment";
import { useEffect, useState } from "react";
import uuid from 'react-uuid';
import './App.css';
import ScrollToBottom from 'react-scroll-to-bottom';


function Chat({ socket, author, room }) {


    const WelcomeMessage = {
        id: uuid(),
        room,
        author: "Chat bot",
        message: "Welcome...",
        time: moment().format('h:mm a')
    }

    const [message, setMessage] = useState("")
    const [messages, setMessages] = useState([WelcomeMessage])


    const send = async () => {
        if (message != "") {
            const data = {
                id: uuid(),
                room,
                author,
                message,
                time: moment().format('h:mm a')
            }
            await socket.emit("send_message", data);
            setMessages((list) => [...list, data]);
            setMessage("")
        }
    }

    useEffect(() => {
        socket.on("receive_message", (data) => {
            setMessages((list) => !list.find(m => m.id == data.id) ? [...list, data] : list)
        })
    }, [socket]);



    return (
        <div className="chat-window">
            <div className="chat-header">
                <p>Live Chat</p>
            </div>
            <div className="chat-body">
                <ScrollToBottom className="message-container">
                {messages.map((msg, i) => {
                    return (
                        <div key={i} className="message" id={author != msg.author ? "you" : "other"}>
                            <div>
                                <div className="message-content">
                                    <p>{msg.message}</p>
                                </div>
                                <div className="message-meta">
                                    <p id="time">{msg.time}</p>
                                    <p id="author" >{author == msg.author ? "you" : msg.author}</p>
                                </div>
                            </div>
                        </div>
                    )
                })}
                </ScrollToBottom>
            </div>
            <div className="chat-footer">
                <input type="text" value={message} placeholder="Hey..." onKeyPress={e => e.key == "Enter" && send()} onChange={(e) => setMessage(e.target.value)} />
                <button onClick={send}>&#9658;</button>
            </div>
        </div>
    );
}

export default Chat;
