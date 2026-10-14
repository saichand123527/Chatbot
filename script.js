// --- FOOD MENU DATABASE ---
const foodMenu = [
    { id: 1, name: "Masala Dosa", category: "Breakfast", price: 65, emoji: " dosa", desc: "Crispy crepe stuffed with spiced potatoes, served with chutney & sambar." },
    { id: 2, name: "Idli Sambar", category: "Breakfast", price: 40, emoji: "idli", desc: "Soft, steamed rice cakes served with hot sambar and fresh coconut chutney." },
    { id: 3, name: "Puri Bhaji", category: "Breakfast", price: 50, emoji: "puri", desc: "Fluffy deep-fried puris accompanied by flavorful potato curry." },
    { id: 4, name: "Chicken Biryani", category: "Lunch", price: 150, emoji: "🍛", desc: "Aromatic basmati rice cooked with tender chicken pieces and rich spices." },
    { id: 5, name: "Veg Fried Rice", category: "Lunch", price: 90, emoji: "🍜", desc: "Stir-fried rice tossed with fresh vegetables and oriental sauces." },
    { id: 6, name: "Thali Meal", category: "Lunch", price: 110, emoji: "🍱", desc: "Complete wholesome meal with roti, rice, dal, sabzi, and curd." },
    { id: 7, name: "Veg Cheese Burger", category: "Snacks", price: 75, emoji: "🍔", desc: "Crispy vegetable patty layered with melted cheese and fresh lettuce." },
    { id: 8, name: "Grilled Sandwich", category: "Snacks", price: 60, emoji: "🥪", desc: "Toasted sandwich filled with veggies, cheese, and herb spread." },
    { id: 9, name: "French Fries", category: "Snacks", price: 50, emoji: "🍟", desc: "Golden, crispy potato fries dusted with seasoned salt." },
    { id: 10, name: "Cold Coffee", category: "Drinks", price: 60, emoji: "🧋", desc: "Chilled, creamy blended coffee topped with chocolate syrup." },
    { id: 11, name: "Fresh Lime Soda", category: "Drinks", price: 30, emoji: "🥤", desc: "Refreshing sweet & salty sparkling lime drink." },
    { id: 12, name: "Mango Shake", category: "Drinks", price: 70, emoji: "🥭", desc: "Rich and thick milkshake made with real ripe mango pulp." }
];

// --- APPLICATION STATE ---
let cart = [];
let orders = [];
let currentUser = null;

// --- DOMContentLoaded Initialization ---
document.addEventListener("DOMContentLoaded", () => {
    initAuth();
    initNavigation();
    initMenu();
    initCart();
    initCheckout();
    setMinPickupDate();
});

// --- 1. LOGIN & AUTHENTICATION ---
function initAuth() {
    const loginForm = document.getElementById("login-form");
    const loginSection = document.getElementById("login-section");
    const appContainer = document.getElementById("app-container");
    const togglePassword = document.getElementById("toggle-password");
    const passwordInput = document.getElementById("login-password");
    const logoutBtn = document.getElementById("logout-btn");
    const userDisplay = document.getElementById("user-display");

    // Show / Hide Password
    togglePassword.addEventListener("click", () => {
        const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
        passwordInput.setAttribute("type", type);
        togglePassword.classList.toggle("fa-eye");
        togglePassword.classList.toggle("fa-eye-slash");
    });

    // Login Form Submission
    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const email = document.getElementById("login-email").value.trim();
        const password = passwordInput.value.trim();

        let isValid = true;
        document.getElementById("email-error").textContent = "";
        document.getElementById("password-error").textContent = "";

        if (!email.includes("@")) {
            document.getElementById("email-error").textContent = "Please enter a valid college email address.";
            isValid = false;
        }

        if (password.length < 6) {
            document.getElementById("password-error").textContent = "Password must be at least 6 characters long.";
            isValid = false;
        }

        if (isValid) {
            currentUser = email;
            userDisplay.innerHTML = `<i class="fa-solid fa-user-circle"></i> ${email.split('@')[0]}`;
            loginSection.classList.add("hidden");
            appContainer.classList.remove("hidden");
            loginForm.reset();
        }
    });

    // Logout Button
    logoutBtn.addEventListener("click", () => {
        if (confirm("Are you sure you want to log out?")) {
            appContainer.classList.add("hidden");
            loginSection.classList.remove("hidden");
            cart = [];
            updateCartBadge();
        }
    });
}

// --- 2. NAVIGATION SYSTEM ---
function initNavigation() {
    const navLinks = document.querySelectorAll(".nav-link");

    navLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const targetId = link.getAttribute("data-target");
            switchTab(targetId);
        });
    });
}

