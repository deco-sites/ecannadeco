/**
 * This file takes care of global app side effects,
 * like clicking on add to cart and the cart modal being displayed
 */

import { signal } from "@preact/signals";

export type UserSession = {
  id: string;
  name: string;
  email: string;
  plan: string;
};

const displayCart = signal(false);
const displayMenu = signal(false);
const displaySearchPopup = signal(false);
const displaySearchDrawer = signal(false);
const displayNewDocModal = signal(false);
const displayNewTicketModal = signal(false);
const displayConfirmDeleteDoc = signal(false);
const displayConfirmCancelSubscription = signal(false);
const displayCheckoutUpsellModal = signal(false);
const displayPreSignupUsersModal = signal(false);
const displayAssociationAdminNewDoc = signal(false);
const displayNewPatientModal = signal(false);
const displayNewTreatmentModal = signal(false);
const displayPlanLimit = signal(false);
const displayModalTextAction = signal(false);
const displayVideoModal = signal(false);
const updatedData = signal(true);
const uploadedFile = signal(true);
const user = signal<UserSession | null>(null);
const userToAdminCreateDoc = signal({
  email: "",
  _id: "",
});
const associationToAdminCreateDoc = signal({
  name: "",
  _id: "",
});
const modalTextAction = signal<{ text: string; actionUrl: string }>({
  text: "",
  actionUrl: "",
});

const state = {
  displayCart,
  displayMenu,
  displaySearchPopup,
  displaySearchDrawer,
  displayNewDocModal,
  displayPlanLimit,
  updatedData,
  uploadedFile,
  displayNewTicketModal,
  displayConfirmDeleteDoc,
  displayConfirmCancelSubscription,
  displayCheckoutUpsellModal,
  displayPreSignupUsersModal,
  displayAssociationAdminNewDoc,
  displayNewPatientModal,
  userToAdminCreateDoc,
  associationToAdminCreateDoc,
  displayModalTextAction,
  displayNewTreatmentModal,
  displayVideoModal,
  user,
  modalTextAction,
};

// Keyboard event listeners
addEventListener("keydown", (e: KeyboardEvent) => {
  const isK = e.key === "k" || e.key === "K" || e.keyCode === 75;

  // Open Searchbar on meta+k
  if (e.metaKey === true && isK) {
    displaySearchPopup.value = true;
  }
});

export const useUI = () => state;
