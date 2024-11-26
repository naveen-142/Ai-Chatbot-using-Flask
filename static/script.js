document.addEventListener('DOMContentLoaded', function () {
    const sendButton = document.getElementById('send-button');
    const messageInput = document.getElementById('message-input');
    const chatBody = document.getElementById('chat-body');

    sendButton.addEventListener('click', sendMessage);

    function sendMessage() {
        const userMessage = messageInput.value.trim();
        if (userMessage) {
          
            const userMessageElement = document.createElement('div');
            userMessageElement.className = 'chat-message user';
            userMessageElement.textContent = userMessage;
            chatBody.appendChild(userMessageElement);

            
            messageInput.value = '';

            chatBody.scrollTop = chatBody.scrollHeight;

            
            fetch('https://ai-chatbot-using-flask-fy3r.vercel.app/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message: userMessage })
            })
            .then(response => response.json())
            .then(data => {
                const botMessageElement = document.createElement('div');
                botMessageElement.className = 'chat-message bot';
                botMessageElement.textContent = data.response || 'No response from bot';
                chatBody.appendChild(botMessageElement);
            
                chatBody.scrollTop = chatBody.scrollHeight;
            })
            .catch(error => {
                console.error('Error:', error);
            });
            
        }
    }
});