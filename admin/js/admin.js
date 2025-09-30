// Admin Dashboard JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    if (localStorage.getItem('adminLoggedIn') !== 'true') {
        window.location.href = 'login.html';
        return;
    }
    
    initializeAdmin();
    loadStoredData();
});

// Initialize admin functionality
function initializeAdmin() {
    // Initialize form handlers
    initContentForm();
    initVideoForm();
    initSettingsForm();
    initFileUploads();
    
    // Load initial data
    updateStats();
    loadGalleryItems();
}

// Navigation between sections
function showSection(sectionName) {
    // Hide all sections
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
        section.classList.remove('active');
        section.style.display = 'none';
    });
    
    // Show selected section
    const targetSection = document.getElementById(`${sectionName}-section`);
    if (targetSection) {
        targetSection.style.display = 'block';
        setTimeout(() => {
            targetSection.classList.add('active');
        }, 10);
    }
    
    // Update navigation
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => item.classList.remove('active'));
    
    const activeNav = document.querySelector(`[onclick="showSection('${sectionName}')"]`);
    if (activeNav) {
        activeNav.classList.add('active');
    }
}

// Logout functionality
function logout() {
    if (confirm('Sei sicuro di voler uscire?')) {
        localStorage.removeItem('adminLoggedIn');
        window.location.href = 'login.html';
    }
}

// Content Management
function initContentForm() {
    const contentForm = document.getElementById('contentForm');
    
    contentForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const contentData = {};
        
        formData.forEach((value, key) => {
            contentData[key] = value;
        });
        
        // Save to localStorage (in production, send to server)
        localStorage.setItem('siteContent', JSON.stringify(contentData));
        
        showNotification('Contenuti salvati con successo!', 'success');
        
        // Update the main website (simulate)
        updateMainWebsite(contentData);
    });
}

// Update main website content
function updateMainWebsite(contentData) {
    // This would typically send data to server
    // For demo purposes, we'll just log the data
    console.log('Updating main website with:', contentData);
    
    // Simulate updating the main site
    try {
        // Update hero section
        if (window.parent && window.parent.document) {
            const heroTitle = window.parent.document.querySelector('.hero-title');
            const heroSubtitle = window.parent.document.querySelector('.hero-subtitle');
            const heroDescription = window.parent.document.querySelector('.hero-description');
            
            if (heroTitle) heroTitle.textContent = contentData.heroTitle;
            if (heroSubtitle) heroSubtitle.textContent = contentData.heroSubtitle;
            if (heroDescription) heroDescription.textContent = contentData.heroDescription;
        }
    } catch (error) {
        console.log('Cannot update parent window:', error);
    }
}

// Services Management
function editService(serviceId) {
    const services = getStoredServices();
    const service = services.find(s => s.id === serviceId);
    
    if (service) {
        // Create edit modal
        showServiceModal(service);
    }
}

function deleteService(serviceId) {
    if (confirm('Sei sicuro di voler eliminare questo servizio?')) {
        let services = getStoredServices();
        services = services.filter(s => s.id !== serviceId);
        
        localStorage.setItem('services', JSON.stringify(services));
        showNotification('Servizio eliminato con successo!', 'success');
        
        // Refresh services display
        loadServices();
    }
}

function addNewService() {
    const newService = {
        id: 'new-' + Date.now(),
        title: '',
        description: '',
        features: [],
        icon: 'fas fa-cog'
    };
    
    showServiceModal(newService, true);
}

