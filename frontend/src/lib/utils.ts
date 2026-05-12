type SpectaResult<T, E> =
  | { status: "ok"; data: T }
  | { status: "error"; error: E };

/**
 * Unpack tauri-specta's response
 */
export async function unwrap<T, E>(
  promise: Promise<SpectaResult<T, E>>,
): Promise<T> {
  const res = await promise;
  if (res.status === "error") {
    throw res.error;
  }
  return res.data;
}
