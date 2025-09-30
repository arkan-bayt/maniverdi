// Website Data Synchronization API
// This file handles the communication between admin panel and main website

class WebsiteDataAPI {
    constructor() {
        this.apiEndpoint = '/api'; // Change to your actual API endpoint
        this.localStorageKey = 'websiteData';
        this.publishedDataKey = 'publishedWebsiteData';
    }

    // Get current website data
    getCurrentData() {
        return {
            content: JSON.parse(localStorage.getItem('siteContent') || '{}'),
            services: this.getStoredServices(),
            gallery: this.getStoredGallery(),
            videos: this.getStoredVideos(),
            settings: JSON.parse(localStorage.getItem('siteSettings') || '{}'),
            lastModified: new Date().toISOString()
        };
    }

    // Get published website data
    getPublishedData() {
        const published = localStorage.getItem(this.publishedDataKey);
        return published ? JSON.parse(published) : null;
    }

    // Check if there are unpublished changes
    hasUnpublishedChanges() {
        const current = this.getCurrentData();
        const published = this.getPublishedData();
        
        if (!published) return true;
        
        return JSON.stringify(current) !== JSON.stringify(published);
    }

    // Publish changes to main website
    async publishChanges() {
        const data = this.getCurrentData();
        
        try {
            // In production, this would be an actual API call
            const response = await this.simulateAPICall(data);
            
            if (response.success) {
                // Store as published data
                localStorage.setItem(this.publishedDataKey, JSON.stringify(data));
                
                // Generate updated HTML files
                this.generateUpdatedFiles(data);
                
                return { success: true, message: 'Sito web aggiornato con successo!' };
            } else {
                throw new Error(response.error || 'Errore durante la pubblicazione');
            }
        } catch (error) {
            throw new Error('Errore di connessione: ' + error.message);
        }
    }

    // Simulate API call (replace with actual API in production)
    simulateAPICall(data) {
        return new Promise((resolve) => {
            setTimeout(() => {
                // Simulate some potential errors
                if (Math.random() < 0.05) { // 5% chance of error for realism
                    resolve({ success: false, error: 'Errore temporaneo del server' });
                } else {
                    resolve({ success: true, data });
                }
            }, 2000); // Simulate network delay
        });
    }

    // Generate updated website files
    generateUpdatedFiles(data) {
        try {
            // Update main index.html data
            this.updateIndexHTML(data);
            
            // Update gallery data
            this.updateGalleryData(data.gallery);
            
            // Update services data
            this.updateServicesData(data.services);
            
            // Apply theme settings
            this.applyThemeSettings(data.settings);
            
        } catch (error) {
            console.error('Error generating files:', error);
        }
    }

    // Update main index.html with new data
    updateIndexHTML(data) {
        // This would typically be done server-side
        // For demo purposes, we'll store the data for JavaScript to use
        const updatedData = {
            ...data,
            generatedAt: new Date().toISOString()
        };
        
        localStorage.setItem('mainWebsiteData', JSON.stringify(updatedData));
        
        // Try to update parent window if accessible
        this.updateParentWindow(data);
    }

    // Update parent window (main website) if accessible
    updateParentWindow(data) {
        try {
            if (window.opener && !window.opener.closed) {
                // Admin opened from main site - update opener
                window.opener.postMessage({
                    type: 'WEBSITE_UPDATE',
                    data: data
                }, '*');
            } else if (window.parent && window.parent !== window) {
                // Admin in iframe - update parent
                window.parent.postMessage({
                    type: 'WEBSITE_UPDATE',
                    data: data
                }, '*');
            }
        } catch (error) {
            console.log('Cannot communicate with parent window:', error);
        }
    }

    // Update gallery data
    updateGalleryData(galleryData) {
        // Export gallery as JSON file for main website
        const galleryJSON = JSON.stringify(galleryData, null, 2);
        this.createDownloadableFile('gallery.json', galleryJSON);
    }

    // Update services data
    updateServicesData(servicesData) {
        // Export services as JSON file
        const servicesJSON = JSON.stringify(servicesData, null, 2);
        this.createDownloadableFile('services.json', servicesJSON);
    }

    // Apply theme settings
    applyThemeSettings(settings) {
        if (!settings) return;
        
        // Generate CSS variables
        const cssVariables = Object.entries(settings)
            .filter(([key]) => key.includes('Color'))
            .map(([key, value]) => `--${key.replace('Color', '-color')}: ${value};`)
            .join('\n    ');
        
        if (cssVariables) {
            const cssContent = `:root {\n    ${cssVariables}\n}`;
            this.createDownloadableFile('theme-settings.css', cssContent);
        }
    }

