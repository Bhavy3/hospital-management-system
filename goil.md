**Hospital Management System – All Functionalities & Working (Point-by-Point)**

The system is a **web-based Hospital Management System** built with **React (Frontend)** + **Python/Django (Backend)**. It digitizes the complete hospital workflow for patients, doctors, staff, admin, reception, and accounts.

### 1. Core Purpose & High-Level Working
- Patients can view **doctor availability online** and book appointments from mobile/desktop without visiting the hospital.
- Doctors can access complete **patient history, diagnosis records, and prescriptions** instantly.
- All patient data (registration, diagnosis, room allocation, billing, discharge) is centrally stored and managed.
- Online payment integration eliminates manual billing.
- Supports **DICOM format** for medical images/case studies.
- Generates reports, manages staff, and automates discharge process.

### 2. Modules & Their Functionalities

#### **Patient Module**
- Self-registration (first name, middle name, last name, gender, mobile, email, address, age, password).
- View **doctor availability** and different doctor types.
- Send **appointment request** (date, time, day, doctor selection).
- Receive **appointment confirmation**.
- View own **prescription** and diagnosis history on device.
- View **room allocation** and discharge status.
- Make **online payment** (view billing status).
- Access past records for future diagnosis.

#### **Doctor Module**
- View patient details and appointment data.
- Update **treatment/diagnosis**.
- Issue **prescription** (medicine name + description).
- Access **patient diagnosis history** and DICOM images.
- View assigned patients and their room status.
- Send diagnosis advice back to system.

#### **Admin Module**
- Manage staff (add/edit/delete).
- Generate **reports** (patient, appointment, payment, etc.).
- Oversee entire hospital operations through centralized dashboard.

#### **Reception Module**
- Handle **appointment generation** and assignment.
- Manage patient queue and visiting charges.
- Coordinate with registration and doctor modules.

#### **Staff / Nursing Staff Module**
- **Room allocation** (check room availability, type, charges).
- Update room status (available/occupied).
- Handle patient discharge process.
- Manage nursing staff database and room charges.

#### **Account Module**
- Process **billing and payments**.
- Handle different payment types (online/offline).
- Generate payment receipts.
- Track room charges + doctor fees + other services.
- Update payment status to patient/doctor/admin.

### 3. Key Workflows (How the System Works – Step by Step)

**Patient Registration → Appointment Flow**
1. Patient registers or logs in.
2. Patient checks doctor availability → selects doctor, date & time.
3. Appointment request sent → Reception/Doctor assigns slot.
4. Appointment data stored in database → patient & doctor both notified.

**Diagnosis & Treatment Flow**
1. Doctor views patient details + history.
2. Doctor performs diagnosis → updates treatment.
3. Doctor issues prescription (medicine + description).
4. Prescription stored and visible to patient on device.

**Room & Admission Flow**
1. Patient needs admission → Staff checks room availability.
2. Room allocated (type, charges, room number).
3. Patient record updated with room + doctor in-charge.

**Discharge & Payment Flow**
1. Doctor/Staff initiates discharge.
2. Account module calculates total bill (doctor fees + room charges + other).
3. Patient makes **online payment**.
4. Discharge process completed → records updated.

**Admin & Reporting**
- Admin can view/generate reports on patients, appointments, payments, staff, etc.
- All data is stored in relational database with proper foreign keys.

### 4. Database Tables (Data Dictionary – What is Stored)

| Table              | Key Fields (Main)                          | Purpose |
|--------------------|--------------------------------------------|--------|
| **Registration**   | R_id (PK), Name, Gender, Mobile, Email, Address, Age, Password, Visiting charges | New user/patient registration |
| **Appointment**    | App_id (PK), Date, Time, Day, D_id (FK)   | Booking & scheduling |
| **Room**           | Room_no (PK), Availability, Type, R_charges | Room management |
| **Patient**        | P_id (PK), Name, DOB, Age, Gender, Address, Mobile, Email, Disease, Room, D_id | Complete patient record |
| **Doctor**         | D_id (PK), Name, Age, Mobile, Email, Address, Fees, Qualification, Working time | Doctor profile & schedule |
| **Prescription**   | Pre_id (PK), Date, Medicine, Description, P_id, D_id | Digital prescriptions |
| **Payment**        | Py_id (PK), Type, Date, Amount, P_id, D_id, R_charges | Billing & transactions |

### 5. Additional Features
- **Online Payment System** – Fully integrated (no external tool needed).
- **DICOM Support** – Medical imaging storage & viewing.
- **Data Security** – Password hashing, foreign keys for data integrity.
- **Time-Saving** – Patients avoid queues; doctors get instant history.
- **Scalable** – Designed for large hospitals with many patients.

**Summary**:  
The system completely replaces the old manual/offline process with a **fully digital, online, real-time hospital management platform**. Patients book appointments online, doctors manage diagnosis digitally, staff handles rooms, accounts manage payments, and admin controls everything — all in one integrated system.

This covers **every functionality and workflow** mentioned in the complete 32-page project report.