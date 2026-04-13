// GLOW Cosmetics - Main JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all modules
    initTheme();
    initAccessibility();
    initMobileMenu();
    initCart();
    initFilters();
    initModals();
    initForms();
    initNotifications();
});

// Theme Toggle
function initTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    
    // Load saved theme
    const savedTheme = localStorage.getItem('theme') || 'dark';
    body.setAttribute('data-theme', savedTheme);
    
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = body.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            body.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            showNotification(`Тема переключена на ${newTheme === 'dark' ? 'тёмную' : 'светлую'}`, 'success');
        });
    }
}

// Accessibility Panel
function initAccessibility() {
    const toggle = document.querySelector('.accessibility-toggle');
    const panel = document.querySelector('.accessibility-panel');
    const overlay = document.querySelector('.overlay');
    
    if (toggle && panel) {
        toggle.addEventListener('click', () => {
            panel.classList.toggle('active');
            if (overlay) overlay.classList.toggle('active');
        });
        
        if (overlay) {
            overlay.addEventListener('click', () => {
                panel.classList.remove('active');
                overlay.classList.remove('active');
            });
        }
        
        // Font size controls
        const fontSizeLarge = document.getElementById('font-size-large');
        const highContrast = document.getElementById('high-contrast');
        
        if (fontSizeLarge) {
            fontSizeLarge.addEventListener('change', (e) => {
                if (e.target.checked) {
                    document.body.style.fontSize = '18px';
                } else {
                    document.body.style.fontSize = '';
                }
            });
        }
        
        if (highContrast) {
            highContrast.addEventListener('change', (e) => {
                if (e.target.checked) {
                    document.body.setAttribute('data-contrast', 'high');
                } else {
                    document.body.removeAttribute('data-contrast');
                }
            });
        }
    }
}

// Mobile Menu
function initMobileMenu() {
    const toggle = document.querySelector('.mobile-menu-toggle');
    const menu = document.querySelector('.nav-menu');
    const overlay = document.querySelector('.overlay');
    
    if (toggle && menu) {
        toggle.addEventListener('click', () => {
            menu.classList.toggle('active');
            if (overlay) overlay.classList.toggle('active');
        });
        
        if (overlay) {
            overlay.addEventListener('click', () => {
                menu.classList.remove('active');
                overlay.classList.remove('active');
            });
        }
    }
}

// Cart Functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function initCart() {
    updateCartCount();
    renderCartItems();
    
    // Add to cart buttons
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const productId = btn.dataset.productId;
            const productName = btn.dataset.productName;
            const productPrice = parseFloat(btn.dataset.productPrice);
            const productImage = btn.dataset.productImage || 'https://placehold.co/300x300/1a1a25/ff0080?text=Product';
            
            addToCart(productId, productName, productPrice, productImage);
        });
    });
    
    // Cart toggle
    const cartToggle = document.getElementById('cart-toggle');
    const cartSidebar = document.querySelector('.cart-sidebar');
    const overlay = document.querySelector('.overlay');
    
    if (cartToggle && cartSidebar) {
        cartToggle.addEventListener('click', () => {
            cartSidebar.classList.toggle('active');
            if (overlay) overlay.classList.toggle('active');
        });
        
        if (overlay) {
            overlay.addEventListener('click', () => {
                cartSidebar.classList.remove('active');
                overlay.classList.remove('active');
            });
        }
    }
    
    // Checkout button
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length === 0) {
                showNotification('Корзина пуста', 'error');
                return;
            }
            window.location.href = 'cart.html';
        });
    }
}

function addToCart(id, name, price, image) {
    const existingItem = cart.find(item => item.id === id);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            id,
            name,
            price,
            image,
            quantity: 1
        });
    }
    
    saveCart();
    updateCartCount();
    renderCartItems();
    showNotification(`${name} добавлен в корзину`, 'success');
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    saveCart();
    updateCartCount();
    renderCartItems();
    showNotification('Товар удалён из корзины', 'success');
}

function updateQuantity(id, change) {
    const item = cart.find(item => item.id === id);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(id);
        } else {
            saveCart();
            renderCartItems();
        }
    }
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCartCount() {
    const countElement = document.querySelector('.cart-count');
    if (countElement) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        countElement.textContent = totalItems;
    }
}

