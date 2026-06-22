import { execFile } from "node:child_process"
import { existsSync } from "node:fs"
import { mkdir } from "node:fs/promises"
import { tmpdir } from "node:os"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import { promisify } from "node:util"

const exec = promisify(execFile)

export type MediaKey = "play" | "next" | "previous" | "forward" | "rewind"

const sourcePath = fileURLToPath(
  new URL("../native/media-key.swift", import.meta.url),
)
const binaryPath = join(tmpdir(), "macos-media-keys", "media-key")

const ensureBinary = async (): Promise<string> => {
  if (existsSync(binaryPath)) return binaryPath
  await mkdir(dirname(binaryPath), { recursive: true })
  await exec("swiftc", ["-O", sourcePath, "-o", binaryPath])
  return binaryPath
}

/**
 * Post a macOS system media key to whichever app is responding to media keys
 * (the same events the keyboard's media keys emit). macOS only. Requires the
 * calling process to have Accessibility permission.
 */
export const sendMediaKey = async (key: MediaKey): Promise<void> => {
  if (process.platform !== "darwin") {
    throw new Error("@kud/macos-media-keys only works on macOS")
  }
  const binary = await ensureBinary()
  try {
    await exec(binary, [key])
  } catch (error) {
    const stderr = (error as { stderr?: string }).stderr
    throw new Error(stderr?.trim() || `failed to send media key: ${key}`)
  }
}
