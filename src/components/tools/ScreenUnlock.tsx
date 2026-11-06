import React, { useState, useEffect } from 'react';
import { 
  KeyRound, 
  ArrowLeft, 
  Lock, 
  Unlock, 
  ShieldAlert, 
  Smartphone, 
  CheckCircle2, 
  RotateCw, 
  AlertTriangle,
  Fingerprint,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { ConnectedDevice } from '../../types';

interface ScreenUnlockProps {
  device: ConnectedDevice | null;
  onBack: () => void;
  lang: 'fr' | 'en';
}

export const ScreenUnlock: React.FC<ScreenUnlockProps> = ({
  device,
  onBack,
  lang,
}) => {
  const [unlockType, setUnlockType] = useState<'screen' | 'apple-id' | 'screen-time' | 'mdm' | 'icloud'>('screen');
  const [unlockStage, setUnlockStage] = useState<'intro' | 'dfu-guide' | 'firmware' | 'unlocking' | 'success'>('intro');
  
  // Interactive Keypad state on phone
  const [passcode, setPasscode] = useState<string>('');
  const [passcodeError, setPasscodeError] = useState(false);
  const [dfuStep, setDfuStep] = useState(1);
  const [unlockProgress, setUnlockProgress] = useState(0);

  const handleKeyClick = (digit: string) => {
    if (passcode.length < 6) {
      const next = passcode + digit;
      setPasscode(next);
      if (next.length === 6) {
        // Trigger simulated failure to demonstrate why user needs Dr.Fone!
        setPasscodeError(true);
        setTimeout(() => {
          setPasscode('');
          setPasscodeError(false);
        }, 1200);
      }
    }
  };

  const startUnlockingProcess = () => {
    setUnlockStage('dfu-guide');
  };

  const proceedToFirmware = () => {
    setUnlockStage('firmware');
    setTimeout(() => {
      setUnlockStage('unlocking');
      setUnlockProgress(0);
    }, 1800);
  };

  useEffect(() => {
    if (unlockStage === 'unlocking') {
      const interval = setInterval(() => {
        setUnlockProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setUnlockStage('success');
            return 100;
          }
          return prev + 5;
        });
      }, 150);
      return () => clearInterval(interval);
    }
  }, [unlockStage]);

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
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center shadow-xs">
              <KeyRound className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                {lang === 'fr' ? 'Déverrouillage d\'Écran & Contournement de Sécurité' : 'Screen Unlock & Security Bypass'}
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {device?.name || 'iPhone 15 Pro'} · Code à 4/6 chiffres, Face ID, Apple ID, FRP
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main View Area */}
      <div className="flex-1 overflow-y-auto p-6 max-w-5xl mx-auto w-full">
        {unlockStage === 'intro' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left: Lock scenarios (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {lang === 'fr' ? 'Sélectionnez le type de verrouillage à supprimer' : 'Select Lock Type to Bypass'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {lang === 'fr' 
                    ? 'Dr.Fone contourne tous les mécanismes de verrouillage sans avoir besoin du mot de passe.' 
                    : 'Dr.Fone removes security locks without needing the original passcode.'}
                </p>
              </div>

              <div className="space-y-2.5">
                {[
                  {
                    id: 'screen',
                    title: lang === 'fr' ? 'Déverrouiller le code d\'accès de l\'écran' : 'Unlock Screen Passcode',
                    desc: lang === 'fr' ? 'Code 4 chiffres, 6 chiffres, schéma, Face ID ou Touch ID oublié ou désactivé.' : '4-digit, 6-digit passcode, pattern, Face ID or Touch ID.',
                    icon: Lock,
                  },
                  {
                    id: 'apple-id',
                    title: lang === 'fr' ? 'Supprimer l\'identifiant Apple ID / Compte Google' : 'Remove Apple ID / Google FRP',
                    desc: lang === 'fr' ? 'Supprimer le compte lié sans le mot de passe pour se connecter avec un nouveau.' : 'Remove linked account to sign in with a new Apple ID or Google account.',
                    icon: ShieldAlert,
                  },
                  {
                    id: 'screen-time',
                    title: lang === 'fr' ? 'Déverrouiller le code Temps d\'Écran' : 'Bypass Screen Time Passcode',
                    desc: lang === 'fr' ? 'Supprime les restrictions de temps d\'écran sans aucune perte de données.' : 'Remove screen time passcode with 100% zero data loss.',
                    icon: ShieldCheck,
                  },
                  {
                    id: 'mdm',
                    title: lang === 'fr' ? 'Contourner la gestion d\'appareils mobiles (MDM)' : 'Bypass MDM Lock',
                    desc: lang === 'fr' ? 'Supprime les profils de supervision d\'entreprise ou d\'école.' : 'Remove corporate or school supervisory profile.',
                    icon: Smartphone,
                  },
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = unlockType === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setUnlockType(item.id as any)}
                      className={`w-full flex items-start gap-3.5 p-4 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'border-amber-500 bg-amber-50/40 dark:bg-amber-950/20 shadow-xs'
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
                      }`}
                    >
                      <div className={`p-2 rounded-lg mt-0.5 ${isSelected ? 'bg-amber-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <div className="text-xs font-bold text-slate-900 dark:text-white">{item.title}</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">{item.desc}</div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300 shrink-0 mt-2" />
                    </button>
                  );
                })}
              </div>

              <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-xl text-xs text-amber-800 dark:text-amber-300 flex items-center gap-2.5">
                <AlertTriangle className="w-4 h-4 shrink-0 text-amber-500" />
                <span>
                  {lang === 'fr' 
                    ? 'Note : Le déverrouillage de l\'écran réinitialise le mot de passe et rétablit l\'accès complet.' 
                    : 'Note: Screen unlock resets the passcode and restores full system access.'}
                </span>
              </div>

              <button
                onClick={startUnlockingProcess}
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-md shadow-amber-500/20 transition-all"
              >
                {lang === 'fr' ? 'Démarrer le Déverrouillage' : 'Start Unlock'}
              </button>
            </div>

            {/* Right: Interactive Simulated Locked Phone (5 cols) */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <span className="text-[11px] font-semibold text-slate-400 mb-2">
                {lang === 'fr' ? 'Simulateur d\'écran verrouillé' : 'Locked Screen Simulator'}
              </span>

              {/* Realistic iPhone mockup */}
              <div className="w-64 h-[440px] rounded-3xl bg-slate-950 border-4 border-slate-800 p-3 flex flex-col justify-between shadow-2xl relative">
                {/* Dynamic Island */}
                <div className="mx-auto w-20 h-4 rounded-full bg-black border border-slate-800 flex items-center justify-between px-2 text-[9px] text-slate-500">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                  <div className="w-2 h-2 rounded-full bg-blue-900/60" />
                </div>

                {/* Locked Keypad screen */}
                <div className="text-center my-auto space-y-3">
                  <Lock className={`w-6 h-6 mx-auto ${passcodeError ? 'text-rose-500 animate-bounce' : 'text-white'}`} />
                  <div>
                    <h4 className="text-white text-xs font-semibold">
                      {passcodeError ? (lang === 'fr' ? 'Code d\'accès incorrect' : 'Incorrect Passcode') : (lang === 'fr' ? 'Saisir le code d\'accès' : 'Enter Passcode')}
                    </h4>
                    <p className="text-[10px] text-slate-400">
                      {lang === 'fr' ? 'iPhone désactivé' : 'iPhone Unavailable'}
                    </p>
                  </div>

                  {/* 6 Passcode dots */}
                  <div className="flex justify-center gap-2">
                    {[0, 1, 2, 3, 4, 5].map((idx) => (
                      <div
                        key={idx}
                        className={`w-2.5 h-2.5 rounded-full border border-white/60 transition-colors ${
                          passcode.length > idx ? (passcodeError ? 'bg-rose-500 border-rose-500' : 'bg-white') : 'bg-transparent'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Number Keypad */}
                  <div className="grid grid-cols-3 gap-2 px-4 pt-1">
                    {['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '⌫'].map((k, i) => {
                      if (k === '') return <div key={i} />;
                      if (k === '⌫') {
                        return (
                          <button
                            key={i}
                            onClick={() => setPasscode(passcode.slice(0, -1))}
                            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-xs mx-auto"
                          >
                            ⌫
                          </button>
                        );
                      }
                      return (
                        <button
                          key={i}
                          onClick={() => handleKeyClick(k)}
                          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 active:bg-white/30 text-white flex items-center justify-center text-xs font-semibold mx-auto transition-colors"
                        >
                          {k}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Bottom Home indicator */}
                <div className="mx-auto w-24 h-1 rounded-full bg-white/40" />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: DFU / RECOVERY MODE GUIDE */}
        {unlockStage === 'dfu-guide' && (
          <div className="max-w-3xl mx-auto space-y-6 text-center py-4">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-amber-500 uppercase tracking-wider">Étape 1 sur 3 · Manipulation Matérielle Obligatoire</span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {lang === 'fr' ? 'Passer votre téléphone en Mode Récupération Physique' : 'Enter Hardware Recovery Mode'}
              </h3>
              <p className="text-xs text-slate-500 max-w-xl mx-auto">
                {lang === 'fr' 
                  ? 'Pour des raisons de sécurité matérielle (puce Secure Enclave / Samsung Knox), le mot de passe ne peut être supprimé qu\'en forçant le mode DFU ou Recovery avec les touches physiques.'
                  : 'Due to hardware encryption, a forgotten lock can only be wiped by entering physical DFU/Recovery mode.'}
              </p>
            </div>

            {/* Brand / Model selector buttons */}
            <div className="flex items-center justify-center gap-2 flex-wrap text-xs">
              {[
                { id: 1, label: 'iPhone 15 / 14 / 13 / 12 / 11 / X (Face ID)' },
                { id: 2, label: 'iPhone SE / 8 / 7 / 6s (Bouton Home)' },
                { id: 3, label: 'Samsung Galaxy (S24 / S23 / A54)' },
                { id: 4, label: 'Xiaomi / Redmi / POCO' },
                { id: 5, label: 'Google Pixel (Pixel 6 / 7 / 8 / 9)' },
              ].map((b) => (
                <button
                  key={b.id}
                  onClick={() => setDfuStep(b.id)}
                  className={`px-3 py-1.5 rounded-xl font-medium transition-colors ${
                    dfuStep === b.id
                      ? 'bg-amber-500 text-white shadow-xs font-bold'
                      : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                  }`}
                >
                  {b.label}
                </button>
              ))}
            </div>

            {/* Specific Instructions based on selected hardware model */}
            {dfuStep === 1 && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
                <div className="p-4 rounded-xl border border-amber-500 bg-amber-50/40 dark:bg-amber-950/20">
                  <div className="text-xs font-bold text-amber-600 mb-1">1. Volume Haut</div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400">Appuyez brièvement sur le bouton Volume + puis relâchez immédiatement.</p>
                </div>
                <div className="p-4 rounded-xl border border-amber-500 bg-amber-50/40 dark:bg-amber-950/20">
                  <div className="text-xs font-bold text-amber-600 mb-1">2. Volume Bas</div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400">Appuyez brièvement sur le bouton Volume - puis relâchez immédiatement.</p>
                </div>
                <div className="p-4 rounded-xl border border-amber-500 bg-amber-50/40 dark:bg-amber-950/20">
                  <div className="text-xs font-bold text-amber-600 mb-1">3. Bouton Latéral</div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400">Maintenez le bouton Marche enfoncé jusqu'à l'écran noir puis l'icône câble/ordinateur.</p>
                </div>
              </div>
            )}

            {dfuStep === 2 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
                <div className="p-4 rounded-xl border border-amber-500 bg-amber-50/40 dark:bg-amber-950/20">
                  <div className="text-xs font-bold text-amber-600 mb-1">1. Brancher en USB</div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400">Connectez le câble Lightning à l'ordinateur.</p>
                </div>
                <div className="p-4 rounded-xl border border-amber-500 bg-amber-50/40 dark:bg-amber-950/20">
                  <div className="text-xs font-bold text-amber-600 mb-1">2. Bouton Home + Latéral</div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400">Maintenez le bouton Home et le bouton supérieur/latéral enfoncés simultanément.</p>
                </div>
              </div>
            )}

            {dfuStep === 3 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
                <div className="p-4 rounded-xl border border-amber-500 bg-amber-50/40 dark:bg-amber-950/20">
                  <div className="text-xs font-bold text-amber-600 mb-1">1. Éteindre le Galaxy</div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400">Branchez le câble USB-C à votre ordinateur.</p>
                </div>
                <div className="p-4 rounded-xl border border-amber-500 bg-amber-50/40 dark:bg-amber-950/20">
                  <div className="text-xs font-bold text-amber-600 mb-1">2. Volume Haut + Power</div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400">Maintenez Volume Haut et Marche jusqu'à l'apparition du menu Android Recovery (Recovery Knox).</p>
                </div>
              </div>
            )}

            {dfuStep >= 4 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
                <div className="p-4 rounded-xl border border-amber-500 bg-amber-50/40 dark:bg-amber-950/20">
                  <div className="text-xs font-bold text-amber-600 mb-1">1. Éteindre l'appareil</div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400">Maintenez le bouton d'alimentation jusqu'à l'extinction complète.</p>
                </div>
                <div className="p-4 rounded-xl border border-amber-500 bg-amber-50/40 dark:bg-amber-950/20">
                  <div className="text-xs font-bold text-amber-600 mb-1">2. Volume Bas + Power (Fastboot)</div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400">Maintenez Volume Bas et Marche enfoncés pour afficher l'écran Fastboot / Bootloader.</p>
                </div>
              </div>
            )}

            <div className="p-4 bg-slate-900 text-white rounded-2xl flex items-center justify-between">
              <div className="text-left text-xs">
                <div className="font-bold">Prêt pour la réinitialisation matérielle</div>
                <div className="text-slate-400 font-mono text-[11px]">Téléphone en attente de commande de flashage</div>
              </div>
              <button
                onClick={proceedToFirmware}
                className="px-4 py-2 text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors shadow-sm"
              >
                Passer au Déblocage & Micrologiciel →
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: FIRMWARE VERIFICATION & UNLOCKING */}
        {(unlockStage === 'firmware' || unlockStage === 'unlocking') && (
          <div className="max-w-md mx-auto text-center space-y-6 py-12">
            <div className="w-20 h-20 rounded-full bg-amber-50 dark:bg-amber-950/60 border-2 border-amber-500/30 flex items-center justify-center mx-auto text-amber-500">
              <RotateCw className="w-8 h-8 animate-spin" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {unlockStage === 'firmware' 
                  ? (lang === 'fr' ? 'Téléchargement & Vérification du Micrologiciel...' : 'Downloading & Verifying Firmware...') 
                  : (lang === 'fr' ? 'Suppression du verrouillage en cours...' : 'Removing Screen Lock...')}
              </h3>
              <p className="text-xs text-slate-500 font-mono">
                {unlockStage === 'firmware' ? 'iOS_17.5.1_Restore_Official.ipsw (SHA-256 Validé)' : `Suppression de la clé Secure Enclave... ${unlockProgress}%`}
              </p>
            </div>

            <div className="w-full space-y-2">
              <div className="w-full h-3 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-150"
                  style={{ width: `${unlockStage === 'firmware' ? 45 : unlockProgress}%` }}
                />
              </div>
              <div className="text-xs font-mono text-slate-400">
                {unlockStage === 'firmware' ? '4.8 GB / 5.2 GB' : `${unlockProgress}% complété`}
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: SUCCESS */}
        {unlockStage === 'success' && (
          <div className="max-w-md mx-auto text-center space-y-5 py-8">
            <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-500 flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {lang === 'fr' ? 'Appareil Déverrouillé avec Succès !' : 'Device Unlocked Successfully!'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {lang === 'fr' 
                  ? 'Le code d\'accès et les restrictions ont été entièrement effacés. Votre smartphone redémarre normalement.' 
                  : 'Passcode and lock constraints successfully wiped. Your phone is rebooting.'}
              </p>
            </div>

            <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-left text-xs space-y-1.5 font-mono">
              <div className="text-emerald-500 font-bold">Statut : Déverrouillé 100%</div>
              <div className="text-slate-500">Protection iCloud : Réinitialisée</div>
              <div className="text-slate-500">Système : Prêt pour une nouvelle configuration</div>
            </div>

            <button
              onClick={() => setUnlockStage('intro')}
              className="px-6 py-2.5 text-xs font-bold text-white bg-amber-500 rounded-xl hover:bg-amber-600 transition-colors shadow-sm"
            >
              {lang === 'fr' ? 'Terminé (Retour)' : 'Done (Back)'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
