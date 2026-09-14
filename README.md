# CareFlow

### Digital AYUSH Case-Taking & Patient Record Management System

CareFlow is a student-built healthcare technology prototype developed for **Smart India Hackathon 2026 — Problem Statement SIH26047: Patient Case-Taking Software**.

The project focuses on digitizing and structuring the patient case-taking workflow for AYUSH practitioners, while maintaining a practitioner-led approach to clinical decision-making.

---

## 🚀 Overview

Traditional patient case-taking can involve paper-based records, repetitive documentation and difficulty accessing previous case information during follow-up consultations.

CareFlow provides a simple digital workflow for:

- Patient registration
- Prakriti assessment
- Structured case entry
- Symptom and history documentation
- Practitioner assessment and management notes
- Automatic structured case summary
- Patient history and timeline
- Follow-up tracking

The V1 prototype is designed to demonstrate the **core case-taking and documentation workflow** before introducing more advanced features such as AI-assisted extraction, voice input, OCR and healthcare interoperability.

---

## 🎯 Problem Statement

**SIH26047 — Patient Case-Taking Software**

The problem focuses on digitizing patient history and case-taking in AYUSH healthcare settings, particularly in busy OPDs where practitioners need a structured and efficient method of collecting, organizing and reviewing patient information.

CareFlow addresses the core documentation layer of this problem through a simple practitioner-oriented digital workflow.

---

## 💡 Solution

CareFlow follows a structured patient journey:

```text
Patient Registration
        ↓
Prakriti Assessment
        ↓
Case Entry
        ↓
Practitioner Assessment
        ↓
Case Summary
        ↓
Patient History
        ↓
Follow-up
```
✨ Features
1. Dashboard

Provides an overview of the practice:

Total patients
Total cases
Upcoming follow-ups
Recent patients
Quick access to patient records
2. Patient Registration

Allows the practitioner to create a structured patient record containing:

Full name
Age
Gender
Phone number
Optional ABHA ID

The prototype uses synthetic data only.

3. Prakriti Assessment

CareFlow includes a prototype questionnaire interface for recording Prakriti-related responses.

The current V1 demonstrates:

Questionnaire flow
Vata/Pitta/Kapha scoring
Percentage visualization
Result storage

Important: The current questionnaire and scoring mechanism are prototype placeholders and are explicitly not clinically validated. They must be verified against authoritative AYUSH/academic sources before any real-world clinical use.

4. Structured Case Entry

Practitioners can document:

Chief complaint
Symptoms / concerns
Case history
AYUSH observations
Practitioner assessment / diagnosis
Treatment / management plan
Follow-up date

Clinical decisions are entered by the practitioner.

CareFlow does not autonomously diagnose patients or prescribe medicines.

5. Case Summary

After saving a case, CareFlow generates a structured summary containing:

Patient information
Prakriti result
Chief complaint
Symptoms
Case history
AYUSH observations
Practitioner assessment
Management plan
Follow-up information

The V1 summary is deterministic and template-based rather than AI-generated.

6. Patient History & Timeline

Each patient has a longitudinal record containing:

Basic patient information
Prakriti assessment
Previous cases
Consultation dates
Case summaries
Follow-up information

This allows previous consultations to be reviewed from a single patient profile.

7. Follow-up Management

The Follow-ups section provides:

Upcoming follow-ups
Follow-up dates
Related patient
Related case
Follow-up status
Completion tracking
🛠️ Technology Stack
Frontend
HTML5
CSS3
Vanilla JavaScript
Data Storage
Browser localStorage
Development Approach

CareFlow V1 is intentionally built without a backend server so that the team can demonstrate the complete product workflow as a lightweight prototype.

┌─────────────────────────┐
│       CareFlow UI       │
│     HTML + CSS + JS     │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│    JavaScript Logic     │
│   State + Data Handling  │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│       localStorage      │
│     Browser Database     │
└─────────────────────────┘
🗃️ Data Model

The V1 prototype maintains four primary conceptual entities:

Patient
  │
  ├── Prakriti Assessment
  │
  ├── Cases
  │     │
  │     └── Follow-up
  │
  └── Follow-ups
Patient
id
fullName
age
gender
phone
abhaId
createdAt
updatedAt
Prakriti Assessment
vata
pitta
kapha
result
answers
assessedAt
Case
id
date
chiefComplaint
symptoms
history
ayushObservations
practitionerAssessment
treatmentManagementPlan
followUp
summary
Follow-up
id
caseId
date
status
notes
💾 Why localStorage?

