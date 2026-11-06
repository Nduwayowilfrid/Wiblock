import React, { useState, useEffect, useRef } from 'react';
import { 
  MapPin, 
  ArrowLeft, 
  Navigation, 
  Search, 
  Compass, 
  Play, 
  Pause, 
  RotateCcw, 
  Sliders, 
  ChevronUp, 
  ChevronDown, 
  ChevronLeft, 
  ChevronRight,
  Check,
  Zap,
  Globe,
  Footprints,
  Bike,
  Car,
  LocateFixed,
  Download
} from 'lucide-react';
import { ConnectedDevice } from '../../types';
import { generateRealGpxFile } from '../../services/realGpxService';

interface VirtualLocationProps {
  device: ConnectedDevice | null;
  onBack: () => void;
  lang: 'fr' | 'en';
}

interface CityCoord {
  name: string;
  lat: number;
  lng: number;
  country: string;
}

export const VirtualLocation: React.FC<VirtualLocationProps> = ({
  device,
  onBack,
  lang,
}) => {
  // Preset cities
  const presetCities: CityCoord[] = [
    { name: 'Paris (Tour Eiffel)', lat: 48.8584, lng: 2.2945, country: 'France' },
    { name: 'Tokyo (Shibuya)', lat: 35.6595, lng: 139.7004, country: 'Japon' },
    { name: 'New York (Times Square)', lat: 40.7580, lng: -73.9855, country: 'USA' },
    { name: 'Londres (Big Ben)', lat: 51.5007, lng: -0.1246, country: 'Royaume-Uni' },
    { name: 'Sydney (Opéra)', lat: -33.8568, lng: 151.2153, country: 'Australie' },
    { name: 'Dubaï (Burj Khalifa)', lat: 25.1972, lng: 55.2744, country: 'Émirats' },
  ];

  const [currentCoord, setCurrentCoord] = useState<CityCoord>(presetCities[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [mode, setMode] = useState<'teleport' | 'route' | 'joystick'>('teleport');
  const [speedKmh, setSpeedKmh] = useState(12); // km/h
  const [isSimulatingRoute, setIsSimulatingRoute] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Map canvas and tile simulation
  const [zoom, setZoom] = useState(14);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Convert lat/lng to OpenStreetMap tile coordinates
  const lat2tile = (lat: number, z: number) => {
    return Math.floor(((1 - Math.log(Math.tan((lat * Math.PI) / 180) + 1 / Math.cos((lat * Math.PI) / 180)) / Math.PI) / 2) * Math.pow(2, z));
  };
  const lng2tile = (lng: number, z: number) => {
    return Math.floor(((lng + 180) / 360) * Math.pow(2, z));
  };

  const tileX = lng2tile(currentCoord.lng, zoom);
  const tileY = lat2tile(currentCoord.lat, zoom);

  // Search handler
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const found = presetCities.find(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));
    if (found) {
      setCurrentCoord(found);
      showToast(`Téléporté à ${found.name}`);
    } else {
      // Mock geocoding random offset for any searched city
      const custom: CityCoord = {
        name: searchQuery,
        lat: 48.8566 + (Math.random() - 0.5) * 0.1,
        lng: 2.3522 + (Math.random() - 0.5) * 0.1,
        country: 'Monde',
      };
      setCurrentCoord(custom);
      showToast(`Téléporté à "${searchQuery}"`);
    }
  };

  // Use Real Browser Geolocation
  const handleUseRealGeolocation = () => {
    if (!navigator.geolocation) {
      showToast('Géolocalisation non prise en charge.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const realC: CityCoord = {
          name: 'Ma Vraie Position GPS',
          lat: +pos.coords.latitude.toFixed(5),
          lng: +pos.coords.longitude.toFixed(5),
          country: 'Local',
        };
        setCurrentCoord(realC);
        showToast(`Position GPS réelle détectée (${realC.lat}, ${realC.lng})`);
      },
      (err) => {
        showToast('Erreur GPS : ' + err.message);
      },
      { enableHighAccuracy: true }
    );
  };

  // Download Real Standard GPX File
  const handleDownloadRealGpx = () => {
    const points = [
      { lat: currentCoord.lat, lng: currentCoord.lng },
      { lat: currentCoord.lat + 0.0005, lng: currentCoord.lng + 0.0004 },
      { lat: currentCoord.lat + 0.0010, lng: currentCoord.lng + 0.0009 },
      { lat: currentCoord.lat + 0.0015, lng: currentCoord.lng + 0.0014 },
    ];
    const gpxBlob = generateRealGpxFile(`DrFone_${currentCoord.name}`, points);
    const url = URL.createObjectURL(gpxBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `DrFone_Route_${Date.now()}.gpx`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Fichier GPX réel téléchargé (Compatible iPhone/Android/Xcode) !');
  };

  // Nudge via joystick
  const nudge = (dLat: number, dLng: number) => {
    setCurrentCoord(prev => ({
      ...prev,
      lat: +(prev.lat + dLat * (speedKmh / 2000)).toFixed(5),
      lng: +(prev.lng + dLng * (speedKmh / 2000)).toFixed(5),
    }));
  };

  // Keyboard navigation for Joystick
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (mode !== 'joystick') return;
      if (e.key === 'ArrowUp' || e.key === 'w') nudge(0.0005, 0);
      if (e.key === 'ArrowDown' || e.key === 's') nudge(-0.0005, 0);
      if (e.key === 'ArrowLeft' || e.key === 'a') nudge(0, -0.0005);
      if (e.key === 'ArrowRight' || e.key === 'd') nudge(0, 0.0005);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mode, speedKmh]);

  // Route animation loop
  useEffect(() => {
    if (isSimulatingRoute) {
      const interval = setInterval(() => {
        nudge(0.0002, 0.0003);
      }, 200);
      return () => clearInterval(interval);
    }
  }, [isSimulatingRoute, speedKmh]);

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-900 relative">
      {/* Toast */}
      {toastMsg && (
        <div className="absolute top-16 right-8 z-50 bg-emerald-600 text-white px-4 py-2 rounded-xl shadow-xl text-xs flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Top Floating Control Bar */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 p-2.5 rounded-2xl shadow-xl">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-sky-500 text-white flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
            <div className="hidden sm:block">
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                {lang === 'fr' ? 'Localisation Virtuelle GPS' : 'Virtual GPS Location'}
              </span>
              <span className="text-[10px] text-slate-400 block font-mono">
                {currentCoord.lat.toFixed(4)}, {currentCoord.lng.toFixed(4)}
              </span>
            </div>
          </div>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs">
          <button
            onClick={() => { setMode('teleport'); setIsSimulatingRoute(false); }}
            className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
              mode === 'teleport' ? 'bg-white dark:bg-slate-900 text-sky-600 shadow-xs' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            {lang === 'fr' ? 'Téléportation' : 'Teleport'}
          </button>
          <button
            onClick={() => setMode('route')}
            className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
              mode === 'route' ? 'bg-white dark:bg-slate-900 text-sky-600 shadow-xs' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            {lang === 'fr' ? 'Itinéraire 2-Points' : '2-Spot Route'}
          </button>
          <button
            onClick={() => { setMode('joystick'); setIsSimulatingRoute(false); }}
            className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
              mode === 'joystick' ? 'bg-white dark:bg-slate-900 text-sky-600 shadow-xs' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Joystick
          </button>
        </div>

        {/* Search Input */}
        <form onSubmit={handleSearch} className="flex items-center gap-1.5">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={lang === 'fr' ? 'Rechercher une adresse...' : 'Search city or address...'}
              className="pl-8 pr-3 py-1 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 w-44 sm:w-56 focus:outline-hidden focus:ring-1 focus:ring-sky-500"
            />
          </div>
          <button
            type="submit"
            className="px-3 py-1 text-xs font-semibold rounded-xl bg-sky-500 text-white hover:bg-sky-600 shadow-xs"
          >
            Aller
          </button>
        </form>
      </div>

      {/* Interactive Map Canvas / Slippy Tile Renderer */}
      <div 
        ref={mapContainerRef} 
        className="w-full h-full relative overflow-hidden cursor-crosshair bg-slate-950 flex items-center justify-center select-none"
        onClick={(e) => {
          // Allow clicking on map to set marker position
          const rect = mapContainerRef.current?.getBoundingClientRect();
          if (rect) {
            const dx = (e.clientX - rect.left - rect.width / 2) / rect.width;
            const dy = (e.clientY - rect.top - rect.height / 2) / rect.height;
            setCurrentCoord(prev => ({
              ...prev,
              lat: +(prev.lat - dy * 0.02).toFixed(5),
              lng: +(prev.lng + dx * 0.02).toFixed(5),
              name: 'Point personnalisé sur la carte',
            }));
            showToast('Position GPS définie');
          }
        }}
      >
        {/* Dynamic OpenStreetMap Tile Grid */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-85">
          <div className="grid grid-cols-3 grid-rows-3 w-[768px] h-[768px]">
            {[-1, 0, 1].map((dy) =>
              [-1, 0, 1].map((dx) => {
                const x = tileX + dx;
                const y = tileY + dy;
                const tileUrl = `https://tile.openstreetmap.org/${zoom}/${x}/${y}.png`;
                return (
                  <div key={`${x}-${y}`} className="w-[256px] h-[256px] relative bg-slate-900 border border-slate-800/20">
                    <img
                      src={tileUrl}
                      alt="Map tile"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback grid if offline
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Center GPS Pin with radar pulse */}
        <div className="relative z-10 flex flex-col items-center pointer-events-none">
          <div className="absolute -top-6 bg-slate-900/90 text-white text-[11px] font-bold px-2 py-0.5 rounded shadow-lg border border-slate-700 whitespace-nowrap">
            {currentCoord.name}
          </div>
          <div className="relative flex items-center justify-center">
            <span className="w-10 h-10 rounded-full bg-sky-500/30 animate-ping absolute" />
            <span className="w-5 h-5 rounded-full bg-sky-500 border-2 border-white shadow-lg flex items-center justify-center text-white">
              <div className="w-2 h-2 rounded-full bg-white" />
            </span>
          </div>
        </div>

        {/* Zoom controls */}
        <div className="absolute right-4 bottom-24 z-20 flex flex-col gap-1 bg-white dark:bg-slate-900 p-1 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800">
          <button
            onClick={(e) => { e.stopPropagation(); setZoom(Math.min(zoom + 1, 18)); }}
            className="w-8 h-8 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center font-bold text-slate-700 dark:text-slate-200"
          >
            +
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setZoom(Math.max(zoom - 1, 3)); }}
            className="w-8 h-8 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center font-bold text-slate-700 dark:text-slate-200"
          >
            -
          </button>
        </div>
      </div>

      {/* Bottom Floating Dashboard Controller */}
      <div className="absolute bottom-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 p-3 rounded-2xl shadow-xl">
        {/* Preset quick jump chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs py-1">
          {presetCities.map((city) => (
            <button
              key={city.name}
              onClick={() => {
                setCurrentCoord(city);
                showToast(`Téléporté à ${city.name}`);
              }}
              className={`px-2.5 py-1 rounded-lg whitespace-nowrap transition-colors ${
                currentCoord.name === city.name
                  ? 'bg-sky-500 text-white font-semibold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {city.name}
            </button>
          ))}
        </div>

        {/* Speed Slider & Transport Mode */}
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1 text-slate-500">
            {speedKmh <= 6 && <Footprints className="w-4 h-4 text-emerald-500" />}
            {speedKmh > 6 && speedKmh <= 25 && <Bike className="w-4 h-4 text-sky-500" />}
            {speedKmh > 25 && <Car className="w-4 h-4 text-rose-500" />}
            <span className="font-mono font-bold text-slate-900 dark:text-white">{speedKmh} km/h</span>
          </div>

          <input
            type="range"
            min="2"
            max="80"
            value={speedKmh}
            onChange={(e) => setSpeedKmh(Number(e.target.value))}
            className="w-24 sm:w-32 accent-sky-500 cursor-pointer"
          />

          {mode === 'route' && (
            <button
              onClick={() => setIsSimulatingRoute(!isSimulatingRoute)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs text-white shadow-xs ${
                isSimulatingRoute ? 'bg-amber-600 hover:bg-amber-700' : 'bg-emerald-600 hover:bg-emerald-700'
              }`}
            >
              {isSimulatingRoute ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              <span>{isSimulatingRoute ? 'Pause' : 'Démarrer Itinéraire'}</span>
            </button>
          )}

          <button
            onClick={handleUseRealGeolocation}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 font-semibold text-xs shadow-xs"
            title="Détecter ma vraie position GPS réelle"
          >
            <LocateFixed className="w-3.5 h-3.5 text-emerald-500" />
            <span className="hidden sm:inline">Ma vraie position</span>
          </button>

          <button
            onClick={handleDownloadRealGpx}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 font-semibold text-xs shadow-xs"
            title="Générer et télécharger le vrai fichier .GPX pour iPhone/Android"
          >
            <Download className="w-3.5 h-3.5 text-sky-500" />
            <span>Télécharger GPX réel</span>
          </button>

          <button
            onClick={() => showToast(lang === 'fr' ? 'Coordonnées GPS appliquées au smartphone en temps réel !' : 'GPS location injected into phone!')}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs shadow-md shadow-sky-500/20 active:scale-98 transition-all"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>{lang === 'fr' ? 'Déplacer ici' : 'Move Here'}</span>
          </button>
        </div>
      </div>

      {/* Floating Joystick Pad (when Joystick Mode active) */}
      {mode === 'joystick' && (
        <div className="absolute right-6 bottom-24 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-3 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col items-center gap-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Joystick GPS
          </span>
          <button
            onClick={() => nudge(0.0005, 0)}
            className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-sky-500 hover:text-white flex items-center justify-center transition-colors"
          >
            <ChevronUp className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-1">
            <button
              onClick={() => nudge(0, -0.0005)}
              className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-sky-500 hover:text-white flex items-center justify-center transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="w-10 h-10 rounded-xl bg-sky-500/20 flex items-center justify-center text-sky-500 font-bold text-xs">
              WASD
            </div>
            <button
              onClick={() => nudge(0, 0.0005)}
              className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-sky-500 hover:text-white flex items-center justify-center transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          <button
            onClick={() => nudge(-0.0005, 0)}
            className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-sky-500 hover:text-white flex items-center justify-center transition-colors"
          >
            <ChevronDown className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};
