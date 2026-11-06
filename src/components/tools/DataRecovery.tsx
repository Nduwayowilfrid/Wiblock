import React, { useState, useEffect } from 'react';
import { 
  Database, 
  ArrowLeft, 
  CheckSquare, 
  Square, 
  Search, 
  RotateCw, 
  Download, 
  Smartphone, 
  HardDrive, 
  Cloud, 
  Image as ImageIcon, 
  MessageSquare, 
  Users, 
  Calendar, 
  FileText, 
  Check, 
  Eye, 
  Filter,
  AlertTriangle,
  Play
} from 'lucide-react';
import { ConnectedDevice } from '../../types';
import { mockPhotos, mockContacts, mockMessages } from '../../data/mockData';

interface DataRecoveryProps {
  device: ConnectedDevice | null;
  onBack: () => void;
  lang: 'fr' | 'en';
}

export const DataRecovery: React.FC<DataRecoveryProps> = ({
  device,
  onBack,
  lang,
}) => {
  const [sourceMode, setSourceMode] = useState<'device' | 'itunes' | 'cloud'>('device');
  const [scanState, setScanState] = useState<'idle' | 'scanning' | 'complete'>('idle');
  const [scanProgress, setScanProgress] = useState(0);
  const [scannedFilesCount, setScannedFilesCount] = useState(0);

  // Selected categories to scan
  const [selectedTypes, setSelectedTypes] = useState({
    photos: true,
    messages: true,
    contacts: true,
    whatsapp: true,
    notes: true,
    callLogs: true,
  });

  // Filter in results: only deleted vs all
  const [onlyDeleted, setOnlyDeleted] = useState(true);
  const [activeCategory, setActiveCategory] = useState<'photos' | 'contacts' | 'messages'>('photos');

  // Selected item IDs for recovery
  const [selectedItemIds, setSelectedItemIds] = useState<Record<string, boolean>>({});
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  // Trigger interactive scan
  const startScan = () => {
    setScanState('scanning');
    setScanProgress(0);
    setScannedFilesCount(0);
  };

  useEffect(() => {
    if (scanState === 'scanning') {
      const interval = setInterval(() => {
        setScanProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setScanState('complete');
            // Select all by default
            setSelectedItemIds({
              'p-7': true,
              'p-8': true,
              'p-9': true,
              'c-6': true,
              'c-7': true,
              'm-4': true,
            });
            return 100;
          }
          const next = prev + 5;
          setScannedFilesCount(Math.round((next / 100) * 14200));
          return next;
        });
      }, 120);

      return () => clearInterval(interval);
    }
  }, [scanState]);

  // Recovered datasets
  const deletedPhotos = mockPhotos.filter(p => onlyDeleted ? p.isDeleted : true);
  const deletedContacts = mockContacts.filter(c => onlyDeleted ? c.isDeleted : true);
  const deletedMessages = mockMessages.filter(m => onlyDeleted ? m.isDeleted : true);

  const toggleSelect = (id: string) => {
    setSelectedItemIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const selectedCount = Object.values(selectedItemIds).filter(Boolean).length;

  const handleRecover = (destination: 'pc' | 'phone') => {
    showNotification(
      destination === 'pc'
        ? (lang === 'fr' ? `${selectedCount} éléments récupérés avec succès dans le dossier DrFone_Recovery/ !` : `${selectedCount} items saved to DrFone_Recovery/`)
        : (lang === 'fr' ? `${selectedCount} éléments restaurés directement sur ${device?.name || 'l\'appareil'} !` : `${selectedCount} items restored to device!`)
    );
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-50 dark:bg-slate-950">
      {/* Toast */}
      {notification && (
        <div className="absolute top-16 right-8 z-50 bg-emerald-600 text-white px-4 py-2.5 rounded-xl shadow-xl text-xs flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4" />
          <span>{notification}</span>
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
            <div className="w-8 h-8 rounded-lg bg-cyan-600 text-white flex items-center justify-center shadow-xs">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                {lang === 'fr' ? 'Récupération de Données Perdues & Supprimées' : 'Data Recovery Suite'}
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {device?.name || 'iPhone 15 Pro'} · {device?.model || 'A3106'}
              </p>
            </div>
          </div>
        </div>

        {scanState === 'complete' && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleRecover('pc')}
              disabled={selectedCount === 0}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{lang === 'fr' ? `Récupérer vers PC (${selectedCount})` : `Recover to PC (${selectedCount})`}</span>
            </button>
            <button
              onClick={() => handleRecover('phone')}
              disabled={selectedCount === 0}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 transition-colors shadow-xs"
            >
              <Smartphone className="w-3.5 h-3.5 text-emerald-500" />
              <span>{lang === 'fr' ? 'Restaurer sur l\'appareil' : 'Restore to Device'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      {scanState === 'idle' && (
        <div className="flex-1 overflow-y-auto p-8 max-w-4xl mx-auto w-full space-y-8">
          {/* Recovery Source Selector */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">
              {lang === 'fr' ? '1. Choisissez la source de récupération' : '1. Choose Recovery Source'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={() => setSourceMode('device')}
                className={`p-4 rounded-xl border text-left transition-all ${
                  sourceMode === 'device'
                    ? 'border-cyan-500 bg-cyan-50/50 dark:bg-cyan-950/30 text-cyan-900 dark:text-cyan-200 shadow-xs'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300'
                }`}
              >
                <Smartphone className="w-5 h-5 text-cyan-600 mb-2" />
                <div className="text-xs font-bold">{lang === 'fr' ? 'Depuis l\'appareil' : 'From Device'}</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  {lang === 'fr' ? 'Scan direct de la mémoire flash' : 'Direct flash storage deep scan'}
                </div>
              </button>

              <button
                onClick={() => setSourceMode('itunes')}
                className={`p-4 rounded-xl border text-left transition-all ${
                  sourceMode === 'itunes'
                    ? 'border-cyan-500 bg-cyan-50/50 dark:bg-cyan-950/30 text-cyan-900 dark:text-cyan-200 shadow-xs'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300'
                }`}
              >
                <HardDrive className="w-5 h-5 text-blue-600 mb-2" />
                <div className="text-xs font-bold">{lang === 'fr' ? 'Sauvegarde iTunes' : 'iTunes Backup'}</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  {lang === 'fr' ? 'Extraire depuis un backup PC' : 'Extract from local computer backup'}
                </div>
              </button>

              <button
                onClick={() => setSourceMode('cloud')}
                className={`p-4 rounded-xl border text-left transition-all ${
                  sourceMode === 'cloud'
                    ? 'border-cyan-500 bg-cyan-50/50 dark:bg-cyan-950/30 text-cyan-900 dark:text-cyan-200 shadow-xs'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300'
                }`}
              >
                <Cloud className="w-5 h-5 text-indigo-600 mb-2" />
                <div className="text-xs font-bold">{lang === 'fr' ? 'Sauvegarde Cloud' : 'Cloud Backup'}</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  {lang === 'fr' ? 'Télécharger depuis iCloud/Google' : 'Download from iCloud / Google Drive'}
                </div>
              </button>
            </div>
          </div>

          {/* Categories to Scan */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {lang === 'fr' ? '2. Sélectionnez les types de fichiers à analyser' : '2. Select File Types to Scan'}
              </h3>
              <button
                onClick={() => {
                  const allSelected = Object.values(selectedTypes).every(Boolean);
                  setSelectedTypes({
                    photos: !allSelected,
                    messages: !allSelected,
                    contacts: !allSelected,
                    whatsapp: !allSelected,
                    notes: !allSelected,
                    callLogs: !allSelected,
                  });
                }}
                className="text-xs text-cyan-600 dark:text-cyan-400 hover:underline font-medium"
              >
                {lang === 'fr' ? 'Tout cocher / décocher' : 'Toggle all'}
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { key: 'photos', label: 'Photos & Vidéos', icon: ImageIcon },
                { key: 'messages', label: 'Messages & SMS', icon: MessageSquare },
                { key: 'contacts', label: 'Contacts & Numéros', icon: Users },
                { key: 'whatsapp', label: 'WhatsApp & Médias', icon: MessageSquare },
                { key: 'notes', label: 'Notes & Mémos vocaux', icon: FileText },
                { key: 'callLogs', label: 'Journal d\'appels', icon: Calendar },
              ].map(({ key, label, icon: Icon }) => {
                const isChecked = selectedTypes[key as keyof typeof selectedTypes];
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSelectedTypes(prev => ({ ...prev, [key]: !isChecked }))}
                    className={`flex items-center justify-between p-3.5 rounded-xl border transition-colors text-left ${
                      isChecked
                        ? 'border-cyan-400 dark:border-cyan-700 bg-white dark:bg-slate-900'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4 text-cyan-600" />
                      <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">{label}</span>
                    </div>
                    {isChecked ? (
                      <CheckSquare className="w-4 h-4 text-cyan-600" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-400" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Start Scan Button */}
          <div className="text-center pt-4">
            <button
              onClick={startScan}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-sm shadow-md shadow-cyan-500/20 hover:shadow-cyan-500/30 transition-all active:scale-98"
            >
              {lang === 'fr' ? 'Démarrer l\'Analyse Approfondie' : 'Start Deep Scan'}
            </button>
            <p className="text-[11px] text-slate-400 mt-2">
              {lang === 'fr' 
                ? 'Algorithme breveté de reconstruction de secteurs Dr.Fone (aucun risque de surécriture)' 
                : 'Dr.Fone patented sector reconstruction algorithm (100% read-only safe)'}
            </p>
          </div>
        </div>
      )}

      {/* SCANNING STATE ANIMATION */}
      {scanState === 'scanning' && (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-6">
          <div className="relative w-28 h-28 flex items-center justify-center">
            {/* Outer spinning ring */}
            <div className="absolute inset-0 rounded-full border-4 border-cyan-500/20 border-t-cyan-500 animate-spin" />
            <div className="w-20 h-20 rounded-full bg-cyan-50 dark:bg-cyan-950/60 flex items-center justify-center text-cyan-600">
              <Database className="w-8 h-8 animate-pulse" />
            </div>
          </div>

          <div className="space-y-1.5 max-w-md">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {lang === 'fr' ? 'Analyse approfondie de la mémoire en cours...' : 'Deep Scanning Device Storage...'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {lang === 'fr' ? 'Ne débranchez pas le câble USB pendant l\'analyse des secteurs raw.' : 'Do not disconnect the USB cable while reading raw storage sectors.'}
            </p>
          </div>

          {/* Progress bar */}
          <div className="w-full max-w-md space-y-2">
            <div className="w-full h-2.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 transition-all duration-150"
                style={{ width: `${scanProgress}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-xs font-mono text-slate-500">
              <span>{scanProgress}% terminé</span>
              <span>{scannedFilesCount.toLocaleString()} fichiers examinés</span>
            </div>
          </div>

          <button
            onClick={() => setScanState('complete')}
            className="px-4 py-1.5 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 border border-slate-300 dark:border-slate-700 rounded-lg"
          >
            {lang === 'fr' ? 'Passer directement aux résultats' : 'Skip to results'}
          </button>
        </div>
      )}

      {/* SCAN RESULTS EXPLORER */}
      {scanState === 'complete' && (
        <div className="flex-1 flex overflow-hidden">
          {/* Left Categories Tree */}
          <div className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-3 space-y-4 shrink-0 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2">
                {lang === 'fr' ? 'Données retrouvées' : 'Found Data'}
              </div>

              {/* Toggle Only Deleted */}
              <div className="p-2 bg-slate-50 dark:bg-slate-800/60 rounded-xl flex items-center justify-between text-xs">
                <span className="text-slate-700 dark:text-slate-300 font-medium">
                  {lang === 'fr' ? 'Supprimés seuls' : 'Deleted only'}
                </span>
                <input
                  type="checkbox"
                  checked={onlyDeleted}
                  onChange={(e) => setOnlyDeleted(e.target.checked)}
                  className="rounded text-cyan-600 focus:ring-cyan-500 w-4 h-4 cursor-pointer"
                />
              </div>

              {/* Categories */}
              <div className="space-y-1">
                <button
                  onClick={() => setActiveCategory('photos')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors ${
                    activeCategory === 'photos'
                      ? 'bg-cyan-50 dark:bg-cyan-950/70 text-cyan-700 dark:text-cyan-300 font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-cyan-500" />
                    <span>Photos & Vidéos</span>
                  </div>
                  <span className="font-mono text-rose-500 font-semibold text-[11px]">{deletedPhotos.length}</span>
                </button>

                <button
                  onClick={() => setActiveCategory('contacts')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors ${
                    activeCategory === 'contacts'
                      ? 'bg-cyan-50 dark:bg-cyan-950/70 text-cyan-700 dark:text-cyan-300 font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-indigo-500" />
                    <span>Contacts</span>
                  </div>
                  <span className="font-mono text-rose-500 font-semibold text-[11px]">{deletedContacts.length}</span>
                </button>

                <button
                  onClick={() => setActiveCategory('messages')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors ${
                    activeCategory === 'messages'
                      ? 'bg-cyan-50 dark:bg-cyan-950/70 text-cyan-700 dark:text-cyan-300 font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-emerald-500" />
                    <span>Messages & SMS</span>
                  </div>
                  <span className="font-mono text-rose-500 font-semibold text-[11px]">{deletedMessages.length}</span>
                </button>
              </div>
            </div>

            <button
              onClick={() => setScanState('idle')}
              className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 py-1"
            >
              ← Nouvelle analyse
            </button>
          </div>

          {/* Right Explorer Grid */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <div className="flex items-center justify-between text-xs pb-3 border-b border-slate-200 dark:border-slate-800">
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {activeCategory === 'photos' && `${deletedPhotos.length} éléments trouvés`}
                {activeCategory === 'contacts' && `${deletedContacts.length} contacts trouvés`}
                {activeCategory === 'messages' && `${deletedMessages.length} conversations trouvées`}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const newSelected = { ...selectedItemIds };
                    if (activeCategory === 'photos') {
                      deletedPhotos.forEach(p => newSelected[p.id] = true);
                    } else if (activeCategory === 'contacts') {
                      deletedContacts.forEach(c => newSelected[c.id] = true);
                    } else {
                      deletedMessages.forEach(m => newSelected[m.id] = true);
                    }
                    setSelectedItemIds(newSelected);
                  }}
                  className="text-xs text-cyan-600 hover:underline font-medium"
                >
                  Tout sélectionner
                </button>
              </div>
            </div>

            {/* Category: Photos */}
            {activeCategory === 'photos' && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {deletedPhotos.map((photo) => {
                  const isChecked = !!selectedItemIds[photo.id];
                  return (
                    <div
                      key={photo.id}
                      onClick={() => toggleSelect(photo.id)}
                      className={`relative rounded-xl overflow-hidden border cursor-pointer transition-all ${
                        isChecked 
                          ? 'border-cyan-500 ring-2 ring-cyan-500/30' 
                          : 'border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      <div className="aspect-square bg-slate-900">
                        <img
                          src={photo.url}
                          alt={photo.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Select checkbox badge */}
                      <div className="absolute top-2 left-2 w-5 h-5 rounded-md bg-white/90 dark:bg-black/90 flex items-center justify-center shadow-xs">
                        {isChecked ? (
                          <CheckSquare className="w-4 h-4 text-cyan-600" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-400" />
                        )}
                      </div>

                      {photo.isDeleted && (
                        <div className="absolute top-2 right-2 text-[9px] font-bold px-1.5 py-0.5 rounded bg-rose-500 text-white shadow-xs">
                          Supprimé
                        </div>
                      )}

                      <div className="p-2 bg-white dark:bg-slate-900 text-xs">
                        <div className="font-semibold truncate text-slate-900 dark:text-white">{photo.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{photo.size}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Category: Contacts */}
            {activeCategory === 'contacts' && (
              <div className="space-y-2">
                {deletedContacts.map((contact) => {
                  const isChecked = !!selectedItemIds[contact.id];
                  return (
                    <div
                      key={contact.id}
                      onClick={() => toggleSelect(contact.id)}
                      className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                        isChecked
                          ? 'border-cyan-500 bg-cyan-50/30 dark:bg-cyan-950/20'
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 flex items-center justify-center">
                          {isChecked ? <CheckSquare className="w-4 h-4 text-cyan-600" /> : <Square className="w-4 h-4 text-slate-400" />}
                        </div>
                        <div className={`w-8 h-8 rounded-full ${contact.avatarColor} text-white flex items-center justify-center font-bold text-xs`}>
                          {contact.name.charAt(0)}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <span>{contact.name}</span>
                            {contact.isDeleted && (
                              <span className="text-[9px] px-1.5 py-0.2 rounded bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                                Récupérable
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono">{contact.phone} · {contact.email}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Category: Messages */}
            {activeCategory === 'messages' && (
              <div className="space-y-2">
                {deletedMessages.map((msg) => {
                  const isChecked = !!selectedItemIds[msg.id];
                  return (
                    <div
                      key={msg.id}
                      onClick={() => toggleSelect(msg.id)}
                      className={`flex items-start justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                        isChecked
                          ? 'border-cyan-500 bg-cyan-50/30 dark:bg-cyan-950/20'
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 flex items-center justify-center mt-0.5">
                          {isChecked ? <CheckSquare className="w-4 h-4 text-cyan-600" /> : <Square className="w-4 h-4 text-slate-400" />}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <span>{msg.sender}</span>
                            <span className="text-[10px] text-slate-400 font-mono">{msg.senderPhone}</span>
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                              Supprimé
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                            {msg.preview}
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">{msg.date}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
