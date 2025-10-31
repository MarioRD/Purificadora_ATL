/* JavaScript for cart and interactions */
// Carrito de compras
let cart = [];

// Elementos
const cartIcon = document.getElementById('cart-icon');
const cartModal = document.getElementById('cart-modal');
const closeCart = document.getElementById('close-cart');
const cartItems = document.getElementById('cart-items');
const cartCount = document.getElementById('cart-count');
const cartTotal = document.getElementById('cart-total');
const addToCartButtons = document.querySelectorAll('.add-to-cart');
const sendOrderButton = document.getElementById('send-order');

// Mostrar u ocultar carrito
cartIcon && cartIcon.addEventListener('click', () => {
  cartModal.classList.remove('hidden');
  renderCart();
});

closeCart && closeCart.addEventListener('click', () => {
  cartModal.classList.add('hidden');
});

// Agregar productos al carrito
addToCartButtons.forEach(button => {
  button.addEventListener('click', () => {
    const name = button.getAttribute('data-name');
    const price = parseFloat(button.getAttribute('data-price'));

    const existingItem = cart.find(item => item.name === name);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ name, price, quantity: 1 });
    }
    updateCart();
  });
});

// Actualizar el carrito
function updateCart() {
  cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);
  renderCart();
}

// Renderizar items
function renderCart() {
  if (!cartItems) return;
  if (cart.length === 0) {
    cartItems.innerHTML = '<p class="text-gray-500 text-center py-4">Tu carrito está vacío</p>';
    cartTotal.textContent = '$0.00';
    return;
  }

  let itemsHTML = '';
  let total = 0;

  cart.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;
    itemsHTML += `
      <div class="flex justify-between items-center py-2 border-b">
        <div>
          <h4 class="font-medium">${item.name}</h4>
          <p class="text-sm text-gray-600">${item.price.toFixed(2)} c/u</p>
        </div>
        <div class="flex items-center">
          <button class="decrease-quantity px-2 text-gray-500 hover:text-blue-600" data-index="${index}">-</button>
          <span class="mx-2">${item.quantity}</span>
          <button class="increase-quantity px-2 text-gray-500 hover:text-blue-600" data-index="${index}">+</button>
          <span class="ml-4 font-medium">${itemTotal.toFixed(2)}</span>
        </div>
      </div>
    `;
  });

  cartItems.innerHTML = itemsHTML;
  cartTotal.textContent = `$${total.toFixed(2)}`;

  document.querySelectorAll('.decrease-quantity').forEach(button => {
    button.addEventListener('click', (e) => {
      const index = e.target.getAttribute('data-index');
      if (cart[index].quantity > 1) {
        cart[index].quantity -= 1;
      } else {
        cart.splice(index, 1);
      }
      updateCart();
    });
  });

  document.querySelectorAll('.increase-quantity').forEach(button => {
    button.addEventListener('click', (e) => {
      const index = e.target.getAttribute('data-index');
      cart[index].quantity += 1;
      updateCart();
    });
  });
}

// Enviar pedido por WhatsApp
sendOrderButton && sendOrderButton.addEventListener('click', () => {
  const name = document.getElementById('customer-name').value.trim();
  const phone = document.getElementById('customer-phone').value.trim();
  const address = document.getElementById('customer-address').value.trim();

  if (!name || !phone) {
    alert('Por favor ingresa tu nombre y teléfono');
    return;
  }

  if (cart.length === 0) {
    alert('Tu carrito está vacío');
    return;
  }

  let message = `Hola, quiero hacer un pedido:\n\n*Cliente:* ${name}\n*Teléfono:* ${phone}\n`;
  if (address) {
    message += `*Dirección:* ${address}\n\n`;
  }
  message += '*Pedido:*\n';
  cart.forEach(item => {
    message += `- ${item.name}: ${item.quantity} x ${item.price.toFixed(2)} = ${(item.quantity * item.price).toFixed(2)}\n`;
  });
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  message += `\n*Total:* $${total.toFixed(2)}`;
  const whatsappUrl = `https://wa.me/5215544897399?text=${encodeURIComponent(message)}`;
  window.open(whatsappUrl, '_blank');
});

// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    target && target.scrollIntoView({ behavior: 'smooth' });
  });
});

// Mobile menu (placeholder)
document.querySelectorAll('.md\:hidden').forEach(el => {
  el.addEventListener('click', function() {
    alert('Menú móvil: En una implementación real, esto mostraría/ocultaría el menú');
  });
});