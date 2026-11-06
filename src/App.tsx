import React, { useState, useEffect } from 'react';
import { ConnectedDevice, ToolId, MediaPhoto, ContactItem } from './types';
import { mockDevices, mockPhotos, mockContacts } from './data/mockData';
import { Header } from './components/Header';
import { HomeToolkit } from './components/HomeToolkit';
import { PhoneManager } from './components/tools/PhoneManager';
import { DataRecovery } from './components/tools/DataRecovery';
import { PhoneTransfer } from './components/tools/PhoneTransfer';
import { ScreenUnlock } from './components/tools/ScreenUnlock';
import { SystemRepair } from './components/tools/SystemRepair';
import { WhatsAppTransfer } from './components/tools/WhatsAppTransfer';
import { PhoneBackup } from './components/tools/PhoneBackup';
import { DataEraser } from './components/tools/DataEraser';
import { VirtualLocation } from './components/tools/VirtualLocation';
import { ScreenMirror } from './components/tools/ScreenMirror';
import { DeviceInfoModal } from './components/tools/DeviceInfoModal';
import { RingtoneMaker } from './components/tools/RingtoneMaker';
import { pairRealUsbDevice } from './services/realDeviceService';
import { pickRealDeviceFolder } from './services/realFileService';
import { Check, AlertCircle } from 'lucide-react';

