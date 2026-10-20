import React, { useState, useEffect } from 'react';
import { MessageSquare, Plus, Tag, Smile, Frown, Meh, BarChart2, RefreshCw } from 'lucide-react';

export default function App() {
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [newFeedbackText, setNewFeedbackText] = useState('');
  const [category, setCategory] = useState('bug');
  const [loading, setLoading] = useState(false);

  const fetchProjects = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/v1/projects');
      const data = await res.json();
      setProjects(data);
      if (data.length > 0 && !selectedProjectId) {
        setSelectedProjectId(data[0].id);
        setFeedbacks(data[0].feedbacks || []);
      }
    } catch (err) {
      console.error('Failed to fetch projects', err);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    const currentProj = projects.find(p => p.id === selectedProjectId);
    if (currentProj) {
      setFeedbacks(currentProj.feedbacks || []);
    }
  }, [selectedProjectId, projects]);

  const handleAddFeedback = async (e) => {
    e.preventDefault();
    if (!newFeedbackText.trim() || !selectedProjectId) return;

    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8000/api/v1/projects/${selectedProjectId}/feedbacks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newFeedbackText, category })
      });
      
      if (res.ok) {
        setNewFeedbackText('');
        await fetchProjects();
      }
    } catch (err) {
      console.error('Failed to add feedback', err);
    } finally {
      setLoading(false);
    }
  };

  const getSentimentIcon = (sentiment) => {
    if (sentiment === 'positive') return <Smile className="text-green-500 w-5 h-5" />;
    if (sentiment === 'negative') return <Frown className="text-red-500 w-5 h-5" />;
    return <Meh className="text-yellow-500 w-5 h-5" />;
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col font-sans">
      <header className="bg-white border-b px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <BarChart2 className="w-6 h-6 text-indigo-600" />
          <h1 className="text-xl font-bold text-gray-800">FeedbackPulse AI (Live SQLite)</h1>
        </div>
        <button 
          onClick={fetchProjects}
          className="flex items-center gap-1 text-xs bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg border border-indigo-200 hover:bg-indigo-100 transition"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh Data
        </button>
      </header>

      <div className="flex-1 max-w-6xl w-full mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <h2 className="text-lg font-semibold mb-4 text-gray-700 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-indigo-500" /> Projects
          </h2>
          <div className="space-y-3">
            {projects.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedProjectId(p.id)}
                className={`w-full text-left p-3 rounded-lg border transition-all ${
                  selectedProjectId === p.id 
                    ? 'border-indigo-500 bg-indigo-50/50 ring-1 ring-indigo-500' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-medium text-gray-900">{p.name}</div>
                <div className="text-xs text-gray-500 mt-1">{p.description}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-md font-semibold text-gray-700 mb-3">Submit Feedback (Saved to SQLite)</h3>
            <form onSubmit={handleAddFeedback} className="space-y-3">
              <textarea
                value={newFeedbackText}
                onChange={(e) => setNewFeedbackText(e.target.value)}
                placeholder="Enter feedback or bug details..."
                className="w-full border rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none border-gray-300"
                rows="2"
              />
              <div className="flex items-center justify-between">
                <select 
                  value={category} 
                  onChange={(e) => setCategory(e.target.value)}
                  className="border rounded-lg px-3 py-1.5 text-sm bg-white border-gray-300"
                >
                  <option value="bug">Bug Report</option>
                  <option value="feature_request">Feature Request</option>
                  <option value="praise">Praise</option>
                </select>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition flex items-center gap-1 disabled:opacity-50"
                >
                  <Plus className="w-4 h-4" /> {loading ? 'Saving...' : 'Add Feedback'}
                </button>
              </div>
            </form>
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
            <h3 className="text-md font-semibold text-gray-700">Project Feedbacks ({feedbacks.length})</h3>
            {feedbacks.length === 0 ? (
              <p className="text-sm text-gray-500">No feedbacks recorded for this project yet.</p>
            ) : (
              feedbacks.map((f) => (
                <div key={f.id} className="p-4 rounded-lg border border-gray-100 bg-gray-50 flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-800">{f.content}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs px-2 py-0.5 rounded bg-gray-200 text-gray-700 font-mono flex items-center gap-1">
                        <Tag className="w-3 h-3" /> {f.category}
                      </span>
                      <span className="text-xs text-gray-400">{f.createdAt?.split('T')[0]}</span>
                    </div>
                  </div>
                  <div>{getSentimentIcon(f.sentiment)}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
