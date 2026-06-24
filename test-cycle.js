// Test cycle detection
const data = ["X->Y", "Y->Z", "Z->X"];

// Step 1: Validate entries
const validEntries = [];
const invalidEntries = [];

for (const entry of data) {
  const trimmed = entry.trim();
  const regex = /^([A-Z])->([A-Z])$/;
  
  if (regex.test(trimmed)) {
    const [parent, child] = trimmed.split('->');
    if (parent === child) {
      invalidEntries.push(entry);
    } else {
      validEntries.push(trimmed);
    }
  } else {
    invalidEntries.push(entry);
  }
}

console.log('Valid entries:', validEntries);

// Step 2: Detect duplicates
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

console.log('Unique valid entries:', uniqueValidEntries);

// Step 3: Build graph
const adjMap = {};
const childSet = new Set();
const allNodes = new Set();
const childParentMap = {};

for (const edge of uniqueValidEntries) {
  const [parent, child] = edge.split('->');
  
  if (childParentMap.hasOwnProperty(child)) {
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

console.log('Adjacency map:', adjMap);
console.log('All nodes:', [...allNodes]);

// Step 5: Find connected components
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
        
        if (adjMap[current]) {
          for (const child of adjMap[current]) {
            if (!visited.has(child)) {
              queue.push(child);
            }
          }
        }
        
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
console.log('Components:', components.map(c => [...c]));

// Step 6: Detect cycles
function detectCycle(componentNodes, adjMap) {
  const visited = new Set();
  const recursionStack = new Set();
  
  function dfs(node) {
    console.log(`Visiting node: ${node}, recursionStack:`, [...recursionStack]);
    visited.add(node);
    recursionStack.add(node);
    
    const children = adjMap[node] || [];
    console.log(`Children of ${node}:`, children);
    for (const child of children) {
      if (!visited.has(child)) {
        if (dfs(child)) return true;
      } else if (recursionStack.has(child)) {
        console.log(`Cycle detected! Node ${child} is in recursionStack`);
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

for (const component of components) {
  console.log('\n--- Testing component:', [...component], '---');
  const hasCycle = detectCycle(component, adjMap);
  console.log('Has cycle:', hasCycle);
}
