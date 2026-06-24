# Chitkara BFHL API - Backend

Express.js REST API for processing hierarchical node strings.

## Installation

```bash
npm install
```

## Local Development

```bash
npm start
```

Server runs on port 3001 by default.

## API Endpoint

### POST /bfhl

Processes hierarchical node strings and returns tree hierarchies.

**Request Body:**
```json
{
  "data": ["A->B", "A->C", "B->D", "hello", "1->2"]
}
```

**Response:**
```json
{
  "user_id": "sanjay_22022004",
  "email_id": "sanjay1621.be23@chitkarauniversity.edu.in",
  "college_roll_number": "2311981621",
  "hierarchies": [...],
  "invalid_entries": [...],
  "duplicate_edges": [...],
  "summary": {
    "total_trees": 3,
    "total_cycles": 1,
    "largest_tree_root": "A"
  }
}
```

## Deployment on Render

1. Push this backend to a GitHub repository (e.g., `chitkara-bfhl-api`)
2. Go to [render.com](https://render.com) and sign in
3. Click "New +" → "Web Service"
4. Connect your GitHub repository
5. Configure:
   - **Name**: chitkara-bfhl-api
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `node index.js`
6. Click "Deploy Web Service"
7. Note the deployed URL (e.g., `https://chitkara-bfhl-api.onrender.com`)

## Features

- Validates node entries using regex `/^([A-Z])->([A-Z])$/`
- Detects and removes duplicate edges
- Handles multi-parent (diamond) cases
- Detects cycles using DFS
- Builds nested tree objects
- Calculates tree depth
- CORS enabled for all origins
- Responds in under 3 seconds for up to 50 nodes