function switchTab(tabId) {
    document.querySelectorAll(".tab-section").forEach(section => {
        section.classList.remove("active");
    });
    document.querySelectorAll(".nav-link").forEach(link => {
        link.classList.remove("active");
    });

    document.getElementById(tabId).classList.add("active");
    const activeLink = document.querySelector(`.nav-link[data-target="${tabId}"]`);
    if (activeLink) {
        activeLink.classList.add("active");
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// --- 3. FOOD MENU & CATEGORY FILTERS ---
function initMenu() {
    renderMenu(foodMenu);

    const filterBtns = document.querySelectorAll(".filter-btn");
    filterBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            filterBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            const category = btn.getAttribute("data-category");
            if (category === "All") {
                renderMenu(foodMenu);
            } else {
                const filtered = foodMenu.filter(item => item.category === category);
                renderMenu(filtered);
            }
        });
    });
}

function renderMenu(items) {
    const foodGrid = document.getElementById("food-grid");
    foodGrid.innerHTML = "";

    if (items.length === 0) {
        foodGrid.innerHTML = `<p class="text-muted">No food items found in this category.</p>`;
        return;
    }

    items.forEach(item => {
        const card = document.createElement("div");
        card.className = "food-card";
        card.innerHTML = `
            <div class="food-img-container">
                <span>${item.emoji}</span>
                <span class="food-tag">${item.category}</span>
            </div>
            <div class="food-details">
                <div class="food-title-price">
                    <h3>${item.name}</h3>
                    <span class="food-price">₹${item.price}</span>
                </div>
                <p class="food-desc">${item.desc}</p>
                <button class="btn btn-primary btn-block" onclick="addToCart(${item.id})">
                    <i class="fa-solid fa-cart-plus"></i> Add to Cart
                </button>
            </div>
        `;
        foodGrid.appendChild(card);
    });
}

// --- 4. SHOPPING CART MANAGEMENT ---
function addToCart(itemId) {
    const item = foodMenu.find(f => f.id === itemId);
    const existing = cart.find(c => c.id === itemId);

    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ ...item, quantity: 1 });
    }

    updateCartBadge();
    renderCart();
    showToast(`${item.name} added to cart!`);
}

function updateQuantity(itemId, change) {
    const item = cart.find(c => c.id === itemId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            cart = cart.filter(c => c.id !== itemId);
        }
    }
    updateCartBadge();
    renderCart();
}

function removeFromCart(itemId) {
    cart = cart.filter(c => c.id !== itemId);
    updateCartBadge();
    renderCart();
}

function updateCartBadge() {
    const badge = document.getElementById("cart-badge");
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    badge.textContent = totalCount;
}

function initCart() {
    renderCart();
}

function renderCart() {
    const cartList = document.getElementById("cart-items-list");
    cartList.innerHTML = "";

    if (cart.length === 0) {
        cartList.innerHTML = `<p class="text-muted" style="text-align: center; padding: 30px;">Your cart is currently empty. <br> Explore the menu to add delicious items!</p>`;
        document.getElementById("cart-subtotal").textContent = "₹0";
        document.getElementById("cart-tax").textContent = "₹0";
        document.getElementById("cart-total").textContent = "₹0";
        return;
    }

    cart.forEach(item => {
        const itemDiv = document.createElement("div");
        itemDiv.className = "cart-item";
        itemDiv.innerHTML = `
            <div class="cart-item-info">
                <span class="cart-item-emoji">${item.emoji}</span>
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p>₹${item.price} each</p>
                </div>
            </div>
            <div class="cart-item-actions">
                <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                <span>${item.quantity}</span>
                <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                <button class="remove-btn" onclick="removeFromCart(${item.id})"><i class="fa-solid fa-trash"></i></button>
            </div>
        `;
        cartList.appendChild(itemDiv);
    });

    // Calculate Totals
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = Math.round(subtotal * 0.05);
    const total = subtotal + tax;

    document.getElementById("cart-subtotal").textContent = `₹${subtotal}`;
    document.getElementById("cart-tax").textContent = `₹${tax}`;
    document.getElementById("cart-total").textContent = `₹${total}`;
}

// --- 5 & 6. PICKUP DATE/TIME & PAYMENT TYPE ---
function setMinPickupDate() {
    const dateInput = document.getElementById("pickup-date");
    const today = new Date().toISOString().split("T")[0];
    dateInput.setAttribute("min", today);
    dateInput.value = today;
}

function initCheckout() {
    const paymentSelect = document.getElementById("payment-type");
    const upiInterface = document.getElementById("upi-interface");
    const cardInterface = document.getElementById("card-interface");
    const cashInterface = document.getElementById("cash-interface");
    const placeOrderBtn = document.getElementById("place-order-btn");

    paymentSelect.addEventListener("change", (e) => {
        const val = e.target.value;
        upiInterface.classList.add("hidden");
        cardInterface.classList.add("hidden");
        cashInterface.classList.add("hidden");

        if (val === "UPI") {
            upiInterface.classList.remove("hidden");
        } else if (val === "Card") {
            cardInterface.classList.remove("hidden");
        } else if (val === "Cash") {
            cashInterface.classList.remove("hidden");
        }
    });

    placeOrderBtn.addEventListener("click", () => {
        processCheckout();
    });
}