    // Create downloadable file (for manual deployment)
    createDownloadableFile(filename, content) {
        try {
            const blob = new Blob([content], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            // Store for potential download
            const fileData = {
                filename,
                url,
                content,
                createdAt: new Date().toISOString()
            };
            
            const existingFiles = JSON.parse(localStorage.getItem('generatedFiles') || '[]');
            const updatedFiles = existingFiles.filter(f => f.filename !== filename);
            updatedFiles.push(fileData);
            
            localStorage.setItem('generatedFiles', JSON.stringify(updatedFiles));
            
        } catch (error) {
            console.error('Error creating file:', error);
        }
    }

    // Download generated files
    downloadGeneratedFiles() {
        const files = JSON.parse(localStorage.getItem('generatedFiles') || '[]');
        
        files.forEach(file => {
            const link = document.createElement('a');
            link.href = file.url;
            link.download = file.filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    }

    // Get helper methods (same as existing ones)
    getStoredServices() {
        const stored = localStorage.getItem('services');
        return stored ? JSON.parse(stored) : [];
    }

    getStoredGallery() {
        const stored = localStorage.getItem('gallery');
        return stored ? JSON.parse(stored) : [];
    }

    getStoredVideos() {
        const stored = localStorage.getItem('videos');
        return stored ? JSON.parse(stored) : [];
    }
}

// Initialize API
const websiteAPI = new WebsiteDataAPI();

// Enhanced publish function
async function publishChanges() {
    const publishBtn = document.querySelector('.btn-publish');
    const originalText = publishBtn.innerHTML;
    
    try {
        // Show loading state
        publishBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Pubblicazione in corso...';
        publishBtn.disabled = true;
        
        // Show progress
        showPublishProgress();
        
        // Publish changes
        const result = await websiteAPI.publishChanges();
        
        if (result.success) {
            // Success state
            publishBtn.innerHTML = '<i class="fas fa-check"></i> Pubblicato con Successo!';
            publishBtn.style.background = '#4CAF50';
            
            showNotification(result.message, 'success');
            
            // Show download option for generated files
            showDownloadOption();
            
        } else {
            throw new Error(result.error || 'Errore sconosciuto');
        }
        
    } catch (error) {
        // Error state
        publishBtn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Errore nella Pubblicazione';
        publishBtn.style.background = '#f44336';
        
        showNotification('Errore durante la pubblicazione: ' + error.message, 'error');
    }
    
    // Reset button after 3 seconds
    setTimeout(() => {
        publishBtn.innerHTML = originalText;
        publishBtn.disabled = false;
        publishBtn.style.background = '';
        hidePublishProgress();
    }, 3000);
}

// Show download option for generated files
function showDownloadOption() {
    const publishSection = document.querySelector('.publish-section');
    
    // Remove existing download section
    const existingDownload = document.getElementById('downloadSection');
    if (existingDownload) {
        existingDownload.remove();
    }
    
    const downloadSection = document.createElement('div');
    downloadSection.id = 'downloadSection';
    downloadSection.innerHTML = `
        <div style="margin-top: 1rem; padding: 1rem; background: rgba(255,255,255,0.1); border-radius: 8px;">
            <p style="margin-bottom: 0.5rem; font-size: 0.9rem;">
                <i class="fas fa-download"></i> File generati automaticamente:
            </p>
            <button class="btn btn-secondary" onclick="websiteAPI.downloadGeneratedFiles()" style="font-size: 0.85rem; padding: 8px 16px;">
                Scarica File Aggiornati
            </button>
            <p style="font-size: 0.75rem; margin-top: 0.5rem; opacity: 0.8;">
                Scarica i file JSON aggiornati per l'integrazione manuale
            </p>
        </div>
    `;
    
    publishSection.appendChild(downloadSection);
    
    // Auto-hide after 10 seconds
    setTimeout(() => {
        if (downloadSection.parentElement) {
            downloadSection.remove();
        }
    }, 10000);
}

// Check for unpublished changes on load
document.addEventListener('DOMContentLoaded', function() {
    if (websiteAPI.hasUnpublishedChanges()) {
        const publishBtn = document.querySelector('.btn-publish');
        if (publishBtn) {
            publishBtn.style.animation = 'pulse 2s infinite';
            publishBtn.title = 'Hai modifiche non pubblicate!';
        }
    }
});

// Add pulse animation CSS
const pulseCSS = `
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    }
`;

const style = document.createElement('style');
style.textContent = pulseCSS;
document.head.appendChild(style);