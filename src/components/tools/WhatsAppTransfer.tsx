import React, { useState } from 'react';
import { 
  MessageSquareShare, 
  ArrowLeft, 
  Smartphone, 
  HardDrive, 
  CheckCircle2, 
  RotateCw, 
  Check, 
  ShieldCheck, 
  ArrowRight,
  Eye,
  FileText
} from 'lucide-react';
import { ConnectedDevice } from '../../types';

interface WhatsAppTransferProps {
  device: ConnectedDevice | null;
  onBack: () => void;
  lang: 'fr' | 'en';
}

export const WhatsAppTransfer: React.FC<WhatsAppTransferProps> = ({
  device,
  onBack,
  lang,
}) => {
  const [activeTab, setActiveTab] = useState<'transfer' | 'backup' | 'restore'>('transfer');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [statusText, setStatusText] = useState('');

  const startAction = (type: string) => {
    setIsProcessing(true);
    setProgress(0);
    setIsComplete(false);
    setStatusText(lang === 'fr' ? 'Chiffrement et extraction de la base SQLite WhatsApp...' : 'Extracting WhatsApp database...');

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsProcessing(false);
          setIsComplete(true);
          return 100;
        }
        const next = prev + 5;
        if (next > 40 && next < 80) {
          setStatusText(lang === 'fr' ? 'Migration des 14 250 photos & mémos vocaux...' : 'Migrating 14,250 media files...');
        } else if (next >= 80) {
          setStatusText(lang === 'fr' ? 'Réindexation du trousseau chiffré sur l\'appareil cible...' : 'Re-indexing encrypted database on target...');
        }
        return next;
      });
    }, 120);
  };

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
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <MessageSquareShare className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                {lang === 'fr' ? 'Transfert & Sauvegarde WhatsApp' : 'WhatsApp Transfer & Backup'}
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                WhatsApp Messenger & WhatsApp Business · iOS ⇄ Android
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-6 py-2 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2 text-xs">
        {[
          { id: 'transfer', label: lang === 'fr' ? 'Transférer WhatsApp entre téléphones' : 'Transfer Between Phones' },
          { id: 'backup', label: lang === 'fr' ? 'Sauvegarder WhatsApp sur PC' : 'Backup to PC' },
          { id: 'restore', label: lang === 'fr' ? 'Restaurer une sauvegarde sur téléphone' : 'Restore Backup to Phone' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id as any);
              setIsComplete(false);
              setIsProcessing(false);
            }}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-8 max-w-4xl mx-auto w-full">
        {isProcessing ? (
          <div className="max-w-md mx-auto text-center space-y-6 py-12">
            <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center mx-auto">
              <RotateCw className="w-8 h-8 animate-spin" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {lang === 'fr' ? 'Opération WhatsApp en cours...' : 'Processing WhatsApp data...'}
              </h3>
              <p className="text-xs font-mono text-emerald-600 dark:text-emerald-400">
                {statusText}
              </p>
            </div>
            <div className="w-full space-y-2">
              <div className="w-full h-3 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 to-green-600 transition-all duration-150"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex justify-between text-xs font-mono text-slate-400">
                <span>{progress}%</span>
                <span>12.4 GB / 12.4 GB</span>
              </div>
            </div>
          </div>
        ) : isComplete ? (
          <div className="max-w-md mx-auto text-center space-y-5 py-8">
            <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-500 flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              {lang === 'fr' ? 'Opération WhatsApp Réussie !' : 'WhatsApp Operation Successful!'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {lang === 'fr' 
                ? 'Tous les messages, stickers, vocaux et médias ont été transférés sans perte.' 
                : 'All chats, stickers, voice memos and media successfully processed.'}
            </p>
            <button
              onClick={() => setIsComplete(false)}
              className="px-6 py-2.5 text-xs font-bold text-white bg-emerald-600 rounded-xl hover:bg-emerald-700"
            >
              {lang === 'fr' ? 'Terminé' : 'Done'}
            </button>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {activeTab === 'transfer' && (lang === 'fr' ? 'Migration directe iOS ⇄ Android' : 'Direct Phone-to-Phone Migration')}
                  {activeTab === 'backup' && (lang === 'fr' ? 'Sauvegarde locale complète WhatsApp' : 'Complete WhatsApp Local Backup')}
                  {activeTab === 'restore' && (lang === 'fr' ? 'Restaurer vos conversations' : 'Restore WhatsApp Conversations')}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Prend en charge les pièces jointes volumineuses, vocaux, contacts et historique complet.
                </p>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                100% Chiffré
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <div className="text-base font-bold text-emerald-600">48 210</div>
                <div className="text-[11px] text-slate-500">Messages textes</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <div className="text-base font-bold text-emerald-600">3 420</div>
                <div className="text-[11px] text-slate-500">Photos & vidéos</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <div className="text-base font-bold text-emerald-600">890</div>
                <div className="text-[11px] text-slate-500">Mémos vocaux</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <div className="text-base font-bold text-emerald-600">12.4 GB</div>
                <div className="text-[11px] text-slate-500">Taille totale</div>
              </div>
            </div>

            <button
              onClick={() => startAction(activeTab)}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-500/20 transition-all active:scale-98"
            >
              {activeTab === 'transfer' && (lang === 'fr' ? 'Démarrer le Transfert WhatsApp' : 'Start WhatsApp Transfer')}
              {activeTab === 'backup' && (lang === 'fr' ? 'Sauvegarder Maintenant sur PC' : 'Backup to PC Now')}
              {activeTab === 'restore' && (lang === 'fr' ? 'Restaurer sur le Téléphone' : 'Restore to Phone')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
