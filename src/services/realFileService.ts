import { MediaPhoto, ContactItem } from '../types';

export interface RealFolderScanResult {
  folderName: string;
  photos: MediaPhoto[];
  contacts: ContactItem[];
  otherFilesCount: number;
  totalSizeBytes: number;
}

/**
 * Prompts user to pick a REAL folder (such as phone mount point, DCIM, or local backup directory)
 */
export async function pickRealDeviceFolder(): Promise<RealFolderScanResult | null> {
  if (typeof window === 'undefined') return null;

  // Use File System Access API if available
  if ('showDirectoryPicker' in window) {
    try {
      const dirHandle = await (window as any).showDirectoryPicker({
        mode: 'read',
      });

      const photos: MediaPhoto[] = [];
      const contacts: ContactItem[] = [];
      let totalSizeBytes = 0;
      let otherFilesCount = 0;

      // Recursive reader
      async function readEntries(handle: any, currentPath: string = '') {
        for await (const entry of handle.values()) {
          if (entry.kind === 'file') {
            const file = await entry.getFile();
            totalSizeBytes += file.size;
            const ext = file.name.split('.').pop()?.toLowerCase() || '';

            if (['jpg', 'jpeg', 'png', 'heic', 'webp', 'gif'].includes(ext)) {
              photos.push({
                id: `real-photo-${file.name}-${Date.now()}-${Math.random()}`,
                name: file.name,
                album: currentPath || 'Téléphone (Stockage réel)',
                date: new Date(file.lastModified).toISOString().replace('T', ' ').slice(0, 16),
                size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
                url: URL.createObjectURL(file),
                isDeleted: false,
              });
            } else if (ext === 'vcf') {
              // Parse simple vCard
              const text = await file.text();
              const fnMatch = text.match(/FN:(.+)/i);
              const telMatch = text.match(/TEL.*:(.+)/i);
              const emailMatch = text.match(/EMAIL.*:(.+)/i);

              contacts.push({
                id: `real-contact-${Date.now()}-${Math.random()}`,
                name: fnMatch ? fnMatch[1].trim() : file.name,
                phone: telMatch ? telMatch[1].trim() : 'Numéro non renseigné',
                email: emailMatch ? emailMatch[1].trim() : 'Email non renseigné',
                avatarColor: 'bg-indigo-600',
                isDeleted: false,
              });
            } else {
              otherFilesCount++;
            }
          } else if (entry.kind === 'directory') {
            await readEntries(entry, `${currentPath}/${entry.name}`);
          }
        }
      }

      await readEntries(dirHandle, dirHandle.name);

      return {
        folderName: dirHandle.name,
        photos,
        contacts,
        otherFilesCount,
        totalSizeBytes,
      };
    } catch (err: any) {
      if (err.name === 'AbortError') return null;
      throw err;
    }
  }

  return null;
}
