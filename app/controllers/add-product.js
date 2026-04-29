// app/controllers/add-product.js

// open the modal
function addProductModal() {
    clearForm();
    document.getElementById('add-product-overlay').classList.add('active');
}

// close the modal
function closeProductModal() {
    document.getElementById('add-product-overlay').classList.remove('active');
    clearForm();
}

// preview selected image before submitting
function previewImage(input) {
    const file = input.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        document.getElementById('image-preview').src            = e.target.result;
        document.getElementById('image-preview-wrap').style.display = 'block';
    };
    reader.readAsDataURL(file);
}

// submit the new product to the server
async function submitProduct() {
    const productCode = document.getElementById('inp-code').value.trim();
    const productName = document.getElementById('inp-name').value.trim();
    const quantity    = parseInt(document.getElementById('inp-qty').value)     || 0;
    const unitPrice   = parseFloat(document.getElementById('inp-price').value) || 0;

    if (!productCode || !productName) {
        showToast('Product Code and Product Name are required.', true);
        return;
    }

    let productImage = '';
    const fileInput  = document.getElementById('inp-image');
    if (fileInput.files[0]) {
        productImage = await toBase64(fileInput.files[0]);
    }

    try {
        const res  = await fetch('/api/inventory', {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({ productCode, productName, quantity, unitPrice, productImage })
        });
        const data = await res.json();

        if (data.success) {
            showToast(data.message);
            closeProductModal();
            loadInventory(); // refresh the grid so new product appears immediately
        } else {
            showToast(data.message, true);
        }
    } catch (e) {
        showToast('Failed to add product. Please try again.', true);
    }
}

// convert image file to base64 string
function toBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload  = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// clear all form inputs and hide image preview
function clearForm() {
    document.getElementById('inp-code').value  = '';
    document.getElementById('inp-name').value  = '';
    document.getElementById('inp-qty').value   = '';
    document.getElementById('inp-price').value = '';
    document.getElementById('inp-image').value = '';
    document.getElementById('image-preview').src                 = '';
    document.getElementById('image-preview-wrap').style.display  = 'none';
}

// close modal when clicking the backdrop
document.getElementById('add-product-overlay').addEventListener('click', function(e) {
    if (e.target === this) closeProductModal();
});