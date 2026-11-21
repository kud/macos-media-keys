import { createHash } from "node:crypto"
import { join } from "node:path"

/**
 * Cache key for the compiled helper: a short hash of the Swift source. Any
 * change to the shipped source (e.g. a package upgrade) yields a new key, so
 * the helper is rebuilt once instead of a stale binary being reused.
 */
export const helperCacheKey = (source: string | Buffer): string =>
  createHash("sha256").update(source).digest("hex").slice(0, 16)

export const helperBinaryPath = (
  cacheDir: string,
  source: string | Buffer,
): string => join(cacheDir, `media-key-${helperCacheKey(source)}`)
