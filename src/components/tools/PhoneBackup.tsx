import React, { useState } from 'react';
import { 
  HardDrive, 
  ArrowLeft, 
  ShieldCheck, 
  CheckCircle2, 
  RotateCw, 
  Lock, 
  Download, 
  Calendar, 
  Smartphone,
  Check,
  Plus
} from 'lucide-react';
import { ConnectedDevice, BackupSnapshot } from '../../types';
import { mockBackups } from '../../data/mockData';

interface PhoneBackupProps {
  device: ConnectedDevice | null;
  onBack: () => void;
  lang: 'fr' | 'en';
}

export const PhoneBackup: React.FC<PhoneBackupProps> = ({
  device,
  onBack,
  lang,
}) => {
  const [backups, setBackups] = useState<BackupSnapshot[]>(mockBackups);
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [backupProgress, setBackupProgress] = useState(0);
  const [encryptBackup, setEncryptBackup] = useState(true);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleStartBackup = () => {
    setIsBackingUp(true);
    setBackupProgress(0);

    const interval = setInterval(() => {
      setBackupProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsBackingUp(false);
          const newBk: BackupSnapshot = {
            id: `bk-${Date.now()}`,
            deviceName: device?.name || 'iPhone 15 Pro Max',
            date: new Date().toISOString().replace('T', ' ').slice(0, 19),
            size: `${device?.storageUsedGB.toFixed(1) || '118.4'} GB`,
            itemsSummary: `${device?.photoCount || 3842} Photos, ${device?.contactCount || 654} Contacts, ${device?.messageCount || 1420} SMS`,
            encrypted: encryptBackup,
          };
          setBackups([newBk, ...backups]);
          showToast(lang === 'fr' ? 'Sauvegarde complète créée avec succès !' : 'Full backup created successfully!');
          return 100;
        }
        return prev + 5;
      });
    }, 120);
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-50 dark:bg-slate-950">
      {/* Toast */}
      {toastMsg && (
        <div className="absolute top-16 right-8 z-50 bg-blue-600 text-white px-4 py-2 rounded-xl shadow-xl text-xs flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4" />
          <span>{toastMsg}</span>
        </div>
      )}

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
            <div className="w-8 h-8 rounded-lg bg-sky-600 text-white flex items-center justify-center shadow-xs">
              <HardDrive className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                {lang === 'fr' ? 'Sauvegarde & Restauration Locale' : 'Local Backup & Restore'}
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Sauvegardes incrémentielles chiffrées sur votre disque dur
              </p>
            </div>
          </div>
        </div>

        {!isBackingUp && (
          <button
            onClick={handleStartBackup}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-sky-600 text-white hover:bg-sky-700 shadow-md shadow-sky-500/20 transition-all active:scale-98"
          >
            <Plus className="w-4 h-4" />
            <span>{lang === 'fr' ? 'Sauvegarder Maintenant' : 'Backup Now'}</span>
          </button>
        )}
      </div>

      {/* Main Container */}
      <div className="flex-1 overflow-y-auto p-8 max-w-4xl mx-auto w-full space-y-6">
        {isBackingUp ? (
          <div className="text-center space-y-6 py-12">
            <div className="w-20 h-20 rounded-full bg-sky-50 dark:bg-sky-950 text-sky-600 flex items-center justify-center mx-auto border-2 border-sky-500/20">
              <RotateCw className="w-10 h-10 animate-spin" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {lang === 'fr' ? 'Création de l\'image de sauvegarde...' : 'Creating System Snapshot...'}
              </h3>
              <p className="text-xs text-sky-600 dark:text-sky-400 font-mono">
                Sauvegarde incrémentielle chiffrée AES-256
              </p>
            </div>

            <div className="w-full space-y-2">
              <div className="w-full h-3 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-sky-500 to-blue-600 transition-all duration-150"
                  style={{ width: `${backupProgress}%` }}
                />
              </div>
              <div className="flex justify-between text-xs font-mono text-slate-500">
                <span>{backupProgress}%</span>
                <span>{(device?.storageUsedGB || 118.4) * (backupProgress / 100)} GB / {device?.storageUsedGB || 118.4} GB</span>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Encryption setting */}
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-sky-50 dark:bg-sky-950 text-sky-600">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">
                    {lang === 'fr' ? 'Chiffrer la sauvegarde locale (AES-256)' : 'Encrypt local backup (AES-256)'}
                  </div>
                  <div className="text-slate-400 text-[11px]">
                    Protège les mots de passe de comptes, données de santé et trousseau Wi-Fi.
                  </div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={encryptBackup}
                onChange={(e) => setEncryptBackup(e.target.checked)}
                className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500 cursor-pointer"
              />
            </div>

            {/* Backups List */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
              <div className="px-5 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                  {lang === 'fr' ? 'Historique des sauvegardes enregistrées' : 'Backup Snapshots History'} ({backups.length})
                </span>
                <span className="text-xs text-slate-400">Emplacement : ~/Documents/DrFone/Backups</span>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {backups.map((bk) => (
                  <div
                    key={bk.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-950 text-sky-600 flex items-center justify-center shrink-0">
                        <Smartphone className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          <span>{bk.deviceName}</span>
                          {bk.encrypted && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-medium">
                              Chiffré
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                          {bk.date} · {bk.size}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                          {bk.itemsSummary}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        onClick={() => showToast(lang === 'fr' ? `Restauration de la sauvegarde du ${bk.date} sur l'appareil...` : `Restoring backup ${bk.date}...`)}
                        className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-sky-600 hover:bg-sky-700 text-white transition-colors shadow-xs"
                      >
                        Restaurer
                      </button>
                      <button
                        onClick={() => {
                          setBackups(backups.filter(b => b.id !== bk.id));
                          showToast('Sauvegarde supprimée du disque.');
                        }}
                        className="px-2.5 py-1.5 text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
