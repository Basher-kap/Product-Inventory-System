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
        const res  = await fetch('/api/cart');
        const data = await res.json();

        if (data.success) {
            updateCartBadge(data.items);
            renderCartItems(data.items);
        }
    } catch (e) {
        body.innerHTML = `
            <div class="cart-empty-state">
                <div class="cart-empty-icon">⚠️</div>
                <p>Failed to load cart.</p>
            </div>`;
    }
}

// remove item from cart
async function removeFromCart(productCode) {
    try {
        const res = await fetch(`/api/cart/${productCode}`, {
            method: 'DELETE'
        });
        const data = await res.json();

        if (data.success) {
            showToast(data.message);
            updateCartBadge(data.items);
            renderCartItems(data.items);
        } else {
            showToast(data.message, 'true');
        }
    } catch (e) {
        console.error('Error removing item from cart:', e);
    }
}


// render the cart items inside the drawer
function renderCartItems(items) {
    const body = document.getElementById('cart-drawer-body');

    if (items.length === 0) {
        body.innerHTML = `
            <div class="cart-empty-state">
                <div class="cart-empty-icon">🛒</div>
                <p>Your cart is empty.<br>Add some products to get started!</p>
            </div>`;

        document.getElementById('cart-total-amount').textContent = '₱0.00';
        return;
    }

    body.innerHTML = items.map(item => {
        const imgEl = item.productImage
            ? `<img class="cart-item-img" src="${escHtml(item.productImage)}" alt="${escHtml(item.productName)}">`
            : `<div class="cart-item-no-img">📦</div>`;

        const subtotal = (item.unitPrice * item.quantity).toFixed(2);

        return `
            <div class="cart-item">
                ${imgEl}
                <div class="cart-item-info">
                    <div class="cart-item-name">${escHtml(item.productName)}</div>
                    <div class="cart-item-sub">₱${item.unitPrice.toFixed(2)} × ${item.quantity}</div>
                    <div class="cart-item-total">₱${subtotal}</div>
                </div>

                <button class="remove-btn" onclick="removeFromCart('${escHtml(item.productCode)}')">
                    🗑️
                </button>
            </div>`;
    }).join('');

    // compute total price
    const totalPrice = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0).toFixed(2);
    document.getElementById('cart-total-amount').textContent ='₱' + totalPrice.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// checkout
async function checkout(btn) {
    const totalText = document.getElementById('cart-total-amount').textContent;
    if (totalText === '₱0.00') {
        showToast('Your cart is empty.', 'true');
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
            showToast(data.message);
            closeCart();
            updateCartBadge([]); // reset badge
            loadInventory(); // refresh inventory stock after checkout
        } else {
            showToast(data.message, 'true');

            btn.disabled = false;
            btn.textContent = 'Checkout';
        }
    } catch (e) {
        showToast('Checkout failed. Please try again.', 'true');
        btn.disabled = false;
        btn.textContent = 'Checkout';
    }
}