document.addEventListener('DOMContentLoaded', () => {

  /* =========================================
     1. ACTIVE PAGE HIGHLIGHT & NAV SCROLL
     ========================================= */
  const headerNav = document.getElementById('headerNav');
  const logoLink = document.getElementById('logoLink');
  const menuToggle = document.getElementById('menuToggle');
  const navLinksContainer = document.getElementById('navLinks');
  const navLinks = document.querySelectorAll('.nav-links a:not(.nav-btn)');

  // Set active link based on current page URL
  const currentPathname = window.location.pathname;
  const currentFile = currentPathname.substring(currentPathname.lastIndexOf('/') + 1) || 'index.html';
  
  navLinks.forEach(link => {
    link.classList.remove('active');
    const linkHref = link.getAttribute('href');
    
    if (linkHref === currentFile) {
      link.classList.add('active');
    } else if (currentFile === '' || currentFile === 'index.html') {
      if (linkHref === 'index.html') {
        link.classList.add('active');
      }
    }
  });

  // Dynamic header styles on scroll (only applies if we are on the Home Page where header starts transparent)
  const isHomePage = document.body.classList.contains('home-page');
  
  if (isHomePage) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        headerNav.classList.add('scrolled');
        logoLink.classList.remove('light');
      } else {
        headerNav.classList.remove('scrolled');
        logoLink.classList.add('light');
      }
    });
  }

  // Mobile Menu Toggle
  if (menuToggle && navLinksContainer) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      navLinksContainer.classList.toggle('active');
    });

    // Close Mobile Menu on Link Click
    document.querySelectorAll('.nav-links a').forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navLinksContainer.classList.remove('active');
      });
    });
  }


  /* =========================================
     2. SERVICES TABS SYSTEM
     ========================================= */
  const tabButtons = document.querySelectorAll('.tab-btn');
  const servicePanes = document.querySelectorAll('.services-pane');

  if (tabButtons.length > 0 && servicePanes.length > 0) {
    tabButtons.forEach(button => {
      button.addEventListener('click', () => {
        const targetId = button.getAttribute('data-target');

        // Update active tab button
        tabButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        // Update active pane
        servicePanes.forEach(pane => {
          if (pane.id === targetId) {
            pane.classList.add('active');
            // Restart scroll reveal evaluation for inner cards
            const cards = pane.querySelectorAll('.service-card');
            cards.forEach(card => card.classList.add('active'));
          } else {
            pane.classList.remove('active');
          }
        });
      });
    });
  }


  /* =========================================
     3. PINTEREST GALLERY LIGHTBOX
     ========================================= */
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');

  if (galleryItems.length > 0 && lightbox && lightboxImg) {
    galleryItems.forEach(item => {
      item.addEventListener('click', () => {
        const imgSrc = item.getAttribute('data-src');
        lightboxImg.src = imgSrc;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Lock background scrolling
      });
    });

    const closeLightbox = () => {
      lightbox.classList.remove('active');
      document.body.style.overflow = 'auto'; // Unlock background scrolling
    };

    if (lightboxClose) {
      lightboxClose.addEventListener('click', closeLightbox);
    }
    
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });
  }


  /* =========================================
     4. TESTIMONIALS CAROUSEL
     ========================================= */
  const carouselWrapper = document.getElementById('carouselWrapper');
  const slides = document.querySelectorAll('.testimonial-slide');
  const prevBtn = document.getElementById('carouselPrev');
  const nextBtn = document.getElementById('carouselNext');
  const dots = document.querySelectorAll('.dot');

  if (carouselWrapper && slides.length > 0) {
    let currentSlide = 0;
    const slideCount = slides.length;
    let autoplayInterval;

    const updateCarousel = (index) => {
      currentSlide = index;
      carouselWrapper.style.transform = `translateX(-${currentSlide * 100}%)`;
      
      // Update dots
      dots.forEach(dot => dot.classList.remove('active'));
      if (dots[currentSlide]) {
        dots[currentSlide].classList.add('active');
      }
    };

    const nextSlide = () => {
      let nextIdx = (currentSlide + 1) % slideCount;
      updateCarousel(nextIdx);
    };

    const prevSlide = () => {
      let prevIdx = (currentSlide - 1 + slideCount) % slideCount;
      updateCarousel(prevIdx);
    };

    // Event Listeners for controls
    if (nextBtn) nextBtn.addEventListener('click', () => {
      nextSlide();
      resetAutoplay();
    });
    if (prevBtn) prevBtn.addEventListener('click', () => {
      prevSlide();
      resetAutoplay();
    });

    dots.forEach(dot => {
      dot.addEventListener('click', () => {
        const index = parseInt(dot.getAttribute('data-index'), 10);
        updateCarousel(index);
        resetAutoplay();
      });
    });

    // Autoplay Logic
    const startAutoplay = () => {
      autoplayInterval = setInterval(nextSlide, 6000);
    };

    const resetAutoplay = () => {
      clearInterval(autoplayInterval);
      startAutoplay();
    };

    startAutoplay();
  }


  /* =========================================
     5. STATS ANIMATED COUNTERS
     ========================================= */
  const counters = document.querySelectorAll('.counter');
  const statsSection = document.getElementById('statistics');
  let countersAnimated = false;

  const animateCounters = () => {
    counters.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-target'), 10);
      const duration = 2000; // Animation duration in ms
      let currentVal = 0;
      
      const incrementStep = Math.ceil(target / (duration / 30)); // Scale steps for fluid render
      
      const timer = setInterval(() => {
        currentVal += incrementStep;
        if (currentVal >= target) {
          counter.innerText = target + '+';
          clearInterval(timer);
        } else {
          counter.innerText = currentVal;
        }
      }, 30);
    });
  };

  if (statsSection && counters.length > 0) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !countersAnimated) {
          animateCounters();
          countersAnimated = true;
        }
      });
    }, { threshold: 0.5 });

    statsObserver.observe(statsSection);
  }


  /* =========================================
     6. FAQ ACCORDION LAYOUT
     ========================================= */
  const faqHeaders = document.querySelectorAll('.faq-header');

  if (faqHeaders.length > 0) {
    faqHeaders.forEach(header => {
      header.addEventListener('click', () => {
        const faqItem = header.parentElement;
        const content = faqItem.querySelector('.faq-content');

        // Toggle current item
        if (faqItem.classList.contains('active')) {
          content.style.maxHeight = '0';
          faqItem.classList.remove('active');
        } else {
          // Close other FAQ items
          document.querySelectorAll('.faq-item').forEach(item => {
            item.classList.remove('active');
            item.querySelector('.faq-content').style.maxHeight = '0';
          });

          faqItem.classList.add('active');
          content.style.maxHeight = content.scrollHeight + 'px';
        }
      });
    });
  }


  /* =========================================
     7. LUXURY BOOKING FORM VALIDATION & MODAL
     ========================================= */
  const bookingForm = document.getElementById('bookingForm');
  const successModal = document.getElementById('successModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');

  // Set minimum date picker input to today
  const bookingDateInput = document.getElementById('bookingDate');
  if (bookingDateInput) {
    const today = new Date().toISOString().split('T')[0];
    bookingDateInput.min = today;
  }

  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Perform simple client side checks
      const name = document.getElementById('bookingName').value.trim();
      const phone = document.getElementById('bookingPhone').value.trim();
      const email = document.getElementById('bookingEmail').value.trim();
      const service = document.getElementById('bookingService').value;
      const date = document.getElementById('bookingDate').value;
      const time = document.getElementById('bookingTime').value;

      if (name && phone && email && service && date && time) {
        // Show Success Modal Dialog
        if (successModal) {
          successModal.classList.add('active');
        }
        bookingForm.reset();
      }
    });
  }

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', () => {
      successModal.classList.remove('active');
    });
  }

  // Close modal when clicking on layout backdrop
  if (successModal) {
    successModal.addEventListener('click', (e) => {
      if (e.target === successModal) {
        successModal.classList.remove('active');
      }
    });
  }


  /* =========================================
     8. BACK-TO-TOP BUTTON
     ========================================= */
  const backToTop = document.getElementById('backToTop');

  if (backToTop) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 500) {
        backToTop.classList.add('active');
      } else {
        backToTop.classList.remove('active');
      }
    });

    backToTop.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }


  /* =========================================
     9. SCROLL REVEAL (AOS SUBSTITUTE)
     ========================================= */
  const revealElements = document.querySelectorAll('.reveal-up, .reveal-fade, .reveal-zoom');

  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(element => {
      const rect = element.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom >= 0) {
        element.classList.add('active');
      } else {
        revealObserver.observe(element);
      }
    });
  }
});
