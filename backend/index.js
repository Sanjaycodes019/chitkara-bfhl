const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const USER_ID = "sanjay_22022004";
const EMAIL_ID = "sanjay1621.be23@chitkarauniversity.edu.in";
const COLLEGE_ROLL_NUMBER = "2311981621";

app.post('/bfhl', (req, res) => {
  try {
    const { data } = req.body;
    
    if (!data || !Array.isArray(data)) {
      return res.status(400).json({ error: 'Invalid request body. Expected { "data": [...] }' });
    }

    // Step 1: Validate entries
    const validEntries = [];
    const invalidEntries = [];
    
    for (const entry of data) {
      const trimmed = entry.trim();
      const regex = /^([A-Z])->([A-Z])$/;
      
      if (regex.test(trimmed)) {
        const [parent, child] = trimmed.split('->');
        // Check for self-loop
        if (parent === child) {
          invalidEntries.push(entry);
        } else {
          validEntries.push(trimmed);
        }
      } else {
        invalidEntries.push(entry);
      }
    }

    // Step 2: Detect and remove duplicates
    const seenEdges = new Set();
    const uniqueValidEntries = [];
    const duplicateEdges = [];
    
    for (const edge of validEntries) {
      if (seenEdges.has(edge)) {
        if (!duplicateEdges.includes(edge)) {
          duplicateEdges.push(edge);
        }
      } else {
        seenEdges.add(edge);
        uniqueValidEntries.push(edge);
      }
    }

    // Step 3: Build the graph
    const adjMap = {};
    const childSet = new Set();
    const allNodes = new Set();
    const childParentMap = {}; // Track first parent for each child
    
    for (const edge of uniqueValidEntries) {
      const [parent, child] = edge.split('->');
      
      // Step 4: Handle multi-parent (diamond) case
      if (childParentMap.hasOwnProperty(child)) {
        // Child already has a parent, silently discard this edge
        continue;
      }
      childParentMap[child] = parent;
      
      if (!adjMap[parent]) {
        adjMap[parent] = [];
      }
      adjMap[parent].push(child);
      
      childSet.add(child);
      allNodes.add(parent);
      allNodes.add(child);
    }

    // Find roots (nodes that never appear as children)
    const roots = [...allNodes].filter(node => !childSet.has(node));

    // Step 5: Find connected groups using BFS
    function getConnectedComponents(nodes, adjMap) {
      const visited = new Set();
      const components = [];
      
      for (const node of nodes) {
        if (!visited.has(node)) {
          const component = new Set();
          const queue = [node];
          
          while (queue.length > 0) {
            const current = queue.shift();
            if (visited.has(current)) continue;
            
            visited.add(current);
            component.add(current);
            
            // Add children
            if (adjMap[current]) {
              for (const child of adjMap[current]) {
                if (!visited.has(child)) {
                  queue.push(child);
                }
              }
            }
            
            // Add parents (by checking all nodes)
            for (const [parent, children] of Object.entries(adjMap)) {
              if (children.includes(current) && !visited.has(parent)) {
                queue.push(parent);
              }
            }
          }
          
          components.push(component);
        }
      }
      
      return components;
    }

    const components = getConnectedComponents(allNodes, adjMap);

    // Step 6: For each component - detect cycles and build hierarchy
    const hierarchies = [];

    function detectCycle(componentNodes, adjMap) {
      const visited = new Set();
      const recursionStack = new Set();
      
      function dfs(node) {
        visited.add(node);
        recursionStack.add(node);
        
        const children = adjMap[node] || [];
        for (const child of children) {
          if (!visited.has(child)) {
            if (dfs(child)) return true;
          } else if (recursionStack.has(child)) {
            return true;
          }
        }
        
        recursionStack.delete(node);
        return false;
      }
      
      for (const node of componentNodes) {
        if (!visited.has(node)) {
          if (dfs(node)) return true;
        }
      }
      
      return false;
    }

    // Step 7: Build nested tree object
    function buildTree(node, adjMap) {
      const children = adjMap[node] || [];
      const result = {};
      for (const child of children) {
        result[child] = buildTree(child, adjMap);
      }
      return result;
    }

    // Step 8: Calculate depth
    function calculateDepth(node, adjMap) {
      const children = adjMap[node] || [];
      if (children.length === 0) return 1;
      
      let maxChildDepth = 0;
      for (const child of children) {
        maxChildDepth = Math.max(maxChildDepth, calculateDepth(child, adjMap));
      }
      
      return maxChildDepth + 1;
    }

    for (const component of components) {
      const hasCycle = detectCycle(component, adjMap);
      
      // Find root for this component
      let componentRoot;
      const componentChildren = new Set();
      
      for (const node of component) {
        if (adjMap[node]) {
          for (const child of adjMap[node]) {
            componentChildren.add(child);
          }
        }
      }
      
      const componentRoots = [...component].filter(node => !componentChildren.has(node));
      
      if (componentRoots.length > 0) {
        componentRoot = componentRoots[0];
      } else {
        // Pure cycle - use lexicographically smallest node
        componentRoot = [...component].sort()[0];
      }
      
      if (hasCycle) {
        hierarchies.push({
          root: componentRoot,
          tree: {},
          has_cycle: true
        });
      } else {
        const treeObj = {};
        treeObj[componentRoot] = buildTree(componentRoot, adjMap);
        const depth = calculateDepth(componentRoot, adjMap);
        
        hierarchies.push({
          root: componentRoot,
          tree: treeObj,
          depth: depth
        });
      }
    }

    // Step 9: Build summary object
    const totalTrees = hierarchies.filter(h => !h.has_cycle).length;
    const totalCycles = hierarchies.filter(h => h.has_cycle).length;
    
    let largestTreeRoot = null;
    let maxDepth = 0;
    
    for (const hierarchy of hierarchies) {
      if (!hierarchy.has_cycle && hierarchy.depth > maxDepth) {
        maxDepth = hierarchy.depth;
        largestTreeRoot = hierarchy.root;
      } else if (!hierarchy.has_cycle && hierarchy.depth === maxDepth) {
        // Tiebreaker: lexicographically smaller
        if (largestTreeRoot === null || hierarchy.root < largestTreeRoot) {
          largestTreeRoot = hierarchy.root;
        }
      }
    }

    const response = {
      user_id: USER_ID,
      email_id: EMAIL_ID,
      college_roll_number: COLLEGE_ROLL_NUMBER,
      hierarchies: hierarchies,
      invalid_entries: invalidEntries,
      duplicate_edges: duplicateEdges,
      summary: {
        total_trees: totalTrees,
        total_cycles: totalCycles,
        largest_tree_root: largestTreeRoot
      }
    };

    res.json(response);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// For local testing
if (require.main === module) {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
