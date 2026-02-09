/**
 * Pixel Events for Lodge & Hospitality Demo
 * Tracks user interactions for Meta Ads optimization
 */

document.addEventListener('DOMContentLoaded', function () {
    // Helper function to track Facebook Pixel events safely
    function trackPixelEvent(eventName, params) {
        if (typeof fbq === 'function') {
            fbq('track', eventName, params);
            console.log(`Pixel Event Fired: ${eventName}`, params);
        } else {
            console.warn('Facebook Pixel (fbq) not initialized.');
        }
    }

    // Helper function to track Google Analytics events
    function trackGAEvent(eventName, params) {
        if (typeof gtag === 'function') {
            gtag('event', eventName, params);
            console.log(`GA Event Fired: ${eventName}`, params);
        } else {
            console.warn('Google Analytics (gtag) not initialized.');
        }
    }

    // 1. Track WhatsApp Clicks as 'Lead'
    const whatsappBtns = document.querySelectorAll('a[href*="wa.me"], .btn-whatsapp, #whatsappFloat, #whatsappHeaderBtn, #heroCta, #footerCta');
    whatsappBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            trackPixelEvent('Lead', {
                content_name: 'WhatsApp Click - Lodge Demo',
                content_category: 'Demo Engagement',
                value: 0.00,
                currency: 'BWP'
            });
            trackGAEvent('whatsapp_click', {
                event_category: 'engagement',
                event_label: 'Lodge Demo - WhatsApp'
            });
        });
    });

    // 2. Track AI Concierge Button Clicks (View Rates / Book WhatsApp)
    const viewRatesBtn = document.getElementById('viewRatesBtn');
    if (viewRatesBtn) {
        viewRatesBtn.addEventListener('click', function () {
            trackPixelEvent('ViewContent', {
                content_name: 'View Rates Clicked',
                content_category: 'Demo Interaction',
                content_type: 'pricing_inquiry'
            });
            trackGAEvent('view_rates', {
                event_category: 'engagement',
                event_label: 'Lodge - View Rates'
            });
        });
    }

    const bookWhatsappBtn = document.getElementById('bookWhatsappBtn');
    if (bookWhatsappBtn) {
        bookWhatsappBtn.addEventListener('click', function () {
            trackPixelEvent('InitiateCheckout', {
                content_name: 'Book Via WhatsApp - AI Concierge',
                content_category: 'Demo Conversion',
                value: 450.00,
                currency: 'USD'
            });
            trackGAEvent('book_whatsapp', {
                event_category: 'conversion',
                event_label: 'Lodge - Book via WhatsApp'
            });
        });
    }

    // 3. Track Offering Card Clicks
    const offeringLinks = document.querySelectorAll('.offering-link');
    offeringLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const offeringType = this.getAttribute('data-type') || 'unknown';
            const offeringCard = this.closest('.offering-card');
            const offeringName = offeringCard?.querySelector('h3')?.innerText || 'Unknown Offering';
            const priceText = offeringCard?.querySelector('.offering-price')?.innerText || '';
            const price = parseFloat(priceText.replace(/[^0-9.]/g, '')) || 0;

            trackPixelEvent('ViewContent', {
                content_name: offeringName,
                content_category: 'Offering Browse',
                content_type: offeringType,
                value: price,
                currency: 'USD'
            });
            trackGAEvent('offering_click', {
                event_category: 'engagement',
                event_label: `Offering: ${offeringName}`
            });
        });
    });

    // 4. Track Chat Modal Open
    const chatModal = document.getElementById('chatModal');
    if (chatModal) {
        const observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                if (mutation.target.classList.contains('active')) {
                    trackPixelEvent('ViewContent', {
                        content_name: 'AI Chat Modal Opened',
                        content_category: 'Demo Interaction',
                        content_type: 'chat_modal'
                    });
                    trackGAEvent('chat_modal_opened', {
                        event_category: 'engagement',
                        event_label: 'AI Chat Modal'
                    });
                }
            });
        });
        observer.observe(chatModal, { attributes: true, attributeFilter: ['class'] });
    }

    // 5. Track Chat Messages Sent
    const chatSendBtn = document.getElementById('chatSendBtn');
    if (chatSendBtn) {
        chatSendBtn.addEventListener('click', function () {
            const chatInput = document.getElementById('chatInput');
            if (chatInput && chatInput.value.trim()) {
                trackPixelEvent('ViewContent', {
                    content_name: 'Chat Message Sent',
                    content_category: 'Demo Interaction',
                    content_type: 'ai_chat_engagement'
                });
                trackGAEvent('chat_message_sent', {
                    event_category: 'engagement',
                    event_label: 'Lodge - AI Chat'
                });
            }
        });
    }

    // 6. Track Scroll Depth (for engagement metrics)
    let scrollTracked = { quarter: false, half: false, threeQuarter: false, full: false };
    window.addEventListener('scroll', function () {
        const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;

        if (scrollPercent >= 25 && !scrollTracked.quarter) {
            scrollTracked.quarter = true;
            trackGAEvent('scroll_depth', { event_category: 'engagement', event_label: '25%' });
        }
        if (scrollPercent >= 50 && !scrollTracked.half) {
            scrollTracked.half = true;
            trackGAEvent('scroll_depth', { event_category: 'engagement', event_label: '50%' });
        }
        if (scrollPercent >= 75 && !scrollTracked.threeQuarter) {
            scrollTracked.threeQuarter = true;
            trackGAEvent('scroll_depth', { event_category: 'engagement', event_label: '75%' });
        }
        if (scrollPercent >= 95 && !scrollTracked.full) {
            scrollTracked.full = true;
            trackGAEvent('scroll_depth', { event_category: 'engagement', event_label: '100%' });
        }
    });

    // 7. Track Time on Page
    let timeOnPage = 0;
    const timeTracker = setInterval(function () {
        timeOnPage += 10;
        if (timeOnPage === 30) {
            trackGAEvent('time_on_page', { event_category: 'engagement', event_label: '30_seconds' });
        } else if (timeOnPage === 60) {
            trackGAEvent('time_on_page', { event_category: 'engagement', event_label: '60_seconds' });
            clearInterval(timeTracker);
        }
    }, 10000);

});
