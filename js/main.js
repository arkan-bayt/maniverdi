// Main JavaScript file for Mani Verdi website

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initNavigation();
    initScrollEffects();
    initGallery();
    initContactForm();
    initAnimations();
    initBackToTop();
    initWebsiteUpdates();
    loadDynamicContent();
});

// Initialize website update system
function initWebsiteUpdates() {
    // Listen for updates from admin panel
    window.addEventListener('message', function(event) {
        if (event.data && event.data.type === 'WEBSITE_UPDATE') {
            handleWebsiteUpdate(event.data.data);
        }
    });
    
    // Check for published updates on page load
    checkForUpdates();
}

// Handle website updates from admin panel
function handleWebsiteUpdate(data) {
    try {
        // Update content
        if (data.content) {
            updateSiteContent(data.content);
        }
        
        // Update gallery
        if (data.gallery) {
            updateGalleryContent(data.gallery);
        }
        
        // Update services
        if (data.services) {
            updateServicesContent(data.services);
        }
        
        // Apply settings
        if (data.settings) {
            applyWebsiteSettings(data.settings);
        }
        
        showUpdateNotification('Sito web aggiornato con le ultime modifiche!');
        
    } catch (error) {
        console.error('Error updating website:', error);
    }
}

// Update site content
function updateSiteContent(content) {
    // Update hero section
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const heroDescription = document.querySelector('.hero-description');
    
    if (heroTitle && content.heroTitle) {
        heroTitle.textContent = content.heroTitle;
    }
    
    if (heroSubtitle && content.heroSubtitle) {
        heroSubtitle.textContent = content.heroSubtitle;
    }
    
    if (heroDescription && content.heroDescription) {
        heroDescription.textContent = content.heroDescription;
    }
    
    // Update about section
    const aboutText = document.querySelector('.about-description');
    if (aboutText && content.aboutText) {
        aboutText.textContent = content.aboutText;
    }
    
    // Update contact info
    updateContactInfo(content);
}

// Update contact information
function updateContactInfo(content) {
    // Update phone numbers
    if (content.phone) {
        const phoneElements = document.querySelectorAll('a[href^="tel:"]');
        phoneElements.forEach(el => {
            el.href = `tel:${content.phone}`;
            el.textContent = content.phone;
        });
    }
    
    // Update email addresses
    if (content.email) {
        const emailElements = document.querySelectorAll('a[href^="mailto:"]');
        emailElements.forEach(el => {
            el.href = `mailto:${content.email}`;
            el.textContent = content.email;
        });
    }
    
    // Update address
    if (content.address) {
        const addressElements = document.querySelectorAll('.contact-item p');
        addressElements.forEach(el => {
            if (el.textContent.includes('Novara')) {
                el.textContent = content.address;
            }
        });
    }
}

// Update gallery content
function updateGalleryContent(galleryData) {
    const galleryGrid = document.getElementById('galleryGrid');
    
    if (galleryGrid && galleryData && galleryData.length > 0) {
        // Clear existing items
        galleryGrid.innerHTML = '';
        
        // Add new items
        galleryData.forEach(item => {
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item';
            galleryItem.setAttribute('data-category', item.category);
            galleryItem.innerHTML = `
                <img src="${item.src}" alt="${item.title}" loading="lazy">
                <div class="gallery-overlay">
                    <h4>${item.title}</h4>
                    <p>${item.category ? 'Categoria: ' + item.category : ''}</p>
                    <button class="view-btn" onclick="openModal('${item.src}')">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
            `;
            
            galleryGrid.appendChild(galleryItem);
        });
        
        // Reinitialize gallery filters
        initGalleryFilters();
        
        // Trigger animations for new items
        animateGalleryItems();
    }
}

// Update services content
function updateServicesContent(servicesData) {
    const servicesGrid = document.querySelector('.services-grid');
    
    if (servicesGrid && servicesData && servicesData.length > 0) {
        servicesGrid.innerHTML = servicesData.map(service => `
            <div class="service-item">
                <div class="service-icon">
                    <i class="${service.icon}"></i>
                </div>
                <h3>${service.title}</h3>
                <p>${service.description}</p>
                <ul class="service-features">
                    ${service.features ? service.features.map(feature => `<li>${feature}</li>`).join('') : ''}
                </ul>
                <a href="#contatti" class="service-btn">Richiedi Preventivo</a>
            </div>
        `).join('');
        
        // Animate new service items
        animateServiceItems();
    }
}

