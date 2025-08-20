export interface InvitationContractProps {
  invited: string;
  inviter: string;
  userType: string;
  createdAtBlock: string;
}

export interface InvitationProps {
  invited: string;
  inviter: string;
  userType: number;
  createdAt: number;
}