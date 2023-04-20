
export function getFileNameFromPath(path?: string) {
  if (path === undefined) return undefined
  const separatorIdx = path.lastIndexOf('/')
  if (separatorIdx === -1) {
    return undefined
  }

  return path.substring(separatorIdx + 1)
}