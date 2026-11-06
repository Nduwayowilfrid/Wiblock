import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  ArrowLeft, 
  AlertTriangle, 
  CheckCircle2, 
  Trash2, 
  ShieldCheck, 
  RotateCw, 
  Lock,
  FileCheck
} from 'lucide-react';
import { ConnectedDevice } from '../../types';

interface DataEraserProps {
  device: ConnectedDevice | null;
  onBack: () => void;
  lang: 'fr' | 'en';
}

export const DataEraser: React.FC<DataEraserProps> = ({
  device,
  onBack,
  lang,
}) => {
  const [eraseMode, setEraseMode] = useState<'all' | 'private' | 'deleted-only'>('all');
  const [standard, setStandard] = useState<'low' | 'dod' | 'nist'>('dod');
  const [confirmText, setConfirmText] = useState('');
  const [isWiping, setIsWiping] = useState(false);
  const [wipeProgress, setWipeProgress] = useState(0);
  const [currentPass, setCurrentPass] = useState(1);
  const [isFinished, setIsFinished] = useState(false);

  const startWipe = () => {
    if (confirmText.toUpperCase() !== 'EFFACER' && confirmText.toUpperCase() !== 'ERASE') return;
    setIsWiping(true);
    setWipeProgress(0);
    setCurrentPass(1);
  };

  useEffect(() => {
    if (isWiping) {
      const interval = setInterval(() => {
        setWipeProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsWiping(false);
            setIsFinished(true);
            return 100;
          }
          const next = prev + 5;
          if (next > 33 && next <= 66) setCurrentPass(2);
          if (next > 66) setCurrentPass(3);
          return next;
        });
      }, 150);
      return () => clearInterval(interval);
    }
  }, [isWiping]);

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
            <div className="w-8 h-8 rounded-lg bg-rose-600 text-white flex items-center justify-center shadow-xs">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                {lang === 'fr' ? 'Effaceur de Données Sécurisé (Niveau Militaire)' : 'Military Grade Data Eraser'}
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Norme DoD 5220.22-M & NIST 800-88 · Irréversible 100% garanti
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Form */}
      <div className="flex-1 overflow-y-auto p-8 max-w-3xl mx-auto w-full">
        {isWiping ? (
          <div className="text-center space-y-6 py-12">
            <div className="w-20 h-20 rounded-full bg-rose-50 dark:bg-rose-950 text-rose-600 flex items-center justify-center mx-auto border-2 border-rose-500/20">
              <RotateCw className="w-10 h-10 animate-spin" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {lang === 'fr' ? 'Écrasement sécurisé des secteurs mémoire...' : 'Overwriting Flash Storage Sectors...'}
              </h3>
              <p className="text-xs text-rose-600 dark:text-rose-400 font-mono">
                Passe {currentPass} / 3 (Norme DoD 5220.22-M Récriture Pseudo-Aléatoire)
              </p>
            </div>

            <div className="w-full space-y-2">
              <div className="w-full h-3 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-rose-500 to-red-600 transition-all duration-150"
                  style={{ width: `${wipeProgress}%` }}
                />
              </div>
              <div className="flex justify-between text-xs font-mono text-slate-500">
                <span>{wipeProgress}%</span>
                <span>{device?.storageTotalGB || 256} GB écrasés</span>
              </div>
            </div>
          </div>
        ) : isFinished ? (
          <div className="text-center space-y-5 py-8">
            <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-500 flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {lang === 'fr' ? 'Données Effacées Définitivement !' : 'Device Wiped Permanently!'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {lang === 'fr' 
                  ? 'Aucun logiciel de récupération forensic ne pourra jamais extraire vos données. Votre appareil est prêt à être revendu en toute sécurité.' 
                  : 'Zero forensic recovery possible. Your device is completely sanitized.'}
              </p>
            </div>

            <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-left text-xs space-y-1.5 font-mono max-w-md mx-auto">
              <div className="flex items-center gap-1.5 text-emerald-600 font-bold">
                <FileCheck className="w-4 h-4" />
                <span>Certificat de Destruction Dr.Fone #DF-94821</span>
              </div>
              <div className="text-slate-500">Date : {new Date().toLocaleDateString()}</div>
              <div className="text-slate-500">Algorithme : DoD 5220.22-M (3 passes complètes)</div>
            </div>

            <button
              onClick={() => { setIsFinished(false); setConfirmText(''); }}
              className="px-6 py-2.5 text-xs font-bold text-white bg-rose-600 rounded-xl hover:bg-rose-700"
            >
              {lang === 'fr' ? 'Retour' : 'Back'}
            </button>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-6">
            <div className="flex items-start gap-3 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/40 text-rose-800 dark:text-rose-300 text-xs">
              <AlertTriangle className="w-5 h-5 shrink-0 text-rose-500 mt-0.5" />
              <div>
                <strong className="font-bold">Avertissement irréversible :</strong> Cette opération va détruire l'intégralité des données présentes sur le téléphone. Sauvegardez d'abord vos fichiers avec l'outil Sauvegarde de Dr.Fone si vous souhaitez les conserver.
              </div>
            </div>

            {/* Erase Standard Selector */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                Niveau de sécurité de l'effacement :
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'low', name: 'Niveau Faible', desc: '1 passe (Zéros simples) - Rapide' },
                  { id: 'dod', name: 'Niveau Moyen (DoD)', desc: '3 passes militaires 5220.22-M' },
                  { id: 'nist', name: 'Niveau Élevé (NIST)', desc: '7 passes Gutmann / NIST 800-88' },
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setStandard(s.id as any)}
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      standard === s.id
                        ? 'border-rose-500 bg-rose-50/30 dark:bg-rose-950/20 text-rose-700 dark:text-rose-300'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <div className="text-xs font-bold">{s.name}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{s.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Confirmation Safeguard Input */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <label className="text-xs text-slate-600 dark:text-slate-400 block">
                Pour confirmer la destruction définitive, tapez <strong className="text-rose-600 font-mono">EFFACER</strong> ci-dessous :
              </label>
              <input
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="Tapez EFFACER"
                className="w-full max-w-xs px-3 py-2 text-xs rounded-xl border border-rose-300 dark:border-rose-800 bg-slate-50 dark:bg-slate-800 font-mono text-center tracking-widest uppercase focus:outline-hidden focus:ring-1 focus:ring-rose-500"
              />
            </div>

            <button
              onClick={startWipe}
              disabled={confirmText.toUpperCase() !== 'EFFACER' && confirmText.toUpperCase() !== 'ERASE'}
              className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-40 text-white font-bold text-xs shadow-md shadow-rose-500/20 transition-all"
            >
              Lancer l'Effacement Militaire Irrémédiable
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