function showServiceModal(service, isNew = false) {
    // Create modal HTML
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>${isNew ? 'Aggiungi Nuovo Servizio' : 'Modifica Servizio'}</h3>
                <button class="close-modal" onclick="closeModal()">&times;</button>
            </div>
            <form class="service-form">
                <div class="form-group">
                    <label for="serviceTitle">Titolo Servizio</label>
                    <input type="text" id="serviceTitle" value="${service.title}" required>
                </div>
                <div class="form-group">
                    <label for="serviceDescription">Descrizione</label>
                    <textarea id="serviceDescription" rows="4" required>${service.description}</textarea>
                </div>
                <div class="form-group">
                    <label for="serviceIcon">Icona (Font Awesome class)</label>
                    <input type="text" id="serviceIcon" value="${service.icon}" placeholder="fas fa-seedling">
                </div>
                <div class="form-group">
                    <label for="serviceFeatures">Caratteristiche (una per riga)</label>
                    <textarea id="serviceFeatures" rows="4">${service.features ? service.features.join('\n') : ''}</textarea>
                </div>
                <div class="modal-actions">
                    <button type="submit" class="btn btn-primary">
                        ${isNew ? 'Aggiungi' : 'Salva'}
                    </button>
                    <button type="button" class="btn btn-secondary" onclick="closeModal()">
                        Annulla
                    </button>
                </div>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Handle form submission
    modal.querySelector('.service-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const updatedService = {
            id: service.id,
            title: document.getElementById('serviceTitle').value,
            description: document.getElementById('serviceDescription').value,
            icon: document.getElementById('serviceIcon').value,
            features: document.getElementById('serviceFeatures').value.split('\n').filter(f => f.trim())
        };
        
        saveService(updatedService, isNew);
        closeModal();
    });
}

function saveService(service, isNew) {
    let services = getStoredServices();
    
    if (isNew) {
        services.push(service);
    } else {
        const index = services.findIndex(s => s.id === service.id);
        if (index !== -1) {
            services[index] = service;
        }
    }
    
    localStorage.setItem('services', JSON.stringify(services));
    showNotification('Servizio salvato con successo!', 'success');
    
    loadServices();
}

function getStoredServices() {
    const stored = localStorage.getItem('services');
    return stored ? JSON.parse(stored) : [
        {
            id: 'giardinaggio',
            title: 'Giardinaggio',
            description: 'Servizi completi di progettazione, manutenzione e cura di giardini, aiuole e spazi verdi.',
            icon: 'fas fa-seedling',
            features: ['Progettazione giardini', 'Manutenzione aree verdi', 'Potatura piante', 'Irrigazione automatica']
        },
        {
            id: 'facchinaggio',
            title: 'Facchinaggio',
            description: 'Servizi di trasporto, carico e scarico merci con personale qualificato e attrezzature professionali.',
            icon: 'fas fa-truck',
            features: ['Trasporto merci', 'Carico e scarico', 'Traslochi', 'Montaggio mobili']
        },
        {
            id: 'pulizie',
            title: 'Pulizie',
            description: 'Servizi di pulizia professionale per abitazioni, uffici e spazi commerciali con prodotti eco-friendly.',
            icon: 'fas fa-broom',
            features: ['Pulizie domestiche', 'Pulizie uffici', 'Pulizie post-ristrutturazione', 'Sanificazione ambienti']
        },
        {
            id: 'manutenzione',
            title: 'Piccola Manutenzione',
            description: 'Interventi di piccola manutenzione edile e riparazioni per la vostra casa o ufficio.',
            icon: 'fas fa-tools',
            features: ['Riparazioni domestiche', 'Tinteggiature', 'Piccole ristrutturazioni', 'Manutenzione ordinaria']
        }
    ];
}

