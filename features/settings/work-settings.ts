import { STORAGE_KEYS } from "@/constants/storage-keys";
import { storage } from "@/services/storage.service";
import { DEFAULT_WORK_SETTINGS } from "@/storage/defaults";
import { WorkSettings } from "@/types/work-settings.type";

export async function getWorkSettings(): Promise<WorkSettings> {
  const settings = await storage.getItem<WorkSettings>(
    STORAGE_KEYS.WORK_SETTINGS,
  );

  return settings ?? DEFAULT_WORK_SETTINGS;
}

export async function saveWorkSettings(
  settings: WorkSettings,
): Promise<void> {
  await storage.setItem(
    STORAGE_KEYS.WORK_SETTINGS,
    settings,
  );
}

export async function resetWorkSettings(): Promise<void> {
  await storage.removeItem(STORAGE_KEYS.WORK_SETTINGS);
}