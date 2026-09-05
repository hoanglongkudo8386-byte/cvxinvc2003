/* ============================================
   ANIMATIONS.JS — Typing Effect, Scroll Reveal,
   Progress Bar Animation
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    initScrollReveal();
    initTypingEffect();
    initProgressBars();
});

/* ========== SCROLL REVEAL (IntersectionObserver) ========== */
function initScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Animate once
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });
}

/* ========== TYPING EFFECT ========== */
function initTypingEffect() {
    const typingElement = document.getElementById('typing-text');
    if (!typingElement) return;

    const roles = [
        'Digital Marketer',
        'AI & Automation',
        'Content Creator',
        'Data-Driven Thinker'
    ];

    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let isWaiting = false;

    const TYPING_SPEED = 80;
    const DELETING_SPEED = 40;
    const WAIT_AFTER_TYPE = 2000;
    const WAIT_AFTER_DELETE = 500;

    function type() {
        const currentRole = roles[roleIndex];

        if (isWaiting) return;

        if (!isDeleting) {
            // Typing
            typingElement.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;

            if (charIndex === currentRole.length) {
                // Finished typing, wait then delete
                isWaiting = true;
                setTimeout(() => {
                    isWaiting = false;
                    isDeleting = true;
                    type();
                }, WAIT_AFTER_TYPE);
                return;
            }

            setTimeout(type, TYPING_SPEED);
        } else {
            // Deleting
            typingElement.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;

            if (charIndex === 0) {
                // Finished deleting, move to next role
                isDeleting = false;
                roleIndex = (roleIndex + 1) % roles.length;

                isWaiting = true;
                setTimeout(() => {
                    isWaiting = false;
                    type();
                }, WAIT_AFTER_DELETE);
                return;
            }

            setTimeout(type, DELETING_SPEED);
        }
    }

    // Start typing after a short delay
    setTimeout(type, 800);
}

/* ========== PROGRESS BAR ANIMATION ========== */
function initProgressBars() {
    const progressBars = document.querySelectorAll('.progress-fill');
    if (progressBars.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const fill = entry.target;
                const targetWidth = fill.getAttribute('data-width');
                if (targetWidth) {
                    // Small delay for visual effect
                    setTimeout(() => {
                        fill.style.width = targetWidth + '%';
                    }, 200);
                }
                observer.unobserve(fill);
            }
        });
    }, { threshold: 0.3 });

    progressBars.forEach(bar => observer.observe(bar));
}
