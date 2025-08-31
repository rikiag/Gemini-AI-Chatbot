// Deteksi mode gelap/terang dari perangkat
function detectColorScheme() {
    const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
    const html = document.documentElement;
    const themeIcon = document.querySelector('#theme-toggle i');

    if (prefersDarkScheme.matches) {
        html.setAttribute('data-theme', 'dark');
        html.classList.add('dark');
        if (themeIcon) {
            themeIcon.classList.replace('fa-moon', 'fa-sun');
        }
    } else {
        html.setAttribute('data-theme', 'light');
        html.classList.remove('dark');
        if (themeIcon) {
            themeIcon.classList.replace('fa-sun', 'fa-moon');
        }
    }

    // Listen for changes
    prefersDarkScheme.addEventListener('change', e => {
        if (e.matches) {
            html.setAttribute('data-theme', 'dark');
            html.classList.add('dark');
            if (themeIcon) {
                themeIcon.classList.replace('fa-moon', 'fa-sun');
            }
        } else {
            html.setAttribute('data-theme', 'light');
            html.classList.remove('dark');
            if (themeIcon) {
                themeIcon.classList.replace('fa-sun', 'fa-moon');
            }
        }
    });
}

// Theme Toggle Functionality
function setupThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;

    const themeIcon = themeToggle.querySelector('i');
    themeToggle.addEventListener('click', () => {
        const html = document.documentElement;
        if (html.getAttribute('data-theme') === 'light') {
            html.setAttribute('data-theme', 'dark');
            html.classList.add('dark');
            themeIcon.classList.replace('fa-moon', 'fa-sun');
        } else {
            html.setAttribute('data-theme', 'light');
            html.classList.remove('dark');
            themeIcon.classList.replace('fa-sun', 'fa-moon');
        }
    });
}

// The backend expects a history of messages for context.
// We will maintain it on the client-side.
// The Gemini API uses 'user' and 'model' for roles.
const conversationHistory = [];

/**
 * Appends a message to the chat box and scrolls to the bottom.
 * @param {string} sender - The sender of the message ('user' or 'bot').
 * @param {string} text - The message text.
 * @returns {HTMLElement} The created message element, to allow for future modification.
 */
function appendMessage(sender, text) {
    const chatBox = document.getElementById('chat-box');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message chat ${sender === 'user' ? 'chat-end' : 'chat-start'} mb-4`;

    const avatar = sender === 'user'
        ? '<div class="chat-image avatar"><div class="w-10 rounded-full bg-accent flex items-center justify-center"><i class="fas fa-user text-white"></i></div></div>'
        : '<div class="chat-image avatar"><div class="w-10 rounded-full bg-primary flex items-center justify-center"><i class="fas fa-robot text-white"></i></div></div>';

    const bubbleClass = sender === 'user'
        ? 'chat-bubble bubble-user'
        : 'chat-bubble bubble-bot';

    // Kalau bot lagi "thinking", kasih animasi dots
    let bubbleContent = text;
    if (sender === 'bot' && text.toLowerCase().includes('thinking')) {
        bubbleContent = `
            <span class="typing">
                <span></span><span></span><span></span>
            </span>
        `;
    }

    messageDiv.innerHTML = `
        <div class="${bubbleClass}">${bubbleContent}</div>
        ${avatar}
        <div class="chat-header opacity-50 mt-1">
            ${sender === 'user' ? 'You' : 'Gemini AI'}
        </div>
    `;

    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
    return messageDiv.querySelector('.chat-bubble');
}



/**
 * Updates the thinking message with the actual response
 * @param {HTMLElement} element - The thinking message element
 * @param {string} newContent - The new content to display
 */
function updateThinkingMessage(element, newContent) {
    element.innerHTML = marked.parse(newContent);
    const chatBox = document.getElementById('chat-box');
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Chat Functionality
function setupChat() {
    const form = document.getElementById('chat-form');
    const input = document.getElementById('user-input');
    const chatBox = document.getElementById('chat-box');
    const welcomeMessage = document.getElementById('welcome-message');

    if (!form || !input) return;

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const userMessage = input.value.trim();
        if (!userMessage) return;

        // Remove welcome message on first user message
        if (welcomeMessage) {
            welcomeMessage.remove();
            chatBox.classList.remove('centered');
        }

        // 1. Add user message to UI and history
        appendMessage('user', userMessage);
        conversationHistory.push({ role: 'user', content: userMessage });
        input.value = '';

        // 2. Show a temporary "Thinking..." bot message and get a reference to it
        const thinkingMessageElement = appendMessage('bot', 'thinking');

        try {
            // 3. Send the whole conversation history to the backend
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ messages: conversationHistory }),
            });

            // 4. Handle HTTP errors (e.g., 500, 400)
            if (!response.ok) {
                let errorMessage = 'Failed to get response from server.';
                try {
                    // Try to parse a JSON error response from the server
                    const errorData = await response.json();
                    if (errorData && errorData.error) {
                        errorMessage = errorData.error;
                    }
                } catch (jsonError) {
                    // If the error response is not JSON, use the status text
                    errorMessage = `Failed to get response from server. Status: ${response.status}`;
                }
                updateThinkingMessage(thinkingMessageElement, errorMessage);
                // On failure, we don't add anything to the bot's side of the conversation history.
                // We also remove the user's message that caused the error from the history.
                conversationHistory.pop();
                return;
            }

            // 5. Handle successful response
            const data = await response.json();
            const botReply = data.result;

            if (botReply) {
                // Use a markdown parser (like 'marked') to render the response as HTML.
                updateThinkingMessage(thinkingMessageElement, botReply);
                // Add successful bot reply to history for context in the next turn
                conversationHistory.push({ role: 'model', content: botReply });
            } else {
                updateThinkingMessage(thinkingMessageElement, 'Sorry, no response received.');
                // Don't add an empty or failed response to history.
            }

        } catch (error) {
            // 6. Handle network errors or other exceptions during fetch
            console.error('Error sending message:', error);
            updateThinkingMessage(thinkingMessageElement, 'Failed to get response from server.');
            // If the fetch fails or parsing the response fails, remove the user's message.
            conversationHistory.pop();
        }
    });
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function () {
    detectColorScheme();
    setupThemeToggle();
    setupChat();
});
