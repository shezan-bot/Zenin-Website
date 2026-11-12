// ----- product data
const products = [
  { id: 1, name: "Shadow Monarch Tee", price: 39.99, oldPrice: 69.99, discount: "SAVE43%", imagePlaceholder: "🖤 Shadow Tee", sizes: ["S","M","L","XL","XXL"], img: "images/shadow", categories: ["most-sold"] },
  { id: 2, name: "Solo Leveling - IGRIS Tshirt", price: 59.99, oldPrice: 109.99, discount: "SAVE45%", imagePlaceholder: "⚡ IGRIS Edition", sizes: ["S","M","L","XL"], img: "images/igris", categories: ["most-sold"] },
  { id: 3, name: "New Arrival: Toji Fushiguro Tshirt", price: 79.99, oldPrice: 134.99, discount: "SAVE41%", imagePlaceholder: "🐜 Toji Tee", sizes: ["M","L","XL","XXL"], img: "images/toji", categories: ["new-arrival"] },
  { id: 4, name: "Berserk Tshirt", price: 49.99, oldPrice: 67.99, discount: "SAVE26%", imagePlaceholder: "👑 Berserk Edition", sizes: ["S","M","L","XL"], img: "images/berserk", categories: ["new-arrival"] },
  { id: 5, name: "Madara Uchiha Tshirt", price: 44.99, oldPrice: 74.99, discount: "SAVE40%", imagePlaceholder: "🌙 Madara Edition", sizes: ["S","M","L","XL","XXL"], img: "images/madara", categories: ["new-arrival"] },
  { id: 6, name: "Naruto Uzumaki Tshirt", price: 39.99, oldPrice: 64.99, discount: "SAVE38%", imagePlaceholder: "🍥 Naruto Edition", sizes: ["S","M","L","XL","XXL"], img: "images/Naruto", categories: ["most-sold"] },
  { id: 7, name: "Itachi Uchiha Tshirt", price: 42.99, oldPrice: 69.99, discount: "SAVE39%", imagePlaceholder: "⚡ Sasuke Edition", sizes: ["S","M","L","XL","XXL"], img: "images/Itachi", categories: ["new-arrival"] },
  { id: 8, name: "Goku Ultra Instinct Tshirt", price: 44.99, oldPrice: 72.99, discount: "SAVE38%", imagePlaceholder: "🐉 Goku Edition", sizes: ["S","M","L","XL","XXL"], img: "images/Goku", categories: ["most-sold"] },
  { id: 9, name: "Japan Jersey World Cup Special", price: 66.99, oldPrice: 99.99, discount: "SAVE35%", imagePlaceholder: "🇯🇵 Japan Jersey", sizes: ["S","M","L","XL","XXL"], img: "images/Japan", categories: ["world-cup", "new-arrival"] },
  { id: 10, name: "Argentina Jersey World Cup Special", price: 69.99, oldPrice: 109.99, discount: "SAVE36%", imagePlaceholder: "🇦🇷 Argentina Jersey", sizes: ["S","M","L","XL","XXL"], img: "images/Argentina", categories: ["world-cup", "new-arrival"] },
  { id: 11, name: "Brazil Jersey World Cup Special ", price: 69.99, oldPrice: 109.99, discount: "SAVE36%", imagePlaceholder: "🇧🇷 Brazil Jersey", sizes: ["S","M","L","XL","XXL"], img: "images/Brazil", categories: ["world-cup", "new-arrival"] },
  { id: 12, name: "Germany Jersey World Cup Special ", price: 69.99, oldPrice: 109.99, discount: "SAVE36%", imagePlaceholder: "🇩🇪 Germany Jersey", sizes: ["S","M","L","XL","XXL"], img: "images/Germany", categories: ["world-cup", "new-arrival"] },
  { id: 13, name: "Portugal Jersey World Cup Special ", price: 64.99, oldPrice: 109.99, discount: "SAVE36%", imagePlaceholder: "🇵🇹 Portugal Jersey", sizes: ["S","M","L","XL","XXL"], img: "images/Portugal", categories: ["world-cup", "new-arrival"] },
];

const IMAGE_EXTENSIONS = ["png", "jpg", "jpeg", "webp", "avif", "gif", "svg", "PNG", "JPG", "JPEG"];

// --- cart state
let cart = [];
let currentProduct = null;
let selectedSize = null;
let currentSizesList = [];
let activeCategory = 'all';
let searchTerm = '';

// --- hero carousel state
let heroIndex = 0;
let heroIntervalId = null;