// Apply website settings
function applyWebsiteSettings(settings) {
    if (!settings) return;
    
    const root = document.documentElement;
    
    // Apply color settings
    if (settings.primaryColor) {
        root.style.setProperty('--primary-color', settings.primaryColor);
    }
    
    if (settings.secondaryColor) {
        root.style.setProperty('--secondary-color', settings.secondaryColor);
    }
    
    if (settings.accentColor) {
        root.style.setProperty('--accent-color', settings.accentColor);
    }
    
    // Apply font settings
    if (settings.primaryFont) {
        document.body.style.fontFamily = `${settings.primaryFont}, sans-serif`;
    }
    
    if (settings.fontSize) {
        document.body.style.fontSize = settings.fontSize;
    }
}

// Check for published updates
function checkForUpdates() {
    try {
        const publishedData = localStorage.getItem('publishedWebsiteData');
        if (publishedData) {
            const data = JSON.parse(publishedData);
            const lastCheck = localStorage.getItem('lastUpdateCheck');
            const currentTime = new Date().getTime();
            
            // Check every 5 minutes
            if (!lastCheck || (currentTime - parseInt(lastCheck)) > 300000) {
                localStorage.setItem('lastUpdateCheck', currentTime.toString());
                
                if (data.lastUpdated) {
                    const lastUpdated = new Date(data.lastUpdated).getTime();
                    const pageLoaded = window.performance.timing.navigationStart;
                    
                    if (lastUpdated > pageLoaded) {
                        // New updates available
                        showUpdateAvailableNotification(data);
                    }
                }
            }
        }
    } catch (error) {
        console.log('Error checking for updates:', error);
    }
}

// Load dynamic content from stored data
function loadDynamicContent() {
    try {
        const mainWebsiteData = localStorage.getItem('mainWebsiteData');
        if (mainWebsiteData) {
            const data = JSON.parse(mainWebsiteData);
            handleWebsiteUpdate(data);
        }
    } catch (error) {
        console.log('Error loading dynamic content:', error);
    }
}

