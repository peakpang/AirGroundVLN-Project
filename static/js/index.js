window.HELP_IMPROVE_VIDEOJS = false;

// More Works Dropdown Functionality
function toggleMoreWorks() {
    const dropdown = document.getElementById('moreWorksDropdown');
    const button = document.querySelector('.more-works-btn');
    
    if (dropdown.classList.contains('show')) {
        dropdown.classList.remove('show');
        button.classList.remove('active');
    } else {
        dropdown.classList.add('show');
        button.classList.add('active');
    }
}

// Close dropdown when clicking outside
document.addEventListener('click', function(event) {
    const container = document.querySelector('.more-works-container');
    const dropdown = document.getElementById('moreWorksDropdown');
    const button = document.querySelector('.more-works-btn');
    
    if (container && !container.contains(event.target)) {
        dropdown.classList.remove('show');
        button.classList.remove('active');
    }
});

// Close dropdown on escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const dropdown = document.getElementById('moreWorksDropdown');
        const button = document.querySelector('.more-works-btn');
        dropdown.classList.remove('show');
        button.classList.remove('active');
    }
});

// Copy BibTeX to clipboard
function copyBibTeX() {
    const bibtexElement = document.getElementById('bibtex-code');
    const button = document.querySelector('.copy-bibtex-btn');
    const copyText = button.querySelector('.copy-text');
    
    if (bibtexElement) {
        navigator.clipboard.writeText(bibtexElement.textContent).then(function() {
            // Success feedback
            button.classList.add('copied');
            copyText.textContent = 'Cop';
            
            setTimeout(function() {
                button.classList.remove('copied');
                copyText.textContent = 'Copy';
            }, 2000);
        }).catch(function(err) {
            console.error('Failed to copy: ', err);
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = bibtexElement.textContent;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            
            button.classList.add('copied');
            copyText.textContent = 'Cop';
            setTimeout(function() {
                button.classList.remove('copied');
                copyText.textContent = 'Copy';
            }, 2000);
        });
    }
}

// Scroll to top functionality
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Show/hide scroll to top button
window.addEventListener('scroll', function() {
    const scrollButton = document.querySelector('.scroll-to-top');
    if (window.pageYOffset > 300) {
        scrollButton.classList.add('visible');
    } else {
        scrollButton.classList.remove('visible');
    }
});

// Video carousel autoplay when in view
function setupVideoCarouselAutoplay() {
    const carouselVideos = document.querySelectorAll('.results-carousel video');
    
    if (carouselVideos.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const video = entry.target;
            if (entry.isIntersecting) {
                // Video is in view, play it
                video.play().catch(e => {
                    // Autoplay failed, probably due to browser policy
                    console.log('Autoplay prevented:', e);
                });
            } else {
                // Video is out of view, pause it
                video.pause();
            }
        });
    }, {
        threshold: 0.5 // Trigger when 50% of the video is visible
    });
    
    carouselVideos.forEach(video => {
        observer.observe(video);
    });
}

function setupTrajectoryCarousel() {
    const trajectoryCarousel = document.querySelector('[data-trajectory-carousel]');
    if (!trajectoryCarousel) return;

    const slides = Array.from(trajectoryCarousel.querySelectorAll('.trajectory-slide'));
    const dots = Array.from(trajectoryCarousel.querySelectorAll('[data-trajectory-dot]'));
    const previousButton = trajectoryCarousel.querySelector('[data-trajectory-prev]');
    const nextButton = trajectoryCarousel.querySelector('[data-trajectory-next]');
    let currentSlide = 0;
    let autoplayTimer;

    function showTrajectory(index) {
        currentSlide = (index + slides.length) % slides.length;
        slides.forEach((slide, slideIndex) => {
            slide.classList.toggle('is-active', slideIndex === currentSlide);
        });
        dots.forEach((dot, dotIndex) => {
            dot.classList.toggle('is-active', dotIndex === currentSlide);
            dot.setAttribute('aria-current', dotIndex === currentSlide ? 'true' : 'false');
        });
    }

    function restartAutoplay() {
        window.clearInterval(autoplayTimer);
        autoplayTimer = window.setInterval(() => showTrajectory(currentSlide + 1), 7000);
    }

    previousButton.addEventListener('click', () => {
        showTrajectory(currentSlide - 1);
        restartAutoplay();
    });
    nextButton.addEventListener('click', () => {
        showTrajectory(currentSlide + 1);
        restartAutoplay();
    });
    dots.forEach((dot, dotIndex) => dot.addEventListener('click', () => {
        showTrajectory(dotIndex);
        restartAutoplay();
    }));
    trajectoryCarousel.addEventListener('mouseenter', () => window.clearInterval(autoplayTimer));
    trajectoryCarousel.addEventListener('mouseleave', restartAutoplay);
    showTrajectory(0);
    restartAutoplay();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupTrajectoryCarousel);
} else {
    setupTrajectoryCarousel();
}
