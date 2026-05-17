// app/controllers/cart-drawer.js

function goToCart() {
    document.getElementById('cart-drawer').classList.add('open');
    loadCartItems(); // fetch and render items every time drawer opens
}

// close cart drawer
function closeCart() {
    document.getElementById('cart-drawer').classList.remove('open');
}



// fetch cart items from API and render them in the drawer
async function loadCartItems() {
    const body = document.getElementById('cart-drawer-body');
    body.innerHTML = `<p style="color:var(--muted);text-align:center;font-size:14px;">Loading...</p>`;

    try {
        const res = await fetch('/api/cart');
        const data = await res.json();

        if (!data.success) {
            if (res.status === 401) {
                window.location.href = '/app/login.html';
                return;
            }

            body.innerHTML = `
                <div class="cart-empty-state">
                    <div class="cart-empty-icon">⚠️</div>
                    <p>${escHtml(data.message || 'Failed to load cart.')}</p>
                </div>`;
            return;
        }

        safeUpdateCartBadge(data.items);
        renderCartItems(data.items);
    } catch (e) {
        body.innerHTML = `
            <div class="cart-empty-state">
                <div class="cart-empty-icon">⚠️</div>
                <p>Failed to load cart.</p>
            </div>`;
        console.error('Cart load error:', e);
    }
}

function safeUpdateCartBadge(items) {
    if (typeof updateCartBadge === 'function') {
        updateCartBadge(items);
    }
}

// remove item from cart
async function removeFromCart(productCode) {
    try {
        const res = await fetch(`/api/cart/${encodeURIComponent(productCode)}`, {
            method: 'DELETE'
        });
        const data = await res.json();

        if (data.success) {
            safeShowToast(data.message);
            updateCartBadge(data.items);
            renderCartItems(data.items);
        } else {
            safeShowToast(data.message, true);
        }
    } catch (e) {
        console.error('Error removing item from cart:', e);
        safeShowToast('Failed to remove item from cart.', true);
    }
}


// render the cart items inside the drawer
function renderCartItems(items = []) {
    const body = document.getElementById('cart-drawer-body');

    if (!Array.isArray(items) || items.length === 0) {
        body.innerHTML = `
            <div class="cart-empty-state">
                <div class="cart-empty-icon">🛒</div>
                <p>Your cart is empty.<br>Add some products to get started!</p>
            </div>`;

        const totalAmount = document.getElementById('cart-total-amount');
        if (totalAmount) totalAmount.textContent = '₱0.00';
        return;
    }

    body.innerHTML = items.map(item => {
        const imgEl = item.productImage
            ? `<img class="cart-item-img" src="${escHtml(item.productImage)}" alt="${escHtml(item.productName)}">`
            : `<div class="cart-item-no-img">📦</div>`;

        const unitPrice = Number(item.unitPrice) || 0;
        const quantity = Number(item.quantity) || 0;
        const subtotal = (unitPrice * quantity).toFixed(2);

        return `
            <div class="cart-item">
                ${imgEl}
                <div class="cart-item-info">
                    <div class="cart-item-name">${escHtml(item.productName)}</div>
                    <div class="cart-item-sub">₱${unitPrice.toFixed(2)} × ${quantity}</div>
                    <div class="cart-item-total">₱${subtotal}</div>
                </div>

                <button class="remove-btn" onclick="removeFromCart('${escHtml(item.productCode)}')">
                    🗑️
                </button>
            </div>`;
    }).join('');

    const totalPrice = items.reduce((sum, item) => sum + (Number(item.unitPrice) || 0) * (Number(item.quantity) || 0), 0);
    const totalElement = document.getElementById('cart-total-amount');
    if (totalElement) {
        totalElement.textContent = '₱' + totalPrice.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
}

function escHtml(str) {
    if (typeof str !== 'string') return '';
    return str.replace(/&/g, '&amp;')
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;')
              .replace(/"/g, '&quot;')
              .replace(/'/g, '&#039;');
}

function safeShowToast(message, isError = false) {
    if (typeof showToast === 'function') {
        showToast(message, isError ? 'true' : false);
    } else {
        console[isError ? 'error' : 'log']('Toast:', message);
    }
}

// checkout
async function checkout(btn) {
    const totalText = document.getElementById('cart-total-amount').textContent;
    if (totalText === '₱0.00') {
        safeShowToast('Your cart is empty.', true);
        return;
    }

    btn.disabled = true;
    btn.textContent = 'Processing...';

    try {
        const res = await fetch('/api/cart/checkout', {
            method: 'POST'
        });
        const data = await res.json();

        if (data.success) {
            safeShowToast(data.message);
            closeCart();
            safeUpdateCartBadge([]); // reset badge
            if (typeof loadInventory === 'function') {
                loadInventory(); // refresh inventory stock after checkout
            }
        } else {
            safeShowToast(data.message, true);

            btn.disabled = false;
            btn.textContent = 'Checkout';
        }
    } catch (e) {
        showToast('Checkout failed. Please try again.', 'true');
        btn.disabled = false;
        btn.textContent = 'Checkout';
    }
}