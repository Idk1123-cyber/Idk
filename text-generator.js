const templates = {
    sus: {
        name: "Someone looks suspicious!",
        message: "I saw RED vent! Sus!"
    },
    innocent: {
        name: "Proving innocence",
        message: "I was doing tasks in electrical, not sus!"
    },
    voting: {
        name: "Emergency meeting",
        message: "Who we voting out? Let's discuss!"
    },
    vent: {
        name: "Vented accusation",
        message: "I LITERALLY SAW YOU VENT!"
    },
    task: {
        name: "Task location",
        message: "Heading to med bay to do tasks!"
    },
    killed: {
        name: "Body discovered",
        message: "BODY FOUND IN REACTOR!"
    }
};

function updateCharCount() {
    const textarea = document.getElementById('message-text');
    const count = textarea.value.length;
    document.getElementById('char-count').textContent = `${count}/500 characters`;
}

function applyTextStyle(text, style) {
    switch(style) {
        case 'caps':
            return text.toUpperCase();
        case 'lowercase':
            return text.toLowerCase();
        case 'reverse':
            return text.split('').reverse().join('');
        case 'spaced':
            return text.split('').join(' ');
        case 'dots':
            return text.split('').join('.');
        default:
            return text;
    }
}

function generateText() {
    const name = document.getElementById('player-name').value.trim();
    const message = document.getElementById('message-text').value.trim();
    const style = document.getElementById('text-style').value;
    const prefix = document.getElementById('prefix').value;

    if (!name) {
        showStatus('Please enter your name!', false);
        return;
    }

    if (!message) {
        showStatus('Please enter a message!', false);
        return;
    }

    // Apply text style
    const styledMessage = applyTextStyle(message, style);

    // Build final text
    let finalText = '';
    if (prefix) {
        finalText = prefix + ' ';
    }
    finalText += name + ': ' + styledMessage;

    // Display result
    const display = document.getElementById('text-display');
    display.innerHTML = `<p>${escapeHtml(finalText)}</p>`;
    display.classList.remove('empty');

    showStatus('Text generated! Ready to copy.', true);
}

function useTemplate(templateKey) {
    const template = templates[templateKey];
    if (!template) return;

    document.getElementById('player-name').value = template.name;
    document.getElementById('message-text').value = template.message;
    document.getElementById('text-style').value = 'normal';
    document.getElementById('prefix').value = '';
    updateCharCount();
    generateText();
}

function copyToClipboard() {
    const display = document.getElementById('text-display');
    const text = display.innerText;

    if (text === 'Your generated text will appear here...') {
        showStatus('Generate text first!', false);
        return;
    }

    // Copy to clipboard
    navigator.clipboard.writeText(text).then(() => {
        showStatus('✅ Copied to clipboard! Paste in Among Us now.', true);
        
        // Change button feedback
        const btn = event.target;
        const originalText = btn.textContent;
        btn.textContent = '✅ Copied!';
        setTimeout(() => {
            btn.textContent = originalText;
        }, 2000);
    }).catch(() => {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showStatus('✅ Copied to clipboard! Paste in Among Us now.', true);
    });
}

function showStatus(message, isSuccess) {
    const statusEl = document.getElementById('copy-status');
    statusEl.textContent = message;
    statusEl.style.color = isSuccess ? '#4f4' : '#ff6464';
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

// Event listeners
document.getElementById('message-text').addEventListener('input', updateCharCount);

// Initialize
window.addEventListener('load', () => {
    updateCharCount();
});
