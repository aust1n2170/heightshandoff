![](public/logo.png)

**AI-powered campus marketplace platform built for Boston College (+?) students**

[![Built with Vue](https://img.shields.io/badge/Vue-3.5-4FC08D?logo=vue.js&logoColor=white)](https://vuejs.org/)
[![Powered by Firebase](https://img.shields.io/badge/Firebase-10.14-FFCA28?logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Deployed on Vercel](https://img.shields.io/badge/Vercel-Deployed-000000?logo=vercel&logoColor=white)](https://vercel.com/)
[![AI by OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o-412991?logo=openai&logoColor=white)](https://openai.com/)

---

<div align="center">

**Heights Handoff** - One Eagle's Old is Another Eagle's Gold

</div>

## Overview

**Heights Handoff** is a sustainable marketplace that connects Boston College students to buy, sell, and trade items within the campus community. Using AI-powered image analysis, we've eliminated the friction of traditional marketplaces (especially online), making it effortless to list items and find what you need.

### The Problem
Every year, thousands of perfectly good items end up in landfills during move-out while incoming students spend hundreds buying the same things. Traditional marketplaces require meeting strangers or shipping goods—creating barriers for busy college students.

### The Solution
A BC-only marketplace with:
- **Streamlined AI-powered listings** - Upload a photo, AI fills everything
- **Verified BC users** - Only Eagles can trade
- **Campus-specific features** - Parking marketplace, event coordination
- **Real-time updates** - See new listings instantly

---

## Features

### AI-Powered Item Listing
- Upload a photo and GPT-4o Vision automatically generates:
  - Item name
  - Category
  - Condition assessment
  - Description
  - Suggested price

### BC Authentication
- Secure login with BC credentials (only @bc.edu emails, can be modified to other campuses)
- Verified profiles showing student information
- Closed, trusted ecosystem

### Intelligent Marketplace
- Categorical browsing (Furniture, Electronics, Books, etc.)
- Real-time item feed
- Item details with condition, price, location, and time posted
- Contact sellers directly through verified profiles

### Parking Marketplace
- Interactive map view of available parking spots
- List view with sortable columns
- Request-to-buy system
- Seller dashboard for managing requests

---

## Tech Stack

### Frontend
- **Vue 3**, **Vite**, **Tailwind**, **JavaScript**

### Backend
- **Vercel (Edge Functions + Deployment)**, **Node.js**, **OpenAI GPT-4o Vision API**

### Database & Storage
- **Firebase Firestore, Storage, Authentication**

### Deployment / Version Control
- **Vercel**, **GitHub**

---

## Getting Started

### Prerequisites
- Node.js 18.x+ (I used 20.x for stability reasons)
- npm or yarn
- Firebase account (I found the Blaze subscription to suffice, pay-as-you-use is very helpful :])
- OpenAI API key (Different from a ChatGPT premium plan, must need some credit to use their other models)
- Vercel account (for deployment)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/aust1n2170/heightshandoff.git
cd heightshandoff
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up Firebase**
   - Go to [Firebase Console](https://console.firebase.google.com)
   - Create a new project
   - Enable Firestore Database (start in test mode! This tripped me up)
   - Enable Storage (start in test mode)
   - Enable Authentication (I just used email/password auth)
   - Get your Firebase config from Project Settings

4. **Set up OpenAI**
   - Get your API key from [OpenAI Platform](https://platform.openai.com/api-keys)

5. **Configure environment variables**

Create `.env` file in the root directory:
```bash
# Firebase Configuration
VITE_FIREBASE_API_KEY=your-firebase-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id

# OpenAI Configuration (for Vercel deployment)
OPENAI_API_KEY=sk-proj-your-openai-api-key
```

6. **Run development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Deployment

### Deploy to Vercel (Not sure if it was just me but Vercel via github was so annoying... I just used their CLI so I'll omit the github instructions

#### CLI
```bash
npm i -g vercel

vercel login

vercel --prod
```

---

## Development

### Available Scripts
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

---


### Issues I encountered + fixes :]

#### **"Module not found" errors**
```bash
rm -rf node_modules package-lock.json
npm install
```

#### **Firebase permission denied**
- Check Firestore rules allow read/write
- Verify Storage rules are configured
- Ensure user is authenticated

#### **OpenAI API not working not working**
- Verify `OPENAI_API_KEY` is set in Vercel
- Check OpenAI account has credits
- View Vercel function logs: `vercel logs`

#### **Images not loading**
- Check Firebase Storage CORS settings
- Verify `VITE_FIREBASE_STORAGE_BUCKET` ends in `.appspot.com`
- Check browser console for errors

#### **Build fails on Vercel**
- Clear Vercel build cache
- Verify all dependencies are in `package.json`
- Try changing Node.js version to 20.x+

---

## Some risks to security:

### Current Implementation
- BC email authentication required (perhaps easy to bypass in hindsight)
- Environment variables for sensitive keys
- CORS enabled for development

---


## Future Scalability + other features I didn't have time to implement

- [ ] Direct messaging between users
- [ ] Email notifications
- [ ] Advanced search and filters (AI powered!! :D)
- [ ] Saved items/favorites
- [ ] User ratings and reviews
- [ ] Transaction history
- [ ] Multi-campus deployment
- [ ] Mobile apps (React Native, SwiftUI pt. 2)
- [ ] QR code drop boxes
- [ ] Payment integration
- [ ] Social features (profiles, following)
- [ ] Events and meetups
- [ ] Sustainability challenges
- [ ] Campus partnerships

---

This project was built for the BC Horizons Hackathon 2025.
