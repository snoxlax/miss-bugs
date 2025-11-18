import { userService as userServiceLocal } from './user-service-local';
import { userService as userServiceRemote } from './user-service-remote';

const isRemote = import.meta.env.VITE_USE_REMOTE === 'true' || true;

const selectedService = isRemote ? userServiceRemote : userServiceLocal;

export const userService = {
  ...selectedService,
};