// ----- Helper Functions -----
function loadImageWithFallback(imgEl, baseSrc, placeholderText, onAllFail) {
  let attempt = 0;
  function tryNext() {
    if (attempt >= IMAGE_EXTENSIONS.length) {
      if (onAllFail) onAllFail();
      return;
    }
    imgEl.src = `${baseSrc}.${IMAGE_EXTENSIONS[attempt]}`;
    attempt++;
  }
  imgEl.onerror = tryNext;
  tryNext();
}

function matchesSearch(prod) {
  if (!searchTerm) return true;
  return prod.name.toLowerCase().includes(searchTerm.toLowerCase());
}

// ----- Build Product Card -----
function buildProductCard(prod) {
  const card = document.createElement('div');
  card.className = 'product-card';
  card.addEventListener('click', (e) => {
    e.stopPropagation();
    openProductModal(prod);
  });

  if (prod.categories && prod.categories.length) {
    const tag = document.createElement('div');
    tag.className = 'product-tag';
    const labelMap = { 'new-arrival': 'New Arrival', 'most-sold': 'Most Sold', 'world-cup': 'World Cup' };
    tag.innerText = labelMap[prod.categories[0]] || prod.categories[0];
    card.appendChild(tag);
  }

  const imgDiv = document.createElement('div');
  imgDiv.className = 'product-img';
  if (prod.img) {
    const img = document.createElement('img');
    img.alt = prod.name;
    img.loading = 'lazy';
    loadImageWithFallback(img, prod.img, prod.imagePlaceholder, () => {
      imgDiv.innerHTML = '';
      const span = document.createElement('div');
      span.style.cssText = 'width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:1.1rem;font-weight:bold;background:#e9e2d8;color:#5f5b55;';
      span.innerText = prod.imagePlaceholder + ' 🖼️';
      imgDiv.appendChild(span);
    });
    imgDiv.appendChild(img);
  } else {
    const span = document.createElement('div');
    span.style.cssText = 'width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:1.1rem;font-weight:bold;background:#e9e2d8;color:#5f5b55;';
    span.innerText = prod.imagePlaceholder + ' 🖼️';
    imgDiv.appendChild(span);
  }

  const infoDiv = document.createElement('div');
  infoDiv.className = 'product-info';
  infoDiv.innerHTML = `
    <div class="product-title">${prod.name}</div>
    <div class="price-row">
      <span class="old-price">$${prod.oldPrice.toFixed(2)}</span>
      <span class="new-price">$${prod.price.toFixed(2)}</span>
      <span class="save-badge">${prod.discount}</span>
    </div>
  `;

  card.appendChild(imgDiv);
  card.appendChild(infoDiv);
  return card;
}

// ----- Render Functions -----
function renderFeaturedGrid() {
  const grid = document.getElementById('featuredGrid');
  grid.innerHTML = '';
  const featured = products.filter(matchesSearch).slice(0, 4);
  if (featured.length === 0) {
    grid.innerHTML = '<div class="empty-state">No products match your search.</div>';
    return;
  }
  featured.forEach(prod => grid.appendChild(buildProductCard(prod)));
}

function renderProductGrid() {
  const grid = document.getElementById('productsGrid');
  grid.innerHTML = '';
  const filtered = products.filter(matchesSearch);
  if (filtered.length === 0) {
    grid.innerHTML = '<div class="empty-state">No products match your search.</div>';
    return;
  }
  filtered.forEach(prod => grid.appendChild(buildProductCard(prod)));
}

function renderCategoryGrid() {
  const grid = document.getElementById('categoryGrid');
  grid.innerHTML = '';
  const filtered = products.filter(p => {
    const catMatch = activeCategory === 'all' || (p.categories && p.categories.includes(activeCategory));
    return catMatch && matchesSearch(p);
  });
  if (filtered.length === 0) {
    grid.innerHTML = '<div class="empty-state">No products in this category yet.</div>';
    return;
  }
  filtered.forEach(prod => grid.appendChild(buildProductCard(prod)));
}

function renderAllGrids() {
  renderFeaturedGrid();
  renderProductGrid();
  renderCategoryGrid();
}

