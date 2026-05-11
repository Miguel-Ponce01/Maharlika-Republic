gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
    // --- Elements ---
    const products = document.querySelectorAll(".product");
    const modal = document.getElementById("modalOverlay");
    const modalName = document.getElementById("modalName");
    const modalPrice = document.getElementById("modalPrice");
    const modalImg = document.getElementById("modalImg");
    const modalClose = document.getElementById("modalClose");
    const addToCartBtn = document.getElementById("addToCart");

    const searchBtn = document.getElementById("searchBtn");
    const searchOverlay = document.getElementById("searchOverlay");
    const searchClose = document.getElementById("searchClose");

    const cartBtn = document.getElementById("cartBtn");
    const cartSidebar = document.getElementById("cartSidebar");
    const cartClose = document.getElementById("cartClose");
    const cartCount = document.getElementById("cartCount");
    const cartItems = document.getElementById("cartItems");

    let cart = [];

    // --- Product Modal Logic ---
    products.forEach(product => {
        product.addEventListener("click", () => {
            const name = product.dataset.name;
            const price = product.dataset.price;
            const img = product.dataset.img;

            modalName.textContent = name;
            modalPrice.textContent = "₱" + price;
            modalImg.style.backgroundImage = `url('${img}')`;
            modal.classList.add("active");

            addToCartBtn.onclick = () => {
                cart.push({ name, price, img });
                updateCart();
                modal.classList.remove("active");
                cartSidebar.classList.add("active");
            };
        });
    });

    modalClose.onclick = () => modal.classList.remove("active");
    window.onclick = (e) => {
        if (e.target == modal) modal.classList.remove("active");
    };

    // --- Cart Logic ---
    function updateCart() {
        cartCount.textContent = cart.length;
        if (cart.length === 0) {
            cartItems.innerHTML = '<p style="text-align:center; color:#86868b; margin-top:40px;">Bag is empty.</p>';
        } else {
            cartItems.innerHTML = cart.map((item, i) => `
                <div style="display:flex; gap:16px; margin-bottom:20px; align-items:center;">
                    <img src="${item.img}" style="width:60px; height:60px; border-radius:8px; object-fit:cover;">
                    <div style="flex:1;">
                        <div style="font-weight:600; font-size:14px;">${item.name}</div>
                        <div style="font-size:12px; color:#86868b;">₱${item.price}</div>
                    </div>
                    <span onclick="removeFromCart(${i})" style="cursor:pointer;">✕</span>
                </div>
            `).join('');
        }
    }

    window.removeFromCart = (i) => {
        cart.splice(i, 1);
        updateCart();
    };

    cartBtn.onclick = () => cartSidebar.classList.add("active");
    cartClose.onclick = () => cartSidebar.classList.remove("active");

    // --- Search Overlay & Filter ---
    const searchInput = searchOverlay.querySelector("input");
    
    searchBtn.onclick = () => {
        searchOverlay.classList.add("active");
        searchInput.focus();
    };
    
    searchClose.onclick = () => {
        searchOverlay.classList.remove("active");
        searchInput.value = "";
        filterProducts("");
    };

    searchInput.oninput = (e) => {
        filterProducts(e.target.value);
    };

    function filterProducts(query) {
        const q = query.toLowerCase();
        products.forEach(p => {
            const name = p.dataset.name.toLowerCase();
            if (name.includes(q)) {
                p.style.display = "block";
            } else {
                p.style.display = "none";
            }
        });
    }

    // --- GSAP ANIMATIONS ---

    // Navbar Scroll
    gsap.to(".navbar", {
        background: "rgba(255, 255, 255, 0.9)",
        backdropFilter: "blur(20px)",
        boxShadow: "0 1px 0 rgba(0,0,0,0.05)",
        scrollTrigger: {
            trigger: "body",
            start: "top -50",
            toggleActions: "play none none reverse"
        }
    });

    // Hero Section
    const tlHero = gsap.timeline({ defaults: { ease: "power3.out" } });
    tlHero.from(".hero-title", { y: 100, opacity: 0, duration: 1.2 })
          .from(".hero-subtitle", { y: 30, opacity: 0, duration: 0.8 }, "-=0.8")
          .from(".btn-hero", { y: 20, opacity: 0, duration: 0.8 }, "-=0.4");

    // Parallax Hero
    gsap.to(".hero-bg", {
        yPercent: 30,
        ease: "none",
        scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "bottom top",
            scrub: true
        }
    });

    // Collections Grid (Staggered)
    gsap.from(".card", {
        scrollTrigger: {
            trigger: ".collections-grid",
            start: "top 85%",
        },
        y: 60,
        opacity: 0,
        stagger: 0.2,
        duration: 1,
        ease: "power2.out"
    });

    // Products Grid (Staggered)
    gsap.from(".product", {
        scrollTrigger: {
            trigger: ".products-grid",
            start: "top 85%",
        },
        y: 80,
        opacity: 0,
        stagger: 0.15,
        duration: 1,
        ease: "power2.out"
    });

    // About Section Reveal
    gsap.from(".reveal-text", {
        scrollTrigger: {
            trigger: ".about-container",
            start: "top 80%",
        },
        y: 40,
        opacity: 0,
        stagger: 0.2,
        duration: 1,
        ease: "power3.out"
    });

    gsap.from(".reveal-up", {
        scrollTrigger: {
            trigger: ".reveal-up",
            start: "top 85%",
        },
        y: 60,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out"
    });
});
