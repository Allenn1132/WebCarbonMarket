
// Inisialisasi AOS (Animate On Scroll)
if (typeof AOS !== 'undefined') {
    AOS.init({
        duration: 900,
        once: false,
        easing: 'ease-out-cubic'
    });
}

// Inisialisasi Fancybox v5 (Lightbox Popup Foto Proyek)
if (typeof Fancybox !== 'undefined') {
    Fancybox.bind('[data-fancybox]', {
        Hash: false,
        Thumbs: false,
        Toolbar: {
            display: {
                left: ["infobar"],
                middle: [],
                right: ["close"],
            },
        },
    });
}



// Inisialisasi Swiper Project Cards Carousel
if (document.querySelector('.project-swiper')) {
    const projectSwiper = new Swiper('.project-swiper', {
        slidesPerView: 1,
        spaceBetween: 24,
        loop: true,
        autoplay: {
            delay: 4500,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.project-next',
            prevEl: '.project-prev',
        },
        breakpoints: {
            640: {
                slidesPerView: 2,
                spaceBetween: 24,
            },
            1024: {
                slidesPerView: 3,
                spaceBetween: 30,
            }
        }
    });
}

// GSAP Micro-Interactions (Efek Hover Halus pada Kartu Proyek)
if (typeof gsap !== 'undefined') {
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            gsap.to(card.querySelector('.card-img-wrapper img'), { scale: 1.06, duration: 0.4, ease: "power2.out" });
        });
        card.addEventListener('mouseleave', () => {
            gsap.to(card.querySelector('.card-img-wrapper img'), { scale: 1.0, duration: 0.4, ease: "power2.out" });
        });
    });
}

// Logika Menyembunyikan Navbar & Auto-Reveal Saat Kursor Diarahkan ke Atas
const navbarElement = document.querySelector('.navbar');
const heroSection = document.querySelector('.hero');
const scrollIndicatorElement = document.querySelector('.scroll-indicator');

let isCursorAtTop = false;

const updateNavbarState = () => {
    if (!heroSection || !navbarElement) return;
    const heroBottomThreshold = heroSection.offsetHeight - 64;
    const isScrolledPastHero = window.scrollY > heroBottomThreshold;

    if (isScrolledPastHero && !isCursorAtTop) {
        navbarElement.classList.add('navbar-hidden');
    } else {
        navbarElement.classList.remove('navbar-hidden');
    }
};

window.addEventListener('mousemove', (e) => {
    // Munculkan navbar jika kursor diarahkan dalam rentang 80px dari atas layar
    if (e.clientY <= 80) {
        isCursorAtTop = true;
    } else {
        isCursorAtTop = false;
    }
    updateNavbarState();
});

if (navbarElement) {
    navbarElement.addEventListener('mouseenter', () => {
        isCursorAtTop = true;
        updateNavbarState();
    });
    navbarElement.addEventListener('mouseleave', () => {
        isCursorAtTop = false;
        updateNavbarState();
    });
}

window.addEventListener('scroll', () => {
    updateNavbarState();
    if (scrollIndicatorElement) {
        if (window.scrollY > 80) {
            scrollIndicatorElement.classList.add('scroll-hidden');
        } else {
            scrollIndicatorElement.classList.remove('scroll-hidden');
        }
    }
}, { passive: true });

// Navbar updateState
updateNavbarState();

