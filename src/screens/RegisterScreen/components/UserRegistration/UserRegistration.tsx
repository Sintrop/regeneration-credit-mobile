import { Activist } from "./Activist";
import { Contributor } from "./Contributor";
import { Developer } from "./Developer";
import { Inspector } from "./Inspector";
import { Regenerator } from "./Regenerator";
import { Researcher } from "./Researcher";
import { Supporter } from "./Supporter";

export interface BaseRegistrationProps {
  name: string;
}
interface Props extends BaseRegistrationProps {
  userType: RegistrationsType;
}

export function UserRegistration({ userType, name }: Props) {
  const Component = users[userType];
  return <Component name={name} />
}

const users = {
  1: Regenerator,
  2: Inspector,
  3: Researcher,
  4: Developer,
  5: Contributor,
  6: Activist,
  7: Supporter,

}
export type RegistrationsType = keyof typeof users;
