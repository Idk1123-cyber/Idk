let selectedColor = null;
let currentLag = 0;
let packetLoss = 0;
let randomDisconnects = false;
let isDisconnected = false;

const colorMap = {
    'Red': '#ff4444',
    'Blue': '#4444ff',
    'Green': '#44ff44',
    'Pink': '#ff44ff',
    'Orange': '#ff8844',
    'Yellow': '#ffff44',
    'Black': '#333333',
    'White': '#eeeeee',
    'Purple': '#8844ff',
    'Brown': '#884444'
};

function selectColor(color) {
    selectedColor = color;
    document.querySelectorAll('.color-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    event.target.classList.add('selected');
    document.getElementById('selected-color').textContent = `Selected: ${color}`;
}

function updateLagValue(value) {
    currentLag = parseInt(value);
    document.getElementById('lag-value').textContent = value;
}

function updateLossValue(value) {
    packetLoss = parseInt(value);
    document.getElementById('loss-value').textContent = value;
}

function setLag(value) {
    currentLag = value;
    document.getElementById('lag-amount').value = value;
    document.getElementById('lag-value').textContent = value;
}

function toggleDisconnect() {
    randomDisconnects = document.getElementById('disconnect-sim').checked;
}

function simulateLag() {
    return new Promise((resolve) => {
        const actualLag = currentLag + (Math.random() * 200 - 100);
        setTimeout(resolve, Math.max(0, actualLag));
    });
}

function shouldPacketDrop() {
    return Math.random() * 100 < packetLoss;
}

function simulateDisconnect() {
    if (!randomDisconnects) return false;
    return Math.random() < 0.1; // 10% chance
}

function handleKeyPress(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

async function sendMessage() {
    const input = document.getElementById('message-input');
    const message = input.value.trim();
    
    if (!message) return;
    if (!selectedColor) {
        addSystemMessage('Please select a color first!');
        return;
    }

    // Simulate packet loss
    if (shouldPacketDrop()) {
        addLagMessage('Message failed to send! (Packet Loss)');
        input.value = '';
        return;
    }

    // Simulate disconnect
    if (simulateDisconnect()) {
        isDisconnected = true;
        addSystemMessage(`${selectedColor} was disconnected!`);
        input.disabled = true;
        setTimeout(() => {
            isDisconnected = false;
            input.disabled = false;
            addSystemMessage(`${selectedColor} reconnected!`);
        }, 3000);
        input.value = '';
        return;
    }

    // Show sending with lag
    const statusElement = document.getElementById('status-text');
    statusElement.textContent = 'Sending...';
    
    input.disabled = true;
    const originalText = input.value;
    input.value = '';

    try {
        await simulateLag();
        
        if (currentLag > 0) {
            addLagMessage(`[LAG: +${Math.round(currentLag)}ms]`);
        }
        
        addMessage(selectedColor, originalText);
        statusElement.textContent = '';
    } finally {
        input.disabled = false;
        input.focus();
    }
}

function addMessage(sender, content) {
    const chatBox = document.getElementById('chat-box');
    const messageElement = document.createElement('div');
    messageElement.className = 'message';
    
    const senderColor = colorMap[sender];
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    messageElement.innerHTML = `
        <div class="message-sender" style="color: ${senderColor};">${sender}</div>
        <div class="message-content">${escapeHtml(content)}</div>
        <div class="message-time">${time}</div>
    `;
    
    messageElement.style.borderLeftColor = senderColor;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function addSystemMessage(content) {
    const chatBox = document.getElementById('chat-box');
    const messageElement = document.createElement('div');
    messageElement.className = 'message system';
    messageElement.textContent = content;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function addLagMessage(content) {
    const chatBox = document.getElementById('chat-box');
    const messageElement = document.createElement('div');
    messageElement.className = 'message lag-indicator';
    messageElement.textContent = content;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// Initialize
window.addEventListener('load', () => {
    const chatBox = document.getElementById('chat-box');
    addSystemMessage('Welcome to Among Us Chat!');
    addSystemMessage('Select your color and adjust lag settings to begin...');
});
