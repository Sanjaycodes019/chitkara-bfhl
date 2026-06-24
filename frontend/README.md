# Chitkara BFHL Frontend

React application for visualizing node hierarchies.

## Installation

```bash
npm install
```

## Local Development

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Environment Variables

Create a `.env` file in the root directory:

```
VITE_API_URL=http://localhost:3001
```

For production, set this to your deployed backend URL:
```
VITE_API_URL=https://chitkara-bfhl-api.vercel.app
```

## Build for Production

```bash
npm run build
```

## Deployment on Vercel

1. Set environment variable in Vercel dashboard:
   - `VITE_API_URL` = `https://chitkara-bfhl-api.vercel.app` (your deployed backend URL)

2. Push this frontend to a GitHub repository (e.g., `chitkara-bfhl-frontend`)

3. Import the repository to Vercel
   - Vercel will auto-detect Vite configuration
   - Build and deploy automatically

## Features

- Clean, modern UI with gradient background
- Input textarea for comma or newline-separated node strings
- Loading state with spinner
- Error handling with clear messages
- Summary cards showing metrics (total trees, cycles, largest tree root)
- Visual tree representation with nested indentation
- Color-coded results (green for valid trees, red for cycles)
- Invalid entries displayed as red chips
- Duplicate edges displayed as orange chips
- Responsive design for mobile devices
- Smooth animations and transitions
