# Mani Verdi - Sito Web Aziendale

Un sito web moderno e professionale per Mani Verdi, azienda specializzata in servizi di giardinaggio, facchinaggio, pulizie e piccola manutenzione edile a Novara.

## 🚀 Caratteristiche

- **Design Moderno e Responsivo**: Ottimizzato per desktop, tablet e mobile
- **Sezioni Complete**: Home, Chi Siamo, Servizi, Galleria, Contatti
- **CMS Integrato**: Pannello di amministrazione per gestire contenuti
- **Galleria Interattiva**: Sistema di gestione immagini e video
- **Form di Contatto**: Sistema di richiesta preventivi
- **Animazioni Fluide**: Effetti CSS e JavaScript per un'esperienza coinvolgente
- **SEO Ottimizzato**: Struttura HTML semantica e meta tags

## 📁 Struttura del Progetto

```
mani-verdi-web/
├── index.html              # Pagina principale
├── css/
│   └── style.css           # Fogli di stile principali
├── js/
│   └── main.js             # JavaScript del sito principale
├── images/
│   ├── gallery/            # Immagini della galleria
│   └── services/           # Immagini dei servizi
├── videos/                 # File video
├── data/
│   ├── content.json        # Contenuti del sito
│   ├── services.json       # Dati dei servizi
│   └── settings.json       # Impostazioni del tema
├── admin/
│   ├── login.html          # Pagina di login admin
│   ├── dashboard.html      # Dashboard amministrativa
│   ├── css/
│   │   └── admin.css       # Stili per l'admin
│   └── js/
│       └── admin.js        # JavaScript dell'admin
└── README.md
```

## 🛠️ Installazione e Setup

### 1. Requisiti
- Server web (Apache, Nginx, o server locale come XAMPP, WAMP)
- Browser moderno con supporto HTML5 e CSS3

### 2. Installazione Locale

```bash
# Clona o scarica i file del progetto
cd /percorso/del/tuo/server/web
# Copia tutti i file nella directory del server web
```

### 3. Configurazione

1. **Modifica le informazioni di contatto**:
   - Apri `data/content.json`
   - Aggiorna telefono, email, indirizzo

2. **Configura Google Maps**:
   - Apri `index.html`
   - Sostituisci l'URL della mappa nella sezione contatti con le coordinate corrette

3. **Aggiungi le tue immagini**:
   - Carica le immagini in `images/gallery/`
   - Carica i video in `videos/`

## 🎨 Pannello di Amministrazione

### Accesso Admin
- URL: `tuo-sito.com/admin/login.html`
- Username: `admin`
- Password: `maniverdi2025`

### Funzionalità Admin
- **Dashboard**: Statistiche e attività recenti
- **Gestione Contenuti**: Modifica testi e informazioni
- **Gestione Servizi**: Aggiungi/modifica/elimina servizi
- **Gestione Galleria**: Carica e organizza immagini
- **Gestione Video**: Carica e configura video
- **Impostazioni**: Personalizza colori e font

## 🌐 Deploy e Hosting

### Deploy su Hosting Condiviso

1. **Carica i file via FTP**:
   ```bash
   # Carica tutti i file nella directory public_html o www
   ```

2. **Configura il dominio**:
   - Punta il dominio alla directory del sito
   - Assicurati che index.html sia il file principale

3. **Test del sito**:
   - Visita il tuo dominio
   - Testa tutte le funzionalità
   - Verifica il pannello admin

### Deploy su VPS/Server Dedicato

1. **Installa un web server**:
   ```bash
   # Per Apache
   sudo apt update
   sudo apt install apache2
   
   # Per Nginx
   sudo apt update
   sudo apt install nginx
   ```

2. **Configura il virtual host**:
   ```apache
   # Apache Virtual Host
   <VirtualHost *:80>
       ServerName maniverdi.com
       DocumentRoot /var/www/maniverdi
       DirectoryIndex index.html
   </VirtualHost>
   ```

