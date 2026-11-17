import React, { useState, useEffect } from 'react';
import { 
  X, 
  QrCode, 
  Barcode, 
  CheckCircle2, 
  Search, 
  ArrowLeftRight, 
  Sparkles, 
  AlertCircle,
  Volume2,
  Box,
  MapPin,
  Check
} from 'lucide-react';

export default function BarcodeScannerModal({ 
  isOpen, 
  onClose, 
  inventory = [], 
  onSelectItem, 
  onRelocateItem 
}) {
  const [scanInput, setScanInput] = useState('');
  const [scannedItem, setScannedItem] = useState(null);
  const [scanSuccess, setScanSuccess] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setScanInput('');
      setScannedItem(null);
      setScanSuccess(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const playBeep = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.12);
    } catch (e) {
      // Audio fallback
    }
  };

  const handleScan = (value) => {
    const val = (value || scanInput).trim().toUpperCase();
    if (!val) return;

    const found = inventory.find(i => 
      i.sku.toUpperCase() === val || 
      i.qr_code_data?.toUpperCase().includes(val) ||
      i.batch_number?.toUpperCase() === val
    );

    if (found) {
      playBeep();
      setScannedItem(found);
      setScanSuccess(true);
    } else {
      setScannedItem(null);
      setScanSuccess(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="w-full max-w-lg rounded-3xl bg-white border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-orange-50/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center shadow-xs">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Logistics Scanner Simulator</h3>
              <p className="text-xs text-slate-500 font-medium">Barcode & QR Code intake terminal</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewport */}
        <div className="p-6 space-y-4">
          {/* Animated Scanner Window */}
          <div className="relative h-48 rounded-3xl bg-slate-950 border-2 border-slate-800 flex items-center justify-center overflow-hidden shadow-inner">
            {/* Viewfinder corner brackets */}
            <div className="absolute top-4 left-4 w-7 h-7 border-t-2 border-l-2 border-orange-500 rounded-tl-lg"></div>
            <div className="absolute top-4 right-4 w-7 h-7 border-t-2 border-r-2 border-orange-500 rounded-tr-lg"></div>
            <div className="absolute bottom-4 left-4 w-7 h-7 border-b-2 border-l-2 border-orange-500 rounded-bl-lg"></div>
            <div className="absolute bottom-4 right-4 w-7 h-7 border-b-2 border-r-2 border-orange-500 rounded-br-lg"></div>

            {/* Scanning Laser Beam */}
            <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-orange-500 to-transparent shadow-[0_0_18px_#f97316] animate-bounce"></div>

            <div className="text-center z-10 px-4">
              <Barcode className="w-14 h-14 text-slate-600 mx-auto mb-2" />
              <p className="text-xs text-slate-300 font-medium">Point laser beam at cargo barcode or SKU tag</p>
            </div>
          </div>

          {/* Input field */}
          <div className="flex items-center space-x-2.5">
            <input
              type="text"
              value={scanInput}
              onChange={(e) => setScanInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleScan()}
              placeholder="Type or paste SKU (e.g. SKU-ELC-7740)..."
              className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900 placeholder-slate-400 font-mono font-bold focus:outline-none focus:border-orange-500 focus:bg-white transition-all"
            />
            <button
              onClick={() => handleScan()}
              className="px-5 py-2.5 bg-orange-600 hover:bg-orange-500 text-white rounded-2xl text-xs font-bold shadow-md shadow-orange-600/25 transition-all"
            >
              Scan Tag
            </button>
          </div>

          {/* Quick Demo Scan Buttons */}
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-2">
              Quick Tags from Live MongoDB (Click to scan)
            </span>
            <div className="flex flex-wrap gap-2">
              {inventory.slice(0, 5).map((it) => (
                <button
                  key={it.sku}
                  onClick={() => {
                    setScanInput(it.sku);
                    handleScan(it.sku);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-orange-50 hover:bg-orange-100 border border-orange-200 text-xs font-mono font-bold text-orange-800 transition-all shadow-2xs"
                >
                  {it.sku}
                </button>
              ))}
            </div>
          </div>

          {/* Scanned Result Card */}
          {scannedItem && (
            <div className="p-4 sm:p-5 rounded-3xl bg-orange-50/80 border border-orange-300 shadow-md animate-in fade-in slide-in-from-bottom-2 duration-200">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-mono font-bold text-orange-600">{scannedItem.sku}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center space-x-1">
                      <Check className="w-3 h-3" />
                      <span>Verified in Atlas</span>
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 mt-1">{scannedItem.name}</h4>
                  <p className="text-xs text-slate-600 font-mono mt-1 font-medium flex items-center space-x-1.5">
                    <MapPin className="w-3.5 h-3.5 text-orange-600" />
                    <span>Slot: <strong className="text-slate-900">{scannedItem.bin_id}</strong> ({scannedItem.zone_id})</span>
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xl font-black font-mono text-slate-900 block">
                    {scannedItem.quantity}
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium">{scannedItem.unit}</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="mt-4 pt-3.5 border-t border-orange-200/80 flex items-center justify-end space-x-2.5">
                <button
                  onClick={() => {
                    onClose();
                    onSelectItem(scannedItem);
                  }}
                  className="px-4 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-xs text-slate-700 font-bold transition-all shadow-2xs"
                >
                  Full Sheet
                </button>
                <button
                  onClick={() => {
                    onClose();
                    onRelocateItem(scannedItem.sku);
                  }}
                  className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-xs text-white font-bold flex items-center space-x-1.5 shadow-md shadow-orange-600/25 transition-all"
                >
                  <ArrowLeftRight className="w-3.5 h-3.5" />
                  <span>Relocate / Transfer</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
