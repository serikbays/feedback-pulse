import React, { useState } from 'react';
import { MessageSquare, Plus, Tag, Smile, Frown, Meh, BarChart2 } from 'lucide-react';

const MOCK_PROJECTS = [
  { id: '1', name: 'Mobile App v2', description: 'Main iOS and Android application' },
  { id: '2', name: 'SaaS Dashboard', description: 'Web analytics portal' }
];

const MOCK_FEEDBACKS = [
  { id: '101', projectId: '1', content: 'App crashes on checkout screen!', category: 'bug', sentiment: 'negative', createdAt: '2026-10-18' },
  { id: '102', projectId: '1', content: 'Love the new dark mode toggle feature.', category: 'praise', sentiment: 'positive', createdAt: '2026-10-19' },
  { id: '103', projectId: '2', content: 'Please add CSV export option for analytics.', category: 'feature_request', sentiment: 'neutral', createdAt: '2026-10-19' }
];

export default function App() {
  const [projects] = useState(MOCK_PROJECTS);
  const [selectedProjectId, setSelectedProjectId] = useState('1');
  const [feedbacks, setFeedbacks] = useState(MOCK_FEEDBACKS);
  const [newFeedbackText, setNewFeedbackText] = useState('');
  const [category, setCategory] = useState('bug');

  const filteredFeedbacks = feedbacks.filter(f => f.projectId === selectedProjectId);

  const handleAddFeedback = (e) => {
    e.preventDefault();
    if (!newFeedbackText.trim()) return;

    const newItem = {
      id: Date.now().toString(),
      projectId: selectedProjectId,
      content: newFeedbackText,
      category: category,
      sentiment: category === 'bug' ? 'negative' : category === 'praise' ? 'positive' : 'neutral',
      createdAt: new Date().toISOString().split('T')[0]
    };

    setFeedbacks([newItem, ...feedbacks]);
    setNewFeedbackText('');
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
          <h1 className="text-xl font-bold text-gray-800">FeedbackPulse AI</h1>
        </div>
        <span className="text-xs bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full border border-indigo-200">Mock Service Active</span>
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
            <h3 className="text-md font-semibold text-gray-700 mb-3">Submit Feedback (Mock Ingestion)</h3>
            <form onSubmit={handleAddFeedback} className="space-y-3">
              <textarea
                value={newFeedbackText}
                onChange={(e) => setNewFeedbackText(e.target.value)}
                placeholder="Enter feedback or issue details..."
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
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" /> Add Feedback
                </button>
              </div>
            </form>
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
            <h3 className="text-md font-semibold text-gray-700">Recent Feedbacks ({filteredFeedbacks.length})</h3>
            {filteredFeedbacks.length === 0 ? (
              <p className="text-sm text-gray-500">No feedbacks recorded for this project yet.</p>
            ) : (
              filteredFeedbacks.map((f) => (
                <div key={f.id} className="p-4 rounded-lg border border-gray-100 bg-gray-50 flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-800">{f.content}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs px-2 py-0.5 rounded bg-gray-200 text-gray-700 font-mono flex items-center gap-1">
                        <Tag className="w-3 h-3" /> {f.category}
                      </span>
                      <span className="text-xs text-gray-400">{f.createdAt}</span>
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