// Show update notification
function showUpdateNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'update-notification';
    notification.innerHTML = `
        <div class="update-content">
            <i class="fas fa-sync-alt"></i>
            <span>${message}</span>
            <button onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        background: linear-gradient(135deg, #4CAF50, #2E7D32);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 8px 25px rgba(0,0,0,0.15);
        animation: slideInRight 0.5s ease;
        max-width: 300px;
        font-family: 'Poppins', sans-serif;
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOutRight 0.5s ease';
            setTimeout(() => notification.remove(), 500);
        }
    }, 5000);
}

// Show update available notification
function showUpdateAvailableNotification(data) {
    const notification = document.createElement('div');
    notification.className = 'update-available-notification';
    notification.innerHTML = `
        <div class="update-content">
            <i class="fas fa-download"></i>
            <div>
                <strong>Aggiornamenti Disponibili</strong>
                <p>Nuovi contenuti sono stati pubblicati</p>
            </div>
            <button onclick="location.reload()" class="update-btn">
                Aggiorna
            </button>
            <button onclick="this.parentElement.parentElement.remove()" class="close-btn">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 10000;
        background: linear-gradient(135deg, #2196F3, #1976D2);
        color: white;
        padding: 1rem;
        border-radius: 12px;
        box-shadow: 0 8px 25px rgba(0,0,0,0.15);
        animation: slideInUp 0.5s ease;
        max-width: 320px;
        font-family: 'Poppins', sans-serif;
    `;
    
    document.body.appendChild(notification);
}

// Animate gallery items
function animateGalleryItems() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// Animate service items
function animateServiceItems() {
    const serviceItems = document.querySelectorAll('.service-item');
    serviceItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'scale(0.9)';
        
        setTimeout(() => {
            item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
        }, index * 150);
    });
}

// Initialize gallery filters
function initGalleryFilters() {
    const galleryTabs = document.querySelectorAll('.tab-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    galleryTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const filter = tab.getAttribute('data-filter');
            
            // Update active tab
            galleryTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Filter gallery items
            galleryItems.forEach(item => {
                const category = item.getAttribute('data-category');
                
                if (filter === 'all' || category === filter) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 100);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// Navigation functionality
function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const header = document.querySelector('.header');

    // Mobile menu toggle
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

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            if (targetId.startsWith('#')) {
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    const headerHeight = header.offsetHeight;
                    const targetPosition = targetSection.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Update active navigation link based on scroll position
    window.addEventListener('scroll', () => {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY + header.offsetHeight + 50;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const correspondingLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active'));
                if (correspondingLink) {
                    correspondingLink.classList.add('active');
                }
            }
        });
    });
}

// Scroll effects
function initScrollEffects() {
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Animate elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for scroll animations
    const animatedElements = document.querySelectorAll('.service-item, .gallery-item, .contact-item, .about-text, .about-image');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Initialize everything when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Mani Verdi website loaded!');
    initNavigation();
    initGallery();
    initScrollEffects();
    initContactForm();
    initServiceWorker();
});

// Gallery functionality
function initGallery() {
    console.log('🖼️ Initializing gallery...');
    // Force clear any old data and create fresh gallery
    clearOldGalleryData();
    loadGalleryImages();
}

// Clear old gallery data and create fresh data
function clearOldGalleryData() {
    // Remove any old cached data
    localStorage.removeItem('gallery');
    console.log('🗑️ Cleared old gallery data');
}

// Load gallery images
function loadGalleryImages() {
    console.log('📸 Loading gallery images...');
    
    // Always create fresh data
    const galleryData = createGalleryData();
    localStorage.setItem('gallery', JSON.stringify(galleryData));
    console.log(`✅ Created ${galleryData.length} gallery items`);
    
    updateGalleryDisplay(galleryData);
}

// Create gallery data for all available images
function createGalleryData() {
    console.log('🏗️ Creating gallery data...');
    
    const imageFiles = [
        '20250929_141120.jpg', '20250929_134939.jpg', '20250926_154933.jpg', '20250929_134536.jpg',
        '20250929_133129.jpg', '20250929_135150.jpg', '20250929_141758.jpg', '20250929_135151.jpg',
        '20250926_154942.jpg', '20250929_141110.jpg', '20250929_135158.jpg', '20250929_141757.jpg',
        '20250925_140007.jpg', '20250926_155110.jpg', '20250929_133602.jpg', '20250926_154936.jpg',
        '20250925_094327.jpg', '20250925_140003.jpg', '20250926_152618.jpg', '20250929_134952.jpg',
        '20250929_141457.jpg', '20250929_135149.jpg', '20250929_135255.jpg', '20250929_133601.jpg',
        '20250929_134915.jpg', '20250926_152606.jpg', '20250929_135332.jpg', '20250929_133610.jpg',
        '20250926_152554.jpg', '20250929_134353.jpg', '20250925_140000.jpg', '20250929_135148.jpg',
        '20250929_141435.jpg', '20250925_134037.jpg', '20250926_152546.jpg', '20250929_135153.jpg',
        '20250926_154901.jpg', '20250925_134033.jpg', '20250929_135258.jpg', '20250929_141121.jpg',
        '20250929_133559.jpg', '20250929_134631.jpg', '20250929_134958.jpg', '20250926_154940.jpg',
        '20250929_135330.jpg', '20250929_135259.jpg', '20250929_135302.jpg', '20250929_135157.jpg',
        '20250929_135147.jpg', '20250929_133553.jpg', '20250929_141756.jpg', '20250929_133612.jpg',
        '20250929_133542.jpg', '20250926_154903.jpg', '20250925_140005.jpg', '20250929_135300.jpg',
        '20250929_133608.jpg', '20250929_141118.jpg', '20250929_134055.jpg', '20250929_135256.jpg',
        '20250929_135029.jpg', '20250929_135145.jpg', '20250929_135323.jpg', '20250929_133138.jpg',
        '20250929_133139.jpg', '20250925_134034.jpg', '20250926_152550.jpg', '20250929_141436.jpg',
        '20250929_141437.jpg', '20250925_140006.jpg', '20250929_133535.jpg', '20250925_134110.jpg',
        '20250929_141441.jpg'
    ];
    
    const categories = ['giardinaggio', 'pulizie', 'facchinaggio', 'manutenzione'];
    const titles = {
        giardinaggio: ['Progetto Giardino', 'Cura Prato', 'Potatura Alberi', 'Sistemazione Aiuole', 'Manutenzione Verde'],
        pulizie: ['Pulizie Casa', 'Sanificazione', 'Pulizie Ufficio', 'Lavaggio Pavimenti', 'Pulizie Approfondite'],
        facchinaggio: ['Trasloco', 'Trasporto Mobili', 'Carico Merci', 'Servizi Logistici', 'Facchinaggio'],
        manutenzione: ['Riparazioni', 'Lavori Edili', 'Manutenzione Casa', 'Piccoli Lavori', 'Sistemazioni']
    };
    
    const galleryData = imageFiles.map((filename, index) => {
        const category = categories[index % categories.length];
        const titleArray = titles[category];
        const title = titleArray[index % titleArray.length];
        
        return {
            id: index + 1,
            src: `images/gallery/${filename}`,
            thumbnail: `images/thumbnails/${filename.replace('.jpg', '_thumb.jpg')}`,
            alt: `${category} - ${title}`,
            title: title,
            category: category,
            uploadDate: "30/09/2025"
        };
    });
    
    console.log(`📊 Generated ${galleryData.length} items across ${categories.length} categories`);
    return galleryData;
}

// Get stored gallery from localStorage
function getStoredGallery() {
    try {
        const stored = localStorage.getItem('gallery');
        return stored ? JSON.parse(stored) : [];
    } catch (error) {
        console.error('Error loading gallery from localStorage:', error);
        return [];
    }
}

// Update gallery display with actual images
function updateGalleryDisplay(galleryData) {
    console.log('🎨 Updating gallery display...');
    
    const galleryGrid = document.getElementById('galleryGrid');
    
    if (!galleryGrid) {
        console.error('❌ Gallery grid element not found!');
        return;
    }
    
    // Check if gallery already has images (static HTML)
    const existingImages = galleryGrid.querySelectorAll('.gallery-item img');
    if (existingImages.length > 0) {
        console.log('✅ Gallery already contains static images, skipping JavaScript update');
        return;
    }
    
    if (galleryData && galleryData.length > 0) {
        console.log(`📋 Rendering ${galleryData.length} gallery items`);
        
        galleryGrid.innerHTML = galleryData.map(item => `
            <div class="gallery-item" data-category="${item.category}">
                <img src="${item.src}" alt="${item.alt}" loading="lazy" 
                     onload="console.log('✅ Image loaded: ${item.src}')"
                     onerror="console.error('❌ Failed to load: ${item.src}'); this.style.border='2px solid red';">
                <div class="gallery-overlay">
                    <h4>${item.title}</h4>
                    <p>Categoria: ${item.category}</p>
                    <button class="view-btn" onclick="openImageModal('${item.src}', '${item.title}')">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
            </div>
        `).join('');
        
        console.log(`✅ Gallery display updated with ${galleryData.length} images`);
    } else {
        console.warn('⚠️ No gallery data available');
        showEmptyGallery();
    }
}

// Show empty gallery placeholder
function showEmptyGallery() {
    console.log('📋 Showing empty gallery placeholder');
    
    const galleryGrid = document.getElementById('galleryGrid');
    if (galleryGrid) {
        galleryGrid.innerHTML = `
            <div class="gallery-placeholder">
                <div class="placeholder-content">
                    <i class="fas fa-images"></i>
                    <h3>Galleria in arrivo</h3>
                    <p>Qui verranno mostrate le immagini dei nostri lavori</p>
                </div>
            </div>
        `;
    }
}

// Open image in modal
function openImageModal(src, title) {
    console.log(`🖼️ Opening modal for: ${title}`);
    
    const modal = document.createElement('div');
    modal.className = 'image-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal" onclick="this.parentElement.parentElement.remove()">&times;</span>
            <img src="${src}" alt="${title}">
            <h3>${title}</h3>
        </div>
    `;
    
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
    
    document.body.appendChild(modal);
}

