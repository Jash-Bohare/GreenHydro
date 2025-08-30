# GreenHydro Subsidy — "Trust, Automate, Subsidize"
> Fast, auditable, fraud-resistant subsidy disbursement for certified green hydrogen using blockchain + AI.

---
## Problem Statement
Governments subsidize green hydrogen to accelerate the energy transition, but current disbursement processes are manual, slow, and opaque. Producers can exploit gaps (false production claims or tampered IoT), auditors struggle to track funds across stakeholders, and governments lack automated, auditable controls. This leads to delays, misuse of public funds, and weak market confidence.
We solve this by building a transparent end-to-end system that: (a) validates production claims using signed IoT + AI/ML anomaly detection, (b) requires certifier approval, and (c) automates token-based subsidy disbursement via smart contracts — with a tamper-evident blockchain audit trail.

---

## Objective
•	Automate subsidy release for verified green hydrogen production while minimizing fraud risk.
•	Provide an immutable audit trail of claims, approvals, and disbursements.
•	Reduce manual workload on certifiers by using an AI/ML risk filter.
•	Deliver an end-to-end demo on Sepolia testnet that proves the workflow: Producer → AI check → Certifier sign → Smart contract token payout → Audit log.

---

## Team Name & Members
Team Name: Team GreenLedger <br>
Members:<br>
•	Jash (Team Lead) — Blockchain + Backend (smart contracts, APIs)<br>
•	Jaineel — Frontend (React dashboards)<br>
•	Pratham — AI/ML (anomaly detection)<br>
•	Vidhi — AI/ML (prediction + integration)<br>

---

## 5. Our Approach (Short)
Implement a minimal, robust MVP that follows the user flow: producers submit signed IoT reports → AI scores claims for risk → certifier reviews flagged claims → approved claims trigger smart contract to transfer GreenSubsidyToken (GST) to producers on Sepolia. Everything recorded on-chain for auditor access.
We will reimburse producers with our own ERC-20 tokens (GreenSubsidyToken (GST)) rather than stablecoins for the hackathon demo.

---

## 6. Tech Stack
### Blockchain & Dev Tools:
•	Solidity (smart contracts)
•	Hardhat (compile/deploy/test)
•	Sepolia testnet (deployment)
•	Ethers.js (contract interaction)
•	Metamask (wallet)

### Backend & APIs:
•	Node.js + Express
•	Firebase (simple DB for claims & logs)

### Frontend:
•	React (Create React App / Vite)
•	windows.ethereum (for wallet connect)

### AI/ML:
•	Python (django/FastAPI)
•	scikit-learn (IsolationForest / simple regressors)
•	Simple simulated data set (for training and demo)

### Token & Payment:
•	GreenSubsidyToken (GST) — ERC-20 deployed on Sepolia
•	Smart contract pulls tokens from a funded Pool or receives pre-approved allowance from admin wallet

Note: We will use Sepolia testnet for everything on-chain and Node/Express for backend logic as requested.

---

## 7. Key Features
•	Signed IoT Data Ingestion (simulated): Each claim includes a signed payload (simulated asymmetric sign) to show tamper-evident flow.
•	AI/ML Risk Scoring: Automatic anomaly/fraud scoring for each claim (risk_score + explainability). Flags suspicious claims.
•	Certifier Wallet Sign-off: Certifiers approve claims using wallet signatures; only whitelisted certifiers can sign.
•	Smart Contract Subsidy Pool: Holds GST tokens and releases them on valid approvals.
•	On-chain Audit Trail: Immutable records for claims, approvals, and token disbursements with IPFS evidence links.
•	Role-based Dashboards: Producer / Certifier / Government (auditor) views.
•	Demo Script: Happy path + fraud rejection path to showcase system effectiveness.

---

## 8. Future Scope (Post-hackathon)
•	Integrate hardware-backed IoT (TPM / secure element) for cryptographic device attestation.
•	Use decentralized oracles (Chainlink) for tamper-resistant external data & weather feeds.
•	CBDC or bank API integration for fiat disbursements in production.
•	Expand to a full market for hydrogen credits & subsidy token redemption.
•	Implement zero-knowledge proofs for privacy-preserving attestations.
•	Governance for token policy (multisig treasury, vesting, auditability).