function loadServices() {
    const services = getStoredServices();
    const servicesList = document.querySelector('.services-list');
    
    servicesList.innerHTML = services.map(service => `
        <div class="service-item-admin">
            <h4><i class="${service.icon}"></i> ${service.title}</h4>
            <p>${service.description}</p>
            <div class="service-actions">
                <button class="action-btn btn-edit" onclick="editService('${service.id}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn btn-delete" onclick="deleteService('${service.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

function closeModal() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => modal.remove());
}

// Gallery Management
function initFileUploads() {
    // Image upload handling
    const imageUpload = document.getElementById('imageUpload');
    
    // Drag and drop functionality
    const uploadArea = document.querySelector('.file-upload');
    
    uploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        this.style.borderColor = 'var(--primary-color)';
        this.style.background = 'rgba(46, 125, 50, 0.05)';
    });
    
    uploadArea.addEventListener('dragleave', function(e) {
        e.preventDefault();
        this.style.borderColor = 'var(--border-color)';
        this.style.background = 'transparent';
    });
    
    uploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        this.style.borderColor = 'var(--border-color)';
        this.style.background = 'transparent';
        
        const files = e.dataTransfer.files;
        handleImageUpload({ target: { files } });
    });
}

// Enhanced image upload handling with compression
function handleImageUpload(event) {
    const files = Array.from(event.target.files);
    const processingOverlay = document.getElementById('processingOverlay');
    
    if (files.length === 0) return;
    
    // Show processing overlay
    processingOverlay.style.display = 'flex';
    
    // Process each file
    Promise.all(files.map(file => processImage(file)))
        .then(processedImages => {
            processedImages.forEach(imageData => {
                if (imageData) {
                    addImageToGallery(imageData);
                    addImagePreview(imageData);
                }
            });
            
            processingOverlay.style.display = 'none';
            showNotification(`${processedImages.filter(img => img).length} immagini caricate e ottimizzate con successo!`, 'success');
        })
        .catch(error => {
            processingOverlay.style.display = 'none';
            showNotification('Errore durante l\'elaborazione delle immagini: ' + error.message, 'error');
        });
}

// Advanced image processing with compression
function processImage(file) {
    return new Promise((resolve, reject) => {
        // Validate file size (50MB max)
        if (file.size > 50 * 1024 * 1024) {
            showNotification(`File ${file.name} troppo grande (max 50MB)`, 'error');
            resolve(null);
            return;
        }
        
        // Validate file type
        if (!file.type.startsWith('image/')) {
            showNotification(`File ${file.name} non è un'immagine valida`, 'error');
            resolve(null);
            return;
        }
        
        const reader = new FileReader();
        
        reader.onload = function(e) {
            const img = new Image();
            
            img.onload = function() {
                // Create canvas for compression
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                
                // Calculate optimal dimensions (max 2048px for web)
                let { width, height } = calculateOptimalDimensions(img.width, img.height, 2048);
                
                canvas.width = width;
                canvas.height = height;
                
                // Draw and compress image
                ctx.drawImage(img, 0, 0, width, height);
                
                // Create high quality version for gallery
                const highQualityDataUrl = canvas.toDataURL('image/jpeg', 0.85);
                
                // Create thumbnail (300px max)
                const thumbDimensions = calculateOptimalDimensions(img.width, img.height, 300);
                canvas.width = thumbDimensions.width;
                canvas.height = thumbDimensions.height;
                ctx.drawImage(img, 0, 0, thumbDimensions.width, thumbDimensions.height);
                const thumbnailDataUrl = canvas.toDataURL('image/jpeg', 0.75);
                
                const imageData = {
                    id: 'img-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
                    src: highQualityDataUrl,
                    thumbnail: thumbnailDataUrl,
                    name: file.name,
                    originalSize: file.size,
                    compressedSize: Math.round(highQualityDataUrl.length * 0.75), // Approximate
                    category: 'giardinaggio', // Default category
                    title: file.name.split('.')[0].replace(/[_-]/g, ' '),
                    uploadDate: new Date().toISOString(),
                    dimensions: {
                        original: { width: img.width, height: img.height },
                        compressed: { width, height },
                        thumbnail: thumbDimensions
                    }
                };
                
                resolve(imageData);
            };
            
            img.onerror = () => {
                reject(new Error(`Impossibile caricare l'immagine ${file.name}`));
            };
            
            img.src = e.target.result;
        };
        
        reader.onerror = () => {
            reject(new Error(`Errore durante la lettura del file ${file.name}`));
        };
        
        reader.readAsDataURL(file);
    });
}

// Calculate optimal dimensions while maintaining aspect ratio
function calculateOptimalDimensions(originalWidth, originalHeight, maxSize) {
    if (originalWidth <= maxSize && originalHeight <= maxSize) {
        return { width: originalWidth, height: originalHeight };
    }
    
    const aspectRatio = originalWidth / originalHeight;
    
    if (originalWidth > originalHeight) {
        return {
            width: maxSize,
            height: Math.round(maxSize / aspectRatio)
        };
    } else {
        return {
            width: Math.round(maxSize * aspectRatio),
            height: maxSize
        };
    }
}

