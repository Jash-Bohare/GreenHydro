# 🚀 GreenHydro - Blockchain-Powered Green Hydrogen Subsidies

> **Trust, Automate, Subsidize** - Fast, auditable, fraud-resistant subsidy disbursement for certified green hydrogen using blockchain + AI.

## 🎯 **Project Overview**

GreenHydro solves the critical problem of manual, slow, and opaque government subsidy processes for green hydrogen production. Our system provides:

- **🔒 Fraud Prevention**: AI-powered anomaly detection + cryptographic verification
- **⚡ Automation**: Smart contract-based subsidy disbursement
- **📊 Transparency**: Immutable blockchain audit trail
- **🛡️ Security**: Role-based access controls and signed IoT data

## 🏗️ **Architecture**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   Blockchain    │
│   (React)       │◄──►│   (Node.js)     │◄──►│  (Solidity)    │
│                 │    │                 │    │                 │
│ • Producer UI   │    │ • API Gateway   │    │ • GST Token     │
│ • Certifier UI  │    │ • AI Integration│    │ • SubsidyPool   │
│ • Auditor UI    │    │ • Firebase DB   │    │ • Smart Logic   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🌿 **Branches**

### **`main`** - Project Overview & Documentation
- Project description and architecture
- Setup instructions
- Team information

### **`blockchain`** - Smart Contracts & DeFi
- GreenSubsidyToken (ERC-20)
- SubsidyPool smart contract
- Hardhat deployment scripts
- Sepolia testnet configuration

### **`backend`** - API & Business Logic
- Node.js + Express server
- Firebase integration
- AI/ML risk scoring endpoints
- IoT data processing

### **`frontend`** - User Interfaces
- React dashboards
- Producer onboarding
- Certifier review interface
- Government audit views

## 🚀 **Quick Start**

### **1. Blockchain (Smart Contracts)**
```bash
git checkout blockchain
cd blockchain
npm install
npm run deploy:local      # Local testing
npm run deploy:sepolia    # Sepolia testnet
```

### **2. Backend (API)**
```bash
git checkout backend
cd backend
npm install
npm start
```

### **3. Frontend (UI)**
```bash
git checkout frontend
cd frontend
npm install
npm start
```

## 🎯 **Key Features**

- **🔐 Signed IoT Data**: Tamper-evident production claims
- **🤖 AI Risk Scoring**: Automatic fraud detection
- **💼 Smart Contracts**: Automated subsidy disbursement
- **📋 Role-Based Access**: Producer, Certifier, Government roles
- **🔍 Audit Trail**: Complete blockchain transparency

## 🏆 **Team GreenLedger**

- **Jash** (Team Lead) - Blockchain + Backend
- **Jaineel** - Frontend Development
- **Pratham** - AI/ML Engineering
- **Vidhi** - AI/ML Integration

## 🔗 **Links**

- **Blockchain**: `git checkout blockchain`
- **Backend**: `git checkout backend`
- **Frontend**: `git checkout frontend`
- **Documentation**: See branch-specific READMEs

---

*Built for the Green Hydrogen Hackathon - Accelerating the energy transition through blockchain innovation!* 🌱⚡