// ----- Hero Carousel -----
function renderHeroSlides() {
  const container = document.getElementById('heroSlidesContainer');
  container.innerHTML = '';
  products.forEach((prod, idx) => {
    const slide = document.createElement('div');
    slide.className = 'hero-slide' + (idx === heroIndex ? ' active' : '');
    slide.dataset.index = idx;
    
    const img = document.createElement('img');
    img.alt = prod.name;
    img.loading = 'lazy';
    
    loadImageWithFallback(img, prod.img, prod.imagePlaceholder, () => {
      slide.style.background = `linear-gradient(135deg, #2c2c38 0%, #121217 100%)`;
      slide.innerHTML = '';
      const fallbackDiv = document.createElement('div');
      fallbackDiv.style.cssText = 'width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:3rem;color:#e0b354;background:linear-gradient(135deg, #2c2c38 0%, #121217 100%);';
      fallbackDiv.innerText = prod.imagePlaceholder;
      slide.appendChild(fallbackDiv);
    });
    
    slide.appendChild(img);
    container.appendChild(slide);
  });
}

function renderHeroDots() {
  const dotsContainer = document.getElementById('heroDots');
  dotsContainer.innerHTML = '';
  products.forEach((p, idx) => {
    const dot = document.createElement('div');
    dot.className = 'hero-dot' + (idx === heroIndex ? ' active' : '');
    dot.addEventListener('click', (e) => {
      e.stopPropagation();
      goToHeroSlide(idx);
    });
    dotsContainer.appendChild(dot);
  });
}

function goToHeroSlide(index) {
  const slides = document.querySelectorAll('.hero-slide');
  slides.forEach((slide, idx) => {
    slide.classList.toggle('active', idx === index);
  });
  heroIndex = index;
  renderHeroDots();
  updateHeroText();
  restartHeroInterval();
}

function updateHeroText() {
  const prod = products[heroIndex];
  if (!prod) return;
  const heroText = document.getElementById('heroText');
  const heroBadge = document.getElementById('heroBadge');
  
  heroText.innerHTML = `
    <h2>⚡ ${prod.name.toUpperCase()}</h2>
    <p>$${prod.price.toFixed(2)} · ${prod.discount} · tap to view details</p>
  `;
  heroBadge.innerText = prod.categories && prod.categories[0] === 'world-cup' ? 'WORLD CUP SPECIAL' : 'LIMITED DROP';
}

function cycleHero() {
  const nextIndex = (heroIndex + 1) % products.length;
  goToHeroSlide(nextIndex);
}

function restartHeroInterval() {
  if (heroIntervalId) clearInterval(heroIntervalId);
  heroIntervalId = setInterval(cycleHero, 4000);
}

// ----- Modal Functions -----
function openProductModal(product) {
  currentProduct = product;
  selectedSize = null;
  currentSizesList = [...product.sizes];

  document.getElementById('modalProductTitle').innerText = product.name;
  document.getElementById('modalProductPrice').innerHTML = `<strong>$${product.price.toFixed(2)}</strong> <span style="color:#b45f1b;">${product.discount}</span>`;

  const imageSide = document.getElementById('modalImageSide');
  imageSide.innerHTML = '';
  if (product.img) {
    const img = document.createElement('img');
    img.alt = product.name;
    loadImageWithFallback(img, product.img, product.imagePlaceholder, () => {
      imageSide.innerHTML = '';
      const span = document.createElement('div');
      span.style.cssText = 'width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:1.1rem;font-weight:bold;color:#5f5b55;padding:1rem;text-align:center;';
      span.innerText = product.imagePlaceholder + ' 🖼️';
      imageSide.appendChild(span);
    });
    imageSide.appendChild(img);
  } else {
    const span = document.createElement('div');
    span.style.cssText = 'width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:1.1rem;font-weight:bold;color:#5f5b55;padding:1rem;text-align:center;';
    span.innerText = product.imagePlaceholder + ' 🖼️';
    imageSide.appendChild(span);
  }

  const sizeContainer = document.getElementById('sizeButtonsContainer');
  sizeContainer.innerHTML = '';
  currentSizesList.forEach(size => {
    const btn = document.createElement('button');
    btn.className = 'size-btn';
    btn.innerText = size;
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedSize = size;
      updatePayoutSection();
    });
    sizeContainer.appendChild(btn);
  });

  selectedSize = null;
  updatePayoutSection();

  document.getElementById('productModal').style.display = 'flex';
}

function updatePayoutSection() {
  if (!currentProduct) return;
  const unitPrice = currentProduct.price;
  const sizeText = selectedSize ? selectedSize : '— (please select)';
  const totalForItem = selectedSize ? unitPrice : 0;

  document.getElementById('payoutUnitPrice').innerText = `$${unitPrice.toFixed(2)}`;
  document.getElementById('payoutSizeDisplay').innerHTML = sizeText;
  document.getElementById('payoutTotal').innerHTML = `$${totalForItem.toFixed(2)}`;
  document.getElementById('payoutTotal').style.color = selectedSize ? '#1e1e2a' : '#b45f1b';
}

