// === SITE LOADER ===
const siteLoader = document.getElementById('site-loader')
if (siteLoader) {
    const minWait = new Promise((r) => setTimeout(r, 2300))
    const loaded = new Promise((r) => {
        if (document.readyState === 'complete') r()
        else window.addEventListener('load', r, { once: true })
    })
    Promise.all([minWait, loaded]).then(() => {
        siteLoader.classList.add('hide')
        siteLoader.addEventListener(
            'transitionend',
            () => siteLoader.remove(),
            {
                once: true
            }
        )
    })
}

document.addEventListener('DOMContentLoaded', () => {
    // === NAV TOGGLE (hamburgermenyn) ===
    const toggleBtn = document.querySelector('.nav-toggle')
    const navLinks = document.querySelector('.nav-links')

    if (toggleBtn && navLinks) {
        toggleBtn.addEventListener('click', () => {
            const isOpen = toggleBtn.classList.toggle('open')
            navLinks.classList.toggle('show', isOpen)
            toggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false')
        })
    }

    // === WAVY-TEXT ANIMATION ===
    const text = document.querySelector('.wavy-text')
    if (text) {
        const content = text.textContent
        text.textContent = ''

        content.split('').forEach((letter) => {
            const span = document.createElement('span')
            span.textContent = letter === ' ' ? '\u00A0' : letter
            text.appendChild(span)
        })

        const letters = text.querySelectorAll('span')
        let time = 0

        const animate = () => {
            letters.forEach((letter, index) => {
                const wave = Math.sin(time + index * 0.4) * 1
                letter.style.transform = `translateY(${wave}px)`
            })

            time += 0.03
            requestAnimationFrame(animate)
        }

        animate()
    }

    // === NEDÅTPIL (SCROLL-HINT) ===
    const scrollHint = document.querySelector('.scroll-hint')
    if (scrollHint) {
        const targetSection = document.getElementById('nyheter')

        window.addEventListener(
            'scroll',
            () => {
                if (window.scrollY > 40) {
                    scrollHint.classList.add('scroll-hint--hidden')
                }
            },
            { passive: true }
        )

        scrollHint.addEventListener('click', () => {
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' })
            }
        })
    }

    // === KATEGORI-KNAPPAR REVEAL ===
    const categoryButtons = document.querySelector('.category-buttons')
    if (categoryButtons) {
        window.addEventListener(
            'scroll',
            () => {
                categoryButtons.classList.add('category-buttons--visible')
            },
            { passive: true, once: true }
        )
    }

    // === PRODUKT-SLIDER (MEST KÖPTA) ===
    const track = document.querySelector('.products-track')
    const slides = document.querySelectorAll('.product-card')
    const prevBtn = document.querySelector('.products-arrow--prev')
    const nextBtn = document.querySelector('.products-arrow--next')

    if (track && slides.length && prevBtn && nextBtn) {
        let currentIndex = 0

        const getItemsPerView = () => (window.innerWidth >= 900 ? 4 : 2)
        let itemsPerView = getItemsPerView()
        let slideWidth = 100 / itemsPerView

        const maxIndex = () => Math.max(0, slides.length - itemsPerView)

        const updateSlider = () => {
            if (currentIndex > maxIndex()) currentIndex = maxIndex()
            if (currentIndex < 0) currentIndex = 0
            const offset = -(currentIndex * slideWidth)
            track.style.transform = `translateX(${offset}%)`
        }

        const showNext = () => {
            currentIndex = currentIndex < maxIndex() ? currentIndex + 1 : 0
            updateSlider()
        }

        const showPrev = () => {
            currentIndex = currentIndex > 0 ? currentIndex - 1 : maxIndex()
            updateSlider()
        }

        prevBtn.addEventListener('click', showPrev)
        nextBtn.addEventListener('click', showNext)

        window.addEventListener('resize', () => {
            const newItems = getItemsPerView()
            if (newItems !== itemsPerView) {
                itemsPerView = newItems
                slideWidth = 100 / itemsPerView
                updateSlider()
            }
        })

        updateSlider()
    }

    // === REVEAL PÅ SCROLL (t.ex. "Mest köpta") ===
    const revealSections = document.querySelectorAll('.reveal-on-scroll')

    if ('IntersectionObserver' in window && revealSections.length) {
        const observer = new IntersectionObserver(
            (entries, obs) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('reveal-on-scroll--visible')
                        obs.unobserve(entry.target)
                    }
                })
            },
            {
                threshold: 0.25
            }
        )

        revealSections.forEach((section) => observer.observe(section))
    } else {
        revealSections.forEach((section) =>
            section.classList.add('reveal-on-scroll--visible')
        )
    }

    // === NEWSLETTER FORM ===
    const newsletterForm = document.querySelector('.newsletter-form')
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault()
            alert(
                'Välkommen till Eirá Inner Circle ✨ Du är nu först med det senaste.'
            )
            newsletterForm.reset()
        })
    }

    // === CART ===
    const PRODUCTS = [
        {
            id: 1,
            name: 'Luna Hoops Gold',
            brand: 'Eirá',
            price: 399,
            image: './photos/1.png'
        },
        {
            id: 2,
            name: 'Luna Hoops Silver',
            brand: 'Eirá',
            price: 299,
            image: './photos/2.png'
        },
        {
            id: 3,
            name: 'Elara Drop Earrings',
            brand: 'Eirá',
            price: 599,
            image: './photos/3.png'
        },
        {
            id: 4,
            name: 'Stella Halo Necklace',
            brand: 'Eirá',
            price: 799,
            image: './photos/4.png'
        },
        {
            id: 5,
            name: 'Nord Chain Necklace',
            brand: 'Eirá',
            price: 899,
            image: './photos/5.png'
        }
    ]

    let cart = []

    const cartOverlay = document.querySelector('.cart-overlay')
    const cartDrawer = document.querySelector('.cart-drawer')
    const cartCloseBtn = document.querySelector('.cart-drawer__close')
    const cartItemsEl = document.getElementById('cart-items')
    const cartTotalEl = document.getElementById('cart-total')
    const cartButton = document.querySelector('.cart-btn')

    function openCart() {
        renderCart()
        cartDrawer.classList.add('open')
        cartOverlay.classList.add('active')
    }

    function closeCart() {
        cartDrawer.classList.remove('open')
        cartOverlay.classList.remove('active')
    }

    function renderCart() {
        if (cart.length === 0) {
            cartItemsEl.innerHTML =
                '<p class="cart-empty">Din varukorg är tom</p>'
            cartTotalEl.textContent = '0.00 SEK'
            return
        }

        cartItemsEl.innerHTML = cart
            .map(
                (item) => `
            <div class="cart-item">
                <img class="cart-item__image" src="${item.image}" alt="${item.name}" />
                <div class="cart-item__info">
                    <p class="cart-item__brand">${item.brand}</p>
                    <h3 class="cart-item__name">${item.name}</h3>
                    <p class="cart-item__price">${item.price}.00 SEK</p>
                    <div class="cart-item__qty">
                        <button class="cart-item__qty-btn" data-action="decrease" data-id="${item.id}">&#x2212;</button>
                        <span class="cart-item__qty-num">${item.quantity}</span>
                        <button class="cart-item__qty-btn" data-action="increase" data-id="${item.id}">+</button>
                    </div>
                    <button class="cart-item__remove" data-id="${item.id}">Ta bort</button>
                </div>
            </div>
        `
            )
            .join('')

        const total = cart.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
        )
        cartTotalEl.textContent = total.toFixed(2) + ' SEK'
    }

    function addToCart(productId) {
        const product = PRODUCTS.find((p) => p.id === productId)
        if (!product) return
        const existing = cart.find((i) => i.id === productId)
        if (existing) {
            existing.quantity++
        } else {
            cart.push({ ...product, quantity: 1 })
        }
    }

    cartItemsEl.addEventListener('click', (e) => {
        const qtyBtn = e.target.closest('[data-action]')
        const removeBtn = e.target.closest('.cart-item__remove')

        if (qtyBtn) {
            const id = parseInt(qtyBtn.dataset.id)
            const item = cart.find((i) => i.id === id)
            if (!item) return
            if (qtyBtn.dataset.action === 'increase') item.quantity++
            if (qtyBtn.dataset.action === 'decrease') {
                item.quantity--
                if (item.quantity <= 0) cart = cart.filter((i) => i.id !== id)
            }
            renderCart()
        }

        if (removeBtn) {
            const id = parseInt(removeBtn.dataset.id)
            cart = cart.filter((i) => i.id !== id)
            renderCart()
        }
    })

    document.querySelectorAll('.product-add-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
            const card = btn.closest('[data-product-id]')
            if (!card) return
            addToCart(parseInt(card.dataset.productId))
            openCart()
        })
    })

    cartButton.addEventListener('click', openCart)
    cartCloseBtn.addEventListener('click', closeCart)
    cartOverlay.addEventListener('click', closeCart)
})

// === FOOTER YEAR ===
const yearSpan = document.getElementById('year')
if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear()
}

// === FOOTER-BÅGE + TEXT REVEAL ===
const footerArc = document.querySelector('.site-footer.reveal-arc')

if ('IntersectionObserver' in window && footerArc) {
    const footerObserver = new IntersectionObserver(
        (entries, obs) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    footerArc.classList.add('reveal-arc--visible')
                    obs.unobserve(footerArc)
                }
            })
        },
        {
            threshold: 0.2
        }
    )

    footerObserver.observe(footerArc)
} else if (footerArc) {
    footerArc.classList.add('reveal-arc--visible')
}
