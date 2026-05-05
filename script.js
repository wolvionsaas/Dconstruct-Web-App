// Mobile Menu Toggle
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');
const navOverlay = document.getElementById('navOverlay');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Smooth Scroll (exclude modal links)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    // Skip modal links
    if (anchor.hasAttribute('data-project-modal')) {
        return;
    }
    
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Header Scroll Effect (hide on scroll down, show on scroll up)
const header = document.getElementById('header');
let lastScroll = 0;
const scrollThreshold = 80;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

    // Add background + shadow after threshold
    if (currentScroll > scrollThreshold) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }

    // Determine scroll direction
    if (
        currentScroll > lastScroll &&                // scrolling down
        currentScroll > scrollThreshold &&          // past hero
        !navMenu.classList.contains('active') &&    // don't hide if mobile menu open
        !header.classList.contains('nav-overlay-open') // don't hide if mega menu open
    ) {
        header.classList.add('header-hidden');
    } else {
        header.classList.remove('header-hidden');
    }

    lastScroll = currentScroll <= 0 ? 0 : currentScroll;
});

// Mega Navigation Overlay behaviour (desktop only)
let navOverlayTimeout;

function openNavOverlay() {
    if (window.innerWidth <= 968) return;
    clearTimeout(navOverlayTimeout);
    navOverlay.classList.add('active');
    header.classList.add('nav-overlay-open');
}

function closeNavOverlay() {
    clearTimeout(navOverlayTimeout);
    navOverlayTimeout = setTimeout(() => {
        navOverlay.classList.remove('active');
        header.classList.remove('nav-overlay-open');
    }, 150);
}

header.addEventListener('mouseenter', () => {
    openNavOverlay();
});

// Open overlay when hovering any top-level nav link (desktop)
navLinks.forEach(link => {
    link.addEventListener('mouseenter', () => {
        openNavOverlay();
    });
});

navOverlay.addEventListener('mouseenter', () => {
    clearTimeout(navOverlayTimeout);
});

navOverlay.addEventListener('mouseleave', () => {
    closeNavOverlay();
});

window.addEventListener('scroll', () => {
    // Close overlay on scroll for a cleaner experience
    if (navOverlay.classList.contains('active')) {
        closeNavOverlay();
    }
});

// Hero Slider
let currentSlide = 0;
const slides = document.querySelectorAll('.hero-slide');
const indicators = document.querySelectorAll('.indicator');
const totalSlides = slides.length;

function showSlide(index) {
    slides.forEach((slide, i) => {
        slide.classList.remove('active');
        indicators[i].classList.remove('active');
    });
    
    slides[index].classList.add('active');
    indicators[index].classList.add('active');
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    showSlide(currentSlide);
}

// Auto-advance hero slider
setInterval(nextSlide, 5000);

// Indicator click handlers
indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => {
        currentSlide = index;
        showSlide(currentSlide);
    });
});

// Scroll Animations (AOS - Animate On Scroll)
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('aos-animate');
        }
    });
}, observerOptions);

// Observe all elements with data-aos attribute
document.querySelectorAll('[data-aos]').forEach(el => {
    observer.observe(el);
});

// Active Navigation Link on Scroll
const sections = document.querySelectorAll('section[id]');

function activateNavLink() {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', activateNavLink);

// Contact Form Handler
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form values
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    
    // Simple validation
    if (name && email && message) {
        // Here you would typically send the form data to a server
        alert('Thank you for your message! We will get back to you soon.');
        contactForm.reset();
    } else {
        alert('Please fill in all fields.');
    }
});

// Parallax Effect removed to prevent overlap with statement section

