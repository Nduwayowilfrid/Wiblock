import React, { useState, useEffect } from 'react';
import { 
  Wrench, 
  ArrowLeft, 
  CheckCircle2, 
  RotateCw, 
  ShieldCheck, 
  AlertOctagon, 
  Download, 
  Terminal, 
  Cpu, 
  Smartphone,
  ChevronRight,
  Zap
} from 'lucide-react';
import { ConnectedDevice } from '../../types';

interface SystemRepairProps {
  device: ConnectedDevice | null;
  onBack: () => void;
  lang: 'fr' | 'en';
}

export const SystemRepair: React.FC<SystemRepairProps> = ({
  device,
  onBack,
  lang,
}) => {
  const [repairMode, setRepairMode] = useState<'standard' | 'advanced'>('standard');
  const [selectedIssue, setSelectedIssue] = useState<string>('apple-logo');
  const [repairStage, setRepairStage] = useState<'picker' | 'downloading' | 'repairing' | 'success'>('picker');
  
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [repairProgress, setRepairProgress] = useState(0);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);

  const issues = [
    { id: 'apple-logo', label: lang === 'fr' ? 'Bloqué sur le logo de démarrage' : 'Stuck on Apple/Boot Logo' },
    { id: 'bootloop', label: lang === 'fr' ? 'Boucle de redémarrage continu (Bootloop)' : 'Continuous Boot Loop' },
    { id: 'black-screen', label: lang === 'fr' ? 'Écran noir de la mort (Black Screen)' : 'Black Screen of Death' },
    { id: 'recovery-mode', label: lang === 'fr' ? 'Bloqué en mode Récupération / Câble iTunes' : 'Stuck in Recovery Mode' },
    { id: 'frozen', label: lang === 'fr' ? 'Écran tactile figé / Gel complet' : 'Screen Frozen / Unresponsive' },
    { id: 'itunes-errors', label: lang === 'fr' ? 'Erreurs iTunes 4013, 9, 1110, 4005' : 'iTunes / Finder Error Codes' },
  ];

  const startRepairProcess = () => {
    setRepairStage('downloading');
    setDownloadProgress(0);
  };

  // Simulating firmware download
  useEffect(() => {
    if (repairStage === 'downloading') {
      const interval = setInterval(() => {
        setDownloadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setRepairStage('repairing');
            setRepairProgress(0);
            setTerminalLogs([
              '[INIT] Canal sécurisé USB 3.2 initialisé...',
              '[SOIL] Handshake avec bootloader A17 Pro réussi.',
              '[IPSW] Vérification checksum SHA-256 du firmware officiel...',
              '[IPSW] Package iOS 17.5.1 officiel Apple vérifié ✓',
            ]);
            return 100;
          }
          return prev + 10;
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [repairStage]);

  // Simulating live kernel flashing
  useEffect(() => {
    if (repairStage === 'repairing') {
      const logMilestones: Record<number, string> = {
        20: '[FLASH] Nettoyage de la partition de cache corrompue...',
        40: '[FLASH] Réécriture de l\'image système de base (Standard Mode - Données protégées)...',
        60: '[KERNEL] Rétablissement du noyau Mach et des pilotes graphiques...',
        80: '[NVRAM] Réinitialisation des paramètres matériels NVRAM/PRAM...',
        95: '[BOOT] Préparation de la séquence de démarrage normale...',
      };

      const interval = setInterval(() => {
        setRepairProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setRepairStage('success');
            return 100;
          }
          const next = prev + 5;
          if (logMilestones[next]) {
            setTerminalLogs(curr => [...curr, logMilestones[next]]);
          }
          return next;
        });
      }, 180);
      return () => clearInterval(interval);
    }
  }, [repairStage]);

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-50 dark:bg-slate-950">
      {/* Top Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-violet-600 text-white flex items-center justify-center shadow-xs">
              <Wrench className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                {lang === 'fr' ? 'Réparation du Système Mobile' : 'System Repair Suite'}
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {lang === 'fr' ? 'Correction de plus de 150 pannes système sans perte de données' : 'Fix 150+ iOS & Android system issues with zero data loss'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 overflow-y-auto p-8 max-w-4xl mx-auto w-full">
        {repairStage === 'picker' && (
          <div className="space-y-6">
            {/* Mode selection (Standard vs Advanced) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Standard Mode */}
              <button
                type="button"
                onClick={() => setRepairMode('standard')}
                className={`p-6 rounded-2xl border text-left transition-all ${
                  repairMode === 'standard'
                    ? 'border-violet-500 bg-violet-50/40 dark:bg-violet-950/20 shadow-md ring-2 ring-violet-500/20'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 rounded-xl bg-violet-600 text-white shadow-xs">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                    {lang === 'fr' ? 'Zéro Perte de Données' : 'No Data Loss'}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {lang === 'fr' ? 'Réparation Standard (Recommandé)' : 'Standard Repair (Recommended)'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  {lang === 'fr' 
                    ? 'Corrige la grande majorité des pannes courantes sans toucher à vos photos, contacts, SMS ou applications.' 
                    : 'Fixes most common system problems while keeping all your personal data completely intact.'}
                </p>
              </button>

              {/* Advanced Mode */}
              <button
                type="button"
                onClick={() => setRepairMode('advanced')}
                className={`p-6 rounded-2xl border text-left transition-all ${
                  repairMode === 'advanced'
                    ? 'border-violet-500 bg-violet-50/40 dark:bg-violet-950/20 shadow-md ring-2 ring-violet-500/20'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 rounded-xl bg-slate-800 text-white shadow-xs">
                    <AlertOctagon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300">
                    {lang === 'fr' ? 'Flashage Profond' : 'Deep Flash'}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {lang === 'fr' ? 'Réparation Avancée' : 'Advanced Repair'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  {lang === 'fr' 
                    ? 'Pour les pannes critiques lorsque la réparation standard échoue. Réinstalle entièrement le système d\'exploitation.' 
                    : 'For deep kernel corruptions when standard repair cannot resolve the crash.'}
                </p>
              </button>
            </div>

            {/* Issue Selector */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                {lang === 'fr' ? 'Symptôme constaté sur le téléphone' : 'Observed Device Symptom'}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {issues.map((item) => {
                  const isSelected = selectedIssue === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setSelectedIssue(item.id)}
                      className={`p-3 rounded-xl border text-left text-xs transition-colors flex items-center justify-between ${
                        isSelected
                          ? 'border-violet-500 bg-violet-50 dark:bg-violet-950/50 text-violet-700 dark:text-violet-300 font-semibold'
                          : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span>{item.label}</span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-violet-600" />}
                    </button>
                  );
                })}
              </div>

              {/* Hardware profile */}
              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl flex items-center justify-between text-xs font-mono text-slate-500">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-violet-500" />
                  <span>Cible : {device?.model || 'iPhone 15 Pro Max'}</span>
                </div>
                <span>Firmware adapté : {device?.osVersion || 'iOS 17.5.1'}</span>
              </div>

              <button
                onClick={startRepairProcess}
                className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs shadow-md shadow-violet-500/20 active:scale-98 transition-all"
              >
                {lang === 'fr' ? 'Commencer la Réparation' : 'Start Repair'}
              </button>
            </div>
          </div>
        )}

        {/* DOWNLOADING FIRMWARE STATE */}
        {repairStage === 'downloading' && (
          <div className="max-w-md mx-auto text-center space-y-6 py-12">
            <div className="w-20 h-20 rounded-full bg-violet-50 dark:bg-violet-950 text-violet-600 flex items-center justify-center mx-auto">
              <Download className="w-8 h-8 animate-bounce" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {lang === 'fr' ? 'Téléchargement du micrologiciel officiel...' : 'Downloading Official Firmware...'}
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Apple_IPSW_17.5.1_Build_21F90.ipsw (5.4 GB)
              </p>
            </div>

            <div className="w-full space-y-2">
              <div className="w-full h-3 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-violet-600 to-indigo-600 transition-all duration-150"
                  style={{ width: `${downloadProgress}%` }}
                />
              </div>
              <div className="flex justify-between text-xs font-mono text-slate-400">
                <span>{downloadProgress}%</span>
                <span>Vitesse : 42.8 MB/s</span>
              </div>
            </div>
          </div>
        )}

        {/* LIVE KERNEL REPAIRING STATE */}
        {repairStage === 'repairing' && (
          <div className="max-w-xl mx-auto space-y-6 py-6">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-full bg-violet-600 text-white flex items-center justify-center mx-auto shadow-md">
                <Wrench className="w-7 h-7 animate-spin" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {lang === 'fr' ? 'Réparation et restauration du noyau système...' : 'Repairing System Kernel...'}
              </h3>
              <p className="text-xs text-slate-400">
                {lang === 'fr' ? 'Veuillez ne pas débrancher votre smartphone.' : 'Please do not unplug the device.'}
              </p>
            </div>

            {/* Progress */}
            <div className="w-full space-y-1.5">
              <div className="w-full h-2.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-violet-600 to-purple-500 transition-all duration-150"
                  style={{ width: `${repairProgress}%` }}
                />
              </div>
              <div className="flex justify-between text-xs font-mono text-slate-400">
                <span>{repairProgress}%</span>
                <span>Mode : Réparation Standard (Zéro Perte)</span>
              </div>
            </div>

            {/* Terminal Live Output */}
            <div className="bg-slate-950 text-emerald-400 p-4 rounded-xl font-mono text-[11px] h-48 overflow-y-auto space-y-1 border border-slate-800 shadow-inner">
              <div className="text-slate-500 flex items-center gap-1.5 pb-1 border-b border-slate-900">
                <Terminal className="w-3.5 h-3.5" />
                <span>Dr.Fone Kernel Flasher Terminal v14.2</span>
              </div>
              {terminalLogs.map((log, i) => (
                <div key={i}>{log}</div>
              ))}
            </div>
          </div>
        )}

        {/* SUCCESS STATE */}
        {repairStage === 'success' && (
          <div className="max-w-md mx-auto text-center space-y-5 py-8">
            <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-500 flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {lang === 'fr' ? 'Système Réparé avec Succès !' : 'System Repaired Successfully!'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {lang === 'fr' 
                  ? 'Votre smartphone a redémarré en mode normal. Vos photos, contacts et applications sont entièrement préservés.' 
                  : 'Your phone has restarted normally with 100% data intact.'}
              </p>
            </div>

            <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-left text-xs space-y-1.5 font-mono">
              <div className="text-emerald-500 font-bold">Panne corrigée : {selectedIssue}</div>
              <div className="text-slate-500">Intégrité des fichiers utilisateur : 100% OK</div>
              <div className="text-slate-500">Version installée : {device?.osVersion || 'iOS 17.5.1'}</div>
            </div>

            <button
              onClick={() => setRepairStage('picker')}
              className="px-6 py-2.5 text-xs font-bold text-white bg-violet-600 rounded-xl hover:bg-violet-700 transition-colors shadow-sm"
            >
              {lang === 'fr' ? 'Terminé (Retour)' : 'Done (Back)'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
