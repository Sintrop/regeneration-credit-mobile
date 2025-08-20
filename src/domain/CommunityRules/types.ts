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

export interface DelationContractProps {
  id: string;
  informer: string;
  reported: string;
  title: string;
  testimony: string;
}

export interface DelationProps {
  id: number;
  informer: string;
  reported: string;
  title: string;
  testimony: string;
  createdAt: number;
}