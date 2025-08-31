 # Gemini AI Chatbot

 This project is a submission for the **Maju Bareng AI Bersama Hacktiv8** program, focusing on implementing the Google Gemini API into a user-friendly chat interface.

 > Program Link: [Hacktiv8 - Maju Bareng AI](https://www.hacktiv8.com/projects/avpn-asia)

 ## Screenshot

 ![Application Screenshot](Screenshot.webp)

 ## Features

 - **Conversational AI:** Integrates with the Google Gemini API for intelligent and contextual responses.
 - **Markdown Rendering:** Bot responses are parsed with `marked.js` to display formatted text, code blocks, lists, and more, enhancing readability.
 - **Light & Dark Mode:** Includes a theme toggle to switch between light and dark modes.
 - **System Theme Detection:** Automatically applies the system's preferred color scheme (light or dark) on the first visit.
 - **Responsive Design:** Built with Tailwind CSS and DaisyUI for a clean and responsive layout on all devices.
 - **Typing Indicator:** Shows a "thinking" animation while the bot is generating a response.

 ## Tech Stack

 - **Backend:**
   - Node.js
   - Express.js
   - Google Gemini API (`@google/genai`)

 - **Frontend:**
   - HTML5
   - Tailwind CSS
   - DaisyUI
   - Marked.js (for Markdown parsing)
   - Font Awesome (for icons)

 ## Prerequisites

 Before you begin, ensure you have the following installed:

 - Node.js (latest LTS version is recommended)
 - **Google Gemini API Key**: You need an API key to use the Gemini API. You can obtain one from [Google AI Studio](https://aistudio.google.com/apikey).

 ## Installation & Setup

 1.  **Clone the repository:**
     ```bash
     git clone https://github.com/rikiag/Gemini-AI-Chatbot.git
     ```

 2.  **Navigate to the project directory:**
     ```bash
     cd Gemini-API
     ```

 3.  **Install dependencies:**
     ```bash
     npm install
     ```

 4.  **Create an environment file:**
     Create a `.env` file in the root of the project.
     ```bash
     touch .env
     ```

 5.  **Add your API Key:**
     Open the `.env` file and add your Google Gemini API key.
     ```
     GEMINI_API_KEY=your_gemini_api_key_here
     ```

 ## Running the Application

 1.  **Start the server:**
     ```bash
     npm start
     ```

 2.  **Start the server in development (watch) mode:**
     This will automatically restart the server when file changes are detected.
     ```bash
     npm run watch
     ```

 Once the server is running, open your browser and navigate to `http://localhost:3000`.
