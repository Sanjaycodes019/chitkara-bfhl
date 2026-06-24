import { useState } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

function App() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    const entries = input.split(/[\n,]/).map(s => s.trim()).filter(Boolean);
    
    if (entries.length === 0) {
      setError('Please enter at least one node string.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const res = await axios.post(`${API_URL}/bfhl`, { data: entries });
      setResult(res.data);
    } catch (err) {
      setError('API call failed. Please check the server and try again.');
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const renderTree = (tree, level = 0) => {
    const entries = Object.entries(tree);
    if (entries.length === 0) return null;

    return (
      <ul style={{ marginLeft: `${level * 20}px` }}>
        {entries.map(([node, children]) => (
          <li key={node}>
            <span className="tree-node">{node}</span>
            {renderTree(children, level + 1)}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="app">
      <header className="header">
        <h1>Node Hierarchy Visualizer</h1>
        <p>Enter node strings (e.g., A-&gt;B, A-&gt;C) to visualize hierarchies</p>
      </header>

      <main className="main-content">
        <div className="input-section">
          <textarea
            className="input-textarea"
            placeholder="A-&gt;B, A-&gt;C, B-&gt;D, X-&gt;Y, Y-&gt;Z, Z-&gt;X"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={6}
          />
          <button className="submit-button" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Processing...' : 'Submit'}
          </button>
        </div>

        {error && (
          <div className="error-message">
            ⚠ {error}
          </div>
        )}

        {loading && (
          <div className="loading-message">
            <div className="spinner"></div>
            <span>Loading...</span>
          </div>
        )}

        {result && !loading && (
          <div className="results-section">
            {/* Summary Cards */}
            <div className="summary-cards">
              <div className="summary-card valid">
                <h3>Total Trees</h3>
                <p className="metric">{result.summary.total_trees}</p>
              </div>
              <div className="summary-card cycle">
                <h3>Total Cycles</h3>
                <p className="metric">{result.summary.total_cycles}</p>
              </div>
              <div className="summary-card highlight">
                <h3>Largest Tree Root</h3>
                <p className="metric">{result.summary.largest_tree_root || 'N/A'}</p>
              </div>
            </div>

            {/* Hierarchies */}
            <div className="hierarchies-section">
              <h2>Hierarchies</h2>
              {result.hierarchies.map((hierarchy, index) => (
                <div key={index} className={`hierarchy-card ${hierarchy.has_cycle ? 'cycle' : 'valid'}`}>
                  <h3>Root: {hierarchy.root}</h3>
                  {hierarchy.has_cycle ? (
                    <div className="cycle-warning">
                      <span className="warning-badge">⚠ Cycle Detected</span>
                      <p className="tree-empty-note">tree: {{}}</p>
                    </div>
                  ) : (
                    <div className="tree-content">
                      <p className="depth-info">Depth: {hierarchy.depth}</p>
                      <div className="tree-visualization">
                        {renderTree(hierarchy.tree)}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Invalid Entries */}
            {result.invalid_entries.length > 0 && (
              <div className="entries-section invalid">
                <h2>Invalid Entries</h2>
                <div className="chips-container">
                  {result.invalid_entries.map((entry, index) => (
                    <span key={index} className="chip invalid-chip">
                      {entry}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Duplicate Edges */}
            {result.duplicate_edges.length > 0 && (
              <div className="entries-section duplicate">
                <h2>Duplicate Edges</h2>
                <div className="chips-container">
                  {result.duplicate_edges.map((edge, index) => (
                    <span key={index} className="chip duplicate-chip">
                      {edge}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
