// app/controllers/inventory.js

let allProducts = []; //declares empty array

    //session guard
    fetch('/api/session')
        .then(res => res.json())
        .then(result => {
            if (!result.success) {
                window.location.href = '../login.html';
            } else {
                document.getElementById('profile-username').textContent = result.username;
                document.getElementById('profile-icon').textContent = result.username.charAt(0).toUpperCase();
                loadInventory();
                loadCartCount();
            }
        });


    //fetch and display products
    async function loadInventory() {
        try {
            const res = await fetch('/api/inventory');
            const data = await res.json();
            if (data.success) {
                allProducts = data.products;
                renderTable(allProducts);
            }
        } catch (e) {
            document.getElementById('inventory-grid').innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">⚠️</div>
                    <p>Failed to load inventory. Please try again later.</p>
                </div>`;
        }
    }

    function renderTable(products) {
        const grid = document.getElementById('inventory-grid');

        if (products.length === 0) {
            grid.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">📦</div>
                    <p>No products available.</p>
                </div>`;
            return;
        }

        grid.innerHTML = products.map(p => {
            const imgCell = p.productImage
                ? `<img class="card-img" src="${escHtml(p.productImage)}" alt="${escHtml(p.productName)}">`
                : `<div class="card-img no-image">📦</div>`;

            const qtyClass = p.quantity <= 5 ? 'qty-low' : 'qty-ok';

            return `
                <div class="product-card">
                    ${imgCell}
                    <div class="card-body">
                        <span class="product-code-badge">${escHtml(p.productCode)}</span>
                        <h3 class="card-name">${escHtml(p.productName)}</h3>
                        <div class="card-details">
                            <span class="price-cell">₱${parseFloat(p.unitPrice).toFixed(2)}</span>
                            <span class="qty-cell ${qtyClass}">Qty: ${p.quantity}</span>
                        </div>

                        <button class="add-to-cart-btn" onclick="addToCart('${escHtml(p.productCode)}')">
                            🛒 Add to Cart
                        </button>

                    </div>
                </div>`;
        }).join('');
    }

    async function addToCart(productCode) {
        try {
            const res  = await fetch('/api/cart', {
                method:  'POST',
                headers: { 'Content-Type': 'application/json' },
                body:    JSON.stringify({ productCode })
            });
            const data = await res.json(); //goes back here upon succesfully adding to cart, then the data, which are the carted products are stored here in data

            if (data.success) {
                showToast(data.message);
                updateCartBadge(data.items);  //update badge count
            } else {
                showToast(data.message, 'error');
            }
        } catch (e) {
            showToast('Failed to add to cart. Please try again.', 'error');
        }
    }

    async function loadCartCount() {
        try {
            const res = await fetch('/api/cart');
            const data = await res.json();
            if (data.success) {
                updateCartBadge(data.items);
            }
        } catch (e) {
            console.error('Failed to load cart count:', e);
        }
    }   

    function updateCartBadge(items) {
        const total = items.reduce((sum, item) => sum + item.quantity, 0);
        const badge = document.getElementById('cart-badge'); //grabs the span element with id cart-badge in inventory.html
        badge.textContent = total; // replaces the text inside the <span> with the new total.

        if (total > 0) {
            badge.classList.add('visible'); //shows the badge
        } else {
            badge.classList.remove('visible');
        }
    }

    // toast message
    let toastTimer;
    function showToast(msg, isError = false) {
        const t = document.getElementById('toast');
        t.textContent = msg;
        t.className   = 'toast' + (isError ? ' error' : '') + ' show';
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => t.classList.remove('show'), 3000);
    }

    // escape html to prevent XSS
    function escHtml(str) {
        if (!str) return '';
        return str.replace(/&/g, '&amp;')
                   .replace(/</g, '&lt;')
                   .replace(/>/g, '&gt;')
                   .replace(/"/g, '&quot;')
                   .replace(/'/g, '&#039;');
    }

    //navbar actions
    function goToProfile(e)        { e.preventDefault(); window.location.href = '/app/pages/profile.html'; }
    function goToChangePassword(e) { e.preventDefault(); window.location.href = 'change-password.html'; }
    function handleLogout(e) {
         e.preventDefault();
        fetch('/api/logout', { method: 'POST' }).then(() => window.location.href = '../login.html');
    }