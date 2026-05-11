// ---------- INITIAL DATA ----------
let products = [
  { id: 1, brand: "Apple", name: "iPhone 16 Pro Max 256GB", price: 89990, image: "PRO", badge: "NEW" },
  { id: 2, brand: "Samsung", name: "Galaxy S25 Ultra 256GB", price: 79990, image: "PRO", badge: "HOT" },
  { id: 3, brand: "Apple", name: "AirPods Pro 2", price: 14490, image: "PRO", badge: "SALE" },
  { id: 4, brand: "Apple", name: "MacBook Air M3", price: 74990, image: "PRO", badge: "TOP" }
];

let testimonials = [
  { id: 1, author: "Maria R.", text: "Super fast delivery! Received my iPhone 16 Pro within 24hrs. Legit store!", imageUrl: "https://picsum.photos/id/20/400/250", rating: 5 },
  { id: 2, author: "John Paul C.", text: "First time buying from Maharlika, they gave free tempered glass and 1yr warranty. Highly recommended!", imageUrl: "https://picsum.photos/id/26/400/250", rating: 5 },
  { id: 3, author: "Kristine A.", text: "Legit Samsung dealer. They even helped me with 0% installment. Will order again!", imageUrl: "https://picsum.photos/id/133/400/250", rating: 4.8 }
];

let cart = [];

// ---------- PERSISTENCE ----------
function loadData() {
  const storedProducts = localStorage.getItem("maharlika_products");
  if(storedProducts) products = JSON.parse(storedProducts);
  
  const storedTestimonials = localStorage.getItem("maharlika_testimonials");
  if(storedTestimonials) testimonials = JSON.parse(storedTestimonials);
}

function saveProducts() { localStorage.setItem("maharlika_products", JSON.stringify(products)); }
function saveTestimonials() { localStorage.setItem("maharlika_testimonials", JSON.stringify(testimonials)); }

// ---------- INITIALIZATION ----------
document.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('js-active');
  loadData();
  renderProducts();
  renderTestimonials();
  updateCartUI();
  initMap();
  initRevealObserver();
  initAnimations();
  initNavScroll();
  
  // Force Reveal Fail-safe
  setTimeout(() => {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
    document.body.style.opacity = '1';
  }, 1000);
});

// ---------- NAV ANIMATION ----------
function initNavScroll() {
  const nav = document.getElementById('mainNav');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  });
}

// ---------- RENDERERS ----------
function renderProducts() {
  const grid = document.getElementById('productsGrid');
  if(!grid) return;
  grid.innerHTML = products.map(p => `
    <div class="product-card reveal">
      <div class="product-img">
        <span style="font-size:1.2rem; font-weight:800; color:var(--gold); opacity:0.3;">${p.image.length < 5 ? p.image : `<img src="${p.image}" alt="${p.name}">`}</span>
        <span class="badge-tag">${p.badge || 'PRO'}</span>
      </div>
      <div class="product-info">
        <div class="product-brand">${p.brand}</div>
        <div class="product-name">${p.name}</div>
        <div class="price-row">
          <div><span class="current-price">₱${p.price.toLocaleString()}</span></div>
          <button class="add-to-cart" data-id="${p.id}">+ Add</button>
        </div>
      </div>
    </div>
  `).join('');
  
  document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', () => addToCart(parseInt(btn.dataset.id)));
  });
}

function renderTestimonials() {
  const grid = document.getElementById('testimonialsGrid');
  if(!grid) return;
  grid.innerHTML = testimonials.map(t => `
    <div class="testimonial-card reveal">
      <div class="rating-stars">${'★'.repeat(Math.floor(t.rating))}${t.rating % 1 ? '½' : ''} (${t.rating})</div>
      <div class="testimonial-proof-img">
        ${t.imageUrl ? `<img src="${t.imageUrl}" alt="Proof of purchase" onerror="this.src='https://picsum.photos/id/1/400/250'">` : '<div style="padding:2rem;">📸 Customer proof</div>'}
      </div>
      <p class="testimonial-text">"${t.text}"</p>
      <div class="testimonial-author">— ${t.author}</div>
    </div>
  `).join('');
}

