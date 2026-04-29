// app/components/add-product-modal.js

function renderAddProductModal() {
    const modal = document.createElement('div');
    modal.innerHTML = `
        <div class="modal-overlay" id="add-product-overlay">
            <div class="modal">

                <div class="modal-header">
                    <h3>+ Add Product</h3>
                    <button class="modal-close" onclick="closeProductModal()">✕</button>
                </div>

                <div class="modal-body">

                    <div class="form-group">
                        <label for="inp-code">Product Code *</label>
                        <input type="text" id="inp-code" placeholder="e.g. PROD-001" maxlength="30">
                    </div>

                    <div class="form-group">
                        <label for="inp-name">Product Name *</label>
                        <input type="text" id="inp-name" placeholder="e.g. Kendama" maxlength="100">
                    </div>

                    <div class="form-group">
                        <label for="inp-qty">Quantity</label>
                        <input type="number" id="inp-qty" placeholder="0" min="0">
                    </div>

                    <div class="form-group">
                        <label for="inp-price">Unit Price (₱)</label>
                        <input type="number" id="inp-price" placeholder="0.00" min="0" step="0.01">
                    </div>

                    <div class="form-group">
                        <label for="inp-image">Product Image</label>
                        <input type="file" id="inp-image" accept="image/*" onchange="previewImage(this)">
                        <div id="image-preview-wrap" style="display:none; margin-top:10px; text-align:center;">
                            <img id="image-preview" src="" alt="Preview"
                                style="max-width:100%; max-height:160px; border-radius:12px; border:1.5px solid var(--border); object-fit:cover;">
                        </div>
                    </div>

                </div>

                <div class="modal-footer">
                    <button class="btn-cancel" onclick="closeProductModal()">Cancel</button>
                    <button class="btn-primary" onclick="submitProduct()">Save Product</button>
                </div>

            </div>
        </div>`;

    // inject into the page
    document.body.appendChild(modal);
}

// call immediately so the modal exists in the DOM on page load
renderAddProductModal();