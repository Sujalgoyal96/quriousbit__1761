let cart = [];

function addToCart(product) {
    const existingProduct = cart.find(item => item.id === product.id);
    if (existingProduct) {
        existingProduct.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    renderCart();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    renderCart();
}

function renderCart() {
    const cartTableBody = document.querySelector('#cart-items tbody');
    const totalAmount = document.getElementById('total-amount');
    cartTableBody.innerHTML = '';

    let total = 0;

    cart.forEach(item => {
        const productTotal = item.price * item.quantity;
        total += productTotal;

        const row = `
            <tr>
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>$${item.price.toFixed(2)}</td>
                <td>$${productTotal.toFixed(2)}</td>
                <td><button onclick="removeFromCart('${item.id}')">Remove</button></td>
            </tr>
        `;
        cartTableBody.insertAdjacentHTML('beforeend', row);
    });

    totalAmount.innerText = total.toFixed(2);
}

// Function to handle checkout with discount application
function checkout() {
    let total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Apply discounts
    cart.forEach(item => {
        if (item.category === 'Fashion' && item.quantity >= 2) {
            total -= item.price; // Buy 1 Get 1 Free
        }
        if (item.category === 'Electronics') {
            total -= (item.price * item.quantity) * 0.1; // 10% off on electronics
        }
    });

    // Show final total
    document.getElementById('final-total').innerText = total.toFixed(2);
    document.getElementById('checkout-summary').style.display = 'block';
}

// Function to convert total to different currencies
function convertCurrency() {
    const finalTotal = parseFloat(document.getElementById('final-total').innerText);
    const convertedToEUR = (finalTotal * 0.85).toFixed(2);
    const convertedToGBP = (finalTotal * 0.75).toFixed(2);
    document.getElementById('converted-total').innerHTML = `
        EUR: €${convertedToEUR}<br>
        GBP: £${convertedToGBP}
    `;
}

// Add event listeners to buttons
document.querySelectorAll('.add-to-cart-btn').forEach(button => {
    button.addEventListener('click', event => {
        const productDiv = event.target.closest('.product');
        const product = {
            id: productDiv.dataset.id,
            name: productDiv.dataset.name,
            price: parseFloat(productDiv.dataset.price),
            category: productDiv.dataset.category
        };
        addToCart(product);
    });
});

document.getElementById('checkout-btn').addEventListener('click', checkout);
document.getElementById('convert-currency-btn').addEventListener('click', convertCurrency);