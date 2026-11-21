import { describe, expect, it } from "vitest"
import { join } from "node:path"
import { helperBinaryPath, helperCacheKey } from "../src/cache.js"

describe("helper cache key", () => {
  it("is stable for identical source", () => {
    expect(helperCacheKey("print(1)")).toBe(helperCacheKey("print(1)"))
    expect(helperCacheKey("print(1)")).toBe(
      helperCacheKey(Buffer.from("print(1)")),
    )
  })

  it("changes when the source changes, forcing a rebuild after upgrade", () => {
    expect(helperCacheKey("print(1)")).not.toBe(helperCacheKey("print(2)"))
  })

  it("places the binary in the cache dir under a source-keyed name", () => {
    const path = helperBinaryPath("/cache", "print(1)")
    expect(path).toBe(join("/cache", `media-key-${helperCacheKey("print(1)")}`))
    expect(path).not.toBe(helperBinaryPath("/cache", "print(2)"))
    expect(helperCacheKey("x")).toMatch(/^[0-9a-f]{16}$/)
  })
})
