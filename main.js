/* -------------------------------------------------------------
  PRODUCT WITH BHARATH - INTERACTIVE APPLICATION CODE
  Logic: Typing effects, counters, filtering, validation, modals
------------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. CUSTOM CURSOR GLOW EFFECT (Subtle pointer tracking)
     ========================================================================== */
  const cursorGlow = document.getElementById('cursorGlow');
  
  if (cursorGlow && window.matchMedia('(pointer: fine)').matches) {
    document.addEventListener('mousemove', (e) => {
      cursorGlow.style.left = `${e.clientX}px`;
      cursorGlow.style.top = `${e.clientY}px`;
    });

    // Make glow expand slightly when hovering clickable elements
    const clickables = document.querySelectorAll('a, button, select, input, textarea, .project-card');
    clickables.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursorGlow.style.width = '500px';
        cursorGlow.style.height = '500px';
      });
      el.addEventListener('mouseleave', () => {
        cursorGlow.style.width = '400px';
        cursorGlow.style.height = '400px';
      });
    });
  }

  /* ==========================================================================
     2. THEME SWITCHING (Dark / Light Mode)
     ========================================================================== */
  const themeToggle = document.getElementById('themeToggle');
  const body = document.body;

  // Check LocalStorage or default to dark
  const savedTheme = localStorage.getItem('theme') || 'dark-theme';
  body.className = savedTheme;

  themeToggle.addEventListener('click', () => {
    if (body.classList.contains('dark-theme')) {
      body.classList.replace('dark-theme', 'light-theme');
      localStorage.setItem('theme', 'light-theme');
    } else {
      body.classList.replace('light-theme', 'dark-theme');
      localStorage.setItem('theme', 'dark-theme');
    }
  });

  /* ==========================================================================
     3. STICKY HEADER & SCROLL LINK HIGHLIGHTING
     ========================================================================== */
  const header = document.getElementById('header');
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');

  // Change header styling on scroll
  const handleHeaderScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  // Highlight current nav item on scroll
  const handleNavHighlight = () => {
    let current = '';
    const scrollPosition = window.scrollY + 120; // offset for header height

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href').slice(1) === current) {
        link.classList.add('active');
      }
    });
  };

  window.addEventListener('scroll', () => {
    handleHeaderScroll();
    handleNavHighlight();
  });

  // Run immediately on page load
  handleHeaderScroll();
  handleNavHighlight();

  /* ==========================================================================
     4. MOBILE NAVIGATION MENU TOGGLE
     ========================================================================== */
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');

  if (mobileToggle) {
    // ensure ARIA state exists for accessibility
    mobileToggle.setAttribute('aria-expanded', 'false');
  }

  const toggleMobileMenu = () => {
    if (!mobileToggle || !navMenu) return;

    mobileToggle.classList.toggle('active');
    navMenu.classList.toggle('active');

    const isOpen = navMenu.classList.contains('active');
    mobileToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');

    // Prevent scrolling when mobile menu is open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  };

  if (mobileToggle) mobileToggle.addEventListener('click', toggleMobileMenu);

  // Close mobile menu automatically when resizing to desktop
  window.addEventListener('resize', () => {
    if (!navMenu) return;
    if (window.innerWidth > 991 && navMenu.classList.contains('active')) {
      navMenu.classList.remove('active');
      if (mobileToggle) {
        mobileToggle.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
      }
      document.body.style.overflow = '';
    }
  });

  // Close menu when clicking link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu.classList.contains('active')) {
        toggleMobileMenu();
      }
    });
  });

  /* ==========================================================================
     5. HERO DYNAMIC TYPING EFFECT
     ========================================================================== */
  const typingText = document.getElementById('typingText');
  const phrases = [
    'Digital Interfaces',
    'High-Speed Code',
    'Stunning Brandscapes',
    'Scalable Applications'
  ];
  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  const typeEffect = () => {
    const currentPhrase = phrases[phraseIndex];
    
    if (isDeleting) {
      typingText.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 50; // faster backspacing
    } else {
      typingText.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 120; // natural typing speed
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
      isDeleting = true;
      typingSpeed = 2000; // hold before deleting
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typingSpeed = 500; // pause before typing next
    }

    setTimeout(typeEffect, typingSpeed);
  };

  if (typingText) {
    typeEffect();
  }

  /* ==========================================================================
     6. INCREMENTING STATS COUNTERS
     ========================================================================== */
  const statNumbers = document.querySelectorAll('.stat-number');
  let countersAnimated = false;

  const animateCounters = () => {
    statNumbers.forEach(stat => {
      const target = +stat.getAttribute('data-target');
      const duration = 2000; // 2 seconds
      const increment = target / (duration / 16); // ~60fps
      
      let count = 0;
      const updateCount = () => {
        count += increment;
        if (count < target) {
          stat.textContent = Math.ceil(count);
          setTimeout(updateCount, 16);
        } else {
          // ensure target is exact value and append indicators if needed
          stat.textContent = target + (target === 99 || target === 24 ? '' : '+');
        }
      };
      
      updateCount();
    });
  };

  /* ==========================================================================
     7. SCROLL-REVEAL ENTRANCE EFFECT (Intersection Observer)
     ========================================================================== */
  const revealElements = document.querySelectorAll('.scroll-reveal');
  
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target); // only reveal once
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // Separate observer for the stats section to trigger counters
  const statsSection = document.querySelector('.hero-stats');
  if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !countersAnimated) {
        animateCounters();
        countersAnimated = true;
      }
    }, { threshold: 0.5 });
    
    statsObserver.observe(statsSection);
  }

  /* ==========================================================================
     8. PORTFOLIO WORK FILTERING
     ========================================================================== */
  const filterButtons = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Set active button
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      portfolioItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        
        if (filterValue === 'all' || itemCategory === filterValue) {
          item.classList.remove('hidden');
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });

  /* ==========================================================================
     9. IN-PAGE WORK DETAILS MODAL DIALOG
     ========================================================================== */
  const projectModal = document.getElementById('projectModal');
  const modalClose = document.getElementById('modalClose');
  const modalBackdrop = document.getElementById('modalBackdrop');
  const modalBody = document.getElementById('modalBody');
  const detailButtons = document.querySelectorAll('.view-details-btn');

  // Detailed mock data for project showcase
  const projectData = {
    nova: {
      tag: 'Development & Analytics',
      title: 'Nova Crypto Platform',
      client: 'Nova Finance Group',
      timeline: '4 Months (2025)',
      service: 'Fullstack App & Security Audit',
      bgClass: 'bg-neon-1',
      icon: 'line-chart',
      desc: 'Nova Crypto is a secure, real-time analytics panel displaying live tickers, order flow depth, and trading volumes. The project involved creating a blazing-fast dashboard using reactive frontend patterns, integrated with WebSocket endpoints to stream live asset records with sub-millisecond latency.',
      features: [
        'Secure client-side cryptographic transaction signing validation.',
        'Custom light-weight charting engine rendering 10k+ ticks without frame drops.',
        'High-density dashboard tailored for multi-monitor desktop display setups.'
      ],
      tech: ['ES6 Javascript', 'WebSockets', 'Canvas API', 'Chart.js', 'CSS Grid']
    },
    aero: {
      tag: 'UI/UX Design & Prototyping',
      title: 'Aero Workspace Mobile App',
      client: 'Aero Shared Spaces Inc.',
      timeline: '2 Months (2025)',
      service: 'Mobile Interface Design & Gestures',
      bgClass: 'bg-neon-2',
      icon: 'smartphone',
      desc: 'Aero is a workspace discovery application. The challenge was to deliver a booking flow that allows users to find, audit, and reserve office spaces in under three taps. Product with Bharath developed the user interaction prototype, testing gesture responsiveness and card-based transitions.',
      features: [
        'Gesture-heavy layout favoring quick swipes and card expansions.',
        'Subtle sound design and visual micro-reactions for successful triggers.',
        'Fully documented component library exported directly for developers.'
      ],
      tech: ['Figma Prototyping', 'Interaction Design', 'CSS Transitions', 'SVG Vector Art']
    },
    helios: {
      tag: 'Branding & Smart Systems',
      title: 'Helios Smart Home Suite',
      client: 'Helios Energy Corp.',
      timeline: '3 Months (2026)',
      service: 'Brand Identity & Web Assets',
      bgClass: 'bg-neon-3',
      icon: 'sun',
      desc: 'Helios designs solar-powered smart appliances. We rebuilt their brand architecture from the ground up, writing brand-guideline books, designing iconography symbols, and structuring a highly visual web interface to present solar performance metrics directly to consumers.',
      features: [
        'Complete scalable SVG logo suite that remains legible at 16px.',
        'Energetic dark/warm styling, utilizing custom icons to represent solar outputs.',
        'Interactive energy-saving estimator tool embedded on landing page.'
      ],
      tech: ['Brand Architecture', 'Bespoke SVG Design', 'Vanilla JS Math Engine', 'CSS Keyframes']
    },
    quill: {
      tag: 'AI Tools & SaaS',
      title: 'Quill Content Editor',
      client: 'Quill AI Systems',
      timeline: '5 Months (2025)',
      service: 'Product Design & Frontend Engine',
      bgClass: 'bg-neon-4',
      icon: 'feather',
      desc: 'Quill is a content editor platform utilizing local models to refine author phrasing. Product with Bharath engineered the core web-based text-editor. It supports instant autosave, deep markdown hotkey triggers, offline synchronization, and an interactive assistant sidebar.',
      features: [
        'Zero-latency local keystroke parser translating markdown notation on-the-fly.',
        'Optimized client-side IndexedDB persistence logic preventing loss of edits.',
        'Extremely lightweight package bundle for low network throughput speed.'
      ],
      tech: ['Vanilla JS Editor Core', 'IndexedDB', 'Markdown Parser', 'CSS Flexbox']
    },
    lumina: {
      tag: 'Creative Ecommerce',
      title: 'Lumina Fashion Store',
      client: 'Lumina Apparel Ltd.',
      timeline: '3 Months (2026)',
      service: 'Web Design & Micro-interactions',
      bgClass: 'bg-neon-5',
      icon: 'shopping-bag',
      desc: 'Lumina fashion represents an interactive lookbook experience. Rejecting standard grid templates, we built a carousel and typography-driven layout that feels like reading a luxury physical print magazine, loaded with smooth scroll effects.',
      features: [
        'Scroll-snapping slides representing different clothing collections.',
        'Dynamic zoom hover metrics detailing fabric stitching detail.',
        'Minimalist AJAX-simulated cart panel easing purchasing friction.'
      ],
      tech: ['Scroll-Snap CSS', 'Advanced Hover Matrices', 'Vanilla JS Events', 'Responsive Grids']
    },
    vertex: {
      tag: 'Corporate Identity & Logistics',
      title: 'Vertex Logistics Rebrand',
      client: 'Vertex Global Shipping',
      timeline: '4 Months (2025)',
      service: 'Brand Guidelines & Corporate Website',
      bgClass: 'bg-neon-6',
      icon: 'package',
      desc: 'Vertex is a multinational logistics enterprise. We upgraded their branding, modernizing their look for digital applications. The website features an interactive parcel tracking flow that visually models transit checkpoints.',
      features: [
        'Clean, trustworthy visual style featuring high contrast grids.',
        'Custom interactive tracking line reflecting live package coordinates.',
        'Bilingual localization layout toggling instantly without reload.'
      ],
      tech: ['Corporate UI Systems', 'Dynamic SVG Pipelines', 'JSON Parsers', 'Responsive Design']
    }
  };

  const openModal = (projectId) => {
    const data = projectData[projectId];
    if (!data) return;

    // Build modal inner content
    let techTagsHtml = data.tech.map(t => `<span class="tech-tag">${t}</span>`).join('');
    let featuresHtml = data.features.map(f => `<li>${f}</li>`).join('');

    modalBody.innerHTML = `
      <div class="modal-proj-header">
        <span class="modal-proj-tag">${data.tag}</span>
        <h3 class="modal-proj-title">${data.title}</h3>
        
        <div class="modal-proj-meta-grid">
          <div>
            <span class="meta-col-label">Client</span>
            <span class="meta-col-val">${data.client}</span>
          </div>
          <div>
            <span class="meta-col-label">Timeline</span>
            <span class="meta-col-val">${data.timeline}</span>
          </div>
          <div>
            <span class="meta-col-label">Service</span>
            <span class="meta-col-val">${data.service}</span>
          </div>
        </div>
      </div>

      <div class="modal-proj-visual ${data.bgClass}">
        <i data-lucide="${data.icon}" style="width: 80px; height: 80px; color: var(--accent-yellow);"></i>
      </div>

      <div class="modal-proj-desc">
        <h4>Project Overview</h4>
        <p>${data.desc}</p>
        
        <h4 style="margin-top: 24px;">Key Deliverables</h4>
        <ul class="service-bullets" style="margin-bottom: 24px;">
          ${featuresHtml}
        </ul>
      </div>

      <div class="modal-proj-tech">
        <h4>Technologies Used</h4>
        <div class="tech-tags">
          ${techTagsHtml}
        </div>
      </div>
    `;

    // Re-initialize icons inside modal
    lucide.createIcons();

    // Show modal and lock page scroll
    projectModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    projectModal.classList.remove('active');
    document.body.style.overflow = '';
    setTimeout(() => {
      modalBody.innerHTML = '';
    }, 300);
  };

  // Attach click listeners to detail buttons
  detailButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const projId = btn.getAttribute('data-project');
      openModal(projId);
    });
  });

  // Close triggers
  modalClose.addEventListener('click', closeModal);
  modalBackdrop.addEventListener('click', closeModal);
  
  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && projectModal.classList.contains('active')) {
      closeModal();
    }
  });

  /* ==========================================================================
     10. CONTACT FORM CLIENT-SIDE VALIDATION & HANDLING
     ========================================================================== */
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');
  const formResetBtn = document.getElementById('formResetBtn');

  // Input fields
  const nameInput = document.getElementById('formName');
  const emailInput = document.getElementById('formEmail');
  const serviceInput = document.getElementById('formService');
  const messageInput = document.getElementById('formMessage');

  // Helper to validate email regex
  const isValidEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  // Validate a single field
  const validateField = (input, errorEl, checkFn) => {
    const parent = input.closest('.form-group');
    const isValid = checkFn ? checkFn(input.value) : input.value.trim() !== '';
    
    if (isValid) {
      parent.classList.remove('invalid');
      return true;
    } else {
      parent.classList.add('invalid');
      return false;
    }
  };

  // Real-time input listener removes error triggers
  const setupRealTimeValidation = (input, checkFn) => {
    input.addEventListener('input', () => {
      const parent = input.closest('.form-group');
      const isValid = checkFn ? checkFn(input.value) : input.value.trim() !== '';
      if (isValid) {
        parent.classList.remove('invalid');
      }
    });
  };

  setupRealTimeValidation(nameInput);
  setupRealTimeValidation(emailInput, isValidEmail);
  setupRealTimeValidation(serviceInput);
  setupRealTimeValidation(messageInput);

  // Form submission handler
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Run full validations
      const isNameValid = validateField(nameInput);
      const isEmailValid = validateField(emailInput, null, isValidEmail);
      const isServiceValid = validateField(serviceInput);
      const isMessageValid = validateField(messageInput);

      if (isNameValid && isEmailValid && isServiceValid && isMessageValid) {
        // Disable submit button during animation transition
        const submitBtn = document.getElementById('formSubmitBtn');
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Sending Inquiries...';

        // Simulate API network response (1 second delay)
        setTimeout(() => {
          // Hide form, show success message
          contactForm.classList.add('hidden');
          formSuccess.classList.add('active');
          
          // Reset button text
          submitBtn.disabled = false;
          submitBtn.innerHTML = 'Send Inquiry <i data-lucide="send" class="btn-icon-right"></i>';
          lucide.createIcons();
        }, 1000);
      }
    });
  }

  // Success Reset handler
  if (formResetBtn) {
    formResetBtn.addEventListener('click', () => {
      contactForm.reset();
      
      // Remove any validation residual classes
      const formGroups = contactForm.querySelectorAll('.form-group');
      formGroups.forEach(g => g.classList.remove('invalid'));
      
      formSuccess.classList.remove('active');
      contactForm.classList.remove('hidden');
    });
  }

  /* ==========================================================================
     11. TESTIMONIALS SLIDER (Simple Carousel Logic)
     ========================================================================== */
  // Feel free to add automated sliding intervals or navigation arrows here!
  // In this single review slide design, we render client details smoothly.

});
