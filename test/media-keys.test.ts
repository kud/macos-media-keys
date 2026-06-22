import { describe, expect, it, vi } from "vitest"
import { sendMediaKey } from "../src/index.js"

describe("sendMediaKey", () => {
  it("rejects on non-macOS platforms", async () => {
    const original = process.platform
    Object.defineProperty(process, "platform", { value: "linux" })
    try {
      await expect(sendMediaKey("next")).rejects.toThrow(/only works on macOS/)
    } finally {
      Object.defineProperty(process, "platform", { value: original })
    }
  })
})
