import { authService as localAuthService } from './auth-service-local.js';
import { authService as remoteAuthService } from './auth-service-remote.js';

const isRemote = import.meta.env.VITE_USE_REMOTE === 'true' || true;

const selectedService = isRemote ? remoteAuthService : localAuthService;
export const authService = {
  ...selectedService,
};
