const STORAGE_PREFIX = "psc-result-";

export interface StoredResult {
  testType: string;
  result: Record<string, unknown>;
  timestamp: number;
}

export function saveResult(testType: string, result: Record<string, unknown>) {
  try {
    const entry: StoredResult = { testType, result, timestamp: Date.now() };
    localStorage.setItem(STORAGE_PREFIX + testType, JSON.stringify(entry));
  } catch { /* quota exceeded — silent */ }
}

export function getResult(testType: string): StoredResult | null {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + testType);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function getAllResults(): StoredResult[] {
  const results: StoredResult[] = [];
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(STORAGE_PREFIX)) {
        const raw = localStorage.getItem(key);
        if (raw) {
          const entry = JSON.parse(raw) as StoredResult;
          results.push(entry);
        }
      }
    }
  } catch { /* silent */ }
  return results.sort((a, b) => b.timestamp - a.timestamp);
}

export function clearResult(testType: string) {
  try { localStorage.removeItem(STORAGE_PREFIX + testType); } catch { /* silent */ }
}
