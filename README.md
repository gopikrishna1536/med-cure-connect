# MedCure Connect — Digital Pharmacy & Healthcare Portal

[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL%20Auth-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

A modern, full-featured digital pharmacy and healthcare management platform built with React, TypeScript, Tailwind CSS, and Supabase. Features prescription uploads, medicine catalog search, shopping cart and checkout, order fulfillment tracking, and administrative controls.

---

## ✨ Features

- **Prescription Upload System:** Secure document and image uploading workflow for doctor prescriptions with pharmacist verification.
- **Medicine Catalog & Filtering:** Searchable pharmaceutical inventory with dosage details, manufacturer info, pricing, and category filters.
- **Cart & Order Checkout:** Real-time shopping cart state, order summary calculation, address management, and order placement.
- **Role-Based Authentication:** Patient and Administrator access levels powered by Supabase Auth with Row Level Security (RLS).
- **Admin Management Dashboard:** Administrative views to monitor prescription verification, incoming patient orders, inventory levels, and customer inquiries.
- **Responsive UI:** Built with Tailwind CSS and Radix UI primitives for full mobile and desktop responsiveness.

---

## 🏛️ System Architecture

```
┌────────────────────────────────────────────────────────┐
│                   React + Vite SPA                     │
│  (Catalog, Cart, Prescription Upload, Admin Dashboard) │
└───────────────────────────┬────────────────────────────┘
                            │
              REST / Realtime WebSocket API
                            │
┌───────────────────────────▼────────────────────────────┐
│                    Supabase Backend                    │
│   • Auth (JWT, email/password)                         │
│   • PostgreSQL Database (Products, Orders, Profiles)   │
│   • Storage Buckets (Prescription PDF & Image Files)   │
│   • Row Level Security (RLS Policies)                  │
└────────────────────────────────────────────────────────┘
```

---

## 📂 Project Structure

```
med-cure-connect/
├── .github/
│   └── workflows/
│       └── ci.yml                     # GitHub Actions CI automated build pipeline
├── src/
│   ├── components/                    # Reusable UI components & dialogs
│   ├── contexts/                      # React contexts (CartContext, AuthContext)
│   ├── hooks/                         # Custom React hooks
│   ├── integrations/
│   │   └── supabase/                  # Supabase client & generated type definitions
│   ├── lib/                           # Utility functions & formatting helpers
│   ├── pages/
│   │   ├── AdminDashboard.tsx         # Order and prescription management
│   │   ├── Auth.tsx                   # User login and sign-up
│   │   ├── Cart.tsx                   # Shopping cart review
│   │   ├── Catalog.tsx                # Searchable pharmaceutical catalog
│   │   ├── Checkout.tsx               # Shipping & order payment
│   │   ├── Index.tsx                  # Landing homepage & features
│   │   ├── OrderConfirmation.tsx      # Post-checkout order tracking
│   │   └── UploadPrescription.tsx     # Prescription upload & verification
│   ├── App.tsx                        # Main application routes
│   └── main.tsx                       # Entry point
├── supabase/                          # Database migrations and schema definitions
├── .env.example                       # Environment configuration template
├── package.json                       # Dependencies & build scripts
└── README.md                          # Documentation
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or bun
- A Supabase account and project

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/gopikrishna1536/med-cure-connect.git
   cd med-cure-connect
   ```

2. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```
   Update `.env` with your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
   VITE_SUPABASE_PROJECT_ID=your_project_id
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Launch development server:**
   ```bash
   npm run dev
   ```

5. **Build for production:**
   ```bash
   npm run build
   ```

---

## 📄 License
MIT License.
