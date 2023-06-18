export function retrieveFilename(filepath: string) {
  return filepath.substring(filepath.lastIndexOf("/") + 1);
}
