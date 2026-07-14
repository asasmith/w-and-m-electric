import { draftMode } from "next/headers";

export async function isPreviewEnabled() {
  try {
    const { isEnabled } = await draftMode();
    return isEnabled;
  } catch {
    return false;
  }
}
