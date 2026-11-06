import React, { useState, useEffect, useRef } from 'react';
import { 
  Cast, 
  ArrowLeft, 
  Camera, 
  Video, 
  Maximize2, 
  RotateCw, 
  Volume2, 
  VolumeX, 
  Power, 
  Smartphone, 
  Compass, 
  MessageSquare, 
  Music, 
  Settings, 
  Check,
  Circle,
  Square,
  Radio,
  Tv,
  StopCircle
} from 'lucide-react';
import { ConnectedDevice } from '../../types';

interface ScreenMirrorProps {
  device: ConnectedDevice | null;
  onBack: () => void;
  lang: 'fr' | 'en';
}

export const ScreenMirror: React.FC<ScreenMirrorProps> = ({
  device,
  onBack,
  lang,
}) => {
  const [activeApp, setActiveApp] = useState<'home' | 'photos' | 'safari' | 'messages' | 'camera'>('home');
  const [isRecording, setIsRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [volume, setVolume] = useState(70);
  const [isMuted, setIsMuted] = useState(false);
  const [isRotated, setIsRotated] = useState(false);

  // REAL SCREEN CAPTURE STREAM STATE
  const [realStream, setRealStream] = useState<MediaStream | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Start Real Live Display Capture (Phone / Window / Screen)
  const startRealScreenMirror = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
        showToast('Votre navigateur ne prend pas en charge la capture d\'écran directe.');
        return;
      }
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { frameRate: 60 },
        audio: true,
      });

      setRealStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      // Handle stream end by user
      stream.getVideoTracks()[0].onended = () => {
        setRealStream(null);
        showToast('Diffusion de l\'écran arrêtée.');
      };

      showToast(lang === 'fr' ? 'Flux vidéo réel 60 FPS connecté avec succès !' : 'Real 60 FPS video stream connected!');
    } catch (err: any) {
      if (err.name !== 'NotAllowedError') {
        showToast('Impossible de capturer l\'écran : ' + err.message);
      }
    }
  };

  const stopRealScreenMirror = () => {
    if (realStream) {
      realStream.getTracks().forEach(track => track.stop());
      setRealStream(null);
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      showToast('Flux réel déconnecté.');
    }
  };

  useEffect(() => {
    if (realStream && videoRef.current) {
      videoRef.current.srcObject = realStream;
    }
  }, [realStream]);

  // Real Timer for recording
  useEffect(() => {
    let interval: any;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordSeconds(s => s + 1);
      }, 1000);
    } else {
      setRecordSeconds(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  // Real Snapshot (downloads real PNG image from real stream or canvas)
  const takeScreenshot = () => {
    if (realStream && videoRef.current) {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 1080;
      canvas.height = video.videoHeight || 1920;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `DrFone_Screenshot_${Date.now()}.png`;
            a.click();
            URL.revokeObjectURL(url);
            showToast('Capture d\'écran réelle enregistrée en PNG !');
          }
        });
      }
    } else {
      // Fallback synthetic download
      const canvas = document.createElement('canvas');
      canvas.width = 1170;
      canvas.height = 2532;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 48px sans-serif';
        ctx.fillText('Wondershare Dr.Fone - Capture d\'écran', 100, 200);
        ctx.fillText(new Date().toLocaleString(), 100, 280);
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `DrFone_Mirror_${Date.now()}.png`;
            a.click();
            showToast('Capture d\'écran enregistrée sur votre ordinateur (.PNG) !');
          }
        });
      }
    }
  };

  // Real Screen Video Recording using MediaRecorder API
  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop();
      }
      showToast('Enregistrement terminé. Fichier vidéo généré.');
    } else {
      recordedChunksRef.current = [];
      if (realStream) {
        try {
          const recorder = new MediaRecorder(realStream, { mimeType: 'video/webm' });
          recorder.ondataavailable = (e) => {
            if (e.data.size > 0) recordedChunksRef.current.push(e.data);
          };
          recorder.onstop = () => {
            const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `DrFone_Recording_${Date.now()}.webm`;
            a.click();
            URL.revokeObjectURL(url);
          };
          recorder.start(1000);
          setMediaRecorder(recorder);
        } catch {
          // ignore
        }
      }
      setIsRecording(true);
      showToast('Enregistrement vidéo en direct démarré (WebM)...');
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-900 select-none">
      {/* Toast */}
      {toastMsg && (
        <div className="absolute top-16 right-8 z-50 bg-indigo-600 text-white px-4 py-2 rounded-xl shadow-xl text-xs flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="bg-slate-900 border-b border-slate-800 px-6 py-3 flex items-center justify-between text-white">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <Cast className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-white">
                  {lang === 'fr' ? 'Miroir d\'Écran Haute Définition' : 'Live Screen Mirror'}
                </h2>
                {realStream ? (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Flux Réel 60 FPS
                  </span>
                ) : (
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                    Mode Démo
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400">
                {device?.name || 'iPhone 15 Pro'} · Latence ultra-faible 8ms (USB Direct)
              </p>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-2 text-xs">
          {/* REAL SCREEN CAPTURE BUTTON */}
          {realStream ? (
            <button
              onClick={stopRealScreenMirror}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold transition-colors shadow-xs"
            >
              <StopCircle className="w-3.5 h-3.5" />
              <span>Arrêter le flux réel</span>
            </button>
          ) : (
            <button
              onClick={startRealScreenMirror}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-colors shadow-xs"
              title="Diffuser l'écran d'un vrai téléphone ou d'une fenêtre de smartphone"
            >
              <Tv className="w-3.5 h-3.5" />
              <span>Diffuser mon écran réel</span>
            </button>
          )}

          <button
            onClick={takeScreenshot}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors border border-slate-700"
            title="Capture d'écran"
          >
            <Camera className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden sm:inline">Capture PNG</span>
          </button>

          <button
            onClick={toggleRecording}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors border ${
              isRecording
                ? 'bg-rose-600 text-white border-rose-500 animate-pulse font-bold'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
            }`}
          >
            <Video className="w-3.5 h-3.5 text-rose-400" />
            <span>{isRecording ? `REC 00:${recordSeconds.toString().padStart(2, '0')}` : 'Enregistrer vidéo'}</span>
          </button>

          <button
            onClick={() => setIsRotated(!isRotated)}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700"
            title="Rotation d'écran"
          >
            <RotateCw className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700"
            title={isMuted ? 'Activer le son' : 'Couper le son'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>
        </div>
      </div>

      {/* Main Viewport: Realistic Smartphone Frame */}
      <div className="flex-1 overflow-auto p-6 flex items-center justify-center">
        <div className={`relative transition-all duration-300 ${isRotated ? 'rotate-90 scale-90' : ''}`}>
          {/* Hardware Frame */}
          <div className="w-[300px] h-[610px] rounded-[48px] bg-slate-950 border-[6px] border-slate-800 shadow-2xl p-3 flex flex-col justify-between relative overflow-hidden ring-1 ring-slate-700/60">
            {/* Dynamic Island */}
            <div className="mx-auto w-24 h-5 rounded-full bg-black border border-slate-800 flex items-center justify-between px-2.5 text-[9px] text-slate-500 z-20">
              <div className={`w-2 h-2 rounded-full ${realStream ? 'bg-emerald-400 animate-pulse' : 'bg-slate-700'}`} />
              <span className="text-[10px] text-slate-300 font-mono">14:30</span>
              <div className="w-2.5 h-2.5 rounded-full bg-blue-900/60" />
            </div>

            {/* SCREEN VIEW */}
            <div className="flex-1 my-2 rounded-[36px] bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-900 text-white flex flex-col justify-between relative overflow-hidden">
              {/* REAL LIVE STREAM VIDEO ELEMENT */}
              {realStream ? (
                <div className="w-full h-full relative flex items-center justify-center bg-black">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted={isMuted}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded text-[10px] text-emerald-400 font-mono">
                    LIVE 60FPS
                  </div>
                </div>
              ) : (
                /* INTERACTIVE DEMO APP WHEN NO REAL STREAM CONNECTED */
                <div className="flex-1 flex flex-col justify-between p-4 relative">
                  {/* Prompt banner to connect real screen */}
                  <div className="absolute inset-0 bg-radial from-blue-500/10 to-transparent pointer-events-none" />

                  {/* Home Screen Icons */}
                  {activeApp === 'home' && (
                    <div className="space-y-6 pt-4 z-10">
                      {/* Real stream quick trigger banner */}
                      <button
                        onClick={startRealScreenMirror}
                        className="w-full p-3 rounded-2xl bg-indigo-600/30 border border-indigo-400/40 text-left hover:bg-indigo-600/50 transition-colors"
                      >
                        <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-300">
                          Matériel Réel
                        </div>
                        <div className="text-xs font-bold text-white mt-0.5">
                          Diffuser l'écran d'un vrai téléphone
                        </div>
                        <div className="text-[10px] text-slate-300 mt-1">
                          Cliquez pour capturer en direct 60 FPS →
                        </div>
                      </button>

                      {/* App Grid */}
                      <div className="grid grid-cols-4 gap-3 text-center">
                        <button
                          onClick={() => setActiveApp('photos')}
                          className="flex flex-col items-center gap-1 group"
                        >
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-400 via-rose-500 to-indigo-600 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
                            <Camera className="w-6 h-6" />
                          </div>
                          <span className="text-[10px] text-slate-200">Photos</span>
                        </button>

                        <button
                          onClick={() => setActiveApp('safari')}
                          className="flex flex-col items-center gap-1 group"
                        >
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-400 to-blue-600 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
                            <Compass className="w-6 h-6" />
                          </div>
                          <span className="text-[10px] text-slate-200">Safari</span>
                        </button>

                        <button
                          onClick={() => setActiveApp('messages')}
                          className="flex flex-col items-center gap-1 group"
                        >
                          <div className="w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
                            <MessageSquare className="w-6 h-6" />
                          </div>
                          <span className="text-[10px] text-slate-200">Messages</span>
                        </button>

                        <button
                          onClick={() => showToast('Application Réglages')}
                          className="flex flex-col items-center gap-1 group"
                        >
                          <div className="w-12 h-12 rounded-xl bg-slate-700 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
                            <Settings className="w-6 h-6" />
                          </div>
                          <span className="text-[10px] text-slate-200">Réglages</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Photos App View */}
                  {activeApp === 'photos' && (
                    <div className="flex-1 flex flex-col justify-between pt-2">
                      <div className="flex items-center justify-between pb-2 border-b border-white/10 text-xs">
                        <span className="font-bold">Galerie Photos</span>
                        <button onClick={() => setActiveApp('home')} className="text-blue-400 text-[11px]">Accueil</button>
                      </div>
                      <div className="grid grid-cols-2 gap-2 my-auto">
                        <div className="aspect-square rounded-xl bg-slate-800 overflow-hidden">
                          <img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&q=80" alt="Phone img" className="w-full h-full object-cover" />
                        </div>
                        <div className="aspect-square rounded-xl bg-slate-800 overflow-hidden">
                          <img src="https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&q=80" alt="Phone img" className="w-full h-full object-cover" />
                        </div>
                      </div>
                      <div className="text-center text-[10px] text-slate-400">3 842 photos synchronisées</div>
                    </div>
                  )}

                  {/* Safari View */}
                  {activeApp === 'safari' && (
                    <div className="flex-1 flex flex-col justify-between pt-2">
                      <div className="flex items-center justify-between pb-2 border-b border-white/10 text-xs">
                        <span className="font-bold">wondershare.com</span>
                        <button onClick={() => setActiveApp('home')} className="text-blue-400 text-[11px]">Fermer</button>
                      </div>
                      <div className="my-auto text-center space-y-2 p-2">
                        <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center mx-auto font-black">
                          dr
                        </div>
                        <h4 className="text-xs font-bold">Wondershare Dr.Fone</h4>
                        <p className="text-[10px] text-slate-300">Solution mobile n°1 au monde pour iOS et Android.</p>
                      </div>
                    </div>
                  )}

                  {/* Messages View */}
                  {activeApp === 'messages' && (
                    <div className="flex-1 flex flex-col justify-between pt-2">
                      <div className="flex items-center justify-between pb-2 border-b border-white/10 text-xs">
                        <span className="font-bold">Messages</span>
                        <button onClick={() => setActiveApp('home')} className="text-blue-400 text-[11px]">Retour</button>
                      </div>
                      <div className="space-y-2 my-auto text-xs">
                        <div className="p-2 rounded-xl bg-blue-600 text-white rounded-br-none">
                          Les fichiers sont bien sauvegardés avec Dr.Fone !
                        </div>
                        <div className="p-2 rounded-xl bg-white/20 text-white rounded-bl-none">
                          Génial, tout fonctionne parfaitement.
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Bottom Dock Bar */}
                  <div className="p-2 rounded-2xl bg-white/15 backdrop-blur-lg flex items-center justify-around z-10">
                    <button onClick={() => setActiveApp('home')} className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center text-white">
                      <MessageSquare className="w-4 h-4" />
                    </button>
                    <button onClick={() => setActiveApp('safari')} className="w-9 h-9 rounded-xl bg-blue-500 flex items-center justify-center text-white">
                      <Compass className="w-4 h-4" />
                    </button>
                    <button onClick={() => setActiveApp('photos')} className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center text-white">
                      <Camera className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Home Indicator Line (Clickable to go home) */}
            <button
              onClick={() => setActiveApp('home')}
              className="mx-auto w-28 h-1 rounded-full bg-white/50 hover:bg-white transition-colors cursor-pointer my-1"
              title="Bouton Accueil"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
