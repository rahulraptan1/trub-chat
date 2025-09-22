// DOM elements
const loginContainer = document.getElementById('login-container');
const registerContainer = document.getElementById('register-container');
const authContainer = document.getElementById('auth-container');
const chatContainer = document.getElementById('chat-container');
const showRegisterBtn = document.getElementById('show-register');
const showLoginBtn = document.getElementById('show-login');
const loginBtn = document.getElementById('login-btn');
const registerBtn = document.getElementById('register-btn');
const logoutBtn = document.getElementById('logout-btn');
const sendBtn = document.getElementById('send-btn');
const messageInput = document.getElementById('message-input');
const chatMessages = document.getElementById('chat-messages');
const userName = document.getElementById('user-name');
const userAvatar = document.getElementById('user-avatar');
const emojiToggle = document.getElementById('emoji-toggle');
const emojiContainer = document.getElementById('emoji-container');

// Initially hide emoji container
emojiContainer.style.display = 'none';

// Switch between login and register forms
showRegisterBtn.addEventListener('click', () => {
    loginContainer.classList.remove('active');
    registerContainer.classList.add('active');
});

showLoginBtn.addEventListener('click', () => {
    registerContainer.classList.remove('active');
    loginContainer.classList.add('active');
});

// Toggle emoji picker
emojiToggle.addEventListener('click', () => {
    if (emojiContainer.style.display === 'none') {
        emojiContainer.style.display = 'flex';
    } else {
        emojiContainer.style.display = 'none';
    }
});

// Add emoji to message input
document.querySelectorAll('.emoji').forEach(emoji => {
    emoji.addEventListener('click', () => {
        messageInput.value += emoji.textContent;
        messageInput.focus();
    });
});

// Register new user
registerBtn.addEventListener('click', () => {
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    
    if (!name || !email || !password) {
        alert('Please fill all fields');
        return;
    }
    
    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Update user profile with name
            const user = userCredential.user;
            return user.updateProfile({
                displayName: name
            });
        })
        .then(() => {
            alert('Registration successful!');
            showLogin();
        })
        .catch((error) => {
            alert('Error: ' + error.message);
        });
});

// Login user
loginBtn.addEventListener('click', () => {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    if (!email || !password) {
        alert('Please enter email and password');
        return;
    }
    
    auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // User logged in successfully
            authContainer.style.display = 'none';
            chatContainer.style.display = 'flex';
            
            // Update UI with user info
            const user = userCredential.user;
            userName.textContent = user.displayName || user.email;
            userAvatar.textContent = (user.displayName || user.email).charAt(0).toUpperCase();
            
            // Load chat messages
            loadMessages();
        })
        .catch((error) => {
            alert('Error: ' + error.message);
        });
});

// Logout user
logoutBtn.addEventListener('click', () => {
    auth.signOut()
        .then(() => {
            chatContainer.style.display = 'none';
            authContainer.style.display = 'block';
            showLogin();
        })
        .catch((error) => {
            alert('Error signing out: ' + error.message);
        });
});

// Send message
sendBtn.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

function sendMessage() {
    const messageText = messageInput.value.trim();
    if (!messageText) return;
    
    const user = auth.currentUser;
    if (!user) return;
    
    // Add message to database
    database.ref('messages').push({
        text: messageText,
        sender: user.displayName || user.email,
        senderId: user.uid,
        timestamp: Date.now()
    });
    
    // Clear input
    messageInput.value = '';
}

// Load messages from database
function loadMessages() {
    database.ref('messages').orderByChild('timestamp').limitToLast(20).on('value', (snapshot) => {
        chatMessages.innerHTML = '';
        snapshot.forEach((childSnapshot) => {
            const message = childSnapshot.val();
            displayMessage(message);
        });
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    });
}

// Display message in chat
function displayMessage(message) {
    const user = auth.currentUser;
    const isMyMessage = user && user.uid === message.senderId;
    
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    messageElement.classList.add(isMyMessage ? 'my-message' : 'other-message');
    
    const messageTime = new Date(message.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    
    messageElement.innerHTML = `
        <div class="message-sender">${isMyMessage ? 'You' : message.sender}</div>
        <div class="message-content">${message.text}</div>
        <div class="message-time">${messageTime}</div>
    `;
    
    chatMessages.appendChild(messageElement);
}

// Show login form
function showLogin() {
    registerContainer.classList.remove('active');
    loginContainer.classList.add('active');
}

// Check auth state
auth.onAuthStateChanged((user) => {
    if (user) {
        // User is signed in
        authContainer.style.display = 'none';
        chatContainer.style.display = 'flex';
        
        // Update UI with user info
        userName.textContent = user.displayName || user.email;
        userAvatar.textContent = (user.displayName || user.email).charAt(0).toUpperCase();
        
        // Load chat messages
        loadMessages();
    } else {
        // User is signed out
        chatContainer.style.display = 'none';
        authContainer.style.display = 'block';
    }
});