interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

class CacheLayer {
  private memoryCache = new Map<string, CacheEntry<unknown>>();
  private defaultTtl = 5 * 60 * 1000;

  set<T>(key: string, data: T, ttl?: number): void {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl: ttl ?? this.defaultTtl,
    };
    this.memoryCache.set(key, entry);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(`nexus_cache_${key}`, JSON.stringify(entry));
      } catch {}
    }
  }

  get<T>(key: string): T | null {
    const memEntry = this.memoryCache.get(key) as CacheEntry<T> | undefined;
    if (memEntry && Date.now() - memEntry.timestamp < memEntry.ttl) {
      return memEntry.data;
    }
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(`nexus_cache_${key}`);
        if (stored) {
          const entry: CacheEntry<T> = JSON.parse(stored);
          if (Date.now() - entry.timestamp < entry.ttl) {
            this.memoryCache.set(key, entry);
            return entry.data;
          }
          localStorage.removeItem(`nexus_cache_${key}`);
        }
      } catch {}
    }
    return null;
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }

  clear(): void {
    this.memoryCache.clear();
    if (typeof window !== 'undefined') {
      Object.keys(localStorage)
        .filter((k) => k.startsWith('nexus_cache_'))
        .forEach((k) => localStorage.removeItem(k));
    }
  }
}

export const cache = new CacheLayer();
