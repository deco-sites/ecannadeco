/**
 * This file takes care of global app side effects,
 * like clicking on add to cart and the cart modal being displayed
 */

import { signal } from "@preact/signals";

export type HolderInfo = {
  email: string;
  phone: string;
  full_name: string;
  birth_date: string;
  cpf_cnpj: string;
  postal_code: string;
  address_number: string;
  address_complement: string;
  address_city: string;
  address_state: string;
  address_street: string;
};

const holderInfo = signal<HolderInfo | null>(null);

export const useHolderInfo = () => holderInfo;
