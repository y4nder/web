import { Endpoints, makeRequest } from "~/network/request";
import { useStore, useTatakform } from "~/store";
import { Config } from "~/config";
import { AuthType } from "~/types/enums";
import { getStore } from "./storage";

/**
 * Check if the login is valid.
 */
export function validateLogin(): Promise<boolean> {
  return new Promise((resolve) => {
    // If no tokens, resolve false
    if (!_hasTokens()) {
      resolve(false);
      return;
    }

    // If has token, check if valid
    makeRequest<StudentResponse, null>("GET", Endpoints.Login, null, response => {
      // If logged in
      if (response.success) {
        // Get store 
        const store = useStore();
        // Role
        store.role = response.count; // 4 = Tatakform student, 3 = Tatakform admin, 2 = ict_admin, 1 = admin, 0 = student

        // If student
        if (store.role === AuthType.STUDENT) {
          // Set student data
          store.user = response.data;
          store.isLoggedIn = true;
          store.isAdminLoggedIn = false;
          store.isTatakformStudentLoggedIn = false;
        }
  
        // If admin
        if (store.role === AuthType.ADMIN) {
          // Set admin data
          store.admin = response.data;
          store.isAdminLoggedIn = true;
          store.isLoggedIn = false;
          store.isTatakformStudentLoggedIn = false;
        }

        // If Tatakform Account
        if (store.role === AuthType.TATAKFORM_ACCOUNT) {
          // Get tatakform store
          const tatakform = useTatakform();

          // Set admin data
          tatakform.student = response.data as TatakformStudent;
          store.isLoggedIn = false;
          store.isAdminLoggedIn = false;
          store.isTatakformStudentLoggedIn = true;
        }

        return resolve(response.success);
      }

      // If not logged in
      resolve(false);
    });
  });
}

/**
 * Get the photo link
 * @param has Photo hash
 * @param isReference If the photo is a reference
 */
export function getPhotoLink(hash: any, isReference = false) {
  return Config.API_URL + Endpoints[isReference ? 'ReferenceHash' : "PhotosHash"].replace(":hash", hash);
}

/**
 * Get the QR Code link
 * @param q QR Code data
 * @param isDark If the QR Code is dark
 */
export function getQRCodeLink(q: string, isDark = false) {
  return Config.API_URL + (isDark ? Endpoints.QRCodeDark : Endpoints.QRCode).replace(":q", q);
}

function _hasTokens() {
  const sat = getStore("sat");
  const srt = getStore("srt");
  const usat = getStore("usat");
  const usrt = getStore("usrt");
  const aat = getStore("aat");
  const art = getStore("art");

  return (sat && srt) || (aat && art) || (usat && usrt);
}