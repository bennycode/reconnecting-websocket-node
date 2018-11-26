import ReconnectingWebSocket, {Options} from 'reconnecting-websocket';
import NodeWebSocket = require('ws');
import * as EventEmitter from "events";

class WebSocketClient extends EventEmitter {
  connect(): void {
    const options: Options = {
      WebSocket: typeof window !== 'undefined' ? WebSocket : NodeWebSocket,
      connectionTimeout: 4000,
      debug: true,
      maxReconnectionDelay: 10000,
      maxRetries: Infinity,
      minReconnectionDelay: 4000,
      reconnectionDelayGrowFactor: 1.3,
    };

    function buildWebSocketURL(timestamp: number = Date.now()): string {
      return `wss://echo.websocket.org/?time=${timestamp}`;
    }

    const socket: ReconnectingWebSocket = new ReconnectingWebSocket(
      buildWebSocketURL,
      undefined,
      options
    );

    socket.onmessage = (event: MessageEvent): void => {
      console.log(`Response: ${event.data}`);
    };

    socket.onerror = (): void => {
      console.error('Ooops!');
    };

    socket.onopen = (): void => {
      console.log('WebSocket is alive!');
    };
  }
}

const myWebSocket = new WebSocketClient();
myWebSocket.connect();
