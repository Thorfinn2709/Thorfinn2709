document.addEventListener('DOMContentLoaded', () => {

    // ===== 1. Cursor Glow Effect =====
    const cursorGlow = document.getElementById('cursorGlow');
    if (cursorGlow && window.innerWidth > 768) {
        document.addEventListener('mousemove', (e) => {
            cursorGlow.style.left = e.clientX + 'px';
            cursorGlow.style.top = e.clientY + 'px';
        });
    }

    // ===== 2. Sticky Navigation with Glass Effect =====
    const navbar = document.getElementById('navbar');
    const backToTop = document.getElementById('backToTop');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        // Back to top button visibility
        if (backToTop) {
            if (window.scrollY > 500) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        }
    });

    // Back to top click
    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ===== 3. Mobile Menu Toggle =====
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    const navItems = navLinks.querySelectorAll('a');

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const icon = hamburger.querySelector('i');
        if (navLinks.classList.contains('active')) {
            icon.classList.remove('bx-menu');
            icon.classList.add('bx-x');
        } else {
            icon.classList.remove('bx-x');
            icon.classList.add('bx-menu');
        }
    });

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                const icon = hamburger.querySelector('i');
                icon.classList.remove('bx-x');
                icon.classList.add('bx-menu');
            }
        });
    });

    // ===== 4. Scroll Reveal with Stagger =====
    const revealElements = document.querySelectorAll('.reveal');

    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        revealElements.forEach(el => {
            const revealTop = el.getBoundingClientRect().top;
            if (revealTop < windowHeight - 80) {
                el.classList.add('active');
            }
        });
    };

    revealOnScroll();
    window.addEventListener('scroll', revealOnScroll);

    // ===== 5. Animated Counter for Stats =====
    const statNumbers = document.querySelectorAll('.stat-number');
    let counterAnimated = false;

    const animateCounters = () => {
        statNumbers.forEach(num => {
            const target = parseInt(num.getAttribute('data-target'));
            const duration = 2000;
            const startTime = performance.now();

            const updateCounter = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                // Ease out cubic
                const eased = 1 - Math.pow(1 - progress, 3);
                const current = Math.floor(eased * target);
                num.textContent = current.toLocaleString();

                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    num.textContent = target.toLocaleString();
                }
            };
            requestAnimationFrame(updateCounter);
        });
    };

    const statsSection = document.querySelector('.stats-bar');
    if (statsSection) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !counterAnimated) {
                    counterAnimated = true;
                    animateCounters();
                }
            });
        }, { threshold: 0.5 });
        statsObserver.observe(statsSection);
    }

    // ===== 6. Active Nav Link Highlight =====
    const sections = document.querySelectorAll('section[id]');

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY + 200;
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

            if (navLink) {
                if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                    navLink.style.color = 'var(--accent)';
                } else {
                    navLink.style.color = '';
                }
            }
        });
    });

    // ===== 7. Smooth Parallax on Hero Blobs =====
    if (window.innerWidth > 768) {
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            const blobs = document.querySelectorAll('.blob');
            blobs.forEach((blob, i) => {
                const speed = (i + 1) * 0.15;
                blob.style.transform = `translateY(${scrolled * speed}px)`;
            });
        });
    }

    // ===== 8. Form Handling =====
    const bookingForm = document.getElementById('bookingForm');
    const formSuccess = document.getElementById('formSuccess');
    const FORMSPREE_ENDPOINT = "https://formspree.io/f/xjgjrbor";

    if (bookingForm) {
        bookingForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const btn = bookingForm.querySelector('button[type="submit"]');
            const originalHTML = btn.innerHTML;

            btn.innerHTML = '<span>Sending...</span> <i class="bx bx-loader-alt bx-spin"></i>';
            btn.disabled = true;
            btn.style.opacity = '0.7';

            if (FORMSPREE_ENDPOINT === "YOUR_FORM_ID_HERE") {
                setTimeout(() => {
                    formSuccess.style.display = 'flex';
                    bookingForm.reset();
                    btn.innerHTML = originalHTML;
                    btn.disabled = false;
                    btn.style.opacity = '1';
                    setTimeout(() => { formSuccess.style.display = 'none'; }, 5000);
                }, 1000);
                return;
            }

            try {
                const formData = new FormData(bookingForm);
                const response = await fetch(FORMSPREE_ENDPOINT, {
                    method: 'POST',
                    body: formData,
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    formSuccess.style.display = 'flex';
                    formSuccess.innerHTML = "<i class='bx bx-check-circle'></i> Request sent successfully! We'll email you shortly.";
                    bookingForm.reset();
                } else {
                    alert("Oops! There was a problem submitting your form.");
                }
            } catch (error) {
                alert("Oops! Network error occurred.");
            } finally {
                btn.innerHTML = originalHTML;
                btn.disabled = false;
                btn.style.opacity = '1';
                setTimeout(() => { formSuccess.style.display = 'none'; }, 8000);
            }
        });
    }

    // ===== 9. Tilt Effect on Service Cards =====
    if (window.innerWidth > 768) {
        const cards = document.querySelectorAll('.service-card, .info-card');
        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = (y - centerY) / 20;
                const rotateY = (centerX - x) / 20;
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }

});
