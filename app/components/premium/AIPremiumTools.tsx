"use client";

import { useState } from "react";

interface AIPremiumToolsProps {
  darkMode?: boolean;
  userEmail: string;
  userName: string;
  currentResume: string;
  userPlan: 'free' | 'basic' | 'premium';
  onUpgradeRequired: () => void;
}

export function AIPremiumTools({
  darkMode = false,
  userEmail,
  userName,
  currentResume,
  userPlan,
  onUpgradeRequired
}: AIPremiumToolsProps) {
  const [activeTab, setActiveTab] = useState<'experience' | 'coverletter' | 'ats'>('experience');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  // Experience Generator State
  const [jobDescription, setJobDescription] = useState('');
  const [targetJobTitle, setTargetJobTitle] = useState('');
  const [originalExperience, setOriginalExperience] = useState('');

  // Cover Letter State
  const [targetCompany, setTargetCompany] = useState('');

  // ATS Score State
  const [atsResumeText, setAtsResumeText] = useState(currentResume);
  const [atsJobDescription, setAtsJobDescription] = useState('');

  const handleGenerateExperience = async () => {
    if (userPlan !== 'premium') {
      onUpgradeRequired();
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api/premium/experience', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userEmail,
          originalExperience,
          jobDescription,
          targetJobTitle
        })
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 403) {
          onUpgradeRequired();
          return;
        }
        throw new Error(data.error || 'Failed to generate');
      }

      setResult(data);
    } catch (error) {
      console.error('Error:', error);
      setResult({ error: error instanceof Error ? error.message : 'Failed to generate' });
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateCoverLetter = async () => {
    if (userPlan !== 'premium') {
      onUpgradeRequired();
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api/premium/cover-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userEmail,
          userName,
          targetCompany,
          targetJobTitle,
          jobDescription,
          resumeSummary: currentResume
        })
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 403) {
          onUpgradeRequired();
          return;
        }
        throw new Error(data.error || 'Failed to generate');
      }

      setResult(data);
    } catch (error) {
      console.error('Error:', error);
      setResult({ error: error instanceof Error ? error.message : 'Failed to generate' });
    } finally {
      setLoading(false);
    }
  };

  const handleCalculateATSScore = async () => {
    if (userPlan !== 'premium') {
      onUpgradeRequired();
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api/premium/ats-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userEmail,
          resumeText: atsResumeText,
          jobDescription: atsJobDescription
        })
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 403) {
          onUpgradeRequired();
          return;
        }
        throw new Error(data.error || 'Failed to calculate');
      }

      setResult(data);
    } catch (error) {
      console.error('Error:', error);
      setResult({ error: error instanceof Error ? error.message : 'Failed to calculate' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`rounded-2xl shadow-lg border-2 overflow-hidden ${
      darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
    }`}>
      <div className="border-b border-slate-200 dark:border-slate-700">
        <div className="flex">
          <button
            onClick={() => {
              setActiveTab('experience');
              setResult(null);
            }}
            className={`flex-1 px-6 py-4 font-semibold transition-colors ${
              activeTab === 'experience'
                ? 'bg-blue-600 text-white'
                : darkMode
                  ? 'bg-slate-800 text-slate-400 hover:text-white'
                  : 'bg-white text-slate-600 hover:text-slate-900'
            }`}
          >
            AI Experience
          </button>
          <button
            onClick={() => {
              setActiveTab('coverletter');
              setResult(null);
            }}
            className={`flex-1 px-6 py-4 font-semibold transition-colors ${
              activeTab === 'coverletter'
                ? 'bg-blue-600 text-white'
                : darkMode
                  ? 'bg-slate-800 text-slate-400 hover:text-white'
                  : 'bg-white text-slate-600 hover:text-slate-900'
            }`}
          >
            Cover Letter
          </button>
          <button
            onClick={() => {
              setActiveTab('ats');
              setResult(null);
            }}
            className={`flex-1 px-6 py-4 font-semibold transition-colors ${
              activeTab === 'ats'
                ? 'bg-blue-600 text-white'
                : darkMode
                  ? 'bg-slate-800 text-slate-400 hover:text-white'
                  : 'bg-white text-slate-600 hover:text-slate-900'
            }`}
          >
            ATS Score
          </button>
        </div>
      </div>

      <div className="p-6">
        {activeTab === 'experience' && (
          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                Target Job Title
              </label>
              <input
                type="text"
                value={targetJobTitle}
                onChange={(e) => setTargetJobTitle(e.target.value)}
                placeholder="e.g., Warehouse Supervisor"
                className={`w-full px-4 py-3 rounded-lg border-2 focus:border-blue-500 focus:outline-none ${
                  darkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-slate-50 border-slate-200'
                }`}
              />
            </div>

            <div>
              <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                Job Description
              </label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description here..."
                rows={6}
                className={`w-full px-4 py-3 rounded-lg border-2 focus:border-blue-500 focus:outline-none ${
                  darkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-slate-50 border-slate-200'
                }`}
              />
            </div>

            <div>
              <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                Your Original Experience
              </label>
              <textarea
                value={originalExperience}
                onChange={(e) => setOriginalExperience(e.target.value)}
                placeholder="Describe your current work experience..."
                rows={4}
                className={`w-full px-4 py-3 rounded-lg border-2 focus:border-blue-500 focus:outline-none ${
                  darkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-slate-50 border-slate-200'
                }`}
              />
            </div>

            <button
              onClick={handleGenerateExperience}
              disabled={loading || !targetJobTitle || !jobDescription || !originalExperience}
              className={`w-full py-3 px-6 rounded-xl font-semibold transition-all ${
                loading || !targetJobTitle || !jobDescription || !originalExperience
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl'
              }`}
            >
              {loading ? 'Generating...' : 'Generate ATS-Optimized Experience'}
            </button>

            {result?.error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                {result.error}
              </div>
            )}

            {result?.optimizedExperience && (
              <div className={`p-4 rounded-lg border-2 ${darkMode ? 'bg-slate-700 border-green-500' : 'bg-green-50 border-green-200'}`}>
                <h4 className={`font-bold mb-3 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                  Optimized Experience Bullet Points:
                </h4>
                <ul className="space-y-2 mb-4">
                  {result.optimizedExperience.map((point: string, idx: number) => (
                    <li key={idx} className={`flex items-start gap-2 ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                      <span className="text-green-500 mt-1">✓</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
                <div className={`mt-4 pt-4 border-t ${darkMode ? 'border-slate-600' : 'border-slate-200'}`}>
                  <p className={`text-sm font-semibold mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                    Keywords Extracted:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {result.keywordsExtracted.map((keyword: string, idx: number) => (
                      <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'coverletter' && (
          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                Target Company
              </label>
              <input
                type="text"
                value={targetCompany}
                onChange={(e) => setTargetCompany(e.target.value)}
                placeholder="e.g., Amazon Logistics"
                className={`w-full px-4 py-3 rounded-lg border-2 focus:border-blue-500 focus:outline-none ${
                  darkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-slate-50 border-slate-200'
                }`}
              />
            </div>

            <div>
              <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                Target Job Title
              </label>
              <input
                type="text"
                value={targetJobTitle}
                onChange={(e) => setTargetJobTitle(e.target.value)}
                placeholder="e.g., Warehouse Manager"
                className={`w-full px-4 py-3 rounded-lg border-2 focus:border-blue-500 focus:outline-none ${
                  darkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-slate-50 border-slate-200'
                }`}
              />
            </div>

            <div>
              <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                Job Description
              </label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description here..."
                rows={6}
                className={`w-full px-4 py-3 rounded-lg border-2 focus:border-blue-500 focus:outline-none ${
                  darkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-slate-50 border-slate-200'
                }`}
              />
            </div>

            <button
              onClick={handleGenerateCoverLetter}
              disabled={loading || !targetCompany || !targetJobTitle || !jobDescription}
              className={`w-full py-3 px-6 rounded-xl font-semibold transition-all ${
                loading || !targetCompany || !targetJobTitle || !jobDescription
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl'
              }`}
            >
              {loading ? 'Generating...' : 'Generate Professional Cover Letter'}
            </button>

            {result?.error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                {result.error}
              </div>
            )}

            {result?.coverLetter && (
              <div className={`p-6 rounded-lg border-2 ${darkMode ? 'bg-slate-700 border-green-500' : 'bg-green-50 border-green-200'}`}>
                <div className="flex items-center justify-between mb-4">
                  <h4 className={`font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                    Your Professional Cover Letter
                  </h4>
                  <span className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    {result.wordCount} words
                  </span>
                </div>
                <div className={`whitespace-pre-wrap ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                  {result.coverLetter}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'ats' && (
          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                Your Resume Text
              </label>
              <textarea
                value={atsResumeText}
                onChange={(e) => setAtsResumeText(e.target.value)}
                placeholder="Paste your full resume text here..."
                rows={8}
                className={`w-full px-4 py-3 rounded-lg border-2 focus:border-blue-500 focus:outline-none ${
                  darkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-slate-50 border-slate-200'
                }`}
              />
            </div>

            <div>
              <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                Job Description
              </label>
              <textarea
                value={atsJobDescription}
                onChange={(e) => setAtsJobDescription(e.target.value)}
                placeholder="Paste the job description here..."
                rows={6}
                className={`w-full px-4 py-3 rounded-lg border-2 focus:border-blue-500 focus:outline-none ${
                  darkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-slate-50 border-slate-200'
                }`}
              />
            </div>

            <button
              onClick={handleCalculateATSScore}
              disabled={loading || !atsResumeText || !atsJobDescription}
              className={`w-full py-3 px-6 rounded-xl font-semibold transition-all ${
                loading || !atsResumeText || !atsJobDescription
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl'
              }`}
            >
              {loading ? 'Analyzing...' : 'Calculate ATS Score'}
            </button>

            {result?.error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                {result.error}
              </div>
            )}

            {result?.atsScore !== undefined && (
              <div className={`p-6 rounded-lg border-2 ${darkMode ? 'bg-slate-700 border-blue-500' : 'bg-blue-50 border-blue-200'}`}>
                <div className="text-center mb-6">
                  <div className={`text-5xl font-bold mb-2 ${
                    result.atsScore >= 80 ? 'text-green-600' :
                    result.atsScore >= 60 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {result.atsScore}
                  </div>
                  <p className={`text-sm font-semibold ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    ATS Match Score
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className={`text-sm font-semibold mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                      Matched Keywords:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {result.matchedKeywords.map((keyword: string, idx: number) => (
                        <span key={idx} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className={`text-sm font-semibold mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                      Missing Keywords:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {result.missingKeywords.map((keyword: string, idx: number) => (
                        <span key={idx} className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className={`mb-4 ${darkMode ? 'bg-slate-800 p-4 rounded-lg' : 'bg-white p-4 rounded-lg border border-slate-200'}`}>
                  <p className={`text-sm font-semibold mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                    Readability Score: {result.readabilityScore}/10
                  </p>
                </div>

                <div>
                  <p className={`text-sm font-semibold mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                    Improvement Suggestions:
                  </p>
                  <ul className="space-y-2">
                    {result.suggestions.map((suggestion: string, idx: number) => (
                      <li key={idx} className={`flex items-start gap-2 ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                        <span className="text-blue-500 mt-1">→</span>
                        <span>{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
