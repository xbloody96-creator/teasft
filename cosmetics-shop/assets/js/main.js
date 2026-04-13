/**
 * BEAUTÉ — Premium Cosmetics Shop
 * Main JavaScript
 */

// ===================================
// Accessibility Panel
// ===================================
let currentFontSize = 16;
let isHighContrast = false;

function toggleA11y() {
    const panel = document.getElementById('a11yPanel');
    panel.classList.toggle('active');
}

function adjustFont(delta) {
    currentFontSize = Math.max(12, Math.min(24, currentFontSize + delta));
    document.documentElement.style.fontSize = currentFontSize + 'px';
}

function resetFont() {
    currentFontSize = 16;
    document.documentElement.style.fontSize = '16px';
}

function toggleContrastMode() {
    isHighContrast = !isHighContrast;
    document.body.classList.toggle('high-contrast', isHighContrast);
}

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    document.body.classList.toggle('dark-theme', theme === 'dark');
    document.body.classList.toggle('light-theme', theme === 'light');
}

// ===================================
// Search Overlay
// ===================================
function toggleSearch() {
    const overlay = document.getElementById('searchOverlay');
    overlay.classList.toggle('active');
    
    if (overlay.classList.contains('active')) {
        document.querySelector('.search-input').focus();
    }
}

// Close search on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const overlay = document.getElementById('searchOverlay');
        const panel = document.getElementById('a11yPanel');
        
        if (overlay.classList.contains('active')) {
            overlay.classList.remove('active');
        }
        if (panel.classList.contains('active')) {
            panel.classList.remove('active');
        }
    }
});

// Close search on background click
document.getElementById('searchOverlay')?.addEventListener('click', (e) => {
    if (e.target === document.getElementById('searchOverlay')) {
        toggleSearch();
    }
});

// ===================================
// Product Tabs Filter
// ===================================
const tabButtons = document.querySelectorAll('.tab-btn');
const productCards = document.querySelectorAll('.product-card');

tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active from all tabs
        tabButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const filter = btn.dataset.tab;
        
        // Filter products
        productCards.forEach(card => {
            if (filter === 'all' || card.dataset.category === filter) {
                card.style.display = 'block';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 50);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
    });
});

// ===================================
// Wishlist Toggle
// ===================================
const wishlistButtons = document.querySelectorAll('.product-wishlist');

wishlistButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        btn.classList.toggle('active');
        
        if (btn.classList.contains('active')) {
            btn.textContent = '♥';
            btn.style.color = '#ff6b6b';
        } else {
            btn.textContent = '♡';
            btn.style.color = '';
        }
    });
});

// ===================================
// Cart Functionality
// ===================================
let cartCount = 0;
const cartCountElement = document.querySelector('.cart-count');
const addToCartButtons = document.querySelectorAll('.btn-cart');

addToCartButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        cartCount++;
        if (cartCountElement) {
            cartCountElement.textContent = cartCount;
            
            // Animation
            cartCountElement.style.transform = 'scale(1.3)';
            setTimeout(() => {
                cartCountElement.style.transform = 'scale(1)';
            }, 200);
        }
        
        // Button feedback
        const originalText = btn.textContent;
        btn.textContent = '✓ Добавлено';
        btn.style.background = '#51cf66';
        
        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = '';
        }, 1500);
    });
});

// ===================================
// Smooth Scroll for Anchor Links
// ===================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        
        if (href !== '#' && href.length > 1) {
            e.preventDefault();
            const target = document.querySelector(href);
            
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// ===================================
// Header Scroll Effect
// ===================================
let lastScroll = 0;
const header = document.querySelector('.main-header');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        header.style.boxShadow = 'var(--shadow-md)';
    } else {
        header.style.boxShadow = 'var(--shadow-sm)';
    }
    
    lastScroll = currentScroll;
});

// ===================================
// Service Buttons
// ===================================
const serviceButtons = document.querySelectorAll('.service-action .btn');

serviceButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const originalText = btn.textContent;
        btn.textContent = '✓ Записано';
        btn.style.background = 'var(--color-primary)';
        btn.style.color = 'white';
        
        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = '';
            btn.style.color = '';
        }, 2000);
    });
});

// ===================================
// Promo Form Submit
// ===================================
const promoForm = document.querySelector('.promo-form');

if (promoForm) {
    promoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const btn = promoForm.querySelector('.btn-primary');
        const originalText = btn.textContent;
        
        btn.textContent = '✓ Промокод отправлен!';
        btn.style.background = '#51cf66';
        
        promoForm.reset();
        
        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = '';
        }, 3000);
    });
}

// ===================================
// Contact Form Submit
// ===================================
const contactForm = document.querySelector('.contacts-form');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const btn = contactForm.querySelector('.btn-primary');
        const originalText = btn.textContent;
        
        btn.textContent = '✓ Отправлено!';
        btn.style.background = '#51cf66';
        
        contactForm.reset();
        
        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = '';
        }, 3000);
    });
}

// ===================================
// Intersection Observer for Animations
// ===================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.category-card, .service-item, .product-card, .testimonial-card, .blog-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// ===================================
// Initialize
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('BEAUTÉ shop initialized');
    
    // Set initial theme from localStorage if available
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    
    // Save theme preference
    document.querySelectorAll('.a11y-buttons button[onclick*="setTheme"]').forEach(btn => {
        btn.addEventListener('click', () => {
            const theme = btn.getAttribute('onclick').match(/'([^']+)'/)[1];
            localStorage.setItem('theme', theme);
        });
    });
});

// ===================================
// Easter Egg - Console Message
// ===================================
console.log('%c✨ BEAUTÉ — Premium Cosmetics Shop', 'font-size: 20px; font-weight: bold; color: #d4a574;');
console.log('%cСоздано с любовью к красоте 💄', 'font-size: 12px; color: #8a8a9a;');
