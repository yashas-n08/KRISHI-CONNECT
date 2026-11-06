import React, { useState } from 'react';
import {
  Activity,
  AlertCircle,
  ArrowUpRight,
  BrainCircuit,
  Building2,
  CheckCircle2,
  Clock,
  Database,
  Download,
  FileSpreadsheet,
  Globe,
  Layers,
  RefreshCw,
  Scale,
  ShieldAlert,
  ShieldCheck,
  Tractor,
  TrendingUp,
  UploadCloud,
  Users,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { COMMUNITY_ANALYTICS_DATA, MODEL_PERFORMANCE_METRICS } from '../../data/mockData';

export const AdminDashboard: React.FC = () => {
  const {
    govApiStatuses,
    triggerGovSync,
    importCsvData,
    contracts,
    hotelRequirements,
    commodities,
    language,
    t,
  } = useApp();

  const [isSyncing, setIsSyncing] = useState(false);
  const [showCsvModal, setShowCsvModal] = useState(false);
  const [isProcessingCsv, setIsProcessingCsv] = useState(false);
  const [csvUploadSuccess, setCsvUploadSuccess] = useState<string | null>(null);

  const sampleCsvData = `commodity,district,market,modal_price,min_price,max_price,arrivals_tonnes
Tomato (Hybrid),Kolar,Kolar APMC,2450,2100,2700,420
Onion (Medium),Bangalore Urban,Yeshwanthpur APMC,3150,2800,3400,310
Potato (Jyoti),Hassan,Hassan Market Yard,1920,1750,2100,180
French Beans,Chikkaballapur,Chintamani Market,4300,3900,4700,95
Capsicum (Green),Bangalore Rural,Hoskote Sub-Market,3650,3300,4000,78
Green Chilli,Kolar,Srinivaspur APMC,3900,3500,4250,110
Carrot (Orange),Belgaum,Belgaum APMC,2850,2600,3100,135`;

  const [csvInput, setCsvInput] = useState(sampleCsvData);

  const [disputeLogs, setDisputeLogs] = useState([
    {
      id: 'disp-1',
      title: 'Contract KC-JPN-2026-061: Quality Adjustment',
      date: 'Oct 28',
      desc: 'Maiyas noted 3% broken beans due to transport bumps. Mutual resolution: 1.5% adjustment settled via escrow without dispute escalation.',
      status: 'Resolved' as 'Resolved' | 'Pending' | 'Audited',
      badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    },
    {
      id: 'disp-2',
      title: 'Weight Calibration Audit (Kolar Weighbridge)',
      date: 'Nov 03',
      desc: 'Legal Metrology Department certified digital scales. Zero deviation detected on 50 kg test weights.',
      status: 'Audited' as 'Resolved' | 'Pending' | 'Audited',
      badgeClass: 'bg-blue-50 text-blue-800 border-blue-200',
    },
    {
      id: 'disp-3',
      title: 'Chintamani Transit Moisture Verification',
      date: 'Nov 05',
      desc: 'Rameshwaram Cafe noted high transit humidity on 400kg tomato delivery. Agronomist inspection completed.',
      status: 'Pending' as 'Resolved' | 'Pending' | 'Audited',
      badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
    },
  ]);

  const handleSyncClick = async () => {
    setIsSyncing(true);
    try {
      await triggerGovSync();
    } finally {
      setIsSyncing(false);
    }
  };

  const handleProcessCsv = async () => {
    if (!csvInput.trim()) return;
    setIsProcessingCsv(true);
    try {
      const res = await importCsvData(csvInput);
      setCsvUploadSuccess(`Successfully ingested & broadcasted ${res.importedCount} APMC commodity records to all connected farmer & HoReCa portals!`);
      setShowCsvModal(false);
      setTimeout(() => setCsvUploadSuccess(null), 6000);
    } finally {
      setIsProcessingCsv(false);
    }
  };

  const handleResolveDispute = (id: string) => {
    setDisputeLogs((prev) =>
      prev.map((d) =>
        d.id === id
          ? {
              ...d,
              status: 'Resolved',
              desc: d.desc + ' — [Mediation completed by APMC Administrator: Escrow cleared and settled].',
              badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
            }
          : d
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Admin Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-2xl p-6 text-white shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-blue-300 text-xs font-semibold uppercase tracking-wider mb-1">
              <ShieldCheck className="w-4 h-4 text-blue-400" />
              <span>State Agricultural Marketing Board & System Administration</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              KRISHI Platform Administration & Intelligence Control
            </h1>
            <p className="text-xs sm:text-sm text-blue-200/90 mt-1">
              Real-time monitoring of Government AGMARKNET APIs, Time-series ML model drifts, and Hyperlocal Demand-Supply Balances.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleSyncClick}
              disabled={isSyncing}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center space-x-2 disabled:opacity-70"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Connecting to Agmarknet...' : 'Trigger Agmarknet Sync'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Numerical Analytics Highlights (Section 11 requirement) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Registered Farmers</span>
          <div className="text-2xl font-black text-gray-900 mt-1">{COMMUNITY_ANALYTICS_DATA.totalFarmers}</div>
          <span className="text-[10px] text-emerald-700 font-semibold">100% Aadhaar Verified</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Registered HoReCa</span>
          <div className="text-2xl font-black text-gray-900 mt-1">{COMMUNITY_ANALYTICS_DATA.totalHotels}</div>
          <span className="text-[10px] text-amber-700 font-semibold">FSSAI Certified</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Active Contracts</span>
          <div className="text-2xl font-black text-gray-900 mt-1">{contracts.length}</div>
          <span className="text-[10px] text-blue-700 font-semibold">Zero Default Rate</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Advance Capital Disbursed</span>
          <div className="text-2xl font-black text-[#176B3A] mt-1">₹8.45 L</div>
          <span className="text-[10px] text-emerald-700 font-semibold">UPI Escrow Backed</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Weekly Crop Demand</span>
          <div className="text-2xl font-black text-gray-900 mt-1">3,850 kg</div>
          <span className="text-[10px] text-gray-500">Across JP Nagar Cluster</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Weekly Farm Supply</span>
          <div className="text-2xl font-black text-emerald-700 mt-1">3,100 kg</div>
          <span className="text-[10px] text-red-600 font-semibold">750 kg Net Deficit</span>
        </div>
      </div>

      {/* Demand & Supply Gap Analysis (Section 11 requirement) */}
      <div className="bg-white rounded-2xl p-6 border border-[#E1ECE3] shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <Scale className="w-5 h-5 text-[#176B3A]" />
              <span>Hyperlocal Demand-Supply Gap Matrix</span>
            </h2>
            <p className="text-xs text-gray-500">
              Identifies production deficits in real time so agricultural extension officers can guide farmer planting decisions
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#F8FAF8] border-b border-gray-200 text-gray-600 font-bold uppercase text-[11px]">
                <th className="py-3 px-3">Crop Commodity</th>
                <th className="py-3 px-3">Weekly Hotel Demand</th>
                <th className="py-3 px-3">Contracted Farm Supply</th>
                <th className="py-3 px-3">Deficit / Surplus</th>
                <th className="py-3 px-3">Market Imbalance Status</th>
                <th className="py-3 px-3">Agricultural Extension Advisory</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {COMMUNITY_ANALYTICS_DATA.demandSupplyGaps.map((item) => (
                <tr key={item.crop} className="hover:bg-gray-50">
                  <td className="py-3.5 px-3 font-bold text-gray-900">{item.crop}</td>
                  <td className="py-3.5 px-3 font-semibold text-gray-800">{item.hotelDemandKg} kg/wk</td>
                  <td className="py-3.5 px-3 font-semibold text-gray-800">{item.farmerSupplyKg} kg/wk</td>
                  <td className="py-3.5 px-3 font-black text-sm">
                    {item.gapKg < 0 ? (
                      <span className="text-red-600">{item.gapKg} kg (Shortage)</span>
                    ) : (
                      <span className="text-emerald-700">+{item.gapKg} kg (Surplus)</span>
                    )}
                  </td>
                  <td className="py-3.5 px-3">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        item.gapKg < 0
                          ? 'bg-red-50 text-red-700 border border-red-200'
                          : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-gray-600 text-[11px]">
                    {item.gapKg < 0 ? (
                      <span className="text-[#176B3A] font-semibold">
                        Alert sent to Kolar/Chintamani farmers: +{Math.abs(item.gapKg)} kg planting needed.
                      </span>
                    ) : (
                      <span>Advise farmers to space plucking cycles or contract outside JP Nagar.</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 14: GOVERNMENT DATA INTEGRATION & RELIABILITY PIPELINE */}
      <div className="bg-white rounded-2xl p-6 border border-[#E1ECE3] shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100 gap-3">
          <div>
            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <Database className="w-5 h-5 text-blue-600" />
              <span>Government Agricultural Data Connector Pipeline</span>
            </h2>
            <p className="text-xs text-gray-500">
              Primary Data Ingestion Status across AGMARKNET, data.gov.in, DES, and UPAg
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowCsvModal(true)}
              className="px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 font-bold text-xs rounded-xl transition-colors flex items-center space-x-1.5 shadow-xs"
            >
              <UploadCloud className="w-4 h-4 text-blue-600" />
              <span>Official CSV Data Ingestion</span>
            </button>
          </div>
        </div>

        {csvUploadSuccess && (
          <div className="mt-4 p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs rounded-xl flex items-center space-x-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              <strong>CSV Real-Time Ingestion Verified:</strong> {csvUploadSuccess}
            </span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
          {govApiStatuses.map((src) => (
            <div key={src.sourceName} className="p-4 rounded-xl border border-gray-200 bg-[#FAFCFA]">
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-bold text-gray-900 text-xs">{src.sourceName}</span>
                  <a
                    href={src.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-blue-600 hover:underline block mt-0.5"
                  >
                    {src.url}
                  </a>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  {src.status}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-gray-100 text-[11px]">
                <div>
                  <span className="text-gray-400 block text-[10px]">Indexed Records</span>
                  <span className="font-bold text-gray-800">{src.recordsCount.toLocaleString('en-IN')}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px]">API Latency</span>
                  <span className="font-bold text-emerald-700">{src.avgResponseMs} ms</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px]">Last Sync</span>
                  <span className="font-medium text-gray-600">{src.lastSyncTimestamp.split(' ')[0]}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Model Accuracy & Dispute Resolution Panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Model Accuracy */}
        <div className="bg-white rounded-2xl p-6 border border-[#E1ECE3] shadow-xs">
          <div className="flex items-center space-x-2 text-gray-900 font-bold text-sm mb-2">
            <BrainCircuit className="w-4 h-4 text-[#176B3A]" />
            <h3>AI Prediction Engine Drift & Accuracy Monitoring</h3>
          </div>
          <p className="text-xs text-gray-500 mb-4">
            Continuous backtesting against daily closing modal prices reported by APMC Secretaries.
          </p>

          <div className="space-y-2.5">
            {MODEL_PERFORMANCE_METRICS.map((m) => (
              <div
                key={m.modelName}
                className="p-3 bg-[#F8FAF8] rounded-xl border border-gray-100 flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-bold text-gray-900">{m.modelName}</span>
                  <span className="text-gray-500 text-[11px] block">Weight: {(m.weight * 100).toFixed(0)}%</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div>
                    <span className="text-gray-400 text-[10px] block">RMSE</span>
                    <span className="font-bold text-gray-800">{m.rmse}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 text-[10px] block">MAPE</span>
                    <span className="font-black text-emerald-700">{m.mape}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dispute Resolution Log */}
        <div className="bg-white rounded-2xl p-6 border border-[#E1ECE3] shadow-xs">
          <div className="flex items-center space-x-2 text-gray-900 font-bold text-sm mb-2">
            <ShieldAlert className="w-4 h-4 text-amber-600" />
            <h3>Contract Integrity & Dispute Management Log</h3>
          </div>
          <p className="text-xs text-gray-500 mb-4">
            Auditing fair weights, quality gradings, and dispute mediation in community contracts.
          </p>

          <div className="space-y-3">
            {disputeLogs.map((item) => (
              <div key={item.id} className="p-3 bg-gray-50/80 border border-gray-200 rounded-xl text-xs">
                <div className="flex items-center justify-between font-bold text-gray-900 mb-1">
                  <span>{item.title}</span>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${item.badgeClass}`}>
                      {item.status}
                    </span>
                    <span className="text-[10px] text-gray-500">{item.date}</span>
                  </div>
                </div>
                <p className="text-gray-700 text-[11px] leading-relaxed mb-2">{item.desc}</p>
                {item.status === 'Pending' && (
                  <button
                    onClick={() => handleResolveDispute(item.id)}
                    className="px-3 py-1 bg-[#176B3A] hover:bg-[#12582f] text-white font-bold text-[11px] rounded-lg transition-colors flex items-center space-x-1"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Authorize Resolution & Release Escrow</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CSV Ingestion Modal */}
      {showCsvModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-900 to-indigo-900 p-5 text-white flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold flex items-center gap-2">
                  <FileSpreadsheet className="w-5 h-5 text-blue-300" />
                  <span>State Agricultural Marketing Board CSV Ingestion</span>
                </h3>
                <p className="text-xs text-blue-200 mt-0.5">
                  Import official APMC closing bulletins into the real-time pipeline
                </p>
              </div>
              <button
                onClick={() => setShowCsvModal(false)}
                className="text-white/80 hover:text-white text-lg font-bold px-2 py-1"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-gray-700">Paste or Edit APMC CSV Data:</span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCsvInput(sampleCsvData)}
                    className="text-[11px] font-bold text-blue-600 hover:underline"
                  >
                    Reset to Official Karnataka APMC Sample
                  </button>
                  <span className="text-gray-300">•</span>
                  <button
                    onClick={() => setCsvInput('')}
                    className="text-[11px] font-bold text-gray-500 hover:text-gray-700"
                  >
                    Clear
                  </button>
                </div>
              </div>

              <textarea
                value={csvInput}
                onChange={(e) => setCsvInput(e.target.value)}
                rows={8}
                className="w-full p-3 font-mono text-xs bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:border-blue-600 outline-hidden leading-relaxed text-gray-800"
                placeholder="commodity,district,market,modal_price,min_price,max_price,arrivals_tonnes"
              />

              <div className="p-3 bg-blue-50/80 border border-blue-200 rounded-xl text-xs text-blue-900 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Real-time SSE Sync Enabled:</span>
                </div>
                <p className="text-[11px] text-blue-800 leading-relaxed">
                  Upon submission, KRISHI CONNECT's backend parses each record, recalculates live 7-day trendlines, and broadcasts a <code className="font-mono bg-blue-100 px-1 py-0.5 rounded">CSV_DATA_IMPORTED</code> event to all active farmer and hotel tabs without requiring page reloads.
                </p>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowCsvModal(false)}
                  className="px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold text-xs rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleProcessCsv}
                  disabled={isProcessingCsv || !csvInput.trim()}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center space-x-2 disabled:opacity-60"
                >
                  <UploadCloud className={`w-4 h-4 ${isProcessingCsv ? 'animate-bounce' : ''}`} />
                  <span>{isProcessingCsv ? 'Ingesting & Broadcasting...' : 'Ingest & Broadcast to Platform'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
