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

## Deployment on Vercel

1. Push this backend to a GitHub repository (e.g., `chitkara-bfhl-api`)
2. Import the repository to Vercel
3. Vercel will automatically detect `vercel.json` and deploy as serverless functions
4. Note the deployed URL (e.g., `https://chitkara-bfhl-api.vercel.app`)

## Features

- Validates node entries using regex `/^([A-Z])->([A-Z])$/`
- Detects and removes duplicate edges
- Handles multi-parent (diamond) cases
- Detects cycles using DFS
- Builds nested tree objects
- Calculates tree depth
- CORS enabled for all origins
- Responds in under 3 seconds for up to 50 nodes
