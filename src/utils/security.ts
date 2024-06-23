import DataStorage from '../data/DataStorage';

export async function isPINAccessGranted(): Promise<boolean> {
  const settings = await DataStorage.getSettings();
  const isPinProtected = settings.pinProtection || false;
  if (isPinProtected) {
    // save the PIN hash
    global.pinHash = await DataStorage.getPINHash();
    console.debug('Security: Is pin protected. Hash: ', global.pinHash);
    // get the active PIN (if any)
    const activePin = global.activePin || null;
    // if there is no PIN or the PIN is not enabled
    if (activePin === null || !(await DataStorage.validatePIN(activePin))) {
      global.isAccessGranted = false;
      return false;
    }
  }

  console.debug('Security: Not pin protected');
  global.isAccessGranted = true;
  return true;
}
