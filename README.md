# Chitkara Full Stack Engineering Challenge - Round 1

Full-stack application for processing and visualizing hierarchical node strings.

## Project Structure

```
/bajaj project
  /backend
    index.js          # Express.js API
    package.json      # Backend dependencies
    vercel.json       # Vercel deployment config
    README.md         # Backend documentation
  /frontend
    /src
      App.jsx         # Main React component
      App.css         # Styles
      main.jsx        # Entry point
    index.html        # HTML template
    package.json      # Frontend dependencies
    vite.config.js    # Vite configuration
    README.md         # Frontend documentation
  README.md           # This file
```

## Backend Setup

```bash
cd backend
npm install
npm start
```

API runs on `http://localhost:3001`

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`

## Deployment Instructions

### 1. Backend Deployment (Vercel)

1. Create a GitHub repository for the backend (e.g., `chitkara-bfhl-api`)
2. Push the `backend` folder to this repository
3. Import to Vercel → it detects `vercel.json` and deploys as serverless functions
4. Note the deployed URL (e.g., `https://chitkara-bfhl-api.vercel.app`)

### 2. Frontend Deployment (Vercel)

1. Create a GitHub repository for the frontend (e.g., `chitkara-bfhl-frontend`)
2. Push the `frontend` folder to this repository
3. In Vercel dashboard, set environment variable:
   - `VITE_API_URL` = `https://chitkara-bfhl-api.vercel.app` (your backend URL)
4. Import to Vercel → it auto-detects Vite and deploys

## Test Case

**Input:**
```
A->B, A->C, B->D, C->E, E->F, X->Y, Y->Z, Z->X, P->Q, Q->R, G->H, G->H, G->I, hello, 1->2, A->
```

**Expected Output:**
- 3 valid trees (roots: A, P, G)
- 1 cycle (root: X)
- Invalid entries: hello, 1->2, A->
- Duplicate edges: G->H
- Largest tree root: A (depth 4)

## Validation Checklist

- ✅ POST /bfhl returns correct JSON for the example
- ✅ Self-loops (A->A) go to invalid_entries
- ✅ Trimmed whitespace entries validated after trimming
- ✅ Duplicate edges appear only once in duplicate_edges
- ✅ Multi-parent nodes: first parent wins
- ✅ Cyclic hierarchies return has_cycle: true, tree: {}, no depth
- ✅ Non-cyclic trees return depth, no has_cycle
- ✅ largest_tree_root tiebreaker uses lexicographic order
- ✅ CORS enabled for all origins
- ✅ API responds in under 3 seconds for 50 nodes
- ✅ Frontend shows clear error on API failure
- ✅ Modern, responsive UI design