// Modal functionality for gallery images
function openModal(imageSrc) {
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    
    modalImage.src = imageSrc;
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // Add click outside to close
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
}

function closeModal() {
    const modal = document.getElementById('imageModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
    }
});

// Contact form functionality
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const formObject = {};
        formData.forEach((value, key) => {
            formObject[key] = value;
        });
        
        // Validate form
        if (validateForm(formObject)) {
            // Show loading state
            const submitBtn = this.querySelector('.submit-btn');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Invio in corso...';
            submitBtn.disabled = true;
            
            // Simulate form submission (replace with actual form handling)
            setTimeout(() => {
                showNotification('Messaggio inviato con successo! Ti contatteremo presto.', 'success');
                this.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 2000);
        }
    });
}

// Form validation
function validateForm(data) {
    const errors = [];
    
    if (!data.nome || data.nome.trim().length < 2) {
        errors.push('Il nome deve contenere almeno 2 caratteri');
    }
    
    if (!data.email || !isValidEmail(data.email)) {
        errors.push('Inserisci un indirizzo email valido');
    }
    
    if (!data.servizio) {
        errors.push('Seleziona un servizio');
    }
    
    if (!data.messaggio || data.messaggio.trim().length < 10) {
        errors.push('Il messaggio deve contenere almeno 10 caratteri');
    }
    
    if (errors.length > 0) {
        showNotification(errors.join('<br>'), 'error');
        return false;
    }
    
    return true;
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notif => notif.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">
                ${type === 'success' ? '<i class="fas fa-check-circle"></i>' : 
                  type === 'error' ? '<i class="fas fa-exclamation-circle"></i>' : 
                  '<i class="fas fa-info-circle"></i>'}
            </span>
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        z-index: 2000;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        animation: slideInRight 0.3s ease;
        max-width: 400px;
        min-width: 300px;
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Add notification animations to CSS
const notificationCSS = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        padding: 0;
        margin-left: auto;
        opacity: 0.8;
        transition: opacity 0.2s;
    }
    
    .notification-close:hover {
        opacity: 1;
    }
