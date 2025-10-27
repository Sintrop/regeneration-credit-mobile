import { Activist } from "./components/Activist/Activist";
import { Contributor } from "./components/Contributor/Contributor";
import { Developer } from "./components/Developer/Developer";
import { Inspector } from "./components/Inspector/Inspector";
import { Regenerator } from "./components/Regenerator/Regenerator";
import { Researcher } from "./components/Researcher/Researcher";
import { Supporter } from "./components/Supporter/Supporter";

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
  4: Developer,
  5: Contributor,
  6: Activist,
  7: Supporter
}
type UserTypeToUserData = keyof typeof userData