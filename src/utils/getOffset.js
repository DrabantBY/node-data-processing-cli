export const getOffset = async (fileHandle, offset, size) => {
  if (offset === 0) return 0;
  if (offset >= size) return size;

  const buffer = Buffer.alloc(64 * 1024);

  let start = offset;
  while (start < size) {
    const { bytesRead } = await fileHandle.read(
      buffer,
      0,
      buffer.length,
      start,
    );
    if (bytesRead === 0) return size;
    const idx = buffer.subarray(0, bytesRead).indexOf(0x0a);
    if (idx !== -1) return start + idx + 1;
    start += bytesRead;
  }
  return size;
};
