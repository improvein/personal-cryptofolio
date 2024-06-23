import DataStorage from '../data/DataStorage';

export async function isPINAccessGranted(): Promise<boolean> {
  global.isCheckingAuth = true;
  const settings = await DataStorage.getSettings();
  global.pinProtection = settings.pinProtection || false;
  if (global.pinProtection) {
    // save the PIN hash
    global.pinHash = await DataStorage.getPINHash();
    // get the active PIN (if any)
    const activePin = global.activePin || null;
    // if there is no PIN or the PIN is not enabled
    if (activePin === null || !(await DataStorage.validatePIN(activePin))) {
      global.isCheckingAuth = false;
      global.isAccessGranted = false;
      return false;
    }
  }

  global.isCheckingAuth = false;
  global.isAccessGranted = true;
  return true;
}
