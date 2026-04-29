# 🩸 Blood Bank System

A React web app with role-based portals for Hospitals, Blood Bank Centers, and Donors.

## Project Structure

```
blood-bank-system/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx              # React entry point
    ├── App.jsx               # Root router — wires all screens together
    ├── styles.js             # Design tokens & blood type list
    ├── data/
    │   └── initialData.js    # Seed users & blood banks
    └── components/
        ├── Landing.jsx       # Landing page — 3 login options
        ├── shared/
        │   └── UI.jsx        # Reusable components (Card, Btn, Input, etc.)
        ├── auth/
        │   ├── HospitalAuth.jsx    # Hospital login + register
        │   ├── BloodBankAuth.jsx   # Blood Bank Center login + register
        │   └── DonorAuth.jsx       # Donor login + register
        └── dashboards/
            ├── HospitalDashboard.jsx     # Request blood, track status
            ├── BloodBankDashboard.jsx    # Manage inventory, approve requests
            └── DonorDashboard.jsx        # Find banks, find donors
```

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server
npm run dev

# 3. Open http://localhost:5173
```

## Demo Credentials

| Role            | Username   | Password |
|-----------------|------------|----------|
| Hospital        | apollo     | pass     |
| Blood Bank      | citybank   | pass     |
| Donor           | ravi       | pass     |

## Features

- **Landing Page** — choose your portal
- **Hospital Portal** — request blood by type/units/urgency, send emergency alerts, track request history
- **Blood Bank Portal** — view & edit inventory per blood type, approve/reject hospital requests
- **Donor Portal** — find nearby blood banks, search donors by blood type, view all inventory
- **Register** — all three roles support new account creation
