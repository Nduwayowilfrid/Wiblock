import React, { useState, useEffect } from 'react';
import { 
  ArrowRightLeft, 
  ArrowLeft, 
  Smartphone, 
  CheckSquare, 
  Square, 
  CheckCircle2, 
  Zap, 
  Check, 
  AlertCircle,
  HardDrive
} from 'lucide-react';
import { ConnectedDevice } from '../../types';
import { mockDevices } from '../../data/mockData';

interface PhoneTransferProps {
  currentDevice: ConnectedDevice | null;
  onBack: () => void;
  lang: 'fr' | 'en';
}

export const PhoneTransfer: React.FC<PhoneTransferProps> = ({
  currentDevice,
  onBack,
  lang,
}) => {
  const [sourceDevice, setSourceDevice] = useState<ConnectedDevice>(
    currentDevice || mockDevices[0]
  );
  const [targetDevice, setTargetDevice] = useState<ConnectedDevice>(
    mockDevices.find(d => d.id !== (currentDevice?.id || mockDevices[0].id)) || mockDevices[1]
  );

  const [clearTargetBeforeCopy, setClearTargetBeforeCopy] = useState(false);
  const [transferState, setTransferState] = useState<'idle' | 'transferring' | 'completed'>('idle');
  const [progress, setProgress] = useState(0);
  const [currentStepName, setCurrentStepName] = useState('');
  const [transferredItems, setTransferredItems] = useState(0);

  // Selected types to transfer
  const [transferItems, setTransferItems] = useState({
    contacts: true,
    photos: true,
    videos: true,
    messages: true,
    music: true,
    calendar: true,
    apps: false,
  });

  const flipDevices = () => {
    const temp = sourceDevice;
    setSourceDevice(targetDevice);
    setTargetDevice(temp);
  };

  const startTransfer = () => {
    setTransferState('transferring');
    setProgress(0);
    setTransferredItems(0);
  };

  useEffect(() => {
    if (transferState === 'transferring') {
      const steps = [
        'Établissement du canal direct USB-C haut débit...',
        'Préparation et indexation des contacts & messages...',
        'Copie des flux de photos et vidéos compressées...',
        'Migration des métadonnées de calendrier et notes...',
        'Vérification checksum SHA-256 des données copiées...',
      ];

      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setTransferState('completed');
            return 100;
          }
          const next = prev + 4;
          const stepIndex = Math.min(Math.floor((next / 100) * steps.length), steps.length - 1);
          setCurrentStepName(steps[stepIndex]);
          setTransferredItems(Math.round((next / 100) * 5840));
          return next;
        });
      }, 150);

      return () => clearInterval(interval);
    }
  }, [transferState]);

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-50 dark:bg-slate-950">
      {/* Top Bar */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center shadow-xs">
              <ArrowRightLeft className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                {lang === 'fr' ? 'Transfert de Téléphone à Téléphone (Switch)' : 'Phone to Phone Transfer'}
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {lang === 'fr' ? 'Migration complète 100% sécurisée sans perte' : 'Seamless cross-platform migration (iOS ⇄ Android)'}
              </p>
            </div>
          </div>
        </div>

        {transferState === 'idle' && (
          <button
            onClick={startTransfer}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-teal-600 text-white hover:bg-teal-700 shadow-md shadow-teal-500/20 active:scale-98 transition-all"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>{lang === 'fr' ? 'Lancer le Transfert' : 'Start Transfer'}</span>
          </button>
        )}
      </div>

      {/* Main Body */}
      {transferState === 'idle' && (
        <div className="flex-1 overflow-y-auto p-8 max-w-5xl mx-auto w-full flex flex-col justify-between space-y-6">
          {/* Dual Phone Showcase */}
          <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center">
            {/* SOURCE PHONE (Col 1-5) */}
            <div className="md:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 text-center space-y-4 shadow-xs relative">
              <span className="text-[11px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950 px-2.5 py-0.5 rounded-full border border-teal-200 dark:border-teal-800">
                {lang === 'fr' ? 'Appareil Source (Départ)' : 'Source Device'}
              </span>

              <div className="w-20 h-36 mx-auto rounded-2xl bg-slate-900 border-2 border-slate-700 p-1 flex flex-col justify-between shadow-lg">
                <div className="mx-auto w-6 h-1 rounded-full bg-slate-700" />
                <div className="w-full h-24 rounded-lg bg-gradient-to-tr from-teal-500/30 to-blue-500/30 flex items-center justify-center">
                  <Smartphone className="w-7 h-7 text-white/80" />
                </div>
                <div className="mx-auto w-6 h-0.5 rounded-full bg-slate-600" />
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {sourceDevice.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {sourceDevice.model} · {sourceDevice.os.toUpperCase()} {sourceDevice.osVersion}
                </p>
                <div className="text-[11px] font-mono text-slate-400 mt-1">
                  {sourceDevice.storageUsedGB} GB utilisés / {sourceDevice.storageTotalGB} GB
                </div>
              </div>
            </div>

            {/* FLIP BUTTON (Col 6) */}
            <div className="md:col-span-1 flex justify-center py-2">
              <button
                onClick={flipDevices}
                className="w-12 h-12 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md hover:shadow-lg flex items-center justify-center text-teal-600 dark:text-teal-400 hover:scale-110 active:scale-95 transition-all group"
                title={lang === 'fr' ? 'Inverser Source et Destination' : 'Flip Source and Target'}
              >
                <ArrowRightLeft className="w-5 h-5 group-hover:rotate-180 transition-transform duration-300" />
              </button>
            </div>

            {/* TARGET PHONE (Col 7-11) */}
            <div className="md:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 text-center space-y-4 shadow-xs relative">
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-2.5 py-0.5 rounded-full border border-blue-200 dark:border-blue-800">
                {lang === 'fr' ? 'Appareil Cible (Destination)' : 'Target Device'}
              </span>

              <div className="w-20 h-36 mx-auto rounded-2xl bg-slate-900 border-2 border-slate-700 p-1 flex flex-col justify-between shadow-lg">
                <div className="mx-auto w-6 h-1 rounded-full bg-slate-700" />
                <div className="w-full h-24 rounded-lg bg-gradient-to-tr from-blue-500/30 to-indigo-500/30 flex items-center justify-center">
                  <Smartphone className="w-7 h-7 text-white/80" />
                </div>
                <div className="mx-auto w-6 h-0.5 rounded-full bg-slate-600" />
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {targetDevice.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {targetDevice.model} · {targetDevice.os.toUpperCase()} {targetDevice.osVersion}
                </p>
                <div className="text-[11px] font-mono text-slate-400 mt-1">
                  {targetDevice.storageUsedGB} GB utilisés / {targetDevice.storageTotalGB} GB
                </div>
              </div>
            </div>
          </div>

          {/* Transfer Checklist & Options */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                {lang === 'fr' ? 'Contenu à transférer' : 'Content to Transfer'}
              </h4>
              <span className="text-xs text-slate-400">
                {lang === 'fr' ? 'Estimé : ~48 GB' : 'Estimated: ~48 GB'}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {[
                { key: 'photos', label: 'Photos', count: `${sourceDevice.photoCount} éléments`, size: '42.5 GB' },
                { key: 'videos', label: 'Vidéos', count: `${sourceDevice.videoCount} vidéos`, size: '36.2 GB' },
                { key: 'contacts', label: 'Contacts', count: `${sourceDevice.contactCount} fiches`, size: '1.2 MB' },
                { key: 'messages', label: 'Messages SMS', count: `${sourceDevice.messageCount} conversations`, size: '45.2 MB' },
                { key: 'music', label: 'Musique', count: `${sourceDevice.audioCount} morceaux`, size: '5.8 GB' },
                { key: 'calendar', label: 'Calendrier & Notes', count: '240 entrées', size: '2.4 MB' },
                { key: 'apps', label: 'Apps compatibles', count: `${sourceDevice.appCount} apps`, size: '18.4 GB' },
              ].map(({ key, label, count, size }) => {
                const isChecked = transferItems[key as keyof typeof transferItems];
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setTransferItems(prev => ({ ...prev, [key]: !isChecked }))}
                    className={`flex items-start gap-2.5 p-3 rounded-xl border text-left transition-colors ${
                      isChecked
                        ? 'border-teal-400 dark:border-teal-700 bg-teal-50/20 dark:bg-teal-950/20'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 opacity-60'
                    }`}
                  >
                    <div className="mt-0.5">
                      {isChecked ? <CheckSquare className="w-4 h-4 text-teal-600" /> : <Square className="w-4 h-4 text-slate-400" />}
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-900 dark:text-white">{label}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{count} · {size}</div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Option Checkbox */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
              <input
                type="checkbox"
                id="clearTarget"
                checked={clearTargetBeforeCopy}
                onChange={(e) => setClearTargetBeforeCopy(e.target.checked)}
                className="rounded text-teal-600 focus:ring-teal-500 w-4 h-4 cursor-pointer"
              />
              <label htmlFor="clearTarget" className="cursor-pointer">
                {lang === 'fr' 
                  ? 'Effacer les données sur l\'appareil cible avant la copie (Optionnel)' 
                  : 'Clear data on destination device before copy (Optional)'}
              </label>
            </div>
          </div>
        </div>
      )}

      {/* TRANSFERRING STATE ANIMATION */}
      {transferState === 'transferring' && (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-6 max-w-xl mx-auto">
          {/* Animated bridge between phones */}
          <div className="flex items-center justify-between w-full px-8">
            <div className="text-center">
              <div className="w-16 h-28 rounded-xl bg-slate-900 border-2 border-teal-500 flex items-center justify-center text-teal-400 shadow-md">
                <Smartphone className="w-7 h-7" />
              </div>
              <span className="text-xs font-bold block mt-2">{sourceDevice.name}</span>
            </div>

            {/* Glowing animated transfer packets */}
            <div className="flex-1 flex items-center justify-center px-4 relative">
              <div className="w-full h-1 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-teal-500 via-cyan-400 to-blue-500 animate-pulse"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <Zap className="w-5 h-5 text-teal-500 animate-bounce absolute" />
            </div>

            <div className="text-center">
              <div className="w-16 h-28 rounded-xl bg-slate-900 border-2 border-blue-500 flex items-center justify-center text-blue-400 shadow-md">
                <Smartphone className="w-7 h-7" />
              </div>
              <span className="text-xs font-bold block mt-2">{targetDevice.name}</span>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {lang === 'fr' ? 'Transfert de données en cours...' : 'Transferring data...'}
            </h3>
            <p className="text-xs font-mono text-teal-600 dark:text-teal-400">
              {currentStepName}
            </p>
          </div>

          <div className="w-full space-y-2">
            <div className="w-full h-3 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 transition-all duration-150"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-xs font-mono text-slate-500">
              <span>{progress}%</span>
              <span>84.2 MB/s · {transferredItems.toLocaleString()} éléments migrés</span>
            </div>
          </div>
        </div>
      )}

      {/* COMPLETED STATE */}
      {transferState === 'completed' && (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-5 max-w-md mx-auto">
          <div className="w-16 h-16 rounded-full bg-teal-50 dark:bg-teal-950 text-teal-500 flex items-center justify-center shadow-lg">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              {lang === 'fr' ? 'Transfert Terminé avec Succès !' : 'Transfer Completed Successfully!'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {lang === 'fr' 
                ? `Toutes les données sélectionnées ont été migrées sans aucune altération vers ${targetDevice.name}.`
                : `All selected content migrated to ${targetDevice.name} without any loss.`}
            </p>
          </div>

          <div className="w-full p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-left space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-400">Éléments transférés</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">5 840 éléments (47.8 GB)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Checksum d'intégrité</span>
              <span className="font-mono text-emerald-500">SHA-256 Validé ✓</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Temps total</span>
              <span className="font-mono">8 minutes 42 secondes</span>
            </div>
          </div>

          <button
            onClick={() => setTransferState('idle')}
            className="px-6 py-2.5 text-xs font-bold text-white bg-teal-600 rounded-xl hover:bg-teal-700 transition-colors shadow-sm"
          >
            {lang === 'fr' ? 'Terminé (Retour)' : 'Done (Back)'}
          </button>
        </div>
      )}
    </div>
  );
};
