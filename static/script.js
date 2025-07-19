document.addEventListener('DOMContentLoaded', function () {
    const sendButton = document.getElementById('send-button');
    const messageInput = document.getElementById('message-input');
    const chatBody = document.getElementById('chat-body');

    sendButton.addEventListener('click', sendMessage);

    // 👇 Add this for Enter key support
    messageInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            sendMessage();
        }
    });

    function sendMessage() {
        const userMessage = messageInput.value.trim();
        if (userMessage) {
            const userMessageElement = document.createElement('div');
            userMessageElement.className = 'chat-message user';
            userMessageElement.textContent = userMessage;
            chatBody.appendChild(userMessageElement);

            messageInput.value = '';
            chatBody.scrollTop = chatBody.scrollHeight;

            const apiUrl = `${window.location.origin}/chat`;

            fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMessage }),
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    const botMessageElement = document.createElement('div');
                    botMessageElement.className = 'chat-message bot';
                    botMessageElement.innerHTML = formatBotResponse(data.response || 'No response from bot');
                    chatBody.appendChild(botMessageElement);
                    chatBody.scrollTop = chatBody.scrollHeight;
                })
                .catch(error => {
                    console.error('Error:', error);
                    const errorElement = document.createElement('div');
                    errorElement.className = 'chat-message error';
                    errorElement.textContent = 'Error: Could not fetch response from server.';
                    chatBody.appendChild(errorElement);
                });
        }
    }

    function formatBotResponse(response) {
        response = response.replace(/\n/g, "<br>");
        response = response.replace(/\* \*\*(.*?)\*\*/g, "<strong>$1</strong>");
        response = response.replace(/\* (.*?)\n/g, "• $1<br>");
        return response;
    }
});