// Statement Section - Word Color Animation on Scroll
function animateWordsOnScroll() {
    const statementSection = document.querySelector('.statement-section');
    if (!statementSection) return;

    const words = document.querySelectorAll('.statement-line .word');
    if (words.length === 0) return;

    const sectionTop = statementSection.offsetTop;
    const sectionHeight = statementSection.offsetHeight;
    const windowHeight = window.innerHeight;
    
    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset;
        const sectionStart = sectionTop - windowHeight * 0.5;
        const sectionEnd = sectionTop + sectionHeight - windowHeight * 0.3;
        
        // Check if section is in viewport
        if (scrollY >= sectionStart && scrollY <= sectionEnd) {
            // Calculate progress through the section (0 to 1)
            const progress = (scrollY - sectionStart) / (sectionEnd - sectionStart);
            const progressClamped = Math.max(0, Math.min(1, progress));
            
            // Calculate which words should be active based on scroll progress
            const totalWords = words.length;
            const activeIndex = Math.floor(progressClamped * totalWords);
            
            // Remove active class from all words
            words.forEach(word => word.classList.remove('active'));
            
            // Add active class to words up to activeIndex
            for (let i = 0; i <= activeIndex && i < totalWords; i++) {
                words[i].classList.add('active');
            }
        } else if (scrollY < sectionStart) {
            // Before section - remove all active classes
            words.forEach(word => word.classList.remove('active'));
        } else if (scrollY > sectionEnd) {
            // After section - all words should be active
            words.forEach(word => word.classList.add('active'));
        }
    });
}

// Initialize word animation
animateWordsOnScroll();

// Project Modal Functionality
const projectModal = document.getElementById('projectModal');
const modalClose = document.getElementById('modalClose');
const projectLinks = document.querySelectorAll('[data-project-modal]');

function openProjectModal(projectCard) {
    const title = projectCard.getAttribute('data-project-title');
    const image = projectCard.getAttribute('data-project-image');
    const description = projectCard.getAttribute('data-project-description');
    const details = projectCard.getAttribute('data-project-details');
    const location = projectCard.getAttribute('data-project-location');
    const year = projectCard.getAttribute('data-project-year');

    // Populate modal with project data
    document.getElementById('modalProjectTitle').textContent = title || 'Project Title';
    document.getElementById('modalProjectImage').src = image || '';
    document.getElementById('modalProjectImage').alt = title || 'Project Image';
    document.getElementById('modalProjectDescription').textContent = description || '';
    document.getElementById('modalProjectDetails').textContent = details || '';
    document.getElementById('modalProjectLocation').textContent = location || '';
    document.getElementById('modalProjectYear').textContent = year || '';

    // Show modal
    projectModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeProjectModal() {
    projectModal.classList.remove('active');
    document.body.style.overflow = '';
}

// Open modal when clicking "View Details"
projectLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const projectCard = link.closest('.project-card');
        if (projectCard) {
            openProjectModal(projectCard);
        }
    });
});

// Close modal when clicking close button
modalClose.addEventListener('click', closeProjectModal);

// Close modal when clicking overlay
projectModal.addEventListener('click', (e) => {
    if (e.target === projectModal || e.target.classList.contains('modal-overlay')) {
        closeProjectModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && projectModal.classList.contains('active')) {
        closeProjectModal();
    }
});

// Initialize on page load
function initializePage() {
    // Show first slide
    if (typeof showSlide === 'function') {
        showSlide(0);
    }
    
    // Activate nav link on page load
    if (typeof activateNavLink === 'function') {
        activateNavLink();
    }
    
    // Initialize expertise accordion
    initExpertiseAccordion();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePage);
} else {
    // DOM is already loaded
    initializePage();
}

// Expertise Accordion Functionality
function initExpertiseAccordion() {
    // Wait a bit to ensure DOM is ready
    setTimeout(() => {
        const expertiseItems = document.querySelectorAll('.about-expertise-item');
        
        console.log('Found expertise items:', expertiseItems.length);
        
        expertiseItems.forEach((item) => {
            const header = item.querySelector('.about-expertise-header');
            
            if (!header) {
                console.log('Header not found');
                return;
            }
            
            // Remove any existing event listeners by cloning
            const newHeader = header.cloneNode(true);
            header.parentNode.replaceChild(newHeader, header);
            
            // Add click event to the new header
            newHeader.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                const isActive = item.classList.contains('active');
                
                // Close all items first
                expertiseItems.forEach(otherItem => {
                    otherItem.classList.remove('active');
                });
                
                // Toggle the clicked item
                if (!isActive) {
                    item.classList.add('active');
                }
            });
            
            // Ensure cursor pointer
            newHeader.style.cursor = 'pointer';
        });
        
        console.log('Expertise accordion initialized');
    }, 100);
}