function closeModal() {
  document.getElementById('productModal').style.display = 'none';
  currentProduct = null;
  selectedSize = null;
}

function addCurrentToCart() {
  if (!currentProduct) return;
  if (!selectedSize) {
    alert("⚠️ Please select a size before adding to cart.");
    return;
  }
  const existingItem = cart.find(item => item.id === currentProduct.id && item.size === selectedSize);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: currentProduct.id,
      name: currentProduct.name,
      price: currentProduct.price,
      size: selectedSize,
      quantity: 1
    });
  }
  updateCartUI();
  closeModal();
  alert(`✨ Added ${currentProduct.name} (Size: ${selectedSize}) to cart!`);
}

// ----- Cart Functions -----
function updateCartUI() {
  const cartItemsDiv = document.getElementById('cartItemsList');
  const cartCountSpan = document.getElementById('cartCount');
  const cartCountTop = document.getElementById('cartCountTop');
  const cartTotalSpan = document.getElementById('cartTotalDisplay');
  let totalItems = 0;
  let totalPrice = 0;

  if (cart.length === 0) {
    cartItemsDiv.innerHTML = '<div style="color: #aaa; text-align:center;">Cart is empty</div>';
    cartCountSpan.innerText = '0';
    cartCountTop.innerText = '0';
    cartTotalSpan.innerText = 'Total: $0.00';
    return;
  }

  let itemsHtml = '';
  cart.forEach((item, idx) => {
    const itemTotal = item.price * item.quantity;
    totalItems += item.quantity;
    totalPrice += itemTotal;
    itemsHtml += `
      <div class="cart-item">
        <span><strong>${item.name}</strong> (${item.size}) x${item.quantity}</span>
        <span>$${itemTotal.toFixed(2)}
          <button style="background:#ddd; border:none; border-radius:20px; margin-left:10px; padding:2px 8px; cursor:pointer; flex:none;" class="remove-item-btn" data-index="${idx}">🗑️</button>
        </span>
      </div>
    `;
  });
  cartItemsDiv.innerHTML = itemsHtml;
  cartCountSpan.innerText = totalItems;
  cartCountTop.innerText = totalItems;
  cartTotalSpan.innerText = `Total: $${totalPrice.toFixed(2)}`;

  document.querySelectorAll('.remove-item-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const idx = parseInt(btn.getAttribute('data-index'));
      if (!isNaN(idx)) {
        cart.splice(idx, 1);
        updateCartUI();
      }
      e.stopPropagation();
    });
  });
}

function handleCheckout() {
  if (cart.length === 0) {
    alert("Your cart is empty! Add some awesome items first.");
    return;
  }
  let totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  let itemList = cart.map(item => `${item.name} (${item.size}) x${item.quantity} = $${(item.price * item.quantity).toFixed(2)}`).join('\n');
  let message = `🛍️ ORDER SUMMARY:\n${itemList}\n\n💵 TOTAL: $${totalAmount.toFixed(2)}\n\n✅ Proceed with payout? (Demo mode)`;
  if (confirm(message + "\n\nClick OK to complete test payment.")) {
    alert("🎉 Payment successful! Thank you for your order. (Project demo)");
    cart = [];
    updateCartUI();
    closeModal();
  }
}

// ----- Navigation -----
function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active-link'));
  const activeLink = document.querySelector(`.nav-links a[data-target="${id}"]`);
  if (activeLink) activeLink.classList.add('active-link');
}

// ----- Dark Mode -----
function applyTheme(theme) {
  const toggleBtn = document.getElementById('darkModeToggle');
  if (theme === 'dark') {
    document.body.classList.add('dark-mode');
    if (toggleBtn) toggleBtn.innerText = '☀️';
  } else {
    document.body.classList.remove('dark-mode');
    if (toggleBtn) toggleBtn.innerText = '🌙';
  }
}

function initTheme() {
  const saved = localStorage.getItem('zeninTheme');
  applyTheme(saved === 'dark' ? 'dark' : 'light');
}

function toggleTheme() {
  const isDark = document.body.classList.contains('dark-mode');
  const next = isDark ? 'light' : 'dark';
  applyTheme(next);
  localStorage.setItem('zeninTheme', next);
}

// ----- Auth Functions -----
function openAuthModal(mode) {
  const modal = document.getElementById('authModal');
  switchAuthTab(mode || 'login');
  modal.style.display = 'flex';
  requestAnimationFrame(() => modal.classList.add('show'));
}

function closeAuthModal() {
  const modal = document.getElementById('authModal');
  modal.classList.remove('show');
  setTimeout(() => { modal.style.display = 'none'; }, 300);
}

function switchAuthTab(mode) {
  document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active-auth-tab'));
  document.querySelector(`.auth-tab[data-auth="${mode}"]`).classList.add('active-auth-tab');
  document.getElementById('loginForm').classList.toggle('active-form', mode === 'login');
  document.getElementById('signupForm').classList.toggle('active-form', mode === 'signup');
  document.getElementById('authModalTitle').innerText = mode === 'login' ? 'Welcome Back' : 'Create Your Account';
}

function renderAuthArea() {
  const authArea = document.getElementById('authArea');
  const savedUser = JSON.parse(localStorage.getItem('zeninUser') || 'null');
  authArea.innerHTML = '';
  if (savedUser) {
    const chip = document.createElement('div');
    chip.className = 'user-chip';
    chip.innerHTML = `👤 ${savedUser.name.split(' ')[0]} <button id="logoutBtn">Log Out</button>`;
    authArea.appendChild(chip);
    document.getElementById('logoutBtn').addEventListener('click', () => {
      localStorage.removeItem('zeninUser');
      renderAuthArea();
    });
  } else {
    const btn = document.createElement('button');
    btn.className = 'auth-btn';
    btn.innerText = '👤 Log In';
    btn.addEventListener('click', () => openAuthModal('login'));
    authArea.appendChild(btn);
  }
}

function handleFakeLogin(e) {
  e.preventDefault();
  const email = e.target.querySelector('input[type="email"]').value;
  const fakeUser = { name: email.split('@')[0], email };
  localStorage.setItem('zeninUser', JSON.stringify(fakeUser));
  renderAuthArea();
  closeAuthModal();
  e.target.reset();
  alert(`✨ Welcome back, ${fakeUser.name}! (demo login — no real account)`);
}

function handleFakeSignup(e) {
  e.preventDefault();
  const name = e.target.querySelector('input[type="text"]').value;
  const email = e.target.querySelector('input[type="email"]').value;
  const fakeUser = { name: name || email.split('@')[0], email };
  localStorage.setItem('zeninUser', JSON.stringify(fakeUser));
  renderAuthArea();
  closeAuthModal();
  e.target.reset();
  alert(`🎉 Account created! Welcome, ${fakeUser.name}. (demo signup — no real account)`);
}

// ----- DOMContentLoaded -----
document.addEventListener('DOMContentLoaded', () => {
  renderHeroSlides();
  renderHeroDots();
  updateHeroText();
  restartHeroInterval();
  
  renderAllGrids();
  updateCartUI();
  initTheme();
  renderAuthArea();

  // Modal events
  document.getElementById('closeModalBtn').addEventListener('click', closeModal);
  document.getElementById('cancelModalBtn').addEventListener('click', closeModal);
  document.getElementById('addToCartBtn').addEventListener('click', addCurrentToCart);
  document.getElementById('checkoutBtn').addEventListener('click', handleCheckout);

  document.getElementById('productModal').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeModal();
  });

  // Dark mode toggle
  document.getElementById('darkModeToggle').addEventListener('click', toggleTheme);

  // Auth modal
  document.getElementById('closeAuthModalBtn').addEventListener('click', closeAuthModal);
  document.getElementById('authModal').addEventListener('click', (e) => {
    if (e.target.id === 'authModal') closeAuthModal();
  });
  document.querySelectorAll('.auth-tab').forEach(tab => {
    tab.addEventListener('click', () => switchAuthTab(tab.getAttribute('data-auth')));
  });
  document.getElementById('loginForm').addEventListener('submit', handleFakeLogin);
  document.getElementById('signupForm').addEventListener('submit', handleFakeSignup);

  // Category tabs
  document.querySelectorAll('.cat-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.cat-tab').forEach(t => t.classList.remove('active-tab'));
      tab.classList.add('active-tab');
      activeCategory = tab.getAttribute('data-cat');
      renderCategoryGrid();
    });
  });

  // Search
  document.getElementById('searchInput').addEventListener('input', (e) => {
    searchTerm = e.target.value.trim();
    renderAllGrids();
  });

  // Contact form
  document.getElementById('contactForm').addEventListener('submit', (e) => {
    e.preventDefault();
    alert('✅ Thanks for reaching out! This is a demo form — connect it to your email or a form service to receive real messages.');
    e.target.reset();
  });
});

// ----- Expose functions globally -----
window.updateCartUI = updateCartUI;
window.scrollToSection = scrollToSection;