// --- 7. ORDER CONFIRMATION & MY ORDERS ---
function processCheckout() {
    if (cart.length === 0) {
        alert("Your cart is empty! Please add items before placing an order.");
        switchTab("menu-tab");
        return;
    }

    const pickupDate = document.getElementById("pickup-date").value;
    const pickupTime = document.getElementById("pickup-time").value;
    const paymentType = document.getElementById("payment-type").value;

    if (!pickupDate) {
        alert("Please select a valid pickup date.");
        return;
    }
    if (!pickupTime) {
        alert("Please select a pickup time slot.");
        return;
    }
    if (!paymentType) {
        alert("Please select a payment method.");
        return;
    }

    // Calculate totals
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = Math.round(subtotal * 0.05);
    const totalAmount = subtotal + tax;

    // Generate Unique Order ID
    const orderId = "CB-" + Math.floor(100000 + Math.random() * 900000);
    const orderDate = new Date().toLocaleString();

    const newOrder = {
        id: orderId,
        items: [...cart],
        subtotal,
        tax,
        totalAmount,
        orderDate,
        pickupDate,
        pickupTime,
        paymentType,
        paymentStatus: paymentType === "Cash" ? "Pending (Cash on Pickup)" : "Demo Paid (Successful)",
        orderStatus: "Preparing in Kitchen"
    };

    orders.unshift(newOrder);

    // Render Success Modal
    showOrderSuccessModal(newOrder);

    // Reset Cart
    cart = [];
    updateCartBadge();
    renderCart();
    renderOrders();
}

function showOrderSuccessModal(order) {
    const modal = document.getElementById("success-modal");
    const detailsContainer = document.getElementById("modal-order-details");

    let itemsHtml = order.items.map(i => `<li>${i.name} x ${i.quantity} (₹${i.price * i.quantity})</li>`).join("");

    detailsContainer.innerHTML = `
        <p><strong>Order ID:</strong> ${order.id}</p>
        <p><strong>Pickup:</strong> ${order.pickupDate} (${order.pickupTime})</p>
        <p><strong>Payment:</strong> ${order.paymentType} — ${order.paymentStatus}</p>
        <p><strong>Total Amount:</strong> ₹${order.totalAmount}</p>
        <p><strong>Items:</strong></p>
        <ul style="padding-left: 20px; margin-top: 5px;">${itemsHtml}</ul>
    `;

    modal.classList.remove("hidden");
}

function closeSuccessModal() {
    document.getElementById("success-modal").classList.add("hidden");
    switchTab("orders-tab");
}

function renderOrders() {
    const container = document.getElementById("orders-container");
    container.innerHTML = "";

    if (orders.length === 0) {
        container.innerHTML = `<p class="text-muted" style="text-align: center; padding: 40px;">You haven't placed any orders yet.</p>`;
        return;
    }

    orders.forEach(order => {
        let itemsText = order.items.map(i => `${i.name} (x${i.quantity})`).join(", ");
        
        const card = document.createElement("div");
        card.className = "order-card";
        card.innerHTML = `
            <div class="order-header-row">
                <span class="order-id"><i class="fa-solid fa-receipt"></i> ${order.id}</span>
                <span class="order-status"><i class="fa-solid fa-fire-burner"></i> ${order.orderStatus}</span>
            </div>
            <div class="order-body-grid">
                <div class="order-items-list">
                    <p><strong>Ordered Items:</strong></p>
                    <p>${itemsText}</p>
                </div>
                <div class="order-meta">
                    <p><strong>Ordered At:</strong> ${order.orderDate}</p>
                    <p><strong>Pickup:</strong> ${order.pickupDate} | ${order.pickupTime}</p>
                    <p><strong>Payment:</strong> ${order.paymentType} (${order.paymentStatus})</p>
                </div>
                <div class="order-total-price">
                    <p>Total: ₹${order.totalAmount}</p>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

// Simple Toast Notification
function showToast(message) {
    const toast = document.createElement("div");
    toast.textContent = message;
    toast.style.position = "fixed";
    toast.style.bottom = "20px";
    toast.style.right = "20px";
    toast.style.backgroundColor = "#2f3542";
    toast.style.color = "#fff";
    toast.style.padding = "10px 20px";
    toast.style.borderRadius = "8px";
    toast.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
    toast.style.zIndex = "2000";
    toast.style.fontSize = "0.9rem";
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 2500);
}