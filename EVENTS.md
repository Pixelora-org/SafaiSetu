# Weekend Events & RSVP Integration

## Overview

SafaiSetu lists community cleanup and civic action events in `src/data/events.ts`. Events appear on the map, in the weekend strip, and in the event drawer.

## Adding Events

Each event entry includes:
- Basic details: title, org slug/name, time, location (city, state, lat/lng)
- Practical info: `whatToBring`, `confirmNote`
- Optional website link
- **Optional RSVP link** (e.g. Luma event page)

### RSVP / Luma Link-Out (Phase 1)

Events can include an optional `rsvpUrl` field for external RSVP platforms like Luma:

```typescript
{
  id: "evt-example",
  title: "Park cleanup drive",
  orgSlug: "example-org",
  orgName: "Example Organization",
  startsAt: "2026-09-14T07:00:00+05:30",
  city: "Bengaluru",
  state: "Karnataka",
  lat: 12.9716,
  lng: 77.5946,
  whatToBring: "Gloves, water, closed shoes.",
  confirmNote: "RSVP via Luma for headcount.",
  website: "https://example.org/",
  rsvpUrl: "https://lu.ma/your-event-link",  // Optional
  rsvpLabel: "RSVP on Luma",                  // Optional, defaults to "RSVP on Luma"
}
```

When `rsvpUrl` is set:
- Event cards show a prominent RSVP button
- The map pin drawer shows the RSVP button
- Clicking opens the external RSVP page in a new tab (rel="noopener noreferrer")

### Guidelines

- **Use real Luma links only** when the organization has published a public event page
- If no public link exists yet, omit `rsvpUrl` or add a TODO comment in the code
- Do NOT invent placeholder URLs that look real
- Keep `confirmNote` text accurate — if RSVP is required, mention it there

## Phase 2: API Sync (Future)

The current implementation is **link-out only** — no Luma API integration.

Future Phase 2 work (requires Luma Plus):
- Automatic event sync from Luma API
- RSVP counts and attendee management
- Calendar exports

For now, events are manually curated in `src/data/events.ts`.
