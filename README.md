# NourishShare — Surplus Food Donation & Redistribution Platform

> **Hackathon Prototype**  
> **Problem ID:** HACK-P197  
> **Category:** Food & Restaurant  
> **Difficulty:** Intermediate  

NourishShare is a full-stack surplus food redistribution platform designed to bridge commercial food donors (hotels, caterers, artisan bakeries, organic markets, restaurants) with eligible charitable recipient organizations (emergency shelters, community pantries, soup kitchens, youth outreach centers).

---

## 🌟 Key Capabilities & Features

### 1. Multi-Stakeholder Profiles & Quick Role Switcher
* **Donors:** Profile management with licensed kitchen verification, Food Safety Inspection permit numbers, operational hours, loading bay instructions, and direct contact.
* **Recipient Organizations:** Non-profit charity profiles with 501(c)(3) registration numbers, daily meal serving capacity, refrigeration & cold-storage equipment status, and dietary requirements.
* **Admin Moderator:** Dedicated portal for platform supervisors to review user incident reports, remove inappropriate or spoiled listings, issue formal warnings, and track compliance metrics.
* **1-Click Test Persona Bar:** Switch instantly between 4 Donors, 4 Charitable Recipients, and the Safety Officer Admin to test end-to-end workflows from any perspective.

### 2. End-to-End Food Listing & Request Workflow
* **Listing Creation (Donors):**
  * Title, Category (Cooked Meals, Bakery, Fresh Produce, Dairy/Chilled, Packaged, Beverages).
  * Storage Condition (Hot Held >60°C, Refrigerated <4°C, Ambient, Frozen <-18°C).
  * Quantity, unit, and estimated feeding headcount calculations.
  * Preparation time, use-by/expiry guidance, and precise pickup window.
  * **Mandatory 4-Point Food Safety Compliance Checklist**: requires donors to attest to hygienic preparation in a licensed kitchen, temperature maintenance, packaging integrity, and allergen disclosures before publishing.
* **Reservation Workflow (Recipients):**
  * Browse with real-time search, category pills, dietary tags (Vegetarian, Vegan, Halal, Kosher, Gluten-Free, Nut-Free), storage condition filters, and urgent countdown sorting.
  * Adjustable request quantity with feeding impact preview.
  * Direct logistics notes (driver arrival time, vehicle license, cambro equipment).
  * State transitions: `AVAILABLE` &rarr; `REQUESTED` &rarr; `ACCEPTED` / `REJECTED` / `CANCELLED` &rarr; `COMPLETED`.
* **State Transitions & Handover Verification:**
  * **Accept**: Donor accepts pending reservation &rarr; generates a secure 6-digit **Pickup Verification PIN** (e.g., `739-204`).
  * **Reject**: Donor declines with explicit reason &rarr; transitions to `REJECTED`.
  * **Cancel**: Either party can cancel with reason before pickup deadline &rarr; transitions to `CANCELLED`.
  * **Handover & Completion**: Recipient presents the 6-digit PIN on site &rarr; Donor/Recipient verifies temperature and packaging integrity &rarr; transitions to `COMPLETED` &rarr; updates global meals served, kg rescued, and CO₂ offset metrics.
  * **Digital Donation Receipt**: Generates a printable/PDF-exportable certificate of transfer and Good Samaritan legal compliance record.

### 3. Food Safety, Legal & Privacy Safeguards
* **Prominent Food Safety Disclaimer Banner:** Clearly warns that the app is an educational community prototype and **NOT** a formal food-safety certification body.
* **Interactive Safety & Operational Limitations Modal:**
  * Detailed breakdown of the **Temperature Danger Zone** (4°C – 60°C / 40°F – 140°F).
  * The **2-Hour / 4-Hour Rule** for temperature-sensitive prepared foods.
  * Protection under the **Bill Emerson Good Samaritan Food Donation Act**.
* **Privacy Protection:** All street addresses and phone numbers across the UI use tagged demo addresses (`Demo Address`, `Mock Location`) to prevent accidental personal data exposure.
* **Anti-Double Booking & Deadline Protection:** Real-time quantity locking and visual countdown badges (green >3h, amber 1-3h, pulsing red <1h).

---

## 🗂️ Seed Data Included

The platform is pre-populated with realistic, varied mock data:
* **12 Food Listings** spanning all 6 categories across multiple lifecycle states:
  1. `Grand Hyatt Banquet` — 45 Hot Meal Boxes: Vegetable Biryani & Dal (`AVAILABLE`, Hot Held)
  2. `Golden Crust Artisan Bakery` — 30 Artisan Sourdough Loaves & Croissants (`AVAILABLE`, Ambient)
  3. `Green Valley Organic Market` — 35 kg Fresh Organic Broccoli & Carrots (`REQUESTED`, Refrigerated)
  4. `Bella Italia Trattoria` — 20 Trays Penne Pasta Alla Vodka (`ACCEPTED`, Ready for Pickup with PIN)
  5. `Grand Hyatt Banquet` — 35 Boxed Gourmet Turkey Sandwiches (`COMPLETED`, Verified Handover)
  6. `Green Valley Organic Market` — 25L Organic Milk & Greek Yogurts (`AVAILABLE`, Refrigerated)
  7. `Bella Italia Trattoria` — 50 Servings Minestrone & Tuscan Bread (`AVAILABLE`, Urgent <2h)
  8. `Green Valley Organic Market` — 40 Bottles Cold-Pressed Immunity Juices (`AVAILABLE`, Refrigerated)
  9. `Green Valley Organic Market` — 15 kg Honey Bananas & Apples (`REJECTED`, Sample rejection flow)
  10. `Grand Hyatt Banquet` — 25 Trays Roast Chicken Breast (`CANCELLED`, Sample cancellation flow)
  11. `Golden Crust Artisan Bakery` — 40 Fresh Bagels with Cream Cheese (`FLAGGED FOR MODERATION`, Dairy left at room temp)
  12. `Golden Crust Artisan Bakery` — 50 Assorted Muffins & Fruit Danishes (`COMPLETED`, Verified Handover)
* **4 Sample Recipient Organizations**:
  - *Hope Haven Homeless Shelter* (160 meals/day, refrigerated van)
  - *Downtown Family Food Bank* (350 meals/day, walk-in coolers)
  - *Youth & After-School Kitchen* (90 meals/day, kid-friendly)
  - *Eastside Senior Care & Nutrition* (70 meals/day, dietary specialized)
* **4 Sample Donors** and **1 Platform Admin Moderator**.
* **3 User Incident & Safety Reports** in the Admin Moderation queue.

---

## 🚀 Getting Started

### Prerequisites
* **Node.js** v18+ (tested on v24)
* **npm** v10+

### Installation
Dependencies are already installed in this workspace. To re-install if needed:
```bash
npm install
```

### Running the Application

#### Option 1: Unified Full-Stack Production Server (Recommended)
Serves the REST API and the built React frontend on a single port:
```bash
npm run build
npm start
```
Open **`http://localhost:5000`** in your browser.

#### Option 2: Vite Development Mode
Runs Vite with hot reloading:
```bash
npm run dev
```
Open **`http://localhost:3000`** in your browser.

---

## 🧪 Testing User Journeys

1. **Test Donor Listing Creation**:
   * Switch persona to **Grand Hyatt Banquet** or **Golden Crust Bakery**.
   * Click **"+ Donate Food"** or navigate to **Donor Hub**.
   * Fill out the form, complete the 4 mandatory safety checkboxes, and click **"Publish Food Listing"**.
2. **Test Recipient Food Reservation**:
   * Switch persona to **Hope Haven Homeless Shelter**.
   * On the **Browse Food** page, find an available listing (e.g. *Vegetable Biryani* or *Minestrone*).
   * Click **"Reserve Donation"**, adjust quantity, confirm vehicle capacity, and submit request.
3. **Test Donor Accept & PIN Generation**:
   * Switch persona back to the donor. In the **Donor Hub**, the incoming request appears under **Action Required**.
   * Click **"Accept Request"** &rarr; state changes to `ACCEPTED` and a 6-digit PIN is generated.
4. **Test Pickup Handover Confirmation**:
   * Switch persona to the recipient. Under **Recipient Hub &rarr; Ready for Pickup**, view the PIN.
   * Click **"Confirm Handover On-Site"**, verify temperature, enter PIN, rate experience, and complete handover.
   * View the official **Digital Donation Receipt**.
5. **Test Admin Moderation**:
   * Switch persona to **Admin Moderator** and navigate to **Admin Moderation**.
   * Review listing `listing-111` (flagged for dairy temperature violation). Click **"Remove Listing"** or manage user incident reports.
   * Use **"Reset Sample Seed Data"** anytime to return to the original state.

