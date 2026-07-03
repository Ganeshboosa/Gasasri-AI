"use client";

import { useEffect, useState } from "react";
import { FileText, Upload, Search, Filter, Eye, Download, Brain, AlertTriangle, Loader2 } from "lucide-react";
import { api } from "@/lib/api";

interface Record {
  id: number;
  patient_id: number;
  title: string;
  record_type: string;
  file_url?: string;
  extracted_text?: string;
  ai_summary?: string;
  uploaded_at: string;
}

export default function HealthRecordsPage() {
  const [records, setRecords] = useState<Record[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showUpload, setShowUpload] = useState(false);
  
  const [title, setTitle] = useState("");
  const [type, setType] = useState("Lab Report");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [analyzingId, setAnalyzingId] = useState<number | null>(null);

  const fetchRecords = async () => {
    try {
      const res = await api.get("/records");
      setRecords(res.data);
    } catch (err: any) {
      setError("Failed to load medical records.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setUploading(true);
    
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("record_type", type);
      if (file) {
        formData.append("file", file);
      }

      await api.post("/records", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      
      setTitle("");
      setFile(null);
      setShowUpload(false);
      fetchRecords();
    } catch {
      setError("Failed to upload medical record.");
    } finally {
      setUploading(false);
    }
  };

  const handleAnalyze = async (id: number) => {
    setAnalyzingId(id);
    try {
      await api.post(`/records/${id}/analyze`);
      fetchRecords();
    } catch {
      setError("Failed to run AI analysis.");
    } finally {
      setAnalyzingId(null);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Health Records</h1>
          <p className="text-slate-400 mt-1">All your medical documents in one secure place.</p>
        </div>
        <button 
          onClick={() => setShowUpload(!showUpload)}
          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors text-sm font-medium shadow-[0_0_15px_rgba(79,70,229,0.3)]"
        >
          <Upload className="w-4 h-4" /> {showUpload ? "Cancel" : "Upload Record"}
        </button>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">
          {error}
        </div>
      )}

      {/* Upload Form Modal/Collapsible */}
      {showUpload && (
        <form onSubmit={handleUpload} className="p-6 rounded-2xl border border-white/10 bg-slate-900/80 backdrop-blur-xl space-y-4 max-w-lg">
          <h3 className="font-semibold text-white text-lg">Add New Record</h3>
          
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-300">Record Title</label>
            <input 
              type="text" required value={title} onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Lipids Blood Test"
              className="w-full bg-slate-950/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-300">Record Type</label>
            <select 
              value={type} onChange={e => setType(e.target.value)}
              className="w-full bg-slate-950/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            >
              <option value="Lab Report">Lab Report</option>
              <option value="Prescription">Prescription</option>
              <option value="Imaging">Imaging</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-300">File Attachment (Optional)</label>
            <input 
              type="file" onChange={e => setFile(e.target.files?.[0] || null)}
              className="w-full text-slate-400 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-500/10 file:text-indigo-400 hover:file:bg-indigo-500/20"
            />
          </div>

          <button 
            type="submit" disabled={uploading}
            className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-lg text-sm font-medium"
          >
            {uploading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Save Record"}
          </button>
        </form>
      )}

      {/* AI Summary Banner */}
      <div className="p-5 rounded-2xl border border-indigo-500/20 bg-indigo-500/5 flex items-center gap-4">
        <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex-shrink-0">
          <Brain className="w-6 h-6 text-indigo-400" />
        </div>
        <div>
          <p className="text-sm font-medium text-white">AI Report Analysis Active</p>
          <p className="text-xs text-slate-400 mt-0.5">Click "Analyze Report" on any uploaded document below to generate interactive clinical insights.</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 text-indigo-500 animate-spin" /></div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {records.map((rec) => (
            <div key={rec.id} className="p-6 rounded-2xl border border-white/5 bg-slate-900/50 backdrop-blur-xl hover:bg-slate-800/50 transition-colors group">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex-shrink-0">
                    <FileText className="w-5 h-5 text-slate-300" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-white">{rec.title}</h3>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-slate-400 border border-white/5">
                        {rec.record_type}
                      </span>
                      {rec.ai_summary && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/20">
                          AI Summary
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                      <span>Uploaded on {new Date(rec.uploaded_at).toLocaleDateString()}</span>
                    </div>

                    {rec.ai_summary && (
                      <div className="p-4 rounded-xl bg-white/5 border border-white/5 relative mt-3">
                        <div className="absolute -top-3 left-4 px-2 py-0.5 bg-slate-800 border border-indigo-500/30 text-[10px] uppercase tracking-wider font-bold text-indigo-400 rounded">
                          AI Summary
                        </div>
                        <p className="text-sm text-slate-300 leading-relaxed pt-1 whitespace-pre-line">
                          {rec.ai_summary}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2 flex-shrink-0">
                  {!rec.ai_summary && (
                    <button 
                      onClick={() => handleAnalyze(rec.id)} disabled={analyzingId === rec.id}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 text-xs font-semibold hover:bg-indigo-500/20 border border-indigo-500/20"
                    >
                      {analyzingId === rec.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Brain className="w-3.5 h-3.5" />}
                      Analyze Report
                    </button>
                  )}
                  <button className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors">
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {records.length === 0 && (
            <div className="text-center py-12 text-slate-500">
              <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>No medical records uploaded yet.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