// ---------- CART LOGIC ----------
function addToCart(id) {
  const product = products.find(p => p.id === id);
  if(!product) return;
  const existing = cart.find(i => i.id === id);
  if(existing) existing.qty++;
  else cart.push({ ...product, qty: 1 });
  updateCartUI();
  showToast(`${product.name} added to cart`);
}

function updateCartUI() {
  const totalQty = cart.reduce((s,i) => s + i.qty, 0);
  const totalPrice = cart.reduce((s,i) => s + (i.price * i.qty), 0);
  
  document.getElementById('cartCountDisplay').innerText = totalQty;
  document.getElementById('cartTotalPrice').innerHTML = `₱${totalPrice.toLocaleString()}`;
  
  const container = document.getElementById('cartItemsList');
  if(!container) return;
  
  if(cart.length === 0) {
    container.innerHTML = '<div style="padding:2rem;text-align:center;color:var(--text-mid);">Your cart is empty</div>';
    return;
  }
  
  container.innerHTML = cart.map(item => `
    <div style="display:flex; gap:12px; margin-bottom:1.2rem; align-items:center; border-bottom:1px solid var(--border-light); padding-bottom:12px;">
      <div style="font-size:2rem;">${item.image.length < 5 ? item.image : '📦'}</div>
      <div style="flex:1">
        <strong style="font-size:0.9rem;">${item.name}</strong><br>
        <span style="color:var(--gold); font-weight:600;">₱${item.price.toLocaleString()}</span>
      </div>
      <div style="display:flex; align-items:center; gap:8px;">
        <button class="qty-mod" data-id="${item.id}" data-delta="-1" style="width:24px;height:24px;border-radius:50%;border:1px solid #ddd;background:white;cursor:pointer;">-</button>
        <span style="font-weight:600;">${item.qty}</span>
        <button class="qty-mod" data-id="${item.id}" data-delta="1" style="width:24px;height:24px;border-radius:50%;border:1px solid #ddd;background:white;cursor:pointer;">+</button>
      </div>
    </div>
  `).join('');
  
  document.querySelectorAll('.qty-mod').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.id);
      const delta = parseInt(btn.dataset.delta);
      const idx = cart.findIndex(i => i.id === id);
      if(idx !== -1) {
        cart[idx].qty += delta;
        if(cart[idx].qty <= 0) cart.splice(idx,1);
        updateCartUI();
      }
    });
  });
}

// ---------- ADMIN LOGIC ----------
const modal = document.getElementById('adminModal');
const loginPanel = document.getElementById('adminLoginPanel');
const dashboard = document.getElementById('adminDashboard');

document.getElementById('adminNavBtn').addEventListener('click', (e) => {
  e.preventDefault();
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  makeDraggable(document.querySelector('.modal-content'));
});

// ---------- DRAGGABLE LOGIC ----------
function makeDraggable(el) {
  let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  const header = el.querySelector('.admin-header') || el;
  header.style.cursor = 'move';
  header.onmousedown = dragMouseDown;

  function dragMouseDown(e) {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'BUTTON') return;
    e.preventDefault();
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e.preventDefault();
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    el.style.top = (el.offsetTop - pos2) + "px";
    el.style.left = (el.offsetLeft - pos1) + "px";
    el.style.transform = 'none'; // Clear centering once dragged
    el.style.margin = '0';
  }

  function closeDragElement() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

document.getElementById('loginAdminBtn').addEventListener('click', () => {
  const pwd = document.getElementById('adminPassword').value;
  if(pwd === 'admin123') {
    document.getElementById('adminLoginPanel').style.display = 'none';
    document.getElementById('adminDashboard').style.display = 'block';
    refreshAdminLists();
  } else {
    showToast('Access Denied');
  }
});

// ---------- ADMIN TAB SWITCHING ----------
window.switchAdminTab = function(tab, btn) {
  // Hide all contents
  document.querySelectorAll('.admin-tab-content').forEach(c => {
    c.style.display = 'none';
    c.classList.remove('active');
  });
  // Deactivate all buttons
  document.querySelectorAll('.admin-nav-item').forEach(i => i.classList.remove('active'));
  
  // Show target
  const target = document.getElementById(`tab-${tab}`);
  if(target) {
    target.style.display = 'block';
    target.classList.add('active');
  }
  if(btn) btn.classList.add('active');
}

document.getElementById('logoutAdminBtn').addEventListener('click', () => {
  dashboard.style.display = 'none';
  loginPanel.style.display = 'block';
  document.getElementById('adminPassword').value = '';
  modal.style.display = 'none';
  document.body.style.overflow = '';
});

function refreshAdminLists() {
  // Products Admin
  const prodListDiv = document.getElementById('adminProductList');
  prodListDiv.innerHTML = products.map(p => `
    <div class="admin-item">
      <span><strong>${p.name}</strong> (₱${p.price.toLocaleString()})</span>
      <div>
        <button class="btn-small edit-product" data-id="${p.id}"><i class="fas fa-edit"></i></button>
        <button class="btn-danger delete-product" data-id="${p.id}"><i class="fas fa-trash"></i></button>
      </div>
    </div>
  `).join('');
  
  // Testimonials Admin
  const testListDiv = document.getElementById('adminTestimonialList');
  testListDiv.innerHTML = testimonials.map(t => `
    <div class="admin-item">
      <span><strong>${t.author}</strong></span>
      <div>
        <button class="btn-small edit-testimonial" data-id="${t.id}"><i class="fas fa-edit"></i></button>
        <button class="btn-danger delete-testimonial" data-id="${t.id}"><i class="fas fa-trash"></i></button>
      </div>
    </div>
  `).join('');
  
  attachAdminEvents();
}

function attachAdminEvents() {
  document.querySelectorAll('.delete-product').forEach(btn => {
    btn.addEventListener('click', () => {
      products = products.filter(p => p.id !== parseInt(btn.dataset.id));
      saveProducts(); renderProducts(); refreshAdminLists(); showToast('Product removed');
    });
  });
  
  document.querySelectorAll('.edit-product').forEach(btn => {
    btn.addEventListener('click', () => {
      const p = products.find(p => p.id === parseInt(btn.dataset.id));
      if(p) {
        document.getElementById('prodName').value = p.name;
        document.getElementById('prodBrand').value = p.brand;
        document.getElementById('prodPrice').value = p.price;
        document.getElementById('prodImageUrl').value = p.image;
        document.getElementById('prodBadge').value = p.badge;
        window.editingProductId = p.id;
      }
    });
  });
  
  document.querySelectorAll('.delete-testimonial').forEach(btn => {
    btn.addEventListener('click', () => {
      testimonials = testimonials.filter(t => t.id !== parseInt(btn.dataset.id));
      saveTestimonials(); renderTestimonials(); refreshAdminLists(); showToast('Testimonial removed');
    });
  });

  document.querySelectorAll('.edit-testimonial').forEach(btn => {
    btn.addEventListener('click', () => {
      const t = testimonials.find(t => t.id === parseInt(btn.dataset.id));
      if(t) {
        document.getElementById('testimAuthor').value = t.author;
        document.getElementById('testimText').value = t.text;
        document.getElementById('testimImageUrl').value = t.imageUrl;
        document.getElementById('testimRating').value = t.rating;
        window.editingTestimonialId = t.id;
      }
    });
  });
}

// ---------- STORE MANAGER (ADMIN) ----------
const ADMIN_PASS = "admin123";

// Helper to convert file to Base64
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    if (!file) return resolve("");
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