// Add image preview to upload section
function addImagePreview(imageData) {
    const previewGrid = document.getElementById('imagePreviewGrid');
    
    const previewItem = document.createElement('div');
    previewItem.className = 'image-preview-item';
    previewItem.innerHTML = `
        <img src="${imageData.thumbnail}" alt="${imageData.title}">
        <div class="image-preview-actions">
            <button class="preview-action-btn btn-edit" onclick="editImagePreview('${imageData.id}')" title="Modifica">
                <i class="fas fa-edit"></i>
            </button>
            <button class="preview-action-btn btn-delete" onclick="removeImagePreview('${imageData.id}')" title="Rimuovi">
                <i class="fas fa-times"></i>
            </button>
        </div>
        <div class="image-preview-info">
            <div class="image-preview-name">${imageData.title}</div>
            <div class="image-preview-size">
                ${formatFileSize(imageData.originalSize)} → ${formatFileSize(imageData.compressedSize)}
                <br>
                ${imageData.dimensions.compressed.width}×${imageData.dimensions.compressed.height}
            </div>
        </div>
    `;
    
    previewGrid.appendChild(previewItem);
}

// Format file size for display
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Remove image preview
function removeImagePreview(imageId) {
    const previewItem = document.querySelector(`[data-id="${imageId}"]`);
    if (previewItem) {
        previewItem.remove();
    }
    
    // Also remove from stored gallery
    let gallery = getStoredGallery();
    gallery = gallery.filter(img => img.id !== imageId);
    localStorage.setItem('gallery', JSON.stringify(gallery));
}

// Edit image preview
function editImagePreview(imageId) {
    const gallery = getStoredGallery();
    const image = gallery.find(img => img.id === imageId);
    
    if (image) {
        showGalleryEditModal(image);
    }
}

// Publish changes to main website
function publishChanges() {
    const publishBtn = document.querySelector('.btn-publish');
    const originalText = publishBtn.innerHTML;
    
    // Show progress
    publishBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Pubblicazione in corso...';
    publishBtn.disabled = true;
    
    // Show progress bar
    showPublishProgress();
    
    // Simulate publishing process
    simulatePublishProcess()
        .then(() => {
            // Actually update the main website
            updateMainWebsiteData();
            
            publishBtn.innerHTML = '<i class="fas fa-check"></i> Pubblicato con Successo!';
            publishBtn.style.background = '#4CAF50';
            
            showNotification('Sito web aggiornato con successo! Tutte le modifiche sono ora online.', 'success');
            
            // Reset button after 3 seconds
            setTimeout(() => {
                publishBtn.innerHTML = originalText;
                publishBtn.disabled = false;
                publishBtn.style.background = '';
                hidePublishProgress();
            }, 3000);
        })
        .catch(error => {
            publishBtn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Errore nella Pubblicazione';
            publishBtn.style.background = '#f44336';
            
            showNotification('Errore durante la pubblicazione: ' + error.message, 'error');
            
            setTimeout(() => {
                publishBtn.innerHTML = originalText;
                publishBtn.disabled = false;
                publishBtn.style.background = '';
                hidePublishProgress();
            }, 3000);
        });
}

// Show publish progress
function showPublishProgress() {
    const publishSection = document.querySelector('.publish-section');
    
    const progressDiv = document.createElement('div');
    progressDiv.className = 'publish-progress';
    progressDiv.id = 'publishProgress';
    progressDiv.innerHTML = `
        <div class="progress-bar" id="progressBar"></div>
        <div class="progress-text" id="progressText">Preparazione...</div>
    `;
    
    publishSection.appendChild(progressDiv);
    progressDiv.style.display = 'block';
}

// Hide publish progress
function hidePublishProgress() {
    const progressDiv = document.getElementById('publishProgress');
    if (progressDiv) {
        progressDiv.remove();
    }
}