3. **Carica i file**:
   ```bash
   sudo cp -r /percorso/files/* /var/www/maniverdi/
   sudo chown -R www-data:www-data /var/www/maniverdi
   sudo chmod -R 755 /var/www/maniverdi
   ```

### Deploy su GitHub Pages

1. **Crea un repository GitHub**
2. **Carica i file**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/username/maniverdi.git
   git push -u origin main
   ```
3. **Abilita GitHub Pages** nelle impostazioni del repository

### Deploy su Netlify

1. **Connetti il repository GitHub**
2. **Configura il build**:
   - Build command: (lascia vuoto)
   - Publish directory: `/`
3. **Deploy automatico** ad ogni push

## 🔧 Personalizzazione

### Modifica Colori
```css
/* Modifica in css/style.css o tramite admin panel */
:root {
    --primary-color: #2E7D32;    /* Verde primario */
    --secondary-color: #4CAF50;   /* Verde secondario */
    --accent-color: #FFC107;      /* Giallo accento */
}
```

### Aggiungi Nuovo Servizio
```javascript
// Usa il pannello admin o modifica data/services.json
{
  "id": "nuovo-servizio",
  "title": "Nuovo Servizio",
  "description": "Descrizione del servizio",
  "icon": "fas fa-icon",
  "features": ["Feature 1", "Feature 2"],
  "order": 5
}
```

### Modifica Form di Contatto
```html
<!-- Modifica in index.html sezione contatti -->
<!-- Integra con servizi email come EmailJS, Formspree, ecc. -->
```

## 📱 Responsive Design

Il sito è completamente responsivo e ottimizzato per:
- **Desktop**: 1200px+
- **Tablet**: 768px - 1199px
- **Mobile**: 320px - 767px

## ⚡ Performance

### Ottimizzazioni Implementate
- CSS e JS minificati in produzione
- Immagini ottimizzate
- Lazy loading per immagini
- Caching del browser
- Font web ottimizzati

### Miglioramenti Suggeriti
- Comprimi le immagini (WebP, ottimizzazione)
- Implementa un CDN
- Abilita compressione Gzip
- Aggiungi Service Worker per PWA

## 🔒 Sicurezza

### Raccomandazioni
1. **Cambia le credenziali admin**:
   ```javascript
   // In admin/login.html, modifica:
   if (username === 'nuovo-username' && password === 'nuova-password-sicura')
   ```

2. **Implementa autenticazione backend** per produzione
3. **Usa HTTPS** sempre
4. **Backup regolari** del sito

## 🐛 Troubleshooting

### Problemi Comuni

**Il sito non si carica**:
- Verifica che index.html sia nella directory corretta
- Controlla i permessi dei file (755 per directory, 644 per file)

**Le immagini non si caricano**:
- Verifica i percorsi delle immagini
- Controlla i permessi della cartella images/

**Il pannello admin non funziona**:
- Verifica che JavaScript sia abilitato
- Controlla la console del browser per errori

**Problemi di layout mobile**:
- Verifica il viewport meta tag
- Testa con diversi dispositivi/browser

## 📞 Supporto

Per supporto tecnico o personalizzazioni:
- Email: [inserisci email di supporto]
- Telefono: [inserisci numero]

## 📄 Licenza

Questo progetto è sviluppato specificamente per Mani Verdi. Tutti i diritti riservati.

## 🔄 Aggiornamenti

### Versione 1.0 (Settembre 2025)
- Release iniziale
- Tutte le funzionalità base implementate
- Pannello admin completo

### Roadmap Future
- [ ] Integrazione sistema di prenotazione online
- [ ] Chat live integrata
- [ ] Sistema di recensioni clienti
- [ ] Multi-lingua (Inglese)
- [ ] App mobile (PWA)

---

**Sviluppato con ❤️ per Mani Verdi - Novara**