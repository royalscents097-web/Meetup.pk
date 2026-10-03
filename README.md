# MeetUp.pk — 18+ Non-Sexual Social Companionship Marketplace

> **"Meet. Connect. Experience."**
> Pakistan's premier adults-only (18+) social companionship and activity marketplace for legitimate public outings.

---

## 1. Core Platform Positioning & Safety Policy

MeetUp.pk connects verified adults for wholesome, non-sexual activities strictly in open public spaces across Pakistan:
- **Allowed Social Activities**: Coffee & cafe chats, dining, city heritage walks, literary/cultural events, co-working & study partnerships, language exchange, board games & esports, and professional networking.
- **Strictly Prohibited**: Prostitution, sexual services, adult escorting, overnight bookings, private apartment/hotel room visits, explicit talk, and off-platform payment evasion.
- **Privacy Architecture**: Exact home addresses, CNIC scans, private mobile numbers, and live GPS coordinates are never displayed on public cards or profiles.

---

## 2. Production Architecture

The application is structured into database-ready layers:
```
/src
  /components     # Reusable UI elements (CompanionCard, HeroSearch, Modals, Navbar, Footer, MobileBottomNav)
  /context        # Reactive AppContext with local & database-ready state management
  /data           # Initial seeds for Pakistani cities (Lahore, Karachi, Islamabad, Rawalpindi, etc.)
  /services
    analytics.ts          # Event stream tracking (searches, profile views, booking conversion)
    antiBypassService.ts  # Automatic detection of phone numbers, WhatsApp, IBAN, external payment terms
    paymentService.ts     # PaymentService abstraction, PaymentIntent, TransactionLedger, PayoutRecord
  /types          # Comprehensive TypeScript relational models
  /views          # HomeView, ExploreView, BookingsView, MessagesView, AccountDashboardView, SafetyCenterView, AdminDashboardView
```

---

## 3. Deployment Instructions

### Development Setup
```bash
# Install dependencies
npm install

# Run Vite development server on port 3000
npm run dev
```

### Production Build
```bash
# Lint TypeScript files
npm run lint

# Compile optimized bundle into /dist
npm run build

# Preview build locally
npm run preview
```

### Deploying to Production Platforms
1. **Cloudflare Pages / Vercel / Netlify**:
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Framework: `Vite`

2. **Hostinger / cPanel / Shared VPS**:
   - Run `npm run build`
   - Upload the contents of the generated `dist` folder to `public_html/`
   - Ensure your `.htaccess` routes all requests to `index.html`:
   ```apache
   <IfModule mod_rewrite.c>
     RewriteEngine On
     RewriteBase /
     RewriteRule ^index\.html$ - [L]
     RewriteCond %{REQUEST_FILENAME} !-f
     RewriteCond %{REQUEST_FILENAME} !-d
     RewriteRule . /index.html [L]
   </IfModule>
   ```

3. **Docker Container Deployment**:
   ```dockerfile
   FROM node:20-alpine AS builder
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci
   COPY . .
   RUN npm run build

   FROM nginx:alpine
   COPY --from=builder /app/dist /usr/share/nginx/html
   EXPOSE 80
   CMD ["nginx", "-g", "daemon off;"]
   ```

---

## 4. Environment Variables (`.env.example`)

```ini
# Application URL
APP_URL="https://meetup.pk"

# Platform Commission
DEFAULT_COMMISSION_PERCENT=10

# Payment Provider Configuration (EasyPaisa / JazzCash / Card Gateway)
PAYMENT_GATEWAY_PROVIDER="SecurePakistanGateway"
PAYMENT_GATEWAY_API_KEY="your_api_key_here"
PAYMENT_GATEWAY_WEBHOOK_SECRET="sig_mup_secret_key_here"

# Security & Session
JWT_SECRET="generate_strong_secret_key"
PORT=3000
```

---

## 5. Admin Governance & Security Checklist

- [x] **18+ DOB Gatekeeping**: Registration calculates age $\ge 18$ and requires explicit legal acknowledgement.
- [x] **Zero Storage of Card / Bank Credentials**: Uses server-side PaymentIntent and masked references.
- [x] **Anti-Bypass Moderation**: In-app messages and bios are automatically scanned for phone numbers, IBANs, and external payment phrases, routing them to the `/admin` moderation queue without immediate auto-banning.
- [x] **Configurable Platform Fee**: Admin can toggle platform fee (5%, 8%, 10%, 15%, or custom percentage) dynamically.
- [x] **Immutable Audit Trail**: Every sensitive administrative action (verification, suspension, payout update, review removal) generates a persistent audit log entry.
- [x] **Emergency Helplines**: Pakistan emergency contacts (*15 Police, 1122 Rescue, 1043 Punjab Women Helpline, 1094 Sindh*) embedded directly in Safety Center.