// Simulate publish process with progress updates
function simulatePublishProcess() {
    return new Promise((resolve) => {
        const steps = [
            { progress: 20, text: 'Preparazione dei contenuti...' },
            { progress: 40, text: 'Ottimizzazione delle immagini...' },
            { progress: 60, text: 'Aggiornamento della galleria...' },
            { progress: 80, text: 'Aggiornamento dei servizi...' },
            { progress: 100, text: 'Finalizzazione...' }
        ];
        
        let currentStep = 0;
        
        const updateProgress = () => {
            if (currentStep < steps.length) {
                const step = steps[currentStep];
                const progressBar = document.getElementById('progressBar');
                const progressText = document.getElementById('progressText');
                
                if (progressBar) progressBar.style.width = step.progress + '%';
                if (progressText) progressText.textContent = step.text;
                
                currentStep++;
                setTimeout(updateProgress, 800);
            } else {
                resolve();
            }
        };
        
        updateProgress();
    });
}

// Update main website with current data
function updateMainWebsiteData() {
    try {
        // Get all current data
        const content = JSON.parse(localStorage.getItem('siteContent') || '{}');
        const services = getStoredServices();
        const gallery = getStoredGallery();
        const videos = getStoredVideos();
        const settings = JSON.parse(localStorage.getItem('siteSettings') || '{}');
        
        // Create complete website data package
        const websiteData = {
            content,
            services,
            gallery,
            videos,
            settings,
            lastUpdated: new Date().toISOString()
        };
        
        // In a real application, this would send data to the server
        // For now, we'll store it as the "published" version
        localStorage.setItem('publishedWebsiteData', JSON.stringify(websiteData));
        
        // Update main index.html if possible (in same origin)
        updateMainHTML(websiteData);
        
        console.log('Website data published:', websiteData);
        
    } catch (error) {
        throw new Error('Errore durante l\'aggiornamento dei dati: ' + error.message);
    }
}

// Update main HTML content (if accessible)
function updateMainHTML(data) {
    try {
        // This would work if admin panel is on same origin as main site
        if (window.parent && window.parent.document && window.parent !== window) {
            const mainDoc = window.parent.document;
            
            // Update hero section
            if (data.content.heroTitle) {
                const heroTitle = mainDoc.querySelector('.hero-title');
                if (heroTitle) heroTitle.textContent = data.content.heroTitle;
            }
            
            if (data.content.heroSubtitle) {
                const heroSubtitle = mainDoc.querySelector('.hero-subtitle');
                if (heroSubtitle) heroSubtitle.textContent = data.content.heroSubtitle;
            }
            
            if (data.content.heroDescription) {
                const heroDescription = mainDoc.querySelector('.hero-description');
                if (heroDescription) heroDescription.textContent = data.content.heroDescription;
            }
            
            // Update gallery
            updateMainGallery(mainDoc, data.gallery);
            
            // Trigger main site refresh
            if (window.parent.location) {
                window.parent.location.reload();
            }
        }
    } catch (error) {
        console.log('Cannot update main HTML directly:', error);
    }
}

// Update main website gallery
function updateMainGallery(mainDoc, galleryData) {
    const galleryGrid = mainDoc.querySelector('#galleryGrid');
    
    if (galleryGrid && galleryData && galleryData.length > 0) {
        galleryGrid.innerHTML = galleryData.map(item => `
            <div class="gallery-item" data-category="${item.category || 'all'}">
                <img src="${item.src}" alt="${item.alt}" loading="lazy">
                <div class="gallery-overlay">
                    <h4>${item.title || item.alt}</h4>
                    <p>Categoria: ${item.category || 'Generale'}</p>
                    <button class="view-btn" onclick="openImageModal('${item.src}', '${item.title || item.alt}')">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
            </div>
        `).join('');
    } else if (galleryGrid) {
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

// Enhanced drag and drop functionality
function initFileUploads() {
    const uploadArea = document.querySelector('.image-upload-enhanced');
    
    if (!uploadArea) return;
    
    // Drag and drop functionality
    uploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        this.classList.add('dragover');
    });
    
    uploadArea.addEventListener('dragleave', function(e) {
        e.preventDefault();
        if (!this.contains(e.relatedTarget)) {
            this.classList.remove('dragover');
        }
    });
    
    uploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        this.classList.remove('dragover');
        
        const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'));
        
        if (files.length > 0) {
            const fakeEvent = { target: { files } };
            handleImageUpload(fakeEvent);
        }
    });
    
    // Paste functionality
    document.addEventListener('paste', function(e) {
        const items = Array.from(e.clipboardData.items);
        const imageItems = items.filter(item => item.type.startsWith('image/'));
        
        if (imageItems.length > 0) {
            const files = imageItems.map(item => item.getAsFile()).filter(file => file);
            
            if (files.length > 0) {
                const fakeEvent = { target: { files } };
                handleImageUpload(fakeEvent);
            }
        }
    });
}

function addImageToGallery(imageData) {
    // Save to localStorage
    let gallery = getStoredGallery();
    gallery.push(imageData);
    localStorage.setItem('gallery', JSON.stringify(gallery));
    
    // Update display
    loadGalleryItems();
}

function getStoredGallery() {
    const stored = localStorage.getItem('gallery');
    return stored ? JSON.parse(stored) : [];
}

function loadGalleryItems() {
    // Load gallery data from localStorage using the same system as main site
    let galleryData = getStoredGallery();
    
    // If no data, create it using the same function as main site
    if (!galleryData || galleryData.length === 0) {
        galleryData = createGalleryData();
        localStorage.setItem('gallery', JSON.stringify(galleryData));
    }
    
    const galleryManager = document.getElementById('galleryManager');
    
    if (galleryData.length > 0) {
        galleryManager.innerHTML = galleryData.map(item => `
            <div class="gallery-item-admin" data-id="${item.id}">
                <img src="../${item.src}" alt="${item.alt}" onerror="console.log('Admin image failed: ${item.src}')">
                <div class="gallery-item-actions">
                    <button class="action-btn btn-edit" onclick="editGalleryItem('${item.id}')" title="Modifica">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn btn-delete" onclick="deleteGalleryItem('${item.id}')" title="Elimina">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                <div class="gallery-item-info">
                    <h5>${item.title}</h5>
                    <p>Categoria: ${item.category}</p>
                    <small>Data: ${item.uploadDate}</small>
                </div>
            </div>
        `).join('');
        
        console.log(`Admin gallery loaded with ${galleryData.length} images`);
    } else {
        galleryManager.innerHTML = `
            <div class="empty-gallery">
                <i class="fas fa-images"></i>
                <p>Nessuna immagine caricata.</p>
            </div>
        `;
    }
}

// Create gallery data (same as main.js)
function createGalleryData() {
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
    
    return imageFiles.map((filename, index) => {
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
}

function editGalleryItem(itemId) {
    const gallery = getStoredGallery();
    const item = gallery.find(i => i.id === itemId);
    
    if (item) {
        // Show edit modal
        showGalleryEditModal(item);
    }
}

function deleteGalleryItem(itemId) {
    if (confirm('Sei sicuro di voler eliminare questa immagine?')) {
        let gallery = getStoredGallery();
        gallery = gallery.filter(i => i.id !== itemId);
        
        localStorage.setItem('gallery', JSON.stringify(gallery));
        showNotification('Immagine eliminata con successo!', 'success');
        
        loadGalleryItems();
    }
}

function showGalleryEditModal(item) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Modifica Immagine</h3>
                <button class="close-modal" onclick="closeModal()">&times;</button>
            </div>
            <form class="gallery-form">
                <div class="form-group">
                    <label for="imageTitle">Titolo</label>
                    <input type="text" id="imageTitle" value="${item.title || item.alt}" required>
                </div>
                <div class="form-group">
                    <label for="imageAlt">Testo alternativo</label>
                    <input type="text" id="imageAlt" value="${item.alt}" required>
                </div>
                <div class="form-group">
                    <label for="imageCategory">Categoria</label>
                    <select id="imageCategory" required>
                        <option value="giardinaggio" ${item.category === 'giardinaggio' ? 'selected' : ''}>Giardinaggio</option>
                        <option value="pulizie" ${item.category === 'pulizie' ? 'selected' : ''}>Pulizie</option>
                        <option value="facchinaggio" ${item.category === 'facchinaggio' ? 'selected' : ''}>Facchinaggio</option>
                        <option value="manutenzione" ${item.category === 'manutenzione' ? 'selected' : ''}>Manutenzione</option>
                    </select>
                </div>
                <div class="modal-actions">
                    <button type="submit" class="btn btn-primary">Salva</button>
                    <button type="button" class="btn btn-secondary" onclick="closeModal()">Annulla</button>
                </div>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    modal.querySelector('.gallery-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        item.title = document.getElementById('imageTitle').value;
        item.alt = document.getElementById('imageAlt').value;
        item.category = document.getElementById('imageCategory').value;
        
        let gallery = getStoredGallery();
        const index = gallery.findIndex(i => i.id === item.id);
        if (index !== -1) {
            gallery[index] = item;
            localStorage.setItem('gallery', JSON.stringify(gallery));
            showNotification('Immagine aggiornata con successo!', 'success');
            loadGalleryItems();
        }
        
        closeModal();
    });
}