`;

// Add notification CSS to head
const style = document.createElement('style');
style.textContent = notificationCSS;
document.head.appendChild(style);

// Animations and effects
function initAnimations() {
    // Parallax effect for hero section
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        
        if (hero) {
            const speed = scrolled * 0.5;
            hero.style.transform = `translateY(${speed}px)`;
        }
    });

    // Counter animation for statistics
    const counters = document.querySelectorAll('.stat h4');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.textContent.replace(/\D/g, ''));
                const suffix = counter.textContent.replace(/\d/g, '');
                
                animateCounter(counter, 0, target, 2000, suffix);
                counterObserver.unobserve(counter);
            }
        });
    });
    
    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

// Counter animation function
function animateCounter(element, start, end, duration, suffix = '') {
    const startTime = performance.now();
    
    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const current = Math.floor(progress * (end - start) + start);
        element.textContent = current + suffix;
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        }
    }
    
    requestAnimationFrame(updateCounter);
}

// Back to top functionality
function initBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });
    
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Performance optimizations
window.addEventListener('scroll', debounce(() => {
    // Debounced scroll events
}, 10));

// Service worker registration (for PWA capabilities)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Loading screen
window.addEventListener('load', () => {
    const loader = document.querySelector('.loader');
    if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
        }, 500);
    }
});

// Lazy loading for images
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading
initLazyLoading();

// Error handling
window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
});

// Dark mode toggle (optional feature)
function initDarkMode() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    
    if (darkModeToggle) {
        const isDarkMode = localStorage.getItem('darkMode') === 'true';
        
        if (isDarkMode) {
            document.body.classList.add('dark-mode');
        }
        
        darkModeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            const isCurrentlyDark = document.body.classList.contains('dark-mode');
            localStorage.setItem('darkMode', isCurrentlyDark);
        });
    }
}

// Initialize dark mode
initDarkMode();

// Show More Gallery Items Function
function showMoreGalleryItems() {
    console.log('🔍 Showing more gallery items...');
    
    const hiddenItems = document.getElementById('hiddenGalleryItems');
    const loadMoreBtn = document.querySelector('.load-more-container');
    const hideLessContainer = document.getElementById('hideLessContainer');
    
    if (hiddenItems && loadMoreBtn && hideLessContainer) {
        // Show hidden items with animation
        hiddenItems.style.display = 'contents';
        
        // Hide load more button
        loadMoreBtn.style.display = 'none';
        
        // Show hide less button
        hideLessContainer.style.display = 'block';
        
        // Scroll to the first hidden item smoothly
        setTimeout(() => {
            const firstHiddenItem = hiddenItems.querySelector('.gallery-item');
            if (firstHiddenItem) {
                firstHiddenItem.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'center' 
                });
            }
        }, 100);
        
        console.log('✅ More gallery items shown');
    }
}

// Hide More Gallery Items Function
function hideMoreGalleryItems() {
    console.log('🔍 Hiding more gallery items...');
    
    const hiddenItems = document.getElementById('hiddenGalleryItems');
    const loadMoreBtn = document.querySelector('.load-more-container');
    const hideLessContainer = document.getElementById('hideLessContainer');
    
    if (hiddenItems && loadMoreBtn && hideLessContainer) {
        // Hide additional items
        hiddenItems.style.display = 'none';
        
        // Show load more button
        loadMoreBtn.style.display = 'block';
        
        // Hide hide less button
        hideLessContainer.style.display = 'none';
        
        // Scroll back to gallery title
        const galleryTitle = document.querySelector('#galleria .section-title');
        if (galleryTitle) {
            galleryTitle.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
        }
        
        console.log('✅ More gallery items hidden');
    }
}

// Make functions globally available
window.showMoreGalleryItems = showMoreGalleryItems;
window.hideMoreGalleryItems = hideMoreGalleryItems;

// Export functions for global access
window.openModal = openModal;
window.closeModal = closeModal;