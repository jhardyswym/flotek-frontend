
import socketIOClient from "socket.io-client";

const ENDPOINT = "http://127.0.0.1:3005"
export default class SocketController {

    static _socket = null; 
    

    static init(){
        this._socket = socketIOClient(ENDPOINT);
       // console.log("Got Socket!",this._socket);
    }

    static subscribe(topic,callback){
        this._socket.on(topic,callback);
    
    }

    
}