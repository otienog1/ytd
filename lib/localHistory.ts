// LocalStorage-based download history for unauthenticated users
// Automatically expires items older than 24 hours

interface LocalHistoryItem {
  jobId: string;
  status: string;
  progress: number;
  videoInfo?: {
    id: string;
    title: string;
    thumbnail: string;
    duration: number;
    fileSize?: string;
    quality?: string;
  };
  downloadUrl?: string;
  error?: string;
  createdAt: string; // ISO string
}

const HISTORY_KEY = 'ytd_download_history';
const MAX_AGE_MS = 24 * 60 * 60 * 1000; // 24 hours

export class LocalHistory {
  /**
   * Add a download to local history
   */
  static add(item: Omit<LocalHistoryItem, 'createdAt'>): void {
    try {
      const history = this.getAll();
      const newItem: LocalHistoryItem = {
        ...item,
        createdAt: new Date().toISOString(),
      };

      // Remove duplicate if exists
      const filtered = history.filter(h => h.jobId !== item.jobId);
      filtered.unshift(newItem); // Add to beginning

      // Keep only last 50 items
      const trimmed = filtered.slice(0, 50);

      localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmed));
    } catch (error) {
      console.error('Failed to save to local history:', error);
    }
  }

  /**
   * Get all history items (automatically cleans expired items)
   */
  static getAll(): LocalHistoryItem[] {
    try {
      const stored = localStorage.getItem(HISTORY_KEY);
      if (!stored) return [];

      const history: LocalHistoryItem[] = JSON.parse(stored);
      const now = Date.now();

      // Filter out expired items (older than 24 hours)
      const validHistory = history.filter(item => {
        const createdAt = new Date(item.createdAt).getTime();
        return (now - createdAt) < MAX_AGE_MS;
      });

      // Update storage if any items were removed
      if (validHistory.length !== history.length) {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(validHistory));
      }

      return validHistory;
    } catch (error) {
      console.error('Failed to read local history:', error);
      return [];
    }
  }

  /**
   * Get a specific item by jobId
   */
  static get(jobId: string): LocalHistoryItem | null {
    const history = this.getAll();
    return history.find(item => item.jobId === jobId) || null;
  }

  /**
   * Update an existing item
   */
  static update(jobId: string, updates: Partial<LocalHistoryItem>): void {
    try {
      const history = this.getAll();
      const index = history.findIndex(item => item.jobId === jobId);

      if (index !== -1) {
        history[index] = {
          ...history[index],
          ...updates,
        };
        localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
      }
    } catch (error) {
      console.error('Failed to update local history:', error);
    }
  }

  /**
   * Remove a specific item
   */
  static remove(jobId: string): void {
    try {
      const history = this.getAll();
      const filtered = history.filter(item => item.jobId !== jobId);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Failed to remove from local history:', error);
    }
  }

  /**
   * Clear all history
   */
  static clear(): void {
    try {
      localStorage.removeItem(HISTORY_KEY);
    } catch (error) {
      console.error('Failed to clear local history:', error);
    }
  }

  /**
   * Get count of items in history
   */
  static count(): number {
    return this.getAll().length;
  }
}
