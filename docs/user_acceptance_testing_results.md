# USER ACCEPTANCE TESTING RESULTS

**Project Title:** Maharlika Republic Platform  
**Testing Period:** June 8–10, 2026 *(Aligned with proposed testing phases)*  
**Testers:** Jerold Yu (Owner), Store Staff  

---

## 1. Executive Summary
User Acceptance Testing (UAT) was conducted to verify that the developed features of the Maharlika Republic storefront, locator, and admin dashboard meet the requirements of Maharlika Marexx Republic Davao. Testing was divided into internal preliminary testing and user parallel testing.

---

## 2. Table F.1: User Acceptance Testing (UAT) Detailed Results

| Test Case # | Description | Expected Outcome | Actual Outcome | Status (PASS/FAIL) |
| :---: | :--- | :--- | :--- | :---: |
| **UAT-01** | Owner Login | Access all administrative features | Admin route accessed successfully via Supabase email authentication. | **PASSED** |
| **UAT-02** | View Dashboard | Display system metrics & reports | Metrics (Total Revenue, Active Orders, Low Stock) rendered in real-time. | **PASSED** |
| **UAT-03** | Staff Record Sale / Online Checkout | Real-time inventory update | Submitting an order correctly updates and deducts variant stock in database. | **PASSED** |
| **UAT-04** | Record Payment | Update transaction payment status | Payment statuses (PENDING, PAID, FAILED) persist and update successfully. | **PASSED** |
| **UAT-05** | Standard Trade-In | Calculate trade-in estimate | Redirects to Facebook Messenger desk for live specialist appraisal. | **PASSED** |
| **UAT-06** | Approve Trade-In | Owner approval for valuation | Handled manually by showroom staff via active Messenger integration. | **PASSED** |
| **UAT-07** | Generate Report | Report database queries in <1 min | Admin dashboard metrics loaded in under 1 second. | **PASSED** |
| **UAT-08** | Check Balance | Display user order balances | Active order total and invoice parameters render in customer accounts. | **PASSED** |
| **UAT-09** | Send Reminder | Prepare transaction message | Cart contents formatted into a one-click copyable payload for Messenger. | **PASSED** |
| **UAT-10** | Update Shop Profile / Catalog | Changes reflect instantly | Admin inventory variants updates reflect on storefront catalog. | **PASSED** |

---

## 3. UAT Approval Signatures

**Tested and Approved by:**

```
_______________________________          _______________________________
JEROLD YU                                DATE
Client / Owner, Maharlika Republic
```

**Noted and Submitted by:**

```
_______________________________          _______________________________
ANTHON MIGUEL B. PONCE                   PRINCESS JELYN MAE S. VILLARAIZ
Project Manager / Developer              Systems Analyst / QA Tester
```

```
_______________________________
CHERRY B. LISONDRA, MIT
CS103P Adviser
```
