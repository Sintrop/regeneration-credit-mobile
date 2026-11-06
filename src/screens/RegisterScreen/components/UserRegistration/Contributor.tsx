import { BaseRegistrationProps } from "./UserRegistration";
import { PublisherRegistration } from "./PublisherRegistration";

export function Contributor(props: BaseRegistrationProps) {
  return <PublisherRegistration {...props} userType={5} />;
}
