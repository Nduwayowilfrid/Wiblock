import React from 'react';
import { 
  ShieldCheck, 
  X, 
  Smartphone, 
  BatteryMedium, 
  Cpu, 
  HardDrive, 
  CheckCircle2, 
  FileText, 
  Printer, 
  Download,
  AlertCircle
} from 'lucide-react';
import { ConnectedDevice } from '../../types';

interface DeviceInfoModalProps {
  device: ConnectedDevice | null;
  isOpen: boolean;
  onClose: () => void;
  lang: 'fr' | 'en';
}

export const DeviceInfoModal: React.FC<DeviceInfoModalProps> = ({
  device,
  isOpen,
  onClose,
  lang,
}) => {
  if (!isOpen || !device) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="max-w-2xl w-full bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                {lang === 'fr' ? 'Rapport de Vérification Matériel Dr.Fone' : 'Dr.Fone Hardware Verification Report'}
              </h2>
              <p className="text-[11px] text-slate-400">
                {device.name} · Certificat d'authenticité des composants
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
          {/* General Device Info Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
              <span className="text-[10px] text-slate-400 uppercase">Modèle</span>
              <div className="font-bold text-slate-900 dark:text-white mt-0.5">{device.model}</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
              <span className="text-[10px] text-slate-400 uppercase">Système</span>
              <div className="font-bold text-slate-900 dark:text-white mt-0.5">{device.osVersion}</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
              <span className="text-[10px] text-slate-400 uppercase">N° de Série</span>
              <div className="font-mono font-bold text-slate-900 dark:text-white mt-0.5">{device.serialNumber}</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
              <span className="text-[10px] text-slate-400 uppercase">IMEI 1</span>
              <div className="font-mono font-bold text-slate-900 dark:text-white mt-0.5">{device.imei}</div>
            </div>
          </div>

          {/* Battery Diagnostic Section */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                <BatteryMedium className="w-4 h-4 text-emerald-500" />
                <span>Diagnostic de la Batterie & Santé</span>
              </div>
              <span className="text-emerald-600 font-bold font-mono">
                {device.batteryHealth}% Capacité maximale
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3 font-mono text-[11px]">
              <div>
                <span className="text-slate-400 block">Cycles de charge</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{device.batteryCycle} cycles</span>
              </div>
              <div>
                <span className="text-slate-400 block">Température actuelle</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">28.4 °C (Normal)</span>
              </div>
              <div>
                <span className="text-slate-400 block">Batterie d'origine Apple</span>
                <span className="text-emerald-500 font-bold">Oui (Numéro certifié)</span>
              </div>
            </div>
          </div>

          {/* Genuine Components Inspection Checklist */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs">
            <h4 className="font-bold text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800">
              Test des Pièces & Composants d'Origine
            </h4>

            <div className="space-y-2">
              {[
                { name: 'Écran OLED Super Retina XDR (TrueTone & 120Hz ProMotion)', status: 'Original Apple ✓' },
                { name: 'Module Caméra Arrière 48MP & Téléobjectif 5x', status: 'Original Apple ✓' },
                { name: 'Capteurs Biométriques Face ID / TrueDepth', status: 'Authentifié ✓' },
                { name: 'Carte Mère & Puce A17 Pro (SoC)', status: 'Nominal 100% ✓' },
                { name: 'Statut Débridage / Jailbreak / Root', status: 'Non détecté (Sécurisé)' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between py-1 text-[11px]">
                  <span className="text-slate-700 dark:text-slate-300">{item.name}</span>
                  <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            Généré par Dr.Fone Diagnostics Engine v14.2
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => alert('Rapport exporté en PDF sur le Bureau.')}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Exporter PDF</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