The V1 prototype uses browser localStorage to keep the project lightweight and demonstrate data persistence without requiring backend infrastructure.

For example:

localStorage.setItem(
    "careflow_v1_db",
    JSON.stringify(database)
);

Data can then be retrieved using:

const database = JSON.parse(
    localStorage.getItem("careflow_v1_db")
);

This allows the application to retain demo data even after refreshing the page.

Why not use localStorage in production?

localStorage is suitable for a simple prototype but not appropriate for production healthcare records.

A production implementation would require:

Secure backend infrastructure
Authentication
Authorization
Database access controls
Encryption
Audit logging
Consent management
Secure APIs
Appropriate healthcare data protection measures
🧪 Demo Data

CareFlow V1 comes with synthetic demo patients so the application can be demonstrated without entering real patient information.

Important

Do not enter real patient or medical information into this prototype.

The seeded records are fictional and exist only to demonstrate:

Dashboard statistics
Patient search
Patient profiles
Case history
Follow-up tracking
Prakriti visualization
🔐 Healthcare & Safety Approach

CareFlow is designed as a documentation and case-management tool, not an autonomous medical decision system.

The V1 prototype intentionally does not:

Diagnose patients autonomously
Recommend medicines autonomously
Recommend dosages
Replace a practitioner
Claim clinical validation of the prototype Prakriti scoring
Use real patient data

The practitioner remains responsible for clinical assessment and management decisions.

📱 Future Scope

The V1 establishes the core digital case-taking workflow.

Future versions can introduce:

🤖 AI-Assisted Information Extraction

Patient responses could be converted into structured case information with practitioner review.

Patient Input
     ↓
AI Information Extraction
     ↓
Structured Case Draft
     ↓
Practitioner Review
     ↓
Patient Record

AI would assist with documentation rather than independently making clinical decisions.

🎙️ Multilingual Voice Input
Patient speaks
      ↓
Speech Recognition
      ↓
Text
      ↓
Information Extraction
      ↓
Structured Case
      ↓
Practitioner Review

This could make case-taking easier for patients who are more comfortable speaking than typing.

📄 Medical Document OCR

The system could extract information from uploaded medical documents:

Medical Document
       ↓
OCR
       ↓
Extracted Text
       ↓
Structured Information
       ↓
Practitioner Verification
🌐 Healthcare Interoperability

A future production version could explore integration with India's digital health ecosystem and appropriate interoperability standards such as ABDM/FHIR, subject to technical, regulatory and consent requirements.

🗄️ Secure Backend

The current architecture can eventually be replaced with:

Frontend
   ↓
Backend API
   ↓
Authentication & Authorization
   ↓
Secure Database
   ↓
Audit & Security Layer
🗺️ Development Roadmap
V1 — Prototype
 Dashboard
 Patient registration
 Patient list
 Prakriti assessment interface
 Case entry
 Case summary
 Patient history
 Follow-up management
 Synthetic demo data
 Local persistence
V2 — Backend
 Secure database
 Authentication
 Role-based access
 API layer
 Server-side validation
 Audit logging
V3 — Intelligent Case-Taking
 Multilingual voice input
 Medical document OCR
 AI-assisted information extraction
 AI-assisted summarization
 Practitioner review workflow
V4 — Interoperability
 ABDM integration research
 FHIR-based data exchange
 Consent-based information sharing
 Production security and compliance
👥 Project

Project: CareFlow
Hackathon: Smart India Hackathon 2026
Problem Statement: SIH26047 — Patient Case-Taking Software
Domain: MedTech / BioTech / HealthTech
Focus: AYUSH Digital Case-Taking & Patient Records

⚠️ Disclaimer

CareFlow is a student hackathon prototype created for demonstration and educational purposes.

It is not a medical device, clinical decision-support system or substitute for professional medical advice.

The current Prakriti questionnaire and scoring are prototype implementations and have not been presented as clinically validated.

Only synthetic/demo data should be used with this V1 prototype.

📄 License

This project is currently intended for educational and hackathon demonstration purposes.

Add an appropriate open-source license if the project is later intended for public reuse or distribution.


### One change I'd make before you push it

Don't call the project **"AI-powered AYUSH healthcare platform"** in your GitHub description.

Your actual V1 is more defensible as:

> **Digital AYUSH case-taking & patient record management system**

Then your roadmap says **AI-assisted voice/OCR/extraction**.

That distinction will also help enormously in your viva because you can honestly de
