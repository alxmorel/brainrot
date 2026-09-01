export type AccountMe = {
  id: string;
  email: string;
  creditCents: number;
  welcomeCode: string | null;
  welcomeValid: boolean;
  welcomeExpiresAt: string | null;
  welcomeDiscountCents: number;
  welcomeOffer: string | null;
};
