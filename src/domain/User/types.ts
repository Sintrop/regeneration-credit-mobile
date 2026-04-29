export interface BasicUserProps {
  address: string;
  name: string;
  photo: string;
  poolLevel: number;
  extraInfo?: string;
  extraInfoValue?: number;
}
export type UserType = 1 | 2 | 3 | 4 | 5 | 6 | 7