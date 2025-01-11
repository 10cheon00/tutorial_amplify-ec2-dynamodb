const wsUrl = "ws://ec2-43-201-184-82.ap-northeast-2.compute.amazonaws.com:8080/chat"; // WebSocket 서버 URL
const socket = new WebSocket(wsUrl);

const messagesDiv = document.getElementById("messages");
const messageInput = document.getElementById("messageInput");
const sendButton = document.getElementById("sendButton");

// WebSocket 이벤트 처리
socket.onopen = () => {
  console.log("Connected to WebSocket server.");
};

socket.onmessage = (event) => {
  addMessage(event.data, "server");
};

socket.onclose = () => {
  console.log("WebSocket connection closed.");
};

socket.onerror = (error) => {
  console.error("WebSocket error:", error);
};

// 메시지 전송 버튼 클릭 이벤트
sendButton.addEventListener("click", sendMessage);
messageInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter") sendMessage();
});

// 메시지 전송 함수
function sendMessage() {
  const message = messageInput.value.trim();
  if (message) {
    socket.send(message);
    addMessage(message, "user");
    messageInput.value = "";
  }
}

// 메시지 추가 함수
function addMessage(message, type) {
  const messageDiv = document.createElement("div");
  messageDiv.classList.add("chat-message");
  if (type === "user") messageDiv.classList.add("user");
  messageDiv.textContent = message;
  messagesDiv.appendChild(messageDiv);
  messagesDiv.scrollTop = messagesDiv.scrollHeight; // 스크롤을 최신 메시지로 이동
}
