// Test full example
const data = ["A->B", "A->C", "B->D", "C->E", "E->F", "X->Y", "Y->Z", "Z->X", "P->Q", "Q->R", "G->H", "G->H", "G->I", "hello", "1->2", "A->"];

// Step 1: Validate entries
const validEntries = [];
const invalidEntries = [];

for (const entry of data) {
  const trimmed = entry.trim();
  const regex = /^([A-Z])->([A-Z])$/;
  
  if (regex.test(trimmed === '' ? entry : trimmed)) {
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

// Step 6: Detect cycles
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

// Step 7: Build tree
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

const hierarchies = [];

for (const component of components) {
  const hasCycle = detectCycle(component, adjMap);
  
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

console.log('=== FINAL RESULT ===');
console.log('Hierarchies:', JSON.stringify(hierarchies, null, 2));
console.log('Invalid entries:', invalidEntries);
console.log('Duplicate edges:', duplicateEdges);

const totalTrees = hierarchies.filter(h => !h.has_cycle).length;
const totalCycles = hierarchies.filter(h => h.has_cycle).length;

let largestTreeRoot = null;
let maxDepth = 0;

for (const hierarchy of hierarchies) {
  if (!hierarchy.has_cycle && hierarchy.depth > maxDepth) {
    maxDepth = hierarchy.depth;
    largestTreeRoot = hierarchy.root;
  } else if (!hierarchy.has_cycle && hierarchy.depth === maxDepth) {
    if (largestTreeRoot === null || hierarchy.root < largestTreeRoot) {
      largestTreeRoot = hierarchy.root;
    }
  }
}

console.log('Summary:');
console.log('Total trees:', totalTrees);
console.log('Total cycles:', totalCycles);
console.log('Largest tree root:', largestTreeRoot);
