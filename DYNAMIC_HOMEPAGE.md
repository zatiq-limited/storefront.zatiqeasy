# Dynamic Homepage Implementation

## Overview

The homepage is now fully dynamic and fetches data from the API. When you change the JSON data in `src/data/api-responses/homepage.json`, the homepage will automatically update.

## How It Works

### 1. API Endpoint

- **Endpoint**: `GET http://localhost:3001/api/storefront/v1/page/home`
- **Response**: Returns homepage sections, settings, and SEO data

### 2. Data Flow

```
homepage.json → API Server (port 3001) → Astro Page (port 4322) → Rendered Components
```

### 3. Files Involved

#### API Layer

- `server.js` - Serves the JSON data via REST API
- `src/data/api-responses/homepage.json` - Homepage data source

#### Frontend Layer

- `src/pages/index.astro` - Homepage entry point (fetches data)
- `src/lib/api-client.ts` - API client with `getHomepageData()` function
- `src/components/SectionRenderer.tsx` - Renders sections dynamically
- `src/components/ComponentRenderer.tsx` - Maps section types to components

## Making Changes

### Test the Dynamic Homepage

1. **Start the API Server** (Terminal 1):

```bash
node server.js
```

Server runs on: http://localhost:3001

2. **Start the Dev Server** (Terminal 2):

```bash
pnpm dev
```

Site runs on: http://localhost:4322

3. **Edit JSON Data**:
   Edit `src/data/api-responses/homepage.json` - for example, change the hero headline:

```json
{
  "id": "hero_main",
  "type": "hero-1",
  "settings": {
    "headline": "NEW HEADLINE HERE",
    ...
  }
}
```

4. **See Changes**:

- Refresh the browser at http://localhost:4322
- The homepage will reflect your JSON changes immediately

## Sections Available

The homepage supports these section types:

- `hero-1`, `hero-2`, `hero-3`, `hero-4` - Hero banners
- `badges-1`, `badges-2`, `badges-3` - Trust badges
- `category-1` to `category-6` - Category grids
- `special-offers-slider-1` - Product sliders
- `static-banner-1`, `static-banner-2` - Promotional banners
- `reviews-1`, `reviews-2`, `reviews-3` - Customer reviews
- `brands-1`, `brands-2`, `brands-3` - Brand logos

## API Configuration

Current settings in `src/lib/api-client.ts`:

- **API_BASE_URL**: `http://localhost:3001` (development)
- **USE_MOCK_DATA**: `false` (uses real API)

To use mock data instead, set in `.env`:

```env
PUBLIC_USE_MOCK_DATA=true
```

## Example JSON Structure

```json
{
  "success": true,
  "data": {
    "template": "index",
    "sections": [
      {
        "id": "unique_section_id",
        "type": "hero-1",
        "settings": {
          "headline": "Your Headline",
          "description": "Your description",
          ...
        }
      }
    ],
    "seo": {
      "title": "Page Title",
      "description": "Page Description"
    }
  }
}
```

## Troubleshooting

**Homepage not updating?**

1. Make sure API server is running (`node server.js`)
2. Check the terminal for errors
3. Clear browser cache and refresh
4. Verify JSON is valid (use a JSON validator)

**API not responding?**

1. Check if port 3001 is in use: `curl http://localhost:3001/api/storefront/v1/page/home`
2. Restart the API server
3. Check `server.js` for any errors

**Components not rendering?**

1. Verify the section `type` matches available components
2. Check browser console for errors
3. Ensure required `settings` are provided in JSON
