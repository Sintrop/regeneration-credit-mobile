import { Developer } from "./components/Developer/Developer";
import { Inspector } from "./components/Inspector/Inspector";
import { Regenerator } from "./components/Regenerator/Regenerator";
import { Researcher } from "./components/Researcher/Researcher";

interface Props {
  address: string;
  userType: number;
}
export function Profile({ address, userType }: Props) {
  const Component = userData[userType as UserTypeToUserData];
  return <Component address={address} />
}

const userData = {
  1: Regenerator,
  2: Inspector,
  3: Researcher,
  4: Developer
}
type UserTypeToUserData = keyof typeof userData