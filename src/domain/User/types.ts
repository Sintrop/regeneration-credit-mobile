export interface BasicUserProps {
  address: string;
  name: string;
  photo: string;
  poolLevel: number;
  /** i18n key of the label shown next to extraInfoValue */
  extraInfo?: string;
  extraInfoValue?: number;
}
export type UserType = 1 | 2 | 3 | 4 | 5 | 6 | 7