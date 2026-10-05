import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, QrCode, Copy, Check, Smartphone, Share2, Wifi } from 'lucide-react';
import { playSfx } from '../../audioFx';
import { fetchLanIp } from '../../apiConfig';

export default function QrJoinModal({ isOpen, onClose, roomCode }) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [lanHost, setLanHost] = useState(window.location.host);

  useEffect(() => {
    if (isOpen) {
      fetchLanIp().then((ip) => {
        if (ip && ip !== 'localhost') {
          const port = window.location.port ? `:${window.location.port}` : '';
          setLanHost(`${ip}${port}`);
        }
      });
    }
  }, [isOpen]);

  if (!isOpen || !roomCode) return null;

  const joinUrl = `${window.location.protocol}//${lanHost}/?join=${roomCode}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(joinUrl);
    setCopiedLink(true);
    playSfx('click');
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(roomCode);
    setCopiedCode(true);
    playSfx('click');
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="neu-card bg-[#e6ecf5] max-w-sm w-full max-h-[90dvh] overflow-y-auto p-5 sm:p-6 space-y-4 sm:space-y-5 text-center">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-300/60 pb-3">
          <div className="flex items-center gap-2.5 text-left">
            <div className="w-9 h-9 rounded-xl neu-card-sm flex items-center justify-center text-blue-600">
              <QrCode size={18} />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-900">
                Scan to Join Game
              </h3>
              <p className="text-[11px] text-slate-500">
                Instant mobile camera connect
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 neu-btn text-slate-500 hover:text-slate-800"
          >
            <X size={15} />
          </button>
        </div>

        {/* QR Code Frame */}
        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="p-4 rounded-3xl neu-card bg-white inline-block shadow-md border-2 border-white">
            <QRCodeSVG
              value={joinUrl}
              size={170}
              bgColor="#ffffff"
              fgColor="#1e293b"
              level="M"
              marginSize={1}
            />
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
            <Smartphone size={14} className="text-blue-600" />
            <span>Point phone camera at screen to join</span>
          </div>
        </div>

        {/* Room Code Badge */}
        <div className="space-y-2">
          <div className="flex items-center justify-between p-2.5 rounded-2xl neu-inset">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider pl-2">
              Room Code
            </span>
            <div className="flex items-center gap-2">
              <span className="font-mono font-black text-lg text-blue-700 tracking-widest">
                {roomCode}
              </span>
              <button
                type="button"
                onClick={handleCopyCode}
                className="neu-btn px-2.5 py-1 text-xs text-slate-600 hover:text-blue-600 flex items-center gap-1"
                title="Copy code"
              >
                {copiedCode ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
                <span className="text-[10px] font-bold">{copiedCode ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Direct Link Share Button */}
          <button
            type="button"
            onClick={handleCopyLink}
            className="w-full py-2.5 neu-btn text-xs font-bold text-slate-700 hover:text-blue-700 flex items-center justify-center gap-2"
          >
            {copiedLink ? <Check size={14} className="text-emerald-600" /> : <Share2 size={14} className="text-blue-600" />}
            <span>{copiedLink ? 'Link Copied to Clipboard!' : 'Copy Direct Invite Link'}</span>
          </button>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full py-3 neu-btn-primary font-bold text-xs uppercase tracking-wider"
        >
          Close
        </button>
      </div>
    </div>
  );
}
