// socket.ts
import io from 'socket.io-client';

const Socket = io('http://localhost:8080');

export default Socket;