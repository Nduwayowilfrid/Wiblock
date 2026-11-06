import React, { useState } from 'react';
import { 
  Smartphone, 
  Laptop, 
  ChevronDown, 
  Moon, 
  Sun, 
  Wifi, 
  Usb, 
  ShieldCheck, 
  Globe, 
  Minus, 
  Square, 
  X,
  BatteryCharging,
  HardDrive
} from 'lucide-react';
import { ConnectedDevice, ToolId } from '../types';

interface HeaderProps {
  currentTool: ToolId;
  onSelectTool: (tool: ToolId) => void;
  devices: ConnectedDevice[];
  selectedDevice: ConnectedDevice | null;
  onSelectDevice: (device: ConnectedDevice | null) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  lang: 'fr' | 'en';
  onToggleLang: () => void;
  onOpenReport: () => void;
  onPairRealUsb: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTool,
  onSelectTool,
  devices,
  selectedDevice,
  onSelectDevice,
  isDarkMode,
  onToggleDarkMode,
  lang,
  onToggleLang,
  onOpenReport,
  onPairRealUsb,
}) => {
  const [deviceDropdownOpen, setDeviceDropdownOpen] = useState(false);
  const [connectionMode, setConnectionMode] = useState<'usb' | 'wifi'>('usb');

  const toolTitles: Record<ToolId, { fr: string; en: string }> = {
    'home': { fr: 'Boîte à outils', en: 'Toolkit' },
    'data-recovery': { fr: 'Récupération de données', en: 'Data Recovery' },
    'phone-manager': { fr: 'Gestionnaire de téléphone', en: 'Phone Manager' },
    'phone-transfer': { fr: 'Transfert de téléphone', en: 'Phone Transfer' },
    'screen-unlock': { fr: 'Déverrouillage d\'écran', en: 'Screen Unlock' },
    'system-repair': { fr: 'Réparation du système', en: 'System Repair' },
    'whatsapp-transfer': { fr: 'Transfert WhatsApp', en: 'WhatsApp Transfer' },
    'phone-backup': { fr: 'Sauvegarde & Restauration', en: 'Phone Backup' },
    'data-eraser': { fr: 'Effaceur de données', en: 'Data Eraser' },
    'virtual-location': { fr: 'Localisation virtuelle', en: 'Virtual Location' },
    'screen-mirror': { fr: 'Miroir d\'écran', en: 'Screen Mirror' },
    'device-report': { fr: 'Rapport de vérification', en: 'Verification Report' },
    'ringtone-maker': { fr: 'Créateur de sonneries', en: 'Ringtone Maker' },
  };

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 select-none z-30 shrink-0">
      {/* Top OS Window Title Bar Simulation */}
      <div className="flex items-center justify-between px-4 py-1.5 bg-slate-100 dark:bg-slate-950 border-b border-slate-200/80 dark:border-slate-800/80 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2">
          {/* Dr.Fone Brand Emblem */}
          <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-[9px] font-black text-white shadow-xs">
            dr
          </div>
          <span className="font-semibold text-slate-800 dark:text-slate-200">Wondershare Dr.Fone</span>
          <span className="text-[10px] text-slate-400 dark:text-slate-500">v14.2.5 Pro Suite</span>
        </div>

        {/* Window controls simulation (clean, aesthetic) */}
        <div className="flex items-center gap-2">
          <button 
            type="button" 
            title="Réduire"
            className="w-5 h-5 rounded hover:bg-slate-200 dark:hover:bg-slate-800 flex items-center justify-center transition-colors text-slate-500"
          >
            <Minus className="w-3 h-3" />
          </button>
          <button 
            type="button" 
            title="Agrandir"
            className="w-5 h-5 rounded hover:bg-slate-200 dark:hover:bg-slate-800 flex items-center justify-center transition-colors text-slate-500"
          >
            <Square className="w-2.5 h-2.5" />
          </button>
          <button 
            type="button" 
            title="Fermer"
            className="w-5 h-5 rounded hover:bg-rose-500 hover:text-white flex items-center justify-center transition-colors text-slate-500"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Main Navigation & Device Bar */}
      <div className="flex items-center justify-between px-5 py-3 gap-6">
        {/* Left: Brand & Home Return */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => onSelectTool('home')}
            className="flex items-center gap-3 group text-left transition-transform active:scale-98"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:shadow-blue-500/30 transition-shadow">
              <Smartphone className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-base tracking-tight text-slate-900 dark:text-white font-sans">
                  Dr.Fone
                </span>
                <span className="text-[11px] font-semibold px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/60">
                  Suite
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {lang === 'fr' ? 'Solution Mobile Tout-en-un' : 'All-in-One Mobile Solution'}
              </p>
            </div>
          </button>

          {/* Breadcrumb if inside a subtool */}
          {currentTool !== 'home' && (
            <div className="hidden sm:flex items-center gap-2 text-sm pl-4 border-l border-slate-200 dark:border-slate-800">
              <button 
                onClick={() => onSelectTool('home')}
                className="text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                {lang === 'fr' ? 'Accueil' : 'Home'}
              </button>
              <span className="text-slate-300 dark:text-slate-600">/</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {toolTitles[currentTool][lang]}
              </span>
            </div>
          )}
        </div>

        {/* Center: Connected Device Switcher */}
        <div className="relative">
          <button
            onClick={() => setDeviceDropdownOpen(!deviceDropdownOpen)}
            className="flex items-center gap-3 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 hover:bg-slate-100/80 dark:bg-slate-800/60 dark:hover:bg-slate-800 transition-all text-left shadow-xs"
          >
            <div className="relative">
              <Smartphone className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className={`absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full ${selectedDevice ? 'bg-emerald-500' : 'bg-slate-400'}`} />
            </div>

            <div className="hidden md:block max-w-[200px] truncate">
              {selectedDevice ? (
                <>
                  <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                    {selectedDevice.name}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <span>{selectedDevice.model}</span>
                    <span>·</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-medium">{selectedDevice.batteryLevel}%</span>
                  </div>
                </>
              ) : (
                <div className="text-xs font-medium text-slate-500">
                  {lang === 'fr' ? 'Aucun appareil connecté' : 'No device connected'}
                </div>
              )}
            </div>

            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {/* Device Dropdown Menu */}
          {deviceDropdownOpen && (
            <div 
              className="absolute right-0 mt-2 w-72 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150"
              onClick={() => setDeviceDropdownOpen(false)}
            >
              <div className="px-2.5 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                {lang === 'fr' ? 'Appareils détectés' : 'Detected Devices'}
              </div>

              {devices.map((device) => {
                const isCurrent = selectedDevice?.id === device.id;
                return (
                  <button
                    key={device.id}
                    onClick={() => {
                      onSelectDevice(device);
                      setDeviceDropdownOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 p-2.5 rounded-lg text-left transition-colors ${
                      isCurrent 
                        ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300' 
                        : 'hover:bg-slate-100 dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                      <Smartphone className={`w-4 h-4 ${isCurrent ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500'}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold truncate">{device.name}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        {device.osVersion} · {device.storageTotalGB} GB
                      </div>
                    </div>
                    <div className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                      <BatteryCharging className="w-3 h-3" />
                      {device.batteryLevel}%
                    </div>
                  </button>
                );
              })}

              <div className="my-1 border-t border-slate-200 dark:border-slate-800" />

              <button
                onClick={() => {
                  onSelectDevice(null);
                  setDeviceDropdownOpen(false);
                }}
                className="w-full flex items-center gap-2 p-2 rounded-lg text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
                <span>{lang === 'fr' ? 'Déconnecter l\'appareil' : 'Disconnect Device'}</span>
              </button>
            </div>
          )}
        </div>

        {/* Right Tools & Preferences */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* USB / Wi-Fi toggle */}
          <div className="hidden lg:flex items-center p-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80">
            <button
              onClick={() => setConnectionMode('usb')}
              title={lang === 'fr' ? 'Connexion USB haute vitesse' : 'High-speed USB connection'}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                connectionMode === 'usb'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Usb className="w-3 h-3" />
              <span>USB 3.2</span>
            </button>
            <button
              onClick={() => setConnectionMode('wifi')}
              title={lang === 'fr' ? 'Synchronisation sans fil Wi-Fi' : 'Wireless Wi-Fi Sync'}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                connectionMode === 'wifi'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Wifi className="w-3 h-3" />
              <span>Wi-Fi 6</span>
            </button>
          </div>

          {/* Real WebUSB device pairing button */}
          <button
            onClick={onPairRealUsb}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-500 hover:to-indigo-500 shadow-sm active:scale-98 transition-all"
            title="Détecter et connecter un vrai smartphone branché en USB"
          >
            <Usb className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Connecter USB réel</span>
          </button>

          {/* Verification Report quick button */}
          <button
            onClick={onOpenReport}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-xs"
            title={lang === 'fr' ? 'Rapport de vérification matériel & batterie' : 'Hardware & Battery Verification Report'}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span className="hidden sm:inline">
              {lang === 'fr' ? 'Rapport matériel' : 'Hardware Report'}
            </span>
          </button>

          {/* Language Toggle */}
          <button
            onClick={onToggleLang}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-xs font-bold"
            title={lang === 'fr' ? 'Switch to English' : 'Passer en français'}
          >
            <div className="flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-slate-500" />
              <span className="uppercase">{lang}</span>
            </div>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={onToggleDarkMode}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={isDarkMode ? 'Mode clair' : 'Mode sombre'}
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>
        </div>
      </div>
    </header>
  );
};