function renderCartItems() {
    const cartItemsContainer = document.querySelector('.cart-items');
    if (!cartItemsContainer) return;
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 2rem;">Корзина пуста</p>';
        return;
    }
    
    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-info">
                <h4 class="cart-item-title">${item.name}</h4>
                <p class="cart-item-price">${item.price.toFixed(2)} ₽</p>
                <div class="cart-item-quantity">
                    <button onclick="updateQuantity('${item.id}', -1)">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="updateQuantity('${item.id}', 1)">+</button>
                </div>
            </div>
            <button onclick="removeFromCart('${item.id}')" style="background: none; border: none; color: var(--primary); cursor: pointer; font-size: 1.2rem;">×</button>
        </div>
    `).join('');
    
    // Update total
    const totalElement = document.querySelector('.cart-total-value');
    if (totalElement) {
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        totalElement.textContent = `${total.toFixed(2)} ₽`;
    }
}

// Category Filters
function initFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const category = btn.dataset.category;
            
            productCards.forEach(card => {
                if (category === 'all' || card.dataset.category === category) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// Modals
function initModals() {
    // Close modal buttons
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', () => {
            btn.closest('.modal').classList.remove('active');
            document.querySelector('.overlay')?.classList.remove('active');
        });
    });
    
    // Product quick view
    document.querySelectorAll('.quick-view').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const productId = btn.dataset.productId;
            // In a real app, fetch product details
            document.getElementById('product-modal')?.classList.add('active');
            document.querySelector('.overlay')?.classList.add('active');
        });
    });
    
    // Login modal
    document.querySelectorAll('.login-trigger').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('login-modal')?.classList.add('active');
            document.querySelector('.overlay')?.classList.add('active');
        });
    });
    
    // Overlay click to close
    const overlay = document.querySelector('.overlay');
    if (overlay) {
        overlay.addEventListener('click', () => {
            document.querySelectorAll('.modal').forEach(modal => {
                modal.classList.remove('active');
            });
            overlay.classList.remove('active');
        });
    }
}

// Forms
function initForms() {
    // Login form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email')?.value;
            const password = document.getElementById('login-password')?.value;
            
            if (email && password) {
                // Simulate login
                localStorage.setItem('user', JSON.stringify({ email, name: email.split('@')[0] }));
                document.getElementById('login-modal')?.classList.remove('active');
                document.querySelector('.overlay')?.classList.remove('active');
                showNotification('Вы успешно вошли!', 'success');
                setTimeout(() => window.location.href = 'profile.html', 1000);
            }
        });
    }
    
    // Registration form
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('register-name')?.value;
            const email = document.getElementById('register-email')?.value;
            const password = document.getElementById('register-password')?.value;
            
            if (name && email && password) {
                // Simulate registration
                localStorage.setItem('user', JSON.stringify({ email, name }));
                showNotification('Аккаунт создан!', 'success');
                setTimeout(() => window.location.href = 'profile.html', 1000);
            }
        });
    }
    
    // Contact form
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showNotification('Сообщение отправлено!', 'success');
            contactForm.reset();
        });
    }
    
    // Profile update form
    const profileForm = document.getElementById('profile-form');
    if (profileForm) {
        profileForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showNotification('Профиль обновлён!', 'success');
        });
    }
    
    // Order form
    const orderForm = document.getElementById('order-form');
    if (orderForm) {
        orderForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // Process order
            cart = [];
            saveCart();
            updateCartCount();
            showNotification('Заказ оформлен!', 'success');
            setTimeout(() => window.location.href = 'profile.html', 1500);
        });
    }
}

// Notifications
function initNotifications() {
    // Container for notifications
    if (!document.querySelector('.notifications-container')) {
        const container = document.createElement('div');
        container.className = 'notifications-container';
        document.body.appendChild(container);
    }
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => notification.classList.add('show'), 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Profile Navigation
function switchProfileSection(sectionId) {
    document.querySelectorAll('.profile-section').forEach(section => {
        section.classList.remove('active');
    });
    document.querySelectorAll('.profile-nav a').forEach(link => {
        link.classList.remove('active');
    });
    
    document.getElementById(sectionId)?.classList.add('active');
    event.target.classList.add('active');
}

// Helper: Format price
function formatPrice(price) {
    return new Intl.NumberFormat('ru-RU').format(price) + ' ₽';
}

// Wishlist functionality
let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

function toggleWishlist(productId) {
    const index = wishlist.indexOf(productId);
    if (index > -1) {
        wishlist.splice(index, 1);
        showNotification('Удалено из избранного', 'success');
    } else {
        wishlist.push(productId);
        showNotification('Добавлено в избранное', 'success');
    }
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
}
