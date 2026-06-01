# Oman Prayer Times API

**_An API for serving prayer times in Oman from the Ministry of Endowments and Religious Affairs (MERA)'s website._**

## Routes

### `GET /api/v1/cities`

Returns the list of supported cities.

Optional query parameters:

- `cityId`: Return a single city by ID.

Examples:

```txt
/api/v1/cities
/api/v1/cities?cityId=0
```

### `GET /api/v1/prayer-times`

Returns prayer times for a city.

Optional query parameters:

- `cityId`: City ID. Defaults to `0`.
- `year`: Gregorian year. Defaults to the current year.
- `month`: Month number from `1` to `12`. If omitted, all months for the year are returned.

Example:

```txt
/api/v1/prayer-times?cityId=0&year=2026&month=6
```

## Tech Stack

- **Runtime:** Bun
- **Language:** TypeScript
- **Server:** Hono

## Getting Started

Install dependencies:

```powershell
bun install
```

Run the server:

```powershell
bun run src/index.ts
```
