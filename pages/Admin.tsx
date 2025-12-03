
import React, { useState, useEffect } from 'react';
import { TEXT, MOCK_SATELLITE_DATA } from '../constants';
import { Language, UserRequest } from '../types';
import { aiInstance } from '../utils/aiPredictor';
import { generateCustomerResponse } from '../utils/geminiService';
import { Upload, RefreshCw, Database, Activity, Bot, MessageSquare, Send, Check, Mail } from 'lucide-react';

interface AdminProps {
  lang: Language;
}

export const Admin: React.FC<AdminProps> = ({ lang }) => {
  const [isTraining, setIsTraining] = useState(false);
  const [modelStats, setModelStats] = useState({ accuracy: 0.82, samples: 1500 });
  const [requests, setRequests] = useState<UserRequest[]>([]);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    // Load requests from local storage
    const stored = localStorage.getItem('userRequests');
    if (stored) {
      setRequests(JSON.parse(stored));
    }
  }, []);

  const saveRequests = (updatedRequests: UserRequest[]) => {
    setRequests(updatedRequests);
    localStorage.setItem('userRequests', JSON.stringify(updatedRequests));
  };

  const handleFileUpload = () => {
    alert("Simulation: File satellite.json uploaded successfully to /public/data/");
  };

  const handleRetrain = () => {
    setIsTraining(true);
    setTimeout(() => {
      const stats = aiInstance.train(MOCK_SATELLITE_DATA);
      setModelStats(stats);
      setIsTraining(false);
    }, 2000);
  };

  const handleGenerateReply = async (req: UserRequest) => {
    setProcessingId(req.id);
    const reply = await generateCustomerResponse(req.name, req.location.name, req.question || '', lang);
    
    const updated = requests.map(r => 
      r.id === req.id ? { ...r, status: 'GENERATED' as const, aiReply: reply } : r
    );
    saveRequests(updated);
    setProcessingId(null);
  };

  const handleSendEmail = (req: UserRequest) => {
    const updated = requests.map(r => 
      r.id === req.id ? { ...r, status: 'SENT' as const } : r
    );
    saveRequests(updated);
    alert(`Email Sent to ${req.contact}:\n\n"${req.aiReply}"`);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{TEXT.admin[lang]} Panel</h2>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-100 dark:border-slate-700 flex items-center gap-4">
          <Database className="text-purple-500" size={24} />
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold">{TEXT.datasetSize[lang]}</p>
            <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{modelStats.samples.toLocaleString()}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-100 dark:border-slate-700 flex items-center gap-4">
          <Activity className="text-emerald-500" size={24} />
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold">{TEXT.modelAccuracy[lang]}</p>
            <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{(modelStats.accuracy * 100).toFixed(1)}%</p>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-100 dark:border-slate-700 flex items-center gap-4">
           <div className="w-6 h-6 rounded-full bg-emerald-500 animate-pulse" />
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold">{TEXT.trainingStatus[lang]}</p>
            <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">Ready</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Upload Section */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-full flex items-center justify-center mb-4">
            <Upload size={32} />
          </div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">{TEXT.uploadData[lang]}</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
            Update the model with the latest Sentinel-3 satellite temperature data (.json format).
          </p>
          <button 
            onClick={handleFileUpload}
            className="px-6 py-2 bg-slate-900 dark:bg-slate-700 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors"
          >
            Select File
          </button>
        </div>

        {/* Training Section */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col items-center text-center">
          <div className={`w-16 h-16 bg-orange-100 dark:bg-orange-900/30 text-orange-600 rounded-full flex items-center justify-center mb-4 ${isTraining ? 'animate-spin' : ''}`}>
            <RefreshCw size={32} />
          </div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">{TEXT.retrainModel[lang]}</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
            Recalculate regression coefficients and bias using new datasets.
          </p>
          <button 
            onClick={handleRetrain}
            disabled={isTraining}
            className="px-6 py-2 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors disabled:opacity-50"
          >
            {isTraining ? 'Training...' : 'Start Training'}
          </button>
        </div>
      </div>

      {/* AI Agent Section */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
        <div className="flex items-center gap-3 mb-6 border-b border-slate-100 dark:border-slate-700 pb-4">
          <div className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 p-2 rounded-lg">
            <Bot size={24} />
          </div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">
            {TEXT.adminAgent[lang]}
          </h3>
        </div>

        <div className="space-y-4">
          <h4 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase">
            {TEXT.pendingRequests[lang]}
          </h4>
          
          {requests.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <MessageSquare size={32} className="mx-auto mb-2 opacity-50" />
              <p>{TEXT.noRequests[lang]}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {requests.map((req) => (
                <div key={req.id} className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-bold text-slate-800 dark:text-slate-100">{req.name}</p>
                      <p className="text-xs text-slate-500">{req.contact} • {req.location.name}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-bold rounded ${
                      req.status === 'SENT' ? 'bg-green-100 text-green-700' :
                      req.status === 'GENERATED' ? 'bg-blue-100 text-blue-700' : 
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {req.status}
                    </span>
                  </div>
                  
                  {/* User Question */}
                  <div className="bg-white dark:bg-slate-800 p-3 rounded-lg text-sm text-slate-700 dark:text-slate-300 mb-3 border border-slate-100 dark:border-slate-700">
                    <span className="font-bold text-slate-400 text-xs block mb-1">USER QUERY:</span>
                    {req.question || <span className="italic opacity-50">No specific question provided.</span>}
                  </div>

                  {/* AI Reply Section */}
                  {req.status === 'PENDING' && (
                    <button 
                      onClick={() => handleGenerateReply(req)}
                      disabled={processingId === req.id}
                      className="flex items-center gap-2 text-sm bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                    >
                      {processingId === req.id ? <RefreshCw className="animate-spin" size={16}/> : <Bot size={16} />}
                      {TEXT.generateReply[lang]}
                    </button>
                  )}

                  {req.status !== 'PENDING' && req.aiReply && (
                    <div className="animate-fade-in">
                       <div className="bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded-lg text-sm text-indigo-900 dark:text-indigo-200 mb-3 border border-indigo-100 dark:border-indigo-800/50">
                        <span className="font-bold text-indigo-400 text-xs block mb-1">AI EMAIL DRAFT:</span>
                        {req.aiReply}
                      </div>
                      
                      {req.status === 'GENERATED' && (
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleSendEmail(req)}
                            className="flex items-center gap-2 text-sm bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                          >
                            <Mail size={16} />
                            {TEXT.sendEmail[lang]}
                          </button>
                           <button 
                            onClick={() => handleGenerateReply(req)}
                            className="flex items-center gap-2 text-sm bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-3 py-2 rounded-lg transition-colors hover:bg-slate-300 dark:hover:bg-slate-600"
                          >
                            <RefreshCw size={14} />
                            Regenerate
                          </button>
                        </div>
                      )}
                      
                      {req.status === 'SENT' && (
                         <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400 font-medium">
                           <Check size={16} />
                           Email Sent Successfully
                         </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
