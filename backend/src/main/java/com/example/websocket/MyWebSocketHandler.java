package com.example.websocket;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.socket.*;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;



public class MyWebSocketHandler extends TextWebSocketHandler {
    final static Logger logger = LoggerFactory.getLogger(MyWebSocketHandler.class);
    final Map<String, WebSocketSession> sessions = new ConcurrentHashMap<>();

    final WebSocketMessage<String> connectionEstablishedMessage = new TextMessage("{\"message\":\"You have joined the room.\"}");
    final WebSocketMessage<String> newUserJoinedMessage = new TextMessage("{\"message\":\"A new user has joined the room.\"}");
    final WebSocketMessage<String> connectionClosedMessage = new TextMessage("{\"message\":\"Some user has left the room.\"}");

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        String sessionId = session.getId();

        createSessionLog(sessionId, "Connection established.");

        sessions.put(sessionId, session);
        for (WebSocketSession s : sessions.values()) {
            if (s.getId().equals(sessionId)) {
                s.sendMessage(connectionEstablishedMessage);
            } else {
                s.sendMessage(newUserJoinedMessage);
            }
        }
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        String sessionId = session.getId();
        String payload = message.getPayload();

        createSessionLog(sessionId, "Send message : " + payload);

        for (WebSocketSession s : sessions.values()) {
            if (!s.getId().equals(sessionId)) {
                s.sendMessage(message);
            }
        }
    }

    @Override
    public void handleTransportError(WebSocketSession session, Throwable exception) throws Exception {
        super.handleTransportError(session, exception);
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus closeStatus) throws Exception {
        String sessionId = session.getId();

        sessions.remove(sessionId, session);
        createSessionLog(sessionId, "Connection closed.");

        for (WebSocketSession s : sessions.values()) {
            if (s.isOpen()) {
                s.sendMessage(connectionClosedMessage);
            }
        }


    }

    @Override
    public boolean supportsPartialMessages() {
        return super.supportsPartialMessages();
    }

    private void createSessionLog(String sessionId, String message) {
        logger.info(String.format("[ %s ] %s.", sessionId, message));
    }
}
