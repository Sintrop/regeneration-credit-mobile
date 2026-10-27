import { BaseRegistrationProps } from "./UserRegistration";
import { PublisherRegistration } from "./PublisherRegistration";

export function Researcher(props: BaseRegistrationProps) {
  return <PublisherRegistration {...props} userType={3} />;
}
