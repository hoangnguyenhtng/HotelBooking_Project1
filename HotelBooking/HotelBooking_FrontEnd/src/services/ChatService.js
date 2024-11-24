import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

class ChatService {
    constructor() {
        this.stompClient = null;
        this.messageHandlers = new Set();
    }

    connect(userId, onConnected, onError) {
        const socket = new SockJS('http://localhost:8080/ws');
        this.stompClient = Stomp.over(socket);

        this.stompClient.connect({}, () => {
            // Đăng ký nhận tin nhắn công khai
            this.stompClient.subscribe('/topic/public', this.onMessageReceived);

            // Đăng ký nhận tin nhắn cá nhân
            this.stompClient.subscribe(`/user/${userId}/topic/messages`, this.onMessageReceived);

            // Gửi tin nhắn JOIN
            this.stompClient.send("/app/chat.addUser",
                {},
                JSON.stringify({
                    senderId: userId,
                    type: 'JOIN'
                })
            );

            onConnected();
        }, onError);
    }

    disconnect() {
        if (this.stompClient) {
            this.stompClient.disconnect();
        }
    }

    sendMessage(message) {
        if (this.stompClient) {
            this.stompClient.send("/app/chat.sendMessage", {}, JSON.stringify(message));
        }
    }

    onMessageReceived = (payload) => {
        const message = JSON.parse(payload.body);
        this.messageHandlers.forEach(handler => handler(message));
    }

    addMessageHandler(handler) {
        this.messageHandlers.add(handler);
        return () => this.messageHandlers.delete(handler);
    }
}

export default new ChatService();