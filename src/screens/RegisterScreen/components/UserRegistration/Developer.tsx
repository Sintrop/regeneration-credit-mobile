import { BaseRegistrationProps } from "./UserRegistration";
import { PublisherRegistration } from "./PublisherRegistration";

export function Developer(props: BaseRegistrationProps) {
  return <PublisherRegistration {...props} userType={4} />;
}