document.getElementById('addProductBtn').addEventListener('click', async () => {
  const name = document.getElementById('prodName').value.trim();
  const brand = document.getElementById('prodBrand').value.trim();
  const price = parseFloat(document.getElementById('prodPrice').value);
  const badge = document.getElementById('prodBadge').value.trim();
  const fileInput = document.getElementById('prodImageFile');
  
  if(!name || isNaN(price)) return showToast('Name and price required');
  
  const imageBase64 = await fileToBase64(fileInput.files[0]);

  if(window.editingProductId) {
    const idx = products.findIndex(p => p.id === window.editingProductId);
    if(idx !== -1) {
      products[idx] = { 
        ...products[idx], 
        name, 
        brand: brand || "Maharlika", 
        price, 
        badge,
        image: imageBase64 || products[idx].image 
      };
    }
    window.editingProductId = null;
  } else {
    products.push({ 
      id: Date.now(), 
      name, 
      brand: brand || "Maharlika", 
      price, 
      badge,
      image: imageBase64 || "📱" 
    });
  }
  
  saveProducts(); 
  renderProducts(); 
  refreshAdminLists();
  
  ['prodName','prodBrand','prodPrice','prodBadge'].forEach(id => document.getElementById(id).value = '');
  fileInput.value = "";
  showToast('Product saved');
});

document.getElementById('addTestimonialBtn').addEventListener('click', async () => {
  const author = document.getElementById('testimAuthor').value.trim();
  const text = document.getElementById('testimText').value.trim();
  const rating = parseFloat(document.getElementById('testimRating').value) || 5;
  const fileInput = document.getElementById('testimImageFile');
  
  if(!author || !text) return showToast('Name and feedback required');

  const imageBase64 = await fileToBase64(fileInput.files[0]);
  
  if(window.editingTestimonialId) {
    const idx = testimonials.findIndex(t => t.id === window.editingTestimonialId);
    if(idx !== -1) {
      testimonials[idx] = { 
        ...testimonials[idx], 
        author, 
        text, 
        rating,
        image: imageBase64 || testimonials[idx].image 
      };
    }
    window.editingTestimonialId = null;
  } else {
    testimonials.push({ 
      id: Date.now(), 
      author, 
      text, 
      rating,
      image: imageBase64 || "" 
    });
  }
  
  saveTestimonials(); 
  renderTestimonials(); 
  refreshAdminLists();
  
  ['testimAuthor','testimText','testimRating'].forEach(id => document.getElementById(id).value = '');
  fileInput.value = "";
  showToast('Testimonial saved');
});

// ---------- UI HELPERS ----------
function showToast(msg) {
  const t = document.getElementById('toastMsg');
  t.innerText = msg;
  t.style.opacity = '1';
  t.style.transform = 'translate(-50%, -10px)';
  setTimeout(() => {
    t.style.opacity = '0';
    t.style.transform = 'translateX(-50%)';
  }, 2500);
}

document.getElementById('cartBtn').addEventListener('click', () => {
  document.getElementById('cartDrawer').classList.add('open');
  document.getElementById('cartOverlay').classList.add('active');
});

document.getElementById('closeCartBtn').addEventListener('click', closeCart);
document.getElementById('cartOverlay').addEventListener('click', closeCart);

function closeCart() {
  document.getElementById('cartDrawer').classList.remove('open');
  document.getElementById('cartOverlay').classList.remove('active');
}

document.getElementById('shopNowBtn').addEventListener('click', () => {
  document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
});

// ---------- MAP ----------
function initMap() {
  const map = L.map('map', { scrollWheelZoom: false }).setView([7.0707, 125.6087], 15);
  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; CartoDB'
  }).addTo(map);
  L.marker([7.0707, 125.6087]).addTo(map).bindPopup('<b>Maharlika Republic</b><br>Ilustre St, Davao City').openPopup();
}

// ---------- ANIMATIONS ----------
function initRevealObserver() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if(e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

function initAnimations() {
  if(typeof gsap !== 'undefined') {
    gsap.from('.hero-text > *', { opacity: 0, y: 30, stagger: 0.2, duration: 1, ease: 'power3.out' });
    gsap.from('.hero-visual', { opacity: 0, scale: 0.9, duration: 1.2, ease: 'power3.out', delay: 0.5 });
  }
}
