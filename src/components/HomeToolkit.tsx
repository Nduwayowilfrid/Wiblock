import React from 'react';
import { 
  Database, 
  FolderSync, 
  ArrowRightLeft, 
  KeyRound, 
  Wrench, 
  MessageSquareShare, 
  ShieldAlert, 
  MapPin, 
  Cast, 
  Music, 
  HardDrive, 
  Sparkles, 
  BatteryMedium, 
  Cpu, 
  CheckCircle2, 
  ChevronRight,
  ExternalLink,
  Zap,
  ArrowUpRight,
  Smartphone
} from 'lucide-react';
import { ConnectedDevice, ToolId } from '../types';

interface HomeToolkitProps {
  device: ConnectedDevice | null;
  onSelectTool: (tool: ToolId) => void;
  lang: 'fr' | 'en';
  onOpenReport: () => void;
  onConnectSimulatedDevice: () => void;
  onPairRealUsb: () => void;
  onOpenRealFolder: () => void;
}

export const HomeToolkit: React.FC<HomeToolkitProps> = ({
  device,
  onSelectTool,
  lang,
  onOpenReport,
  onConnectSimulatedDevice,
  onPairRealUsb,
  onOpenRealFolder,
}) => {
  const tools = [
    {
      id: 'phone-manager' as ToolId,
      name: lang === 'fr' ? 'Gestionnaire de Téléphone' : 'Phone Manager',
      desc: lang === 'fr' 
        ? 'Gérer, exporter et transférer photos, musique, vidéos, contacts et fichiers.'
        : 'Manage, export and transfer photos, music, videos, contacts and files.',
      category: lang === 'fr' ? 'Gestion & Fichiers' : 'Management & Files',
      badge: 'Populaire',
      icon: FolderSync,
      gradient: 'from-blue-600 to-indigo-600',
      lightBg: 'bg-blue-50/70 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400',
      borderHover: 'hover:border-blue-400 dark:hover:border-blue-600',
    },
    {
      id: 'data-recovery' as ToolId,
      name: lang === 'fr' ? 'Récupération de Données' : 'Data Recovery',
      desc: lang === 'fr' 
        ? 'Retrouver photos, messages, contacts et WhatsApp supprimés ou perdus.'
        : 'Recover deleted photos, messages, contacts and WhatsApp data.',
      category: lang === 'fr' ? 'Sécurité & Restauration' : 'Security & Recovery',
      badge: lang === 'fr' ? 'Recommandé' : 'Recommended',
      icon: Database,
      gradient: 'from-cyan-500 to-blue-600',
      lightBg: 'bg-cyan-50/70 dark:bg-cyan-950/30 text-cyan-600 dark:text-cyan-400',
      borderHover: 'hover:border-cyan-400 dark:hover:border-cyan-600',
    },
    {
      id: 'phone-transfer' as ToolId,
      name: lang === 'fr' ? 'Transfert de Téléphone' : 'Phone Transfer',
      desc: lang === 'fr' 
        ? 'Copier 100% des données d\'un téléphone à un autre (iOS ⇄ Android).'
        : 'Transfer 100% of data between two phones (iOS ⇄ Android).',
      category: lang === 'fr' ? 'Migration' : 'Migration',
      badge: lang === 'fr' ? '1-Clic' : '1-Click',
      icon: ArrowRightLeft,
      gradient: 'from-teal-500 to-emerald-600',
      lightBg: 'bg-teal-50/70 dark:bg-teal-950/30 text-teal-600 dark:text-teal-400',
      borderHover: 'hover:border-teal-400 dark:hover:border-teal-600',
    },
    {
      id: 'screen-unlock' as ToolId,
      name: lang === 'fr' ? 'Déverrouillage d\'Écran' : 'Screen Unlock',
      desc: lang === 'fr' 
        ? 'Supprimer code 4/6 chiffres, Touch ID, Face ID et verrouillage FRP/iCloud.'
        : 'Bypass 4/6-digit passcode, Touch ID, Face ID and FRP/iCloud lock.',
      category: lang === 'fr' ? 'Déblocage' : 'Bypass',
      icon: KeyRound,
      gradient: 'from-amber-500 to-orange-600',
      lightBg: 'bg-amber-50/70 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400',
      borderHover: 'hover:border-amber-400 dark:hover:border-amber-600',
    },
    {
      id: 'system-repair' as ToolId,
      name: lang === 'fr' ? 'Réparation du Système' : 'System Repair',
      desc: lang === 'fr' 
        ? 'Corriger 150+ pannes : bloqué sur logo Apple/Android, écran noir, bootloop.'
        : 'Fix 150+ system issues: stuck in Apple/Android logo, black screen, bootloop.',
      category: lang === 'fr' ? 'Diagnostic' : 'Diagnostic',
      badge: 'Zero Perte',
      icon: Wrench,
      gradient: 'from-violet-600 to-purple-600',
      lightBg: 'bg-violet-50/70 dark:bg-violet-950/30 text-violet-600 dark:text-violet-400',
      borderHover: 'hover:border-violet-400 dark:hover:border-violet-600',
    },
    {
      id: 'whatsapp-transfer' as ToolId,
      name: lang === 'fr' ? 'Transfert WhatsApp' : 'WhatsApp Transfer',
      desc: lang === 'fr' 
        ? 'Sauvegarder, restaurer et migrer les discussions, photos et pièces jointes.'
        : 'Backup, restore and transfer WhatsApp chats, photos and voice notes.',
      category: lang === 'fr' ? 'Réseaux Sociaux' : 'Social Apps',
      icon: MessageSquareShare,
      gradient: 'from-emerald-500 to-green-600',
      lightBg: 'bg-emerald-50/70 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400',
      borderHover: 'hover:border-emerald-400 dark:hover:border-emerald-600',
    },
    {
      id: 'virtual-location' as ToolId,
      name: lang === 'fr' ? 'Localisation Virtuelle' : 'Virtual Location',
      desc: lang === 'fr' 
        ? 'Téléporter le GPS partout sur terre, simuler des itinéraires et utiliser le joystick.'
        : 'Teleport GPS anywhere, simulate custom walking routes and joystick control.',
      category: lang === 'fr' ? 'GPS & Jeux' : 'GPS & Gaming',
      icon: MapPin,
      gradient: 'from-sky-500 to-indigo-600',
      lightBg: 'bg-sky-50/70 dark:bg-sky-950/30 text-sky-600 dark:text-sky-400',
      borderHover: 'hover:border-sky-400 dark:hover:border-sky-600',
    },
    {
      id: 'screen-mirror' as ToolId,
      name: lang === 'fr' ? 'Miroir d\'Écran' : 'Screen Mirror',
      desc: lang === 'fr' 
        ? 'Contrôler le téléphone en direct depuis votre PC avec clavier et souris.'
        : 'Control your mobile screen live from your desktop with mouse & keyboard.',
      category: lang === 'fr' ? 'Diffusion' : 'Display',
      icon: Cast,
      gradient: 'from-indigo-500 to-blue-600',
      lightBg: 'bg-indigo-50/70 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400',
      borderHover: 'hover:border-indigo-400 dark:hover:border-indigo-600',
    },
    {
      id: 'phone-backup' as ToolId,
      name: lang === 'fr' ? 'Sauvegarde & Restauration' : 'Phone Backup',
      desc: lang === 'fr' 
        ? 'Créer des sauvegardes chiffrées complètes sur disque dur et restaurer sans écraser.'
        : 'Create encrypted local full backups and restore selectively.',
      category: lang === 'fr' ? 'Sauvegarde' : 'Backup',
      icon: HardDrive,
      gradient: 'from-blue-500 to-cyan-600',
      lightBg: 'bg-blue-50/70 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400',
      borderHover: 'hover:border-blue-400 dark:hover:border-blue-600',
    },
    {
      id: 'data-eraser' as ToolId,
      name: lang === 'fr' ? 'Effaceur de Données' : 'Data Eraser',
      desc: lang === 'fr' 
        ? 'Destruction militaire certifiée (DoD 5220.22-M) avant revente ou recyclage.'
        : 'Military grade permanent wipe (DoD 5220.22-M) before device resale.',
      category: lang === 'fr' ? 'Confidentialité' : 'Privacy',
      icon: ShieldAlert,
      gradient: 'from-rose-500 to-red-600',
      lightBg: 'bg-rose-50/70 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400',
      borderHover: 'hover:border-rose-400 dark:hover:border-rose-600',
    },
    {
      id: 'ringtone-maker' as ToolId,
      name: lang === 'fr' ? 'Créateur de Sonneries' : 'Ringtone Maker',
      desc: lang === 'fr' 
        ? 'Découper des chansons, régler les fondus et exporter directement au format M4R/MP3.'
        : 'Trim audio files, set fade in/out and inject custom ringtones to phone.',
      category: lang === 'fr' ? 'Audio & Médias' : 'Audio & Media',
      icon: Music,
      gradient: 'from-pink-500 to-rose-600',
      lightBg: 'bg-pink-50/70 dark:bg-pink-950/30 text-pink-600 dark:text-pink-400',
      borderHover: 'hover:border-pink-400 dark:hover:border-pink-600',
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto px-6 py-6 max-w-7xl mx-auto w-full space-y-6">
      {/* Top Banner / Device Status Showcase */}
      {device ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            {/* Device visual & main specs */}
            <div className="flex items-center gap-5">
              {/* Phone graphic container */}
              <div className="relative w-16 h-28 rounded-2xl bg-slate-950 border-2 border-slate-700/80 p-1 flex flex-col justify-between shadow-md shrink-0">
                {/* Dynamic island / camera punch */}
                <div className="mx-auto w-5 h-1.5 rounded-full bg-black border border-slate-800" />
                {/* Simulated lockscreen wallpaper */}
                <div className="w-full h-16 rounded-lg bg-gradient-to-tr from-cyan-600/40 via-blue-600/40 to-indigo-600/40 flex items-center justify-center">
                  <Smartphone className="w-5 h-5 text-white/80" />
                </div>
                {/* Home indicator bar */}
                <div className="mx-auto w-6 h-0.5 rounded-full bg-slate-400/80 mb-0.5" />
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                    {device.name}
                  </h1>
                  <span className="text-xs px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-semibold border border-blue-200 dark:border-blue-800">
                    {device.os.toUpperCase()} {device.osVersion}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    SN: {device.serialNumber}
                  </span>
                </div>

                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  {device.model} · {device.color}
                </p>

                {/* Quick specs */}
                <div className="flex items-center gap-4 mt-3 text-xs text-slate-600 dark:text-slate-400 flex-wrap">
                  <div className="flex items-center gap-1.5 font-mono">
                    <BatteryMedium className="w-4 h-4 text-emerald-500" />
                    <span>Batterie: <strong className="text-slate-800 dark:text-slate-200">{device.batteryLevel}%</strong> ({device.batteryHealth}% santé)</span>
                  </div>
                  <span>·</span>
                  <div className="flex items-center gap-1.5 font-mono">
                    <HardDrive className="w-4 h-4 text-blue-500" />
                    <span>Stockage: <strong className="text-slate-800 dark:text-slate-200">{device.storageUsedGB} GB</strong> / {device.storageTotalGB} GB</span>
                  </div>
                  <span>·</span>
                  <button 
                    onClick={onOpenReport}
                    className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-medium"
                  >
                    <span>Vérification pièces & batterie</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>

            {/* Quick 1-Click Action Hub */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full lg:w-auto">
              <button
                onClick={() => onSelectTool('phone-manager')}
                className="flex flex-col items-center justify-center p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/40 hover:bg-blue-50/60 dark:hover:bg-blue-950/40 hover:border-blue-300 dark:hover:border-blue-700 transition-all text-center group"
              >
                <FolderSync className="w-5 h-5 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform mb-1.5" />
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">Gérer Fichiers</span>
                <span className="text-[10px] text-slate-400">Photos, Musique</span>
              </button>

              <button
                onClick={() => onSelectTool('phone-backup')}
                className="flex flex-col items-center justify-center p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/40 hover:bg-cyan-50/60 dark:hover:bg-cyan-950/40 hover:border-cyan-300 dark:hover:border-cyan-700 transition-all text-center group"
              >
                <HardDrive className="w-5 h-5 text-cyan-600 dark:text-cyan-400 group-hover:scale-110 transition-transform mb-1.5" />
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">Sauvegarder</span>
                <span className="text-[10px] text-slate-400">Sauvegarde 1-clic</span>
              </button>

              <button
                onClick={() => onSelectTool('screen-mirror')}
                className="flex flex-col items-center justify-center p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/40 hover:bg-indigo-50/60 dark:hover:bg-indigo-950/40 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all text-center group"
              >
                <Cast className="w-5 h-5 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform mb-1.5" />
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">Miroir d'Écran</span>
                <span className="text-[10px] text-slate-400">Contrôle direct</span>
              </button>

              <button
                onClick={onOpenReport}
                className="flex flex-col items-center justify-center p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/40 hover:bg-emerald-50/60 dark:hover:bg-emerald-950/40 hover:border-emerald-300 dark:hover:border-emerald-700 transition-all text-center group"
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform mb-1.5" />
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">Diagnostic</span>
                <span className="text-[10px] text-slate-400">Matériel officiel</span>
              </button>
            </div>
          </div>

          {/* Storage Distribution Bar */}
          <div className="mt-5 pt-5 border-t border-slate-100 dark:border-slate-800/80">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-medium text-slate-600 dark:text-slate-400">
                {lang === 'fr' ? 'Répartition de la mémoire' : 'Storage Breakdown'}
              </span>
              <span className="font-mono text-slate-500">
                {device.storageBreakdown.free.toFixed(1)} GB {lang === 'fr' ? 'libres' : 'free'} ({((device.storageUsedGB / device.storageTotalGB) * 100).toFixed(0)}% occupé)
              </span>
            </div>

            {/* Colored segmented progress bar */}
            <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 flex overflow-hidden shadow-inner">
              <div 
                style={{ width: `${(device.storageBreakdown.photos / device.storageTotalGB) * 100}%` }} 
                className="bg-blue-500 hover:opacity-90 transition-opacity" 
                title={`Photos: ${device.storageBreakdown.photos} GB`}
              />
              <div 
                style={{ width: `${(device.storageBreakdown.videos / device.storageTotalGB) * 100}%` }} 
                className="bg-cyan-500 hover:opacity-90 transition-opacity" 
                title={`Vidéos: ${device.storageBreakdown.videos} GB`}
              />
              <div 
                style={{ width: `${(device.storageBreakdown.apps / device.storageTotalGB) * 100}%` }} 
                className="bg-indigo-500 hover:opacity-90 transition-opacity" 
                title={`Applications: ${device.storageBreakdown.apps} GB`}
              />
              <div 
                style={{ width: `${(device.storageBreakdown.audio / device.storageTotalGB) * 100}%` }} 
                className="bg-purple-500 hover:opacity-90 transition-opacity" 
                title={`Musique: ${device.storageBreakdown.audio} GB`}
              />
              <div 
                style={{ width: `${(device.storageBreakdown.messages / device.storageTotalGB) * 100}%` }} 
                className="bg-amber-500 hover:opacity-90 transition-opacity" 
                title={`Messages: ${device.storageBreakdown.messages} GB`}
              />
              <div 
                style={{ width: `${(device.storageBreakdown.system / device.storageTotalGB) * 100}%` }} 
                className="bg-slate-400 hover:opacity-90 transition-opacity" 
                title={`Système: ${device.storageBreakdown.system} GB`}
              />
            </div>

            {/* Storage Legend */}
            <div className="flex flex-wrap items-center gap-4 mt-2.5 text-[11px] text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0" />
                <span>Photos ({device.storageBreakdown.photos} GB)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 shrink-0" />
                <span>Vidéos ({device.storageBreakdown.videos} GB)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 shrink-0" />
                <span>Apps ({device.storageBreakdown.apps} GB)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500 shrink-0" />
                <span>Audio ({device.storageBreakdown.audio} GB)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
                <span>Messages ({device.storageBreakdown.messages} GB)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-400 shrink-0" />
                <span>Système ({device.storageBreakdown.system} GB)</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Empty / Disconnected state card */
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center max-w-2xl mx-auto shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto mb-4">
            <Smartphone className="w-7 h-7" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            {lang === 'fr' ? 'Connectez un appareil iOS ou Android' : 'Connect an iOS or Android Device'}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
            {lang === 'fr' 
              ? 'Branchez votre téléphone par câble USB ou activez la synchronisation Wi-Fi locale pour débloquer toutes les fonctionnalités Dr.Fone.'
              : 'Connect your phone via USB cable or local Wi-Fi to unlock all Dr.Fone features.'}
          </p>
          <div className="flex items-center justify-center gap-3 mt-5">
            <button
              onClick={onConnectSimulatedDevice}
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
            >
              {lang === 'fr' ? 'Simuler la connexion iPhone 15 Pro' : 'Simulate iPhone 15 Pro Connection'}
            </button>
          </div>
        </div>
      )}

      {/* REAL HARDWARE & PHYSICAL DATA BRIDGE */}
      <div className="bg-gradient-to-r from-blue-900/10 via-indigo-900/10 to-teal-900/10 dark:from-blue-950/40 dark:via-indigo-950/40 dark:to-teal-950/40 border border-blue-200 dark:border-blue-900/60 rounded-2xl p-5 shadow-xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {lang === 'fr' ? 'Mode Matériel Réel & Données Physiques (WebUSB)' : 'Real Hardware & Physical Device Mode (WebUSB)'}
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                100% Réel
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              {lang === 'fr' 
                ? 'Branchez votre smartphone par câble USB à l\'ordinateur pour communiquer directement avec les protocoles matériels (Apple, Samsung, Google Pixel, Xiaomi, etc.) ou scannez vos vrais dossiers de sauvegarde.'
                : 'Connect your smartphone via USB to communicate directly with hardware protocols or scan your real phone backup storage.'}
            </p>
          </div>

          <div className="flex items-center gap-2.5 w-full md:w-auto flex-wrap">
            <button
              onClick={onPairRealUsb}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 active:scale-98 transition-all"
            >
              <Zap className="w-4 h-4 fill-current text-amber-300" />
              <span>{lang === 'fr' ? 'Connecter mon téléphone USB' : 'Connect Physical Phone USB'}</span>
            </button>

            <button
              onClick={onOpenRealFolder}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-xs"
            >
              <HardDrive className="w-4 h-4 text-indigo-500" />
              <span>{lang === 'fr' ? 'Scanner stockage / DCIM réel' : 'Scan Real Phone Storage / DCIM'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tools Section Title */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            {lang === 'fr' ? 'Boîte à Outils Principale' : 'All-in-One Toolkit'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {lang === 'fr' 
              ? 'Solutions professionnelles pour la gestion, récupération et réparation mobile' 
              : 'Professional solutions for mobile data management, recovery, and repair'}
          </p>
        </div>
      </div>

      {/* The 11 Signature Dr.Fone Tool Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <button
              key={tool.id}
              onClick={() => onSelectTool(tool.id)}
              className={`flex flex-col justify-between p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-left transition-all duration-200 group hover:shadow-lg hover:shadow-slate-200/50 dark:hover:shadow-black/40 hover:-translate-y-0.5 ${tool.borderHover}`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  {/* Distinctive Icon Badge */}
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${tool.gradient} flex items-center justify-center text-white shadow-md shadow-slate-300/40 dark:shadow-black/50 group-hover:scale-105 transition-transform`}>
                    <Icon className="w-6 h-6 stroke-[2]" />
                  </div>

                  {/* Category / Badge */}
                  <div className="flex items-center gap-1.5">
                    {tool.badge && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {tool.badge}
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors flex items-center justify-between">
                  <span>{tool.name}</span>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-all shrink-0" />
                </h3>

                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                  {tool.desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                <span>{tool.category}</span>
                <span className="text-blue-600 dark:text-blue-400 font-semibold group-hover:underline">
                  {lang === 'fr' ? 'Ouvrir l\'outil' : 'Launch tool'} →
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
