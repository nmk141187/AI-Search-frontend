# Prospect Search

This is the frontend application for the Prospect Search system.

It provides:
- search UI
- AI natural language search
- Chatbot-style search interface
- CSV export integration

---

## Features

### Search
- Filter companies by:
  - Sector
  - SubSector
  - Location
- Pagination
- Export filtered results as CSV

---

### 🤖 AI Search
- Enter natural language queries

Example: `Fintech companies in London doing payments`

- Displays matching companies
- Export based on search results

---

### Chatbot
- Chat-style UI for search
- Accepts natural language queries
- Displays results in conversational format

Supported command:
User: fintech companies in london
Bot: Found 1 companies

User: export
Bot: Export started

User: Healthtech companies doing insurance in london
Bot: Found 5 companies

## Tech Stack

- Next.js
- TypeScript
- Tailwind CSS
- Axios

## Setup Instructions

### 1. Install dependencies

```bash
npm install
```

### 2. Create Configuration 

Change the file .evn.example to .env.local

```
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
```

### 3. Run Application 

```
npm run dev

````



