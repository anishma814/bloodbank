# Blood Bank Management System

A full-stack web application connecting blood donors and receivers. Donors register their blood group and weight; the system determines donation eligibility automatically. Receivers post blood requests, view matching eligible donors, and send donation offers, which donors can accept or decline.

## Tech Stack

**Backend:** Python, Django, Django REST Framework, Simple JWT (authentication)
**Frontend:** Angular, TypeScript
**Database:** SQLite (default Django dev database)

## Features

- **Role-based authentication** — users register as either a Donor or Receiver, with JWT-based login and route guarding on the frontend
- **Donor eligibility check** — a donor is automatically marked eligible or ineligible based on a minimum weight threshold (50 kg) and time since their last donation (90-day cooldown)
- **Blood request matching** — receivers post a request for a specific blood group; the system returns only eligible donors of that exact blood group
- **Offer / Accept / Decline workflow** — a receiver can send a donation offer to a matched donor; the donor can accept or decline it from their dashboard, with live status updates on both sides
- **Historical accuracy** — each blood request stores a snapshot of the requesting hospital's name at creation time, so later profile edits don't rewrite request history
- **Duplicate-offer prevention** — a receiver cannot send more than one offer to the same donor for the same request

## Data Models

| Model | Description |
|---|---|
| `User` | Custom Django user with a `role` field (`donor` / `receiver`) |
| `Donor` | Linked to a User; stores blood group, weight, age, last donation date. Exposes an `is_eligible` property |
| `Receiver` | Linked to a User; stores hospital name and contact number |
| `BloodRequest` | A receiver's request for a blood group and unit count; tracks status (`pending` → `fulfilled`) |
| `DonationRecord` | Links a Donor to a BloodRequest once an offer is made; tracks status (`offered` / `accepted` / `declined`) |

## Matching Logic

When a receiver views matches for a request, the backend filters donors by:
1. Exact blood group match
2. Weight ≥ 50 kg
3. No donation within the last 90 days

This logic lives entirely on the backend (not the frontend), so eligibility rules can't be bypassed by editing client-side requests.

## Project Structure

```
bloodbank/
├── bloodbank_backend/       # Django project settings & root URLs
├── users/                   # Custom User model, registration, JWT login
├── donors/                  # Donor model, profile CRUD, eligibility logic
├── receivers/                # Receiver model, profile CRUD
├── bloodrequests/           # BloodRequest & DonationRecord models, matching/offer/accept/decline endpoints
└── bloodbank-frontend/
    └── src/app/
        ├── auth/             # Login, register, auth service, route guard
        ├── donor/            # Donor dashboard & service
        ├── receiver/         # Receiver dashboard & service
        ├── requests/         # Blood request & donation record service
        └── interceptors/     # JWT auto-refresh interceptor
```

## Setup Instructions

### Backend (Django)

```bash
cd bloodbank_backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

pip install django djangorestframework djangorestframework-simplejwt django-cors-headers

python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser

python manage.py runserver
```

Backend runs at `http://127.0.0.1:8000`.

### Frontend (Angular)

```bash
cd bloodbank-frontend
npm install

ng serve
```

Frontend runs at `http://localhost:4200`.

Make sure the backend is running first — the frontend depends on it for all data.

## API Endpoints (key routes)

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/users/register/` | Register a new user (donor or receiver) |
| POST | `/api/auth/login/` | Log in, returns access + refresh JWT tokens |
| POST | `/api/auth/refresh/` | Refresh an expired access token |
| GET/POST | `/api/donors/` | View or create the logged-in donor's profile |
| GET/POST | `/api/receivers/` | View or create the logged-in receiver's profile |
| GET/POST | `/api/requests/blood-requests/` | View or create blood requests |
| GET | `/api/requests/blood-requests/<id>/matches/` | Get eligible donors for a request |
| POST | `/api/requests/blood-requests/<id>/offer/` | Send an offer to a chosen donor |
| GET | `/api/requests/donation-records/` | View donation records (offers) |
| POST | `/api/requests/donation-records/<id>/accept/` | Donor accepts an offer |
| POST | `/api/requests/donation-records/<id>/decline/` | Donor declines an offer |

## Possible Future Improvements

- Broader blood-type compatibility matching (e.g. O- as a universal donor), beyond exact blood group match
- Email/SMS notifications when an offer is sent or responded to
- Admin dashboard for managing all requests and donors
- Donation history and certificates for donors

## Author

Fayas KM (Seven) — Python Django Full-Stack Developer
