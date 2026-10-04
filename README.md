# ForgeLink — Premium B2B Demo

Frontend-only client presentation demo for an Indian MSME Manufacturer Discovery Platform.

**Brand:** ForgeLink  
**Tagline:** Where Industry Meets Opportunity

## Stack

- React + TypeScript + Vite
- Tailwind CSS v4
- React Router
- Lucide icons
- Framer Motion
- Sonner toasts

## Run

```bash
cd frontend-web
npm install
npm run dev
```

## Three portals

Use the **Demo Mode** switcher in the header:

| Portal | Entry |
|--------|--------|
| Buyer Portal | `/` discovery + `/buyer` dashboard |
| Manufacturer Portal | `/manufacturer` |
| Admin Console | `/admin` |

Each portal has its own layout, header, sidebar (where relevant), and navigation.

## Main client demo story

1. **Buyer / Public** → Home → search `SS 304 bolt manufacturer Gujarat`
2. Open **ABC Fasteners** → Compare with Patel Engineering + Rajkot Precision
3. **AI Search** (optional wow moment)
4. **Send RFQ** → Success → `RFQ-2026-10482`
5. Switch to **Manufacturer Portal** → New RFQ visible
6. Switch to **Admin Portal** → same RFQ in RFQ Management

Shared React Context keeps the RFQ connected across all three portals.

## Notes

- Mock data + local state only
- No backend, auth, payments, or real AI APIs
