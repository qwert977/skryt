document.addEventListener("DOMContentLoaded", () => {
    // Force scroll to top on refresh
    if ("scrollRestoration" in history) {
        history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);

    // --- 1. CORE UI (Navbar & Scroll) ---
    const shelfGrid = document.querySelector(".product-grid");
    
    window.renderShopItems = () => {
        if (!shelfGrid || !window.skrytProducts) return;
        const lang = localStorage.getItem("skryt_lang") || "en";
        
        // Only render if we are on the home page (where shelfGrid exists)
        shelfGrid.innerHTML = window.skrytProducts.slice(0, 8).map(p => {
            const displayName = lang === "es" ? (p.name_es || p.name) : p.name;
            return `
                <div class="product-card fade-in" onclick="window.location.href='product.html?id=${p.id}'" style="opacity: 1; transform: translateY(0);">
                    <div class="product-img-wrapper">
                        <img src="${p.images[0]}" alt="${displayName}" class="product-image">
                    </div>
                    <div class="product-info">
                        <span class="product-title">${displayName}</span>
                        <span class="product-price">€ ${p.price}</span>
                    </div>
                </div>
            `;
        }).join("");
    };

    renderShopItems();
    const navbar = document.getElementById("navbar");
    if (navbar) {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 50) {
                navbar.style.background = "rgba(0, 0, 0, 0.9)";
                navbar.style.backdropFilter = "blur(10px)";
                navbar.style.mixBlendMode = "normal";
            } else if (window.location.pathname.includes("index.html") || window.location.pathname === "/" || !window.location.pathname.includes(".html")) {
                navbar.style.background = "transparent";
                navbar.style.backdropFilter = "none";
                navbar.style.mixBlendMode = "difference";
            }
        });
    }

    // --- 2. DRAWERS & MODALS (Toggle Logic) ---
    const overlay = document.getElementById("drawer-overlay");
    const cartDrawer = document.getElementById("cart-drawer");
    const wishlistDrawer = document.getElementById("wishlist-drawer");
    const searchModal = document.getElementById("search-modal");
    const accountDrawer = document.getElementById("account-drawer");
    
    const toggleDrawer = (drawer, active) => {
        if (!drawer) return;
        if (active) {
            overlay.classList.add("active");
            drawer.classList.add("active");
            document.body.style.overflow = "hidden";
            if (drawer.id === "cart-drawer") renderCart();
            if (drawer.id === "wishlist-drawer") renderWishlist();
        } else {
            overlay.classList.remove("active");
            drawer.classList.remove("active");
            document.body.style.overflow = "";
        }
    };

    document.getElementById("cart-trigger")?.addEventListener("click", () => toggleDrawer(cartDrawer, true));
    document.getElementById("wishlist-trigger")?.addEventListener("click", () => toggleDrawer(wishlistDrawer, true));
    document.getElementById("account-trigger")?.addEventListener("click", () => toggleDrawer(accountDrawer, true));
    document.getElementById("search-trigger")?.addEventListener("click", () => {
        searchModal.classList.add("active");
        document.getElementById("search-input")?.focus();
    });
    
    document.querySelectorAll(".close-drawer, .drawer-overlay").forEach(el => {
        el.addEventListener("click", () => {
            toggleDrawer(cartDrawer, false);
            toggleDrawer(wishlistDrawer, false);
            toggleDrawer(accountDrawer, false);
            searchModal.classList.remove("active");
        });
    });

    document.getElementById("close-search")?.addEventListener("click", () => searchModal.classList.remove("active"));

    // --- 3. ACCOUNT LOGIC (Simulated) ---
    const accountView = document.getElementById("account-view");
    
    window.renderLoginForm = () => {
        if (!accountView) return;
        const currentLang = localStorage.getItem("skryt_lang") || "en";
        accountView.innerHTML = `
            <div class="auth-form" id="login-form">
                <h2 data-i18n="loginTitle">Skryt Member - Sign In</h2>
                <p class="subtext" data-i18n="loginSub">Log in with your email and password:</p>
                
                <div class="auth-input-group">
                    <input type="email" placeholder="Email">
                </div>
                
                <div class="auth-input-group">
                    <input type="password" placeholder="Password">
                    <a href="#" class="forgot-link" data-i18n="forgot">Forgot password?</a>
                </div>

                <button class="auth-btn" id="login-btn" data-i18n="signIn">Log In</button>
                
                <div class="auth-footer">
                    <span data-i18n="notMember">Not a Skryt Member yet?</span> <span class="auth-link" id="show-register" data-i18n="createAcc">Create your account</span>
                </div>
            </div>
        `;

        // Re-attach listeners after injection
        document.getElementById("show-register")?.addEventListener("click", showRegister);
        document.getElementById("login-btn")?.addEventListener("click", (e) => simulateAuth(e, "Logging in..."));
        
        // Apply translations
        setLanguage(currentLang);
    };

    if (accountView) {
        // If the view is empty, render the login form
        if (accountView.children.length === 0) {
            renderLoginForm();
        }

        window.showRegister = () => {
            const lang = localStorage.getItem("skryt_lang") || "en";
            accountView.innerHTML = `
                <div class="auth-form" id="register-form">
                    <h2 data-i18n="joinUs">${translations[lang].joinUs}</h2>
                    <p class="subtext" data-i18n="joinSub">${translations[lang].joinSub}</p>
                    
                    <div class="auth-input-group">
                        <input type="text" placeholder="${translations[lang].fullName}">
                    </div>
                    <div class="auth-input-group">
                        <input type="email" placeholder="${translations[lang].email}">
                    </div>
                    <div class="auth-input-group">
                        <input type="password" placeholder="${translations[lang].password}">
                    </div>

                    <button class="auth-btn" onclick="simulateAuth(event, 'Joining...')" data-i18n="createAcc">${translations[lang].createAcc}</button>
                    
                    <div class="auth-footer">
                        <span data-i18n="alreadyMember">${translations[lang].alreadyMember}</span> <span class="auth-link" onclick="renderLoginForm()" data-i18n="signIn">${translations[lang].signIn}</span>
                    </div>
                </div>
            `;
            // Re-apply translation to newly injected elements
            setLanguage(lang);
        };

        window.simulateAuth = (e, msg) => {
            if (e) e.preventDefault();
            const btn = e ? e.target : document.getElementById("login-btn");
            if (btn) {
                btn.innerText = msg;
                btn.disabled = true;
            }
            setTimeout(() => {
                accountView.innerHTML = `
                    <div style="text-align:center; padding-top: 50px;">
                        <h4 style="font-size: 1.5rem;">Welcome back, User!</h4>
                        <p style="margin-top: 10px; opacity: 0.6;">You are currently logged in.</p>
                        <button class="add-to-cart" style="margin-top: 30px; background: #eee; color: #000;" onclick="location.reload()">Logout</button>
                    </div>
                `;
            }, 1000);
        };
        
        document.getElementById("show-register")?.addEventListener("click", showRegister);
        document.getElementById("login-btn")?.addEventListener("click", (e) => simulateAuth(e, "Logging in..."));
    }

    // --- 4. CART & WISHLIST LOGIC ---
    let cart = JSON.parse(localStorage.getItem("skryt_cart") || "[]");
    let wishlist = JSON.parse(localStorage.getItem("skryt_wishlist") || "[]");

    const updateUICounters = () => {
        const lang = localStorage.getItem("skryt_lang") || "en";
        const cartCount = document.getElementById("cart-trigger");
        const wishCount = document.getElementById("wishlist-trigger");
        
        const cartText = translations[lang].cart;
        const wishText = translations[lang].wishlist;

        if (cartCount) cartCount.innerText = `${cartText} (${cart.length})`;
        if (wishCount) {
            // Keep the heart icon for wishlist
            wishCount.innerText = `♡ (${wishlist.length})`;
            // If they want text: wishCount.innerText = `${wishText} (${wishlist.length})`;
        }
    };

    const renderCart = () => {
        const lang = localStorage.getItem("skryt_lang") || "en";
        const cartItemsEl = document.getElementById("cart-items");
        if (!cartItemsEl) return;
        
        if (cart.length === 0) {
            cartItemsEl.innerHTML = `<p style="text-align:center; margin-top: 50px; opacity: 0.5;">${lang === "es" ? "Tu carrito está vacío." : "Your cart is empty."}</p>`;
            return;
        }

        cartItemsEl.innerHTML = cart.map((item, index) => {
            const lang = localStorage.getItem("skryt_lang") || "en";
            const product = window.skrytProducts?.find(p => p.id === item.id);
            if (!product) return "";
            const displayName = lang === "es" ? (product.name_es || product.name) : product.name;
            return `
                <div style="display:flex; gap: 15px; margin-bottom: 20px; align-items: center; border-bottom: 1px solid #eee; padding-bottom: 15px;">
                    <img src="${product.images[0]}" style="width: 80px; height: 80px; object-fit: contain; background: #f9f9f9;">
                    <div style="flex:1;">
                        <h4 style="font-size: 0.9rem; margin-bottom: 5px; color:#000;">${displayName}</h4>
                        <p style="font-size: 0.8rem; opacity: 0.6;">${lang === "es" ? "Talla" : "Size"}: ${item.size}</p>
                        <p style="font-weight: 800; margin-top: 5px;">€${product.price}</p>
                    </div>
                    <span style="cursor:pointer; opacity: 0.3; color:#000;" onclick="removeFromCart(${index})">✕</span>
                </div>
            `;
        }).join("");
    };

    window.removeFromCart = (index) => {
        cart.splice(index, 1);
        localStorage.setItem("skryt_cart", JSON.stringify(cart));
        updateUICounters();
        renderCart();
    };

    // --- 5. MULTI-LANGUAGE (EN/ES) ---
    const translations = {
        en: {
            shop: "Shop",
            about: "About Us",
            search: "SEARCH",
            account: "ACCOUNT",
            cart: "CART",
            wishlist: "WISHLIST",
            heroTitle: "Skryt",
            heroSubtitle: "New Collection 2026",
            explore: "Explore Now",
            marquee: "PREMIUM STREETWEAR • NEW ARRIVALS • WORLDWIDE SHIPPING • SKRYT STUDIOS",
            essentials: "Essentials",
            core: "Core Collection",
            viewStore: "View Store",
            footerDesc: "Born from the streets. High-quality accessories and apparel for those who dictate their own style.",
            support: "Support",
            social: "Social",
            checkout: "Checkout",
            cartTitle: "Cart",
            wishlistTitle: "Wishlist",
            close: "CLOSE",
            selectSize: "Select Size",
            addToCart: "Add to Cart",
            secureCheckout: "Secure Checkout:",
            loginTitle: "Skryt Member - Sign In",
            loginSub: "Log in with your email and password:",
            createAcc: "Create your account",
            joinUs: "Skryt Member - Join Us",
            joinSub: "Create your account to join the community:",
            fullName: "Full Name",
            email: "Email Address",
            password: "Password",
            forgot: "Forgot password?",
            signIn: "Sign In",
            notMember: "Not a Skryt Member yet?",
            alreadyMember: "Already a Skryt Member?",
            thankYou: "Thank You!",
            orderSuccess: "Your order has been placed successfully. A confirmation email is on its way.",
            // About Page
            aboutHero: "OUR MISSION",
            missionTitle: "Mission",
            missionText: "At SKRYT, our mission is to redefine street culture by blending minimalist aesthetics with high-contrast storytelling. We create pieces that don't just dress the body, but define the identity of those who walk their own path.",
            visionTitle: "Vision",
            visionText: "To become the global benchmark for premium streetwear, where every collection is a chapter in a larger narrative of authenticity and bold expression. We envision a world where fashion is a tool for self-discovery.",
            valuesTitle: "Values",
            authTitle: "Authenticity",
            authText: "No filters, no masks. Just pure, raw expression in every stitch.",
            contrastTitle: "Contrast",
            contrastText: "The beauty of life lies in the extremes. We embrace the dark and the light.",
            qualityTitle: "Quality",
            qualityText: "Crafted to last, designed to outlive trends. Premium materials only.",
            // FAQ Page
            faqTitle: "FAQ",
            q1: "When will my order arrive?",
            a1: "Orders are typically processed within 24-48 hours. Domestic shipping takes 2-4 business days, while international orders arrive within 7-10 business days.",
            q2: "Do you ship worldwide?",
            a2: "Yes, Skryt Studios ships to over 50 countries. Shipping costs and delivery times vary by location.",
            q3: "How can I track my order?",
            a3: "Once your order is shipped, you will receive an email with a tracking link to follow your package in real-time.",
            q4: "What is your return policy?",
            a4: "We accept returns within 14 days of delivery. Items must be unworn and in their original packaging.",
            // Shipping Page
            shippingTitle: "Shipping & Returns",
            shippingPolicyTitle: "Shipping Policy",
            shippingPolicyText: "We offer worldwide shipping. All orders are tracked. Once your order has been dispatched, you will receive a tracking number via email.",
            euShipping: "European Union: 2-5 Business Days",
            rowShipping: "Rest of World: 7-12 Business Days",
            returnPolicyTitle: "Return Policy",
            returnPolicyText: "If you are not 100% satisfied with your purchase, you can return your order for a full refund or exchange within 14 days from the date of delivery.",
            returnStipulation: "The items must be in the same condition you received them and in the original packaging.",
            // Contact Page
            contactTitle: "Contact Us",
            getInTouch: "Get in Touch",
            contactSubtext: "Have a question or just want to say hi? Fill out the form or reach us directly at:",
            contactSocial: "Social",
            formName: "Name",
            formEmail: "Email",
            formMessage: "Message",
            sendBtn: "Send Message",
            // Footer Extra
            copyright: "Skryt Studios. All Rights Reserved.",
            terms: "Terms & Conditions",
            privacy: "Privacy Policy"
        },
        es: {
            shop: "Tienda",
            about: "Nosotros",
            search: "BUSCAR",
            account: "CUENTA",
            cart: "CARRITO",
            wishlist: "FAVORITOS",
            heroTitle: "Skryt",
            heroSubtitle: "Nueva Colección 2026",
            explore: "Explorar Ahora",
            marquee: "STREETWEAR PREMIUM • NOVEDADES • ENVÍO MUNDIAL • SKRYT STUDIOS",
            essentials: "Esenciales",
            core: "Colección Principal",
            viewStore: "Ver Tienda",
            footerDesc: "Nacido en las calles. Accesorios y ropa de alta calidad para quienes dictan su propio estilo.",
            support: "Soporte",
            social: "Redes",
            checkout: "Pagar",
            cartTitle: "Carrito",
            wishlistTitle: "Favoritos",
            close: "CERRAR",
            selectSize: "Seleccionar Talla",
            addToCart: "Añadir al Carrito",
            secureCheckout: "Pago Seguro:",
            loginTitle: "Miembro Skryt - Acceder",
            loginSub: "Inicia sesión con tu correo y contraseña:",
            createAcc: "Crea tu cuenta",
            joinUs: "Miembro Skryt - Únete",
            joinSub: "Crea tu cuenta para unirte a la comunidad:",
            fullName: "Nombre Completo",
            email: "Correo Electrónico",
            password: "Contraseña",
            forgot: "¿Olvidaste tu contraseña?",
            signIn: "Iniciar Sesión",
            notMember: "¿Aún no eres miembro?",
            alreadyMember: "¿Ya eres miembro?",
            thankYou: "¡Gracias!",
            orderSuccess: "Tu pedido ha sido realizado con éxito. Te hemos enviado un correo de confirmación.",
            // About Page
            aboutHero: "NUESTRA MISIÓN",
            missionTitle: "Misión",
            missionText: "En SKRYT, nuestra misión es redefinir la cultura callejera combinando una estética minimalista con una narrativa de alto contraste. Creamos piezas que no solo visten el cuerpo, sino que definen la identidad de quienes caminan su propio sendero.",
            visionTitle: "Visión",
            visionText: "Convertirnos en el referente global del streetwear premium, donde cada colección es un capítulo en una narrativa más amplia de autenticidad y expresión audaz. Imaginamos un mundo donde la moda es una herramienta para el autodescubrimiento.",
            valuesTitle: "Valores",
            authTitle: "Autenticidad",
            authText: "Sin filtros, sin máscaras. Solo expresión pura y cruda en cada puntada.",
            contrastTitle: "Contraste",
            contrastText: "La belleza de la vida reside en los extremos. Abrazamos tanto la oscuridad como la luz.",
            qualityTitle: "Calidad",
            qualityText: "Creado para durar, diseñado para sobrevivir a las tendencias. Solo materiales premium.",
            // FAQ Page
            faqTitle: "Preguntas Frecuentes",
            q1: "¿Cuándo llegará mi pedido?",
            a1: "Los pedidos se procesan normalmente en 24-48 horas. El envío nacional tarda de 2 a 4 días hábiles, mientras que los pedidos internacionales llegan en 7-10 días hábiles.",
            q2: "¿Realizan envíos a todo el mundo?",
            a2: "Sí, Skryt Studios realiza envíos a más de 50 países. Los costes de envío y los tiempos de entrega varían según la ubicación.",
            q3: "¿Cómo puedo rastrear mi pedido?",
            a3: "Una vez que se envíe su pedido, recibirá un correo electrónico con un enlace de seguimiento para seguir su paquete en tiempo real.",
            q4: "¿Cuál es su política de devoluciones?",
            a4: "Aceptamos devoluciones dentro de los 14 días posteriores a la entrega. Los artículos deben estar sin usar y en su embalaje original.",
            // Shipping Page
            shippingTitle: "Envíos y Devoluciones",
            shippingPolicyTitle: "Política de Envíos",
            shippingPolicyText: "Ofrecemos envíos a todo el mundo. Todos los pedidos tienen seguimiento. Una vez que su pedido haya sido enviado, recibirá un número de seguimiento por correo electrónico.",
            euShipping: "Unión Europea: 2-5 días hábiles",
            rowShipping: "Resto del mundo: 7-12 días hábiles",
            returnPolicyTitle: "Política de Devoluciones",
            returnPolicyText: "Si no está 100% satisfecho con su compra, puede devolver su pedido para obtener un reembolso completo o un cambio dentro de los 14 días posteriores a la entrega.",
            returnStipulation: "Los artículos deben estar en las mismas condiciones en que los recibió y en el embalaje original.",
            // Contact Page
            contactTitle: "Contáctanos",
            getInTouch: "Ponte en Contacto",
            contactSubtext: "¿Tienes alguna pregunta o solo quieres decir hola? Rellena el formulario o contáctanos directamente en:",
            contactSocial: "Redes",
            formName: "Nombre",
            formEmail: "Correo",
            formMessage: "Mensaje",
            sendBtn: "Enviar Mensaje",
            // Footer Extra
            copyright: "Skryt Studios. Todos los derechos reservados.",
            terms: "Términos y Condiciones",
            privacy: "Política de Privacidad"
        }
    };

    window.setLanguage = (lang) => {
        localStorage.setItem("skryt_lang", lang);
        document.documentElement.lang = lang;
        
        // Update all elements with data-i18n
        document.querySelectorAll("[data-i18n]").forEach(el => {
            const key = el.getAttribute("data-i18n");
            if (translations[lang] && translations[lang][key]) {
                el.textContent = translations[lang][key];
            }
        });

        // Update placeholders
        document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
            const key = el.getAttribute("data-i18n-placeholder");
            if (translations[lang] && translations[lang][key]) {
                el.placeholder = translations[lang][key];
            }
        });

        // Update active state on buttons (optional check)
        document.querySelectorAll(".lang-btn").forEach(btn => {
            const clickAttr = btn.getAttribute("onclick");
            if (clickAttr) {
                btn.classList.toggle("active", clickAttr.includes(lang));
            }
        });

        // Re-render dynamic content
        renderCart();
        renderWishlist();
        if (typeof renderProductPage === "function") renderProductPage();
        if (typeof renderShopItems === "function") renderShopItems();
        updateUICounters();
    };

    window.toggleLanguage = () => {
        const current = localStorage.getItem("skryt_lang") || "en";
        const next = current === "en" ? "es" : "en";
        setLanguage(next);
    };

    // --- 6. CHECKOUT SIMULATION ---
    window.processCheckout = () => {
        const lang = localStorage.getItem("skryt_lang") || "en";
        if (cart.length === 0) {
            alert(lang === "es" ? "¡Tu carrito está vacío!" : "Your cart is empty!");
            return;
        }

        const cartItemsEl = document.getElementById("cart-items");
        if (cartItemsEl) {
            cartItemsEl.innerHTML = `
                <div style="text-align: center; padding: 100px 20px;">
                    <h2 style="font-size: 2rem; margin-bottom: 20px;">${translations[lang].thankYou}</h2>
                    <p style="opacity: 0.7; margin-bottom: 40px;">${translations[lang].orderSuccess}</p>
                    <div class="brand" style="font-size: 3rem; margin-bottom: 40px;">Skryt</div>
                    <button class="add-to-cart" onclick="location.reload()">${lang === "es" ? "Volver a tienda" : "Back to Shop"}</button>
                </div>
            `;
        }
        
        cart = [];
        localStorage.removeItem("skryt_cart");
        updateUICounters();
        
        const drawerFooter = document.querySelector(".drawer-footer");
        if (drawerFooter) drawerFooter.style.display = "none";
    };

    const renderWishlist = () => {
        const lang = localStorage.getItem("skryt_lang") || "en";
        const wishItemsEl = document.getElementById("wishlist-items");
        if (!wishItemsEl) return;
        
        if (wishlist.length === 0) {
            wishItemsEl.innerHTML = `<p style="text-align:center; margin-top: 50px; opacity: 0.5;">${lang === "es" ? "Aún no hay favoritos." : "No favorites yet."}</p>`;
            return;
        }

        wishItemsEl.innerHTML = wishlist.map((id, index) => {
            const product = window.skrytProducts?.find(p => p.id === id);
            if (!product) return "";
            return `
                <div style="display:flex; gap: 15px; margin-bottom: 20px; align-items: center;">
                    <img src="${product.images[0]}" style="width: 80px; height: 80px; object-fit: contain; background: #f9f9f9;">
                    <div style="flex:1;">
                        <h4 style="font-size: 0.9rem; color:#000;">${product.name}</h4>
                        <p style="font-weight: 800;">€${product.price}</p>
                        <a href="product.html?id=${id}" style="font-size: 0.7rem; text-decoration: underline; margin-top: 5px; display: block;">${lang === "es" ? "VER PRODUCTO" : "VIEW PRODUCT"}</a>
                    </div>
                    <span style="cursor:pointer; opacity: 0.3; color:#000;" onclick="removeFromWishlist(${index})">✕</span>
                </div>
            `;
        }).join("");
    };

    window.removeFromWishlist = (index) => {
        wishlist.splice(index, 1);
        localStorage.setItem("skryt_wishlist", JSON.stringify(wishlist));
        updateUICounters();
        renderWishlist();
    };

    updateUICounters();

    // --- 5. SEARCH LOGIC ---
    const searchInput = document.getElementById("search-input");
    const searchResults = document.getElementById("search-results");

    searchInput?.addEventListener("input", (e) => {
        const query = e.target.value.toLowerCase();
        if (!query || !window.skrytProducts) {
            searchResults.innerHTML = "";
            return;
        }

        const filtered = window.skrytProducts.filter(p => 
            p.name.toLowerCase().includes(query) || p.category.toLowerCase().includes(query)
        );

        searchResults.innerHTML = filtered.map(p => {
            const lang = localStorage.getItem("skryt_lang") || "en";
            const displayName = lang === "es" ? (p.name_es || p.name) : p.name;
            return `
                <div class="product-card" onclick="window.location.href='product.html?id=${p.id}'">
                    <div class="product-img-wrapper" style="aspect-ratio: 1/1;">
                        <img src="${p.images[0]}" alt="${displayName}" class="product-image">
                    </div>
                    <div class="product-info">
                        <span class="product-title">${displayName}</span>
                        <span class="product-price">€ ${p.price}</span>
                    </div>
                </div>
            `;
        }).join("");
    });

    // --- 6. PRODUCT PAGE SPECIFIC ---
    window.renderProductPage = () => {
        const params = new URLSearchParams(window.location.search);
        const productId = params.get("id");
        const productContainer = document.getElementById("product-container");

        if (productId && productContainer && window.skrytProducts) {
            const product = window.skrytProducts.find(p => p.id === productId);

            if (product) {
                const lang = localStorage.getItem("skryt_lang") || "en";
                const displayName = lang === "es" ? (product.name_es || product.name) : product.name;
                const displayDesc = lang === "es" ? (product.description_es || product.description) : product.description;

                document.title = `${displayName} | SKRYT`;
                
                productContainer.innerHTML = `
                    <div class="product-gallery">
                        <img src="${product.images[0]}" alt="${displayName}" class="main-img">
                    </div>
                    <div class="product-details">
                        <div style="display:flex; justify-content: space-between; align-items: center;">
                            <p style="text-transform: uppercase; font-size: 0.7rem; letter-spacing: 2px; color: #888;">${product.category}</p>
                            <span id="heart-btn" style="cursor:pointer; font-size: 1.5rem;">${wishlist.includes(product.id) ? '♥' : '♡'}</span>
                        </div>
                        <h1>${displayName}</h1>
                        <p class="price">€ ${product.price}</p>
                        
                        <div class="product-description">${displayDesc}</div>

                        <div>
                            <p style="font-weight: 800; text-transform: uppercase; font-size: 0.7rem; margin-bottom: 10px;">${translations[lang].selectSize}</p>
                            <div class="size-selector">
                                ${product.sizes.map(size => `<div class="size-btn">${size}</div>`).join("")}
                            </div>
                        </div>

                        <button class="add-to-cart" id="add-btn">${translations[lang].addToCart}</button>
                        
                        <div class="payment-methods" style="margin-top: 30px; display: flex; align-items: center; gap: 15px;">
                            <span style="font-size: 0.7rem; text-transform: uppercase; letter-spacing: 1px; opacity: 0.5;" data-i18n="secureCheckout">${translations[lang].secureCheckout}</span>
                            <div style="display:flex; gap: 12px; align-items: center;">
                                <!-- Visa -->
                                <svg class="payment-icon" viewBox="0 0 100 32" width="40" height="15" style="background:#fff; border-radius:2px; padding:2px;">
                                    <path d="M35 10l-2 12h-3l2-12h3zm11 0l-2.5 12h-2.5l-1-4-1 4h-2.5l-2.5-12h2.5l1.5 8 1.5-8h2zm8 4c0-1.5-1-2.5-3-2.5h-4l-.5 2.5h3.5l.5-2.5z" fill="#1A1F71"/>
                                </svg>
                                <!-- Mastercard -->
                                <svg class="payment-icon" viewBox="0 0 100 32" width="40" height="25">
                                    <circle cx="40" cy="16" r="12" fill="#EB001B"/>
                                    <circle cx="60" cy="16" r="12" fill="#F79E1B" fill-opacity="0.8"/>
                                </svg>
                                <!-- Apple Pay -->
                                <svg class="payment-icon" viewBox="0 0 100 32" width="40" height="15" style="background:#fff; border-radius:2px; padding:2px;">
                                    <path d="M30 16c0-3 2-5 5-5s5 2 5 5-2 5-5 5-5-2-5-5z" fill="#000"/>
                                </svg>
                            </div>
                        </div>
                    </div>
                `;

                const heartBtn = document.getElementById("heart-btn");
                heartBtn?.addEventListener("click", () => {
                    if (wishlist.includes(product.id)) {
                        wishlist = wishlist.filter(id => id !== product.id);
                        heartBtn.innerText = "♡";
                    } else {
                        wishlist.push(product.id);
                        heartBtn.innerText = "♥";
                    }
                    localStorage.setItem("skryt_wishlist", JSON.stringify(wishlist));
                    updateUICounters();
                });

                const sizeBtns = productContainer.querySelectorAll(".size-btn");
                sizeBtns.forEach(btn => {
                    btn.addEventListener("click", () => {
                        sizeBtns.forEach(b => b.classList.remove("active"));
                        btn.classList.add("active");
                    });
                });

                const addBtn = document.getElementById("add-btn");
                addBtn?.addEventListener("click", () => {
                    const activeSize = productContainer.querySelector(".size-btn.active");
                    if (!activeSize && product.sizes.length > 1 && product.sizes[0] !== "OS") {
                        const lang = localStorage.getItem("skryt_lang") || "en";
                        alert(lang === "es" ? "Por favor selecciona una talla" : "Please select a size");
                        return;
                    }
                    
                    cart.push({ id: product.id, size: activeSize?.innerText || "OS" });
                    localStorage.setItem("skryt_cart", JSON.stringify(cart));
                    updateUICounters();
                    
                    if (typeof toggleDrawer === "function") toggleDrawer(document.getElementById("cart-drawer"), true);
                });
            }
        }
    };

    renderProductPage();

    // Initial language application
    const savedLang = localStorage.getItem("skryt_lang") || "en";
    setLanguage(savedLang);

    // Initial render if drawer is open or counters need update
    renderCart();
    renderWishlist();

    // --- 7. SCROLL REVEAL ---
    const fadeElements = document.querySelectorAll(".fade-in");
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";
            }
        });
    }, { threshold: 0.1 });

    fadeElements.forEach(el => {
        el.style.opacity = "0";
        el.style.transform = "translateY(30px)";
        el.style.transition = "all 0.8s ease-out";
        observer.observe(el);
    });
});