export default function App() {
  const [devices, setDevices] = useState<ConnectedDevice[]>(mockDevices);
  const [selectedDevice, setSelectedDevice] = useState<ConnectedDevice | null>(mockDevices[0]);
  const [currentTool, setCurrentTool] = useState<ToolId>('home');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [lang, setLang] = useState<'fr' | 'en'>('fr');
  const [isReportOpen, setIsReportOpen] = useState(false);

  // Real data state imported from real phone directory
  const [realPhotos, setRealPhotos] = useState<MediaPhoto[]>([]);
  const [realContacts, setRealContacts] = useState<ContactItem[]>([]);
  const [globalToast, setGlobalToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showGlobalToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setGlobalToast({ message, type });
    setTimeout(() => setGlobalToast(null), 4000);
  };

  // Sync dark mode class on <html>
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleConnectSimulatedDevice = () => {
    setSelectedDevice(mockDevices[0]);
  };

  // Connect Real USB Phone using WebUSB API
  const handlePairRealUsb = async () => {
    try {
      showGlobalToast('Ouverture du sélecteur USB natif du navigateur...', 'info');
      const realDevice = await pairRealUsbDevice();
      if (realDevice) {
        setDevices([realDevice, ...devices]);
        setSelectedDevice(realDevice);
        showGlobalToast(`Appareil physique détecté : ${realDevice.name} (${realDevice.model}) !`, 'success');
      }
    } catch (err: any) {
      showGlobalToast(err.message || 'Impossible de se connecter au périphérique USB.', 'error');
    }
  };

  // Open Real Phone Folder (DCIM, MTP storage or backup)
  const handleOpenRealFolder = async () => {
    try {
      showGlobalToast('Sélectionnez le dossier de votre téléphone ou sauvegarde...', 'info');
      const result = await pickRealDeviceFolder();
      if (result) {
        if (result.photos.length > 0) setRealPhotos(result.photos);
        if (result.contacts.length > 0) setRealContacts(result.contacts);

        // Update selected device with real storage info
        const updatedDevice: ConnectedDevice = {
          ...(selectedDevice || mockDevices[0]),
          name: `Dossier: ${result.folderName}`,
          photoCount: result.photos.length,
          contactCount: result.contacts.length,
          storageUsedGB: +(result.totalSizeBytes / (1024 * 1024 * 1024)).toFixed(1),
        };
        setSelectedDevice(updatedDevice);
        setCurrentTool('phone-manager');
        showGlobalToast(`Dossier réel "${result.folderName}" scanné : ${result.photos.length} photos trouvées !`, 'success');
      }
    } catch (err: any) {
      showGlobalToast('Erreur d\'accès au dossier : ' + err.message, 'error');
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans">
      {/* Global Notification Toast */}
      {globalToast && (
        <div className={`fixed top-4 right-6 z-50 px-4 py-3 rounded-2xl shadow-2xl border text-xs flex items-center gap-2.5 animate-in fade-in slide-in-from-top-3 ${
          globalToast.type === 'error'
            ? 'bg-rose-900 text-rose-100 border-rose-700'
            : globalToast.type === 'info'
            ? 'bg-blue-900 text-blue-100 border-blue-700'
            : 'bg-emerald-900 text-emerald-100 border-emerald-700'
        }`}>
          {globalToast.type === 'error' ? <AlertCircle className="w-4 h-4 text-rose-300" /> : <Check className="w-4 h-4 text-emerald-300" />}
          <span className="font-medium">{globalToast.message}</span>
        </div>
      )}

      {/* Top Application Bar */}
      <Header
        currentTool={currentTool}
        onSelectTool={setCurrentTool}
        devices={devices}
        selectedDevice={selectedDevice}
        onSelectDevice={setSelectedDevice}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        lang={lang}
        onToggleLang={() => setLang(lang === 'fr' ? 'en' : 'fr')}
        onOpenReport={() => setIsReportOpen(true)}
        onPairRealUsb={handlePairRealUsb}
      />

      {/* Main Workspace Frame */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {currentTool === 'home' && (
          <HomeToolkit
            device={selectedDevice}
            onSelectTool={setCurrentTool}
            lang={lang}
            onOpenReport={() => setIsReportOpen(true)}
            onConnectSimulatedDevice={handleConnectSimulatedDevice}
            onPairRealUsb={handlePairRealUsb}
            onOpenRealFolder={handleOpenRealFolder}
          />
        )}

        {currentTool === 'phone-manager' && (
          <PhoneManager
            device={selectedDevice}
            onBack={() => setCurrentTool('home')}
            lang={lang}
            onNavigateToRingtone={() => setCurrentTool('ringtone-maker')}
          />
        )}

        {currentTool === 'data-recovery' && (
          <DataRecovery
            device={selectedDevice}
            onBack={() => setCurrentTool('home')}
            lang={lang}
          />
        )}

        {currentTool === 'phone-transfer' && (
          <PhoneTransfer
            currentDevice={selectedDevice}
            onBack={() => setCurrentTool('home')}
            lang={lang}
          />
        )}

        {currentTool === 'screen-unlock' && (
          <ScreenUnlock
            device={selectedDevice}
            onBack={() => setCurrentTool('home')}
            lang={lang}
          />
        )}

        {currentTool === 'system-repair' && (
          <SystemRepair
            device={selectedDevice}
            onBack={() => setCurrentTool('home')}
            lang={lang}
          />
        )}

        {currentTool === 'whatsapp-transfer' && (
          <WhatsAppTransfer
            device={selectedDevice}
            onBack={() => setCurrentTool('home')}
            lang={lang}
          />
        )}

        {currentTool === 'phone-backup' && (
          <PhoneBackup
            device={selectedDevice}
            onBack={() => setCurrentTool('home')}
            lang={lang}
          />
        )}

        {currentTool === 'data-eraser' && (
          <DataEraser
            device={selectedDevice}
            onBack={() => setCurrentTool('home')}
            lang={lang}
          />
        )}

        {currentTool === 'virtual-location' && (
          <VirtualLocation
            device={selectedDevice}
            onBack={() => setCurrentTool('home')}
            lang={lang}
          />
        )}

        {currentTool === 'screen-mirror' && (
          <ScreenMirror
            device={selectedDevice}
            onBack={() => setCurrentTool('home')}
            lang={lang}
          />
        )}

        {currentTool === 'ringtone-maker' && (
          <RingtoneMaker
            device={selectedDevice}
            onBack={() => setCurrentTool('home')}
            lang={lang}
          />
        )}
      </main>

      {/* Verification Report Modal */}
      <DeviceInfoModal
        device={selectedDevice}
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        lang={lang}
      />
    </div>
  );
}
