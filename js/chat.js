/**
 * AI Safari Concierge Chat Simulation
 */
const WHATSAPP_NUMBER = '26778496552';
const WHATSAPP_BASE = `https://wa.me/${WHATSAPP_NUMBER}`;

const RESPONSES = {
    greeting: "Hello! I'm your AI concierge 🦁 I can help you with:\n1) Luxury tent bookings\n2) Private game drives\n3) Special experiences\n\nWhat brings you to Botswana?",
    booking: "Perfect! We have Luxury Canvas Suites at $450/night. How many guests and which dates?",
    safari: "Excellent choice! Private game drives start at $180/person (3 hours).\n\nWould you prefer morning (6am) or sunset (4pm)?",
    confirm: (guests, dates) => `Wonderful! I have availability for ${guests} guests, ${dates}.\n\nTotal: $1,350\n\nShall I confirm your booking?`,
    success: (ref) => `Booking confirmed! ✅\n\nReservation ${ref}\n\n✓ Confirmation email sent\n✓ Pre-arrival guide included\n✓ WhatsApp check-in link\n\nSafe travels! 🌍`,
    fallback: "Great question! Let me connect you with our team for personalized assistance."
};

const QUICK_REPLIES = {
    initial: ['Book a tent', 'Plan safari', 'Ask questions'],
    times: ['6:00 AM', '4:00 PM'],
    confirm: ['Yes, confirm!', 'Change dates']
};

let chatState = { step: 'initial', data: {} };

document.addEventListener('DOMContentLoaded', initChat);

function initChat() {
    const modal = document.getElementById('chatModal');
    const overlay = document.getElementById('chatModalOverlay');
    const closeBtn = document.getElementById('chatModalClose');
    const input = document.getElementById('chatInput');
    const sendBtn = document.getElementById('chatSendBtn');

    // Open modal triggers
    ['heroCta', 'whatsappFloat', 'whatsappHeaderBtn', 'bookWhatsappBtn', 'footerCta'].forEach(id => {
        document.getElementById(id)?.addEventListener('click', openChat);
    });

    // Offering links
    document.querySelectorAll('.offering-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            openChat();
        });
    });

    // View rates button
    document.getElementById('viewRatesBtn')?.addEventListener('click', () => {
        alert('Luxury Canvas Suite: $450/night\nFamily Tent: $680/night\nHoneymoon Suite: $720/night');
    });

    // Close modal
    closeBtn?.addEventListener('click', closeChat);
    overlay?.addEventListener('click', closeChat);

    // Send message
    sendBtn?.addEventListener('click', sendMessage);
    input?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });
}

function openChat() {
    const modal = document.getElementById('chatModal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Reset and start conversation
    chatState = { step: 'initial', data: {} };
    clearMessages();
    setTimeout(() => addAIMessage(RESPONSES.greeting, QUICK_REPLIES.initial), 500);
}

function closeChat() {
    document.getElementById('chatModal').classList.remove('active');
    document.body.style.overflow = '';
}

function clearMessages() {
    document.getElementById('chatMessages').innerHTML = '';
}

function sendMessage() {
    const input = document.getElementById('chatInput');
    const text = input.value.trim();
    if (!text) return;

    addUserMessage(text);
    input.value = '';
    processInput(text);
}

function addUserMessage(text) {
    const container = document.getElementById('chatMessages');
    const div = document.createElement('div');
    div.className = 'modal-message user';
    div.innerHTML = `<div class="bubble">${text}</div>`;
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
}

function addAIMessage(text, quickReplies = null, action = null) {
    const container = document.getElementById('chatMessages');

    // Show typing indicator
    const typing = document.createElement('div');
    typing.className = 'typing-indicator';
    typing.innerHTML = '<span></span><span></span><span></span>';
    container.appendChild(typing);
    container.scrollTop = container.scrollHeight;

    setTimeout(() => {
        typing.remove();
        const div = document.createElement('div');
        div.className = 'modal-message ai';
        let html = `<div class="bubble">${text.replace(/\n/g, '<br>')}`;

        if (action) {
            html += `<div style="margin-top: 12px;">
                        <a href="${action.url}" target="_blank" class="btn btn-whatsapp" style="width: 100%; justify-content: center; text-decoration: none; font-size: 14px; padding: 10px;">
                            ${action.text}
                        </a>
                     </div>`;
        }

        if (quickReplies) {
            html += '<div class="quick-replies">';
            quickReplies.forEach(reply => {
                html += `<button class="quick-reply-btn" onclick="handleQuickReply('${reply}')">${reply}</button>`;
            });
            html += '</div>';
        }
        html += '</div>';
        div.innerHTML = html;
        container.appendChild(div);
        container.scrollTop = container.scrollHeight;
    }, 1500);
}

function handleQuickReply(reply) {
    addUserMessage(reply);
    processInput(reply);
}

function processInput(text) {
    const lower = text.toLowerCase();

    if (chatState.step === 'initial') {
        if (lower.includes('tent') || lower.includes('book') || lower.includes('room')) {
            chatState.step = 'booking';
            addAIMessage(RESPONSES.booking);
        } else if (lower.includes('safari') || lower.includes('drive') || lower.includes('game')) {
            chatState.step = 'safari';
            addAIMessage(RESPONSES.safari, QUICK_REPLIES.times);
        } else {
            addAIMessage(RESPONSES.fallback);
            setTimeout(() => window.open(`${WHATSAPP_BASE}?text=Hi! I have a question about Botswana Lodge`, '_blank'), 2000);
        }
    } else if (chatState.step === 'booking') {
        // Parse guests and dates
        const guests = text.match(/(\d+)\s*guest/i)?.[1] || '2';
        const dates = text.match(/(\w+\s+\d+[-–]\d+)/i)?.[1] || 'your selected dates';
        chatState.data = { guests, dates };
        chatState.step = 'confirm';
        addAIMessage(RESPONSES.confirm(guests, dates), QUICK_REPLIES.confirm);
    } else if (chatState.step === 'safari') {
        chatState.step = 'safari_booked';
        const time = lower.includes('morning') || lower.includes('6') ? '6:00 AM' : '4:00 PM';

        const action = {
            text: 'Finalize Booking on WhatsApp',
            url: `${WHATSAPP_BASE}?text=${encodeURIComponent(`Hi! I'd like to book a ${time} game drive.`)}`
        };

        addAIMessage(`Booked! Your ${time} game drive is confirmed. 🦒\n\nYour guide will meet you at reception.\n\nExpect: Big Five sightings, expert tracking, sundowners! 🌅`, null, action);
    } else if (chatState.step === 'confirm') {
        if (lower.includes('yes') || lower.includes('confirm')) {
            const ref = `BL2024-${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}`;
            sessionStorage.setItem('booking', JSON.stringify({ ref, ...chatState.data }));

            const action = {
                text: 'Send Confirmation to Lodge',
                url: `${WHATSAPP_BASE}?text=${encodeURIComponent(`Hi! I have a confirmed reservation ref: ${ref} for ${chatState.data.guests} guests, ${chatState.data.dates}.`)}`
            };

            addAIMessage(RESPONSES.success(ref), null, action);
        } else {
            chatState.step = 'booking';
            addAIMessage("No problem! What dates work better for you?");
        }
    }
}

// Expose for quick reply buttons
window.handleQuickReply = handleQuickReply;
