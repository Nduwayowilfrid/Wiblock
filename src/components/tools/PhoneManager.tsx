import React, { useState } from 'react';
import { 
  FolderSync, 
  Image as ImageIcon, 
  Music, 
  Users, 
  MessageSquare, 
  LayoutGrid, 
  FolderTree, 
  Upload, 
  Download, 
  Trash2, 
  Plus, 
  Search, 
  Play, 
  Pause, 
  Check, 
  X, 
  ArrowLeft, 
  FileText, 
  Send, 
  Eye, 
  BellRing,
  HardDrive
} from 'lucide-react';
import { ConnectedDevice, MediaPhoto, MediaAudio, ContactItem, MessageItem, AppItem } from '../../types';
import { pickRealDeviceFolder } from '../../services/realFileService';
import { mockPhotos, mockAudios, mockContacts, mockMessages, mockApps } from '../../data/mockData';

interface PhoneManagerProps {
  device: ConnectedDevice | null;
  onBack: () => void;
  lang: 'fr' | 'en';
  onNavigateToRingtone?: () => void;
}

export const PhoneManager: React.FC<PhoneManagerProps> = ({
  device,
  onBack,
  lang,
  onNavigateToRingtone,
}) => {
  const [activeTab, setActiveTab] = useState<'photos' | 'music' | 'contacts' | 'messages' | 'apps' | 'files'>('photos');
  
  // Photos state
  const [photosList, setPhotosList] = useState<MediaPhoto[]>(mockPhotos.filter(p => !p.isDeleted));
  const [selectedPhoto, setSelectedPhoto] = useState<MediaPhoto | null>(null);
  const [activeAlbum, setActiveAlbum] = useState<string>('Tous');
  
  // Audio state
  const [audiosList, setAudiosList] = useState<MediaAudio[]>(mockAudios);
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);

  // Contacts state
  const [contactsList, setContactsList] = useState<ContactItem[]>(mockContacts.filter(c => !c.isDeleted));
  const [contactSearch, setContactSearch] = useState('');
  const [isAddingContact, setIsAddingContact] = useState(false);
  const [newContactName, setNewContactName] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');
  const [newContactEmail, setNewContactEmail] = useState('');
  const [selectedContact, setSelectedContact] = useState<ContactItem | null>(contactsList[0] || null);

  // Messages state
  const [messagesList, setMessagesList] = useState<MessageItem[]>(mockMessages.filter(m => !m.isDeleted));
  const [activeThread, setActiveThread] = useState<MessageItem>(messagesList[0]);
  const [replyText, setReplyText] = useState('');

  // Apps state
  const [appsList, setAppsList] = useState<AppItem[]>(mockApps);

  // Status Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Handle Photo Upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      const file = files[0];
      const newPhoto: MediaPhoto = {
        id: `p-uploaded-${Date.now()}`,
        name: file.name,
        album: 'Pellicule',
        date: new Date().toISOString().replace('T', ' ').slice(0, 16),
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        url: URL.createObjectURL(file),
        isDeleted: false,
      };
      setPhotosList([newPhoto, ...photosList]);
      showToast(lang === 'fr' ? `Photo "${file.name}" importée avec succès sur le téléphone !` : `Photo "${file.name}" imported to device!`);
    }
  };

  // Handle Delete Photo
  const handleDeletePhoto = (id: string) => {
    setPhotosList(photosList.filter(p => p.id !== id));
    if (selectedPhoto?.id === id) setSelectedPhoto(null);
    showToast(lang === 'fr' ? 'Photo supprimée du téléphone.' : 'Photo deleted from device.');
  };

  // Handle Add Contact
  const handleCreateContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContactName.trim()) return;
    const newC: ContactItem = {
      id: `c-custom-${Date.now()}`,
      name: newContactName,
      phone: newContactPhone || '+33 6 00 00 00 00',
      email: newContactEmail || 'contact@example.com',
      avatarColor: 'bg-indigo-500',
      isDeleted: false,
    };
    setContactsList([newC, ...contactsList]);
    setSelectedContact(newC);
    setIsAddingContact(false);
    setNewContactName('');
    setNewContactPhone('');
    setNewContactEmail('');
    showToast(lang === 'fr' ? `Contact "${newC.name}" ajouté avec succès !` : `Contact "${newC.name}" created!`);
  };

  // Handle Send Message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !activeThread) return;
    const newMsg = {
      id: `m-reply-${Date.now()}`,
      text: replyText,
      isFromMe: true,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    const updatedThread = {
      ...activeThread,
      messages: [...activeThread.messages, newMsg],
      preview: replyText,
      date: 'À l\'instant',
    };
    setActiveThread(updatedThread);
    setMessagesList(messagesList.map(m => m.id === updatedThread.id ? updatedThread : m));
    setReplyText('');
  };

  const filteredContacts = contactsList.filter(c => 
    c.name.toLowerCase().includes(contactSearch.toLowerCase()) || 
    c.phone.includes(contactSearch)
  );

  const filteredPhotos = activeAlbum === 'Tous' 
    ? photosList 
    : photosList.filter(p => p.album === activeAlbum);

  const handleScanRealDirectory = async () => {
    try {
      showToast('Sélectionnez le dossier de votre téléphone ou carte SD...');
      const res = await pickRealDeviceFolder();
      if (res) {
        if (res.photos.length > 0) {
          setPhotosList([...res.photos, ...photosList]);
        }
        if (res.contacts.length > 0) {
          setContactsList([...res.contacts, ...contactsList]);
        }
        showToast(`${res.photos.length} photos et ${res.contacts.length} contacts chargés depuis "${res.folderName}" !`);
      }
    } catch (err: any) {
      showToast('Erreur : ' + err.message);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-50 dark:bg-slate-950">
      {/* Toast alert */}
      {toastMessage && (
        <div className="absolute top-16 right-8 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-lg border border-slate-700 text-xs flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Bar for Phone Manager */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
            title={lang === 'fr' ? 'Retour à la boîte à outils' : 'Back to Toolkit'}
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <FolderSync className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                {lang === 'fr' ? 'Gestionnaire de Fichiers & Médias' : 'File & Media Manager'}
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {device?.name || 'iPhone 15 Pro'} · {device?.model || 'A3106'}
              </p>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleScanRealDirectory}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-colors"
            title="Scanner le dossier réel de votre téléphone (DCIM, Sauvegardes, Stockage)"
          >
            <HardDrive className="w-3.5 h-3.5" />
            <span>{lang === 'fr' ? 'Scanner dossier réel' : 'Scan Real Storage'}</span>
          </button>

          {activeTab === 'photos' && (
            <label className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors cursor-pointer shadow-xs">
              <Upload className="w-3.5 h-3.5" />
              <span>{lang === 'fr' ? 'Importer des photos' : 'Import Photos'}</span>
              <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
            </label>
          )}

          <button
            onClick={() => showToast(lang === 'fr' ? 'Exportation vers le dossier Téléchargements en cours...' : 'Exporting to PC Downloads folder...')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-blue-500" />
            <span>{lang === 'fr' ? 'Exporter vers PC' : 'Export to PC'}</span>
          </button>
        </div>
      </div>

      {/* Main split: Tab selector & Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sub-Sidebar Tabs */}
        <div className="w-56 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between p-3 shrink-0">
          <div className="space-y-1">
            <button
              onClick={() => setActiveTab('photos')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-colors ${
                activeTab === 'photos'
                  ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <ImageIcon className="w-4 h-4 text-blue-500" />
                <span>{lang === 'fr' ? 'Photos' : 'Photos'}</span>
              </div>
              <span className="font-mono text-[11px] text-slate-400">{photosList.length}</span>
            </button>

            <button
              onClick={() => setActiveTab('music')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-colors ${
                activeTab === 'music'
                  ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Music className="w-4 h-4 text-purple-500" />
                <span>{lang === 'fr' ? 'Musique & Audio' : 'Music & Audio'}</span>
              </div>
              <span className="font-mono text-[11px] text-slate-400">{audiosList.length}</span>
            </button>

            <button
              onClick={() => setActiveTab('contacts')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-colors ${
                activeTab === 'contacts'
                  ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Users className="w-4 h-4 text-indigo-500" />
                <span>{lang === 'fr' ? 'Contacts' : 'Contacts'}</span>
              </div>
              <span className="font-mono text-[11px] text-slate-400">{contactsList.length}</span>
            </button>

            <button
              onClick={() => setActiveTab('messages')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-colors ${
                activeTab === 'messages'
                  ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <MessageSquare className="w-4 h-4 text-emerald-500" />
                <span>{lang === 'fr' ? 'Messages & SMS' : 'Messages'}</span>
              </div>
              <span className="font-mono text-[11px] text-slate-400">{messagesList.length}</span>
            </button>

            <button
              onClick={() => setActiveTab('apps')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-colors ${
                activeTab === 'apps'
                  ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <LayoutGrid className="w-4 h-4 text-amber-500" />
                <span>{lang === 'fr' ? 'Applications' : 'Apps'}</span>
              </div>
              <span className="font-mono text-[11px] text-slate-400">{appsList.length}</span>
            </button>

            <button
              onClick={() => setActiveTab('files')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-colors ${
                activeTab === 'files'
                  ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <FolderTree className="w-4 h-4 text-cyan-500" />
                <span>{lang === 'fr' ? 'Explorateur racine' : 'Root Explorer'}</span>
              </div>
              <span className="font-mono text-[11px] text-slate-400">/var</span>
            </button>
          </div>

          {/* Quick Ringtone Maker prompt */}
          {onNavigateToRingtone && (
            <div className="p-3 rounded-xl bg-gradient-to-br from-pink-500/10 to-rose-500/10 border border-pink-200/60 dark:border-pink-900/40 text-center">
              <BellRing className="w-4 h-4 text-pink-600 dark:text-pink-400 mx-auto mb-1.5" />
              <div className="text-[11px] font-semibold text-slate-800 dark:text-slate-200">
                {lang === 'fr' ? 'Créateur de Sonnerie' : 'Ringtone Maker'}
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                {lang === 'fr' ? 'Découpez vos musiques' : 'Custom ringtones'}
              </p>
              <button
                onClick={onNavigateToRingtone}
                className="mt-2 text-[10px] font-semibold text-pink-600 dark:text-pink-400 hover:underline"
              >
                {lang === 'fr' ? 'Lancer l\'outil' : 'Launch tool'} →
              </button>
            </div>
          )}
        </div>

        {/* Tab Content Panes */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* TAB 1: PHOTOS */}
          {activeTab === 'photos' && (
            <div className="space-y-5">
              {/* Albums Bar */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
                {['Tous', 'Pellicule', 'Favoris', 'Captures d\'écran', 'WhatsApp'].map((album) => (
                  <button
                    key={album}
                    onClick={() => setActiveAlbum(album)}
                    className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                      activeAlbum === album
                        ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold'
                        : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-100'
                    }`}
                  >
                    {album}
                  </button>
                ))}
              </div>

              {/* Photos Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
                {filteredPhotos.map((photo) => (
                  <div
                    key={photo.id}
                    className="group relative rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-800 aspect-square border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-all"
                  >
                    <img
                      src={photo.url}
                      alt={photo.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Overlay controls on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2.5 text-white">
                      <div className="flex justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedPhoto(photo)}
                          className="p-1.5 rounded-lg bg-black/50 hover:bg-black/80 text-white backdrop-blur-xs transition-colors"
                          title={lang === 'fr' ? 'Aperçu' : 'Preview'}
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeletePhoto(photo.id)}
                          className="p-1.5 rounded-lg bg-rose-600/80 hover:bg-rose-600 text-white backdrop-blur-xs transition-colors"
                          title={lang === 'fr' ? 'Supprimer' : 'Delete'}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div>
                        <div className="text-[11px] font-semibold truncate">{photo.name}</div>
                        <div className="text-[10px] text-slate-300 flex items-center justify-between">
                          <span>{photo.size}</span>
                          <span>{photo.date.split(' ')[0]}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: MUSIC */}
          {activeTab === 'music' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
              <div className="px-5 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {lang === 'fr' ? 'Titres audio synchronisés' : 'Synced Audio Tracks'} ({audiosList.length})
                </span>
                <span className="text-xs text-slate-400">Total: ~32 MB</span>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {audiosList.map((audio) => {
                  const isPlaying = playingAudioId === audio.id;
                  return (
                    <div
                      key={audio.id}
                      className="flex items-center justify-between px-5 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setPlayingAudioId(isPlaying ? null : audio.id)}
                          className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                            isPlaying
                              ? 'bg-purple-600 text-white shadow-xs'
                              : 'bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 hover:bg-purple-100'
                          }`}
                        >
                          {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                        </button>
                        <div>
                          <div className="text-xs font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                            <span>{audio.title}</span>
                            {audio.isRingtone && (
                              <span className="text-[9px] px-1.5 py-0.2 rounded bg-pink-100 dark:bg-pink-950 text-pink-700 dark:text-pink-300 font-medium">
                                Sonnerie
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400">
                            {audio.artist} · {audio.album}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-xs font-mono text-slate-500">
                        <span>{audio.size}</span>
                        <span>{audio.duration}</span>
                        <button
                          onClick={() => showToast(lang === 'fr' ? `"${audio.title}" exporté vers PC.` : `"${audio.title}" exported.`)}
                          className="p-1.5 text-slate-400 hover:text-blue-600 transition-colors"
                          title="Exporter"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: CONTACTS */}
          {activeTab === 'contacts' && (
            <div className="flex flex-col lg:flex-row gap-5 h-full">
              {/* Contacts Directory */}
              <div className="w-full lg:w-72 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex flex-col shrink-0 shadow-xs">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                    {lang === 'fr' ? 'Carnet d\'adresses' : 'Address Book'}
                  </span>
                  <button
                    onClick={() => setIsAddingContact(true)}
                    className="p-1 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 hover:bg-blue-100 transition-colors"
                    title={lang === 'fr' ? 'Nouveau contact' : 'New Contact'}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Search */}
                <div className="relative mb-3">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    value={contactSearch}
                    onChange={(e) => setContactSearch(e.target.value)}
                    placeholder={lang === 'fr' ? 'Rechercher un contact...' : 'Search contact...'}
                    className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                {/* Contact List */}
                <div className="flex-1 overflow-y-auto space-y-1">
                  {filteredContacts.map((c) => {
                    const isSelected = selectedContact?.id === c.id;
                    return (
                      <button
                        key={c.id}
                        onClick={() => setSelectedContact(c)}
                        className={`w-full flex items-center gap-3 p-2 rounded-xl text-left transition-colors ${
                          isSelected
                            ? 'bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                            : 'hover:bg-slate-100 dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-full ${c.avatarColor} text-white flex items-center justify-center font-bold text-xs shrink-0`}>
                          {c.name.charAt(0)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-semibold truncate">{c.name}</div>
                          <div className="text-[11px] text-slate-400 font-mono truncate">{c.phone}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Contact Detail View / Add Contact Form */}
              <div className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
                {isAddingContact ? (
                  <form onSubmit={handleCreateContact} className="space-y-4 max-w-md">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      {lang === 'fr' ? 'Créer un nouveau contact' : 'Create New Contact'}
                    </h3>

                    <div>
                      <label className="text-xs text-slate-500 block mb-1">Nom complet</label>
                      <input
                        type="text"
                        required
                        value={newContactName}
                        onChange={(e) => setNewContactName(e.target.value)}
                        placeholder="Ex: Jean Martin"
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-1 focus:ring-blue-500 outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-slate-500 block mb-1">Téléphone mobile</label>
                      <input
                        type="tel"
                        value={newContactPhone}
                        onChange={(e) => setNewContactPhone(e.target.value)}
                        placeholder="+33 6 12 34 56 78"
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-1 focus:ring-blue-500 outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-slate-500 block mb-1">Adresse e-mail</label>
                      <input
                        type="email"
                        value={newContactEmail}
                        onChange={(e) => setNewContactEmail(e.target.value)}
                        placeholder="jean.martin@email.com"
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-1 focus:ring-blue-500 outline-hidden"
                      />
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <button
                        type="submit"
                        className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                      >
                        Enregistrer
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsAddingContact(false)}
                        className="px-4 py-2 text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-100 rounded-lg"
                      >
                        Annuler
                      </button>
                    </div>
                  </form>
                ) : selectedContact ? (
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className={`w-16 h-16 rounded-full ${selectedContact.avatarColor} text-white flex items-center justify-center font-bold text-2xl shadow-md`}>
                        {selectedContact.name.charAt(0)}
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                          {selectedContact.name}
                        </h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {selectedContact.company || 'Contact personnel'}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3 max-w-sm pt-4 border-t border-slate-100 dark:border-slate-800">
                      <div>
                        <span className="text-[11px] text-slate-400 uppercase">Numéro mobile</span>
                        <div className="text-xs font-semibold font-mono text-slate-800 dark:text-slate-200 mt-0.5">
                          {selectedContact.phone}
                        </div>
                      </div>

                      <div>
                        <span className="text-[11px] text-slate-400 uppercase">Email</span>
                        <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                          {selectedContact.email}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-4">
                      <button
                        onClick={() => showToast(lang === 'fr' ? 'Fiche vCard exportée sur votre ordinateur.' : 'vCard exported.')}
                        className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        Exporter vCard (.vcf)
                      </button>
                      <button
                        onClick={() => {
                          setContactsList(contactsList.filter(c => c.id !== selectedContact.id));
                          setSelectedContact(contactsList[1] || null);
                          showToast('Contact supprimé.');
                        }}
                        className="px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
                      >
                        Supprimer le contact
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-slate-400 text-xs">
                    Sélectionnez un contact pour afficher ses détails
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: MESSAGES */}
          {activeTab === 'messages' && (
            <div className="flex flex-col lg:flex-row gap-5 h-full">
              {/* Message Threads */}
              <div className="w-full lg:w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 flex flex-col shrink-0 shadow-xs">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-2 px-1">
                  Conversations ({messagesList.length})
                </span>

                <div className="flex-1 overflow-y-auto space-y-1">
                  {messagesList.map((m) => {
                    const isSelected = activeThread.id === m.id;
                    return (
                      <button
                        key={m.id}
                        onClick={() => setActiveThread(m)}
                        className={`w-full flex items-start gap-2.5 p-2.5 rounded-xl text-left transition-colors ${
                          isSelected
                            ? 'bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                            : 'hover:bg-slate-100 dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-full ${m.avatarColor} text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5`}>
                          {m.sender.charAt(0)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold truncate">{m.sender}</span>
                            <span className="text-[10px] text-slate-400 font-mono">{m.date}</span>
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                            {m.preview}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Chat Canvas */}
              <div className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col justify-between overflow-hidden shadow-xs">
                {/* Chat Header */}
                <div className="px-5 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                      {activeThread.sender}
                    </h3>
                    <p className="text-[10px] text-slate-400 font-mono">
                      {activeThread.senderPhone}
                    </p>
                  </div>
                  <button
                    onClick={() => showToast('Historique de conversation exporté en PDF.')}
                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Exporter en PDF
                  </button>
                </div>

                {/* Messages feed */}
                <div className="flex-1 p-5 overflow-y-auto space-y-3 bg-slate-50/50 dark:bg-slate-950/40">
                  {activeThread.messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${msg.isFromMe ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-md px-3.5 py-2 rounded-2xl text-xs leading-relaxed ${
                          msg.isFromMe
                            ? 'bg-blue-600 text-white rounded-br-xs'
                            : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-bl-xs'
                        }`}
                      >
                        {msg.text}
                      </div>
                      <span className="text-[9px] font-mono text-slate-400 mt-1 px-1">
                        {msg.time}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Chat reply box */}
                <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                  <input
                    type="text"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder={lang === 'fr' ? 'Écrire un SMS depuis l\'ordinateur...' : 'Type SMS from desktop...'}
                    className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    className="p-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-xs"
                    title="Envoyer"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* TAB 5: APPS */}
          {activeTab === 'apps' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
              <div className="px-5 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {lang === 'fr' ? 'Applications installées sur le mobile' : 'Installed Applications'} ({appsList.length})
                </span>
                <button
                  onClick={() => showToast('Sélectionnez un fichier .IPA ou .APK pour installer')}
                  className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  + Installer une application (.ipa / .apk)
                </button>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {appsList.map((app) => (
                  <div
                    key={app.id}
                    className="flex items-center justify-between px-5 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl ${app.iconBg} text-white flex items-center justify-center font-bold text-xs shadow-xs`}>
                        {app.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-slate-900 dark:text-white">
                          {app.name}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">
                          v{app.version} · {app.category}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs">
                      <span className="font-mono text-slate-500">{app.size}</span>
                      <button
                        onClick={() => {
                          setAppsList(appsList.filter(a => a.id !== app.id));
                          showToast(`"${app.name}" a été désinstallé de l'appareil.`);
                        }}
                        className="px-2.5 py-1 text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors font-medium"
                      >
                        Désinstaller
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: FILES EXPLORER */}
          {activeTab === 'files' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between text-xs font-mono text-slate-500 pb-3 border-b border-slate-100 dark:border-slate-800">
                <span>/private/var/mobile/Media</span>
                <span>Permissions: rw-r--r-- (Mobile)</span>
              </div>

              <div className="space-y-2 text-xs">
                {[
                  { name: 'DCIM (Photos & Vidéos caméra)', type: 'dir', size: '78.7 GB' },
                  { name: 'Downloads (Fichiers téléchargés)', type: 'dir', size: '1.4 GB' },
                  { name: 'Application Data (Containers)', type: 'dir', size: '18.4 GB' },
                  { name: 'Books & Documents', type: 'dir', size: '420 MB' },
                  { name: 'iTunes_Control (Musique & Podcasts)', type: 'dir', size: '5.8 GB' },
                  { name: 'SystemLogs_diagnostics.log', type: 'file', size: '2.4 MB' },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      {item.type === 'dir' ? (
                        <FolderTree className="w-4 h-4 text-blue-500" />
                      ) : (
                        <FileText className="w-4 h-4 text-slate-400" />
                      )}
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{item.name}</span>
                    </div>
                    <span className="font-mono text-slate-400">{item.size}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Photo Preview Modal */}
      {selectedPhoto && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div 
            className="max-w-2xl w-full bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-800"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-video bg-black flex items-center justify-center">
              <img
                src={selectedPhoto.url}
                alt={selectedPhoto.name}
                referrerPolicy="no-referrer"
                className="max-h-full max-w-full object-contain"
              />
            </div>
            <div className="p-4 flex items-center justify-between text-white">
              <div>
                <div className="text-xs font-bold">{selectedPhoto.name}</div>
                <div className="text-[11px] text-slate-400">{selectedPhoto.album} · {selectedPhoto.size} · {selectedPhoto.date}</div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    showToast('Photo téléchargée sur votre PC.');
                    setSelectedPhoto(null);
                  }}
                  className="px-3 py-1.5 text-xs font-semibold bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  Télécharger sur PC
                </button>
                <button
                  onClick={() => setSelectedPhoto(null)}
                  className="p-1.5 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
