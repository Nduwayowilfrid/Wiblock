export type ToolId = 
  | 'home'
  | 'data-recovery'
  | 'phone-manager'
  | 'phone-transfer'
  | 'screen-unlock'
  | 'system-repair'
  | 'whatsapp-transfer'
  | 'phone-backup'
  | 'data-eraser'
  | 'virtual-location'
  | 'screen-mirror'
  | 'device-report'
  | 'ringtone-maker';

export type DeviceOS = 'ios' | 'android';

export interface ConnectedDevice {
  id: string;
  name: string;
  model: string;
  os: DeviceOS;
  osVersion: string;
  serialNumber: string;
  imei: string;
  batteryHealth: number; // percentage
  batteryCycle: number;
  batteryLevel: number;
  storageUsedGB: number;
  storageTotalGB: number;
  jailbrokenOrRooted: boolean;
  color: string;
  photoCount: number;
  videoCount: number;
  audioCount: number;
  contactCount: number;
  messageCount: number;
  appCount: number;
  storageBreakdown: {
    photos: number;
    videos: number;
    apps: number;
    audio: number;
    messages: number;
    system: number;
    free: number;
  };
  genuineComponents: {
    screen: boolean;
    battery: boolean;
    camera: boolean;
    motherboard: boolean;
    faceId: boolean;
  };
}

export interface MediaPhoto {
  id: string;
  name: string;
  album: string;
  date: string;
  size: string;
  url: string;
  isDeleted?: boolean;
}

export interface MediaAudio {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: string;
  size: string;
  isRingtone?: boolean;
}

export interface ContactItem {
  id: string;
  name: string;
  phone: string;
  email: string;
  company?: string;
  avatarColor: string;
  isDeleted?: boolean;
}

export interface MessageItem {
  id: string;
  sender: string;
  senderPhone: string;
  preview: string;
  date: string;
  unreadCount: number;
  avatarColor: string;
  messages: {
    id: string;
    text: string;
    isFromMe: boolean;
    time: string;
  }[];
  isDeleted?: boolean;
}

export interface AppItem {
  id: string;
  name: string;
  version: string;
  size: string;
  iconBg: string;
  category: string;
}

export interface BackupSnapshot {
  id: string;
  deviceName: string;
  date: string;
  size: string;
  itemsSummary: string;
  encrypted: boolean;
}