---

## 9. User Flow (Detailed)
1.	Producer Onboard: Registers, KYC (simulated), links wallet. Plant metadata entered (capacity, location, energy source). Producer's wallet/address is recorded.
2.	Production & IoT Data: IoT device (simulated) emits data {plantId, timestamp, kgProduced, energyInput_kWh, docHash} — this payload is signed with the device-key (simulated) and sent to backend.
3.	AI/ML Validation: Backend calls the AI service with the payload. AI returns {risk_score, top_reasons}. Low risk → quick certifier action; high risk → urgent manual review.
4.	Certifier Review: Certifier logs into dashboard, sees claim + AI score + attachments. If valid, certifier hits Approve (signs via wallet) which writes a certifier-signed approval to blockchain (or stores signature and puts hash on-chain).
5.	Smart Contract Check & Payout: Backend verifies certifier signature + checks claim state. If valid, it calls the SubsidyPool contract to transfer GST tokens from the Pool to the producer.
6.	Audit & Storage: Transaction hashes, IPFS doc links, AI score, and signatures are stored on-chain/DB for auditors.
7.	Dispute Flow: Government can freeze claims using multisig if a dispute arises; auditors can query historical claims.

---

## 10. Our Implementation Approach (Step-by-step mapped to the user flow)
Each numbered step is mapped to a small development task with the owner.<br>
A. Producer Onboarding
•	Task: Simple registration form that records name, wallet address, plant capacity.<br>
•	Owner: Jaineel (frontend) + Jash (backend API)<br>
•	Deliverable: POST /api/producers stores producer record.
<br><br>
B. IoT Data Submission (Simulated)<br>
•	Task: Small script to simulate device data; sign payload with private key and call backend /api/claims/submit.<br>
•	Owner: Jash (provide example script), Pratham/Vidhi (generate plausible data scenarios)<br>
•	Deliverable: Signed JSON payload posted to backend — stored in DB; IPFS hash for docs.<br><br>
C. AI/ML Score<br>
•	Task: AI microservice (/ai/score) that takes payload and returns {risk_score, reasons}.<br>
•	Owner: Pratham & Vidhi<br>
•	Deliverable: Flask/FastAPI endpoint; model is Isolation Forest + simple rules baseline. Provide unit tests + example responses.<br><br>
D. Certifier Dashboard & Signature<br>
•	Task: Certifier UI shows queue (sorted by risk): low → quick approve; high → full details + manual inspection.<br>
•	Owner: Jaineel<br>
•	Deliverable: Button Approve triggers wallet-sign; backend verifies signature & stores it.<br><br>
E. Smart Contract & Token Payout<br>
•	Task: Write SubsidyPool contract: functions to depositPool, submitClaim, certifyClaim (storing certifier signature), releasePayment (transfer GST).<br>
•	Owner: Jash<br>
•	Deliverable: Deploy SubsidyPool + GreenSubsidyToken (GST) ERC-20 on Sepolia. Provide scripts to fund pool (admin wallet) and to execute claim payout during the demo.<br><br>
F. Backend Orchestration<br>
•	Task: Backend service to orchestrate: accept claim → call AI → push notification to certifier → on sign call contract → persist logs.<br>
•	Owner: Jash<br>
•	Deliverable: REST API with these endpoints (see API Spec below).<br><br>
G. Dashboard Integration & Audit View<br>
•	Task: Show producer token balance, claim status, and a government audit view of all transactions.<br>
•	Owner: Jaineel + Jash<br>
•	Deliverable: React dashboard pages connected to backend + Etherscan links / tx hashes.<br><br>
H. Demo Scripts & Test Cases<br>
•	Task: Create 2–3 demo scenarios (happy path, small-tamper, obvious fraud) and a short script for the pitch.<br>
•	Owner: Team (all members)<br>
•	Deliverable: demo.md script and sample wallets / private keys for the judges to inspect.<br>

---