// Logika Interaktif Filter Kartu Produk & Proyek Presisi
const initCategoryFilters = () => {
    const filterBtns = document.querySelectorAll('.products-filter-btn');
    const filterableCards = document.querySelectorAll('.mja-card, .project-page-card');

    if (filterBtns.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const category = btn.getAttribute('data-category') || 'all';

                filterableCards.forEach(card => {
                    const cardCategory = card.getAttribute('data-category');
                    if (category === 'all' || cardCategory === category) {
                        card.style.display = 'flex';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCategoryFilters);
} else {
    initCategoryFilters();
}

// Logika Animasi Smooth Scroll Mulus untuk Tautan Internal Navbar (#)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (!targetId || targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            e.preventDefault();
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ================= USER SESSION & STORAGE AUTH SYSTEM =================
const AUTH_USERS_KEY = 'cm_registered_users';
const AUTH_SESSION_KEY = 'cm_current_user';

// Get Registered Users
function getRegisteredUsers() {
    const usersStr = localStorage.getItem(AUTH_USERS_KEY);
    if (!usersStr) {
        // Initialize default demo account
        const defaultUsers = [{
            fullname: 'Muhamad Arya Fabrian',
            email: 'arya@itcc.ac.id',
            password: 'password123'
        }];
        localStorage.setItem(AUTH_USERS_KEY, JSON.stringify(defaultUsers));
        return defaultUsers;
    }
    try {
        return JSON.parse(usersStr);
    } catch (e) {
        return [];
    }
}

// Get Current Logged In User Session
function getCurrentUserSession() {
    const sessionStr = localStorage.getItem(AUTH_SESSION_KEY) || sessionStorage.getItem(AUTH_SESSION_KEY);
    if (!sessionStr) return null;
    try {
        return JSON.parse(sessionStr);
    } catch (e) {
        return null;
    }
}

// Save Current User Session
function saveUserSession(user, remember = true) {
    const jsonStr = JSON.stringify(user);
    if (remember) {
        localStorage.setItem(AUTH_SESSION_KEY, jsonStr);
    } else {
        sessionStorage.setItem(AUTH_SESSION_KEY, jsonStr);
    }
}

// Clear User Session (Log Out)
function logoutUserSession() {
    localStorage.removeItem(AUTH_SESSION_KEY);
    sessionStorage.removeItem(AUTH_SESSION_KEY);
    window.location.reload();
}

// Update Navbar Auth UI Across All Pages
function updateNavbarAuthUI() {
    const currentUser = getCurrentUserSession();
    const navRight = document.querySelector('.nav-right');
    
    if (currentUser && navRight) {
        const firstName = currentUser.fullname ? currentUser.fullname.split(' ')[0] : 'Account';
        navRight.innerHTML = `
            <div class="user-profile-dropdown-wrapper" style="position: relative; display: inline-block;">
                <button id="user-profile-trigger" type="button" style="background: #E8F5EF; color: #087F5B; border: 1.5px solid rgba(8, 127, 91, 0.25); border-radius: 24px; padding: 8px 18px; font-size: 0.875rem; font-weight: 700; display: inline-flex; align-items: center; gap: 8px; cursor: pointer; transition: all 0.2s ease;">
                    <i class="bx bx-user-circle" style="font-size: 1.2rem;"></i>
                    <span>Hi, ${firstName}</span>
                    <i class="bx bx-chevron-down" id="profile-chevron" style="transition: transform 0.2s ease; font-size: 1.1rem;"></i>
                </button>

                <div id="user-profile-menu" style="display: none; position: absolute; right: 0; top: calc(100% + 10px); background: #ffffff; min-width: 190px; border-radius: 16px; border: 1px solid #E2E8F0; box-shadow: 0 10px 30px rgba(0,0,0,0.08); padding: 8px; z-index: 9999;">
                    <a href="history.html" style="display: flex; align-items: center; gap: 10px; padding: 10px 14px; font-size: 0.875rem; font-weight: 600; color: #1E293B; text-decoration: none; border-radius: 10px; transition: background 0.2s ease;" onmouseover="this.style.background='#F1F5F9'" onmouseout="this.style.background='transparent'">
                        <i class="bx bx-grid-alt" style="font-size: 1.1rem; color: #087F5B;"></i> Dashboard
                    </a>
                    <div style="height: 1px; background: #F1F5F9; margin: 4px 0;"></div>
                    <a href="#" id="btn-logout-session" style="display: flex; align-items: center; gap: 10px; padding: 10px 14px; font-size: 0.875rem; font-weight: 600; color: #EF4444; text-decoration: none; border-radius: 10px; transition: background 0.2s ease;" onmouseover="this.style.background='#FEE2E2'" onmouseout="this.style.background='transparent'">
                        <i class="bx bx-log-out" style="font-size: 1.1rem;"></i> Logout
                    </a>
                </div>
            </div>
        `;

        const triggerBtn = document.getElementById('user-profile-trigger');
        const menu = document.getElementById('user-profile-menu');
        const chevron = document.getElementById('profile-chevron');
        const logoutBtn = document.getElementById('btn-logout-session');

        if (triggerBtn && menu) {
            triggerBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const isVisible = menu.style.display === 'block';
                menu.style.display = isVisible ? 'none' : 'block';
                if (chevron) chevron.style.transform = isVisible ? 'rotate(0deg)' : 'rotate(180deg)';
            });

            document.addEventListener('click', (e) => {
                if (!menu.contains(e.target) && !triggerBtn.contains(e.target)) {
                    menu.style.display = 'none';
                    if (chevron) chevron.style.transform = 'rotate(0deg)';
                }
            });
        }

        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                logoutUserSession();
            });
        }
    }
    if (navRight) {
        navRight.style.visibility = 'visible';
    }
}

// Run Navbar Auth UI & Storage Init on page load
getRegisteredUsers();

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateNavbarAuthUI);
} else {
    updateNavbarAuthUI();
}