// Video Management
function initVideoForm() {
    const videoForm = document.getElementById('videoForm');
    
    videoForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const videoData = {
            id: 'video-' + Date.now(),
            title: formData.get('videoTitle'),
            width: formData.get('videoWidth'),
            height: formData.get('videoHeight'),
            uploadDate: new Date().toISOString()
        };
        
        // Save video data
        let videos = getStoredVideos();
        videos.push(videoData);
        localStorage.setItem('videos', JSON.stringify(videos));
        
        showNotification('Video salvato con successo!', 'success');
        this.reset();
        loadVideos();
    });
}

function handleVideoUpload(event) {
    const file = event.target.files[0];
    
    if (file && file.type.startsWith('video/')) {
        // In a real application, you would upload the file to a server
        showNotification('Video caricato con successo!', 'success');
    }
}

function getStoredVideos() {
    const stored = localStorage.getItem('videos');
    return stored ? JSON.parse(stored) : [
        {
            id: 'video-1',
            title: 'Progetto Giardino Completo',
            width: '640',
            height: '360',
            uploadDate: '2025-09-30'
        }
    ];
}

function loadVideos() {
    const videos = getStoredVideos();
    const videosList = document.querySelector('#videosList tbody');
    
    videosList.innerHTML = videos.map(video => `
        <tr>
            <td>${video.title}</td>
            <td>${video.width}x${video.height}</td>
            <td>${new Date(video.uploadDate).toLocaleDateString('it-IT')}</td>
            <td>
                <button class="action-btn btn-view" onclick="viewVideo('${video.id}')">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="action-btn btn-edit" onclick="editVideo('${video.id}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn btn-delete" onclick="deleteVideo('${video.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function viewVideo(videoId) {
    // Implementation for viewing video
    showNotification('Funzione di visualizzazione video', 'info');
}

function editVideo(videoId) {
    // Implementation for editing video
    showNotification('Funzione di modifica video', 'info');
}

function deleteVideo(videoId) {
    if (confirm('Sei sicuro di voler eliminare questo video?')) {
        let videos = getStoredVideos();
        videos = videos.filter(v => v.id !== videoId);
        
        localStorage.setItem('videos', JSON.stringify(videos));
        showNotification('Video eliminato con successo!', 'success');
        
        loadVideos();
    }
}

// Settings Management
function initSettingsForm() {
    const settingsForm = document.getElementById('settingsForm');
    
    // Load current settings
    loadCurrentSettings();
    
    // Handle color picker changes
    const colorInputs = document.querySelectorAll('input[type="color"]');
    colorInputs.forEach(input => {
        input.addEventListener('change', function() {
            const textInput = this.parentElement.querySelector('input[type="text"]');
            textInput.value = this.value;
            
            // Apply color immediately for preview
            applyColorPreview(this.name, this.value);
        });
    });
    
    settingsForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const settings = {};
        
        formData.forEach((value, key) => {
            settings[key] = value;
        });
        
        localStorage.setItem('siteSettings', JSON.stringify(settings));
        showNotification('Impostazioni salvate con successo!', 'success');
        
        applySettings(settings);
    });
}

function loadCurrentSettings() {
    const stored = localStorage.getItem('siteSettings');
    const settings = stored ? JSON.parse(stored) : {
        primaryColor: '#2E7D32',
        secondaryColor: '#4CAF50',
        accentColor: '#FFC107',
        primaryFont: 'Poppins',
        fontSize: '16px'
    };
    
    // Update form fields
    Object.keys(settings).forEach(key => {
        const input = document.querySelector(`[name="${key}"]`);
        if (input) {
            input.value = settings[key];
            
            // Update color text inputs
            if (input.type === 'color') {
                const textInput = input.parentElement.querySelector('input[type="text"]');
                if (textInput) {
                    textInput.value = settings[key];
                }
            }
        }
    });
}

function applyColorPreview(colorName, colorValue) {
    // Apply color preview to admin panel
    document.documentElement.style.setProperty(`--${colorName.replace('Color', '-color')}`, colorValue);
}

function applySettings(settings) {
    // Apply settings to main website
    const root = document.documentElement;
    
    root.style.setProperty('--primary-color', settings.primaryColor);
    root.style.setProperty('--secondary-color', settings.secondaryColor);
    root.style.setProperty('--accent-color', settings.accentColor);
    
    // Apply font settings
    document.body.style.fontFamily = settings.primaryFont + ', sans-serif';
    document.body.style.fontSize = settings.fontSize;
}

function resetSettings() {
    if (confirm('Sei sicuro di voler ripristinare le impostazioni predefinite?')) {
        const defaultSettings = {
            primaryColor: '#2E7D32',
            secondaryColor: '#4CAF50',
            accentColor: '#FFC107',
            primaryFont: 'Poppins',
            fontSize: '16px'
        };
        
        localStorage.setItem('siteSettings', JSON.stringify(defaultSettings));
        loadCurrentSettings();
        applySettings(defaultSettings);
        
        showNotification('Impostazioni ripristinate!', 'success');
    }
}

// Statistics and Analytics
function updateStats() {
    // Simulate stats update
    const stats = {
        visitors: Math.floor(Math.random() * 2000) + 500,
        messages: Math.floor(Math.random() * 100) + 20,
        images: getStoredGallery().length,
        daysOnline: Math.floor((new Date() - new Date('2025-01-01')) / (1000 * 60 * 60 * 24))
    };
    
    // Update stat cards
    const statCards = document.querySelectorAll('.stat-number');
    if (statCards[0]) statCards[0].textContent = stats.visitors.toLocaleString();
    if (statCards[1]) statCards[1].textContent = stats.messages;
    if (statCards[2]) statCards[2].textContent = stats.images;
    if (statCards[3]) statCards[3].textContent = stats.daysOnline;
}

// Load stored data on initialization
function loadStoredData() {
    loadServices();
    loadGalleryItems();
    loadVideos();
    loadCurrentSettings();
}

// Notification system
function showNotification(message, type = 'info') {
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
    
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Add required CSS for modals
const modalCSS = `
    .modal {
        display: block;
        position: fixed;
        z-index: 1000;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        animation: fadeIn 0.3s;
    }
    
    .modal-content {
        background: white;
        margin: 5% auto;
        padding: 0;
        border-radius: 12px;
        max-width: 500px;
        width: 90%;
        box-shadow: 0 10px 40px rgba(0,0,0,0.2);
    }
    
    .modal-header {
        background: var(--primary-color);
        color: white;
        padding: 1.5rem;
        border-radius: 12px 12px 0 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    
    .modal-header h3 {
        margin: 0;
        font-size: 1.3rem;
    }
    
    .close-modal {
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: all 0.2s;
    }
    
    .close-modal:hover {
        background: rgba(255,255,255,0.1);
    }
    
    .service-form,
    .gallery-form {
        padding: 2rem;
    }
    
    .modal-actions {
        display: flex;
        gap: 1rem;
        justify-content: flex-end;
        margin-top: 2rem;
    }
    
    .service-item-admin {
        background: var(--bg-white);
        border: 1px solid var(--border-color);
        border-radius: var(--border-radius);
        padding: 1.5rem;
        margin-bottom: 1rem;
        position: relative;
    }
    
    .service-actions {
        position: absolute;
        top: 1rem;
        right: 1rem;
        display: flex;
        gap: 0.5rem;
    }
`;

const style = document.createElement('style');
style.textContent = modalCSS;
document.head.appendChild(style);