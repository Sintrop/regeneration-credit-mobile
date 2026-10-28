import { cloneElement, ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { isPublisherUserType, UserTimer } from "@domain";
import { useUserContext } from "@hooks";
import { AppStackParamsList } from "@routes";

import { RequestInspection } from "./RequestInspection/RequestInspection";
import { InviteActivist } from "./Invite/InviteActivist";
import { InviteRegenerator } from "./Invite/InviteRegenerator";
import { Offset } from "./Offset/Offset";
import { InviteSupporter } from "./Invite/InviteSupporter";
import { ActionSheet } from "./Publisher/ActionSheet";
import { PublishResourceForm } from "./Publisher/PublishResourceForm";
import { CalculatorItemForm } from "./Publisher/CalculatorItemForm";
import { InviteSameTypeForm } from "./Publisher/InviteSameTypeForm";

type NavigationProps = NativeStackNavigationProp<AppStackParamsList, "HomeScreen">;

interface TriggerProps {
  openModal?: () => void;
}

interface Props {
  timer: UserTimer;
  /** Row element; receives openModal so tapping it starts the action. */
  children: ReactElement<TriggerProps>;
}

/** Opens the action behind a "Your actions" row: the same sheets as the Actions menu, or the screen where it happens. */
export function TimerAction({ timer, children }: Props) {
  const { t } = useTranslation();
  const navigation = useNavigation<NavigationProps>();
  const { userType } = useUserContext();

  const navigateTo = (open: () => void) => cloneElement(children, { openModal: open });

  switch (timer.key) {
    case "publishResearch":
    case "publishReport":
    case "publishContribution":
      if (!isPublisherUserType(userType)) return children;
      return (
        <ActionSheet title={t(`timers.actions.${timer.key}`)} content={({ close }) => <PublishResourceForm userType={userType} onDone={close} />}>
          {children}
        </ActionSheet>
      );
    case "publishCalculatorItem":
      return (
        <ActionSheet title={t("publisher.publishItem")} content={({ close }) => <CalculatorItemForm onDone={close} />}>
          {children}
        </ActionSheet>
      );
    case "invite":
      if (isPublisherUserType(userType)) {
        return (
          <ActionSheet title={t("timers.actions.invite")} content={({ close }) => <InviteSameTypeForm userType={userType} onDone={close} />}>
            {children}
          </ActionSheet>
        );
      }
      if (userType === 6) return <InviteActivist>{children}</InviteActivist>;
      if (userType === 7) return <InviteSupporter>{children}</InviteSupporter>;
      return children;
    case "offset":
      return <Offset>{children}</Offset>;
    case "inviteRegeneratorInspector":
      return <InviteRegenerator>{children}</InviteRegenerator>;
    case "requestInspection":
      return <RequestInspection>{children}</RequestInspection>;
    case "acceptInspection":
      return navigateTo(() => navigation.navigate("InspectionsScreen"));
    case "vote":
      return navigateTo(() => navigation.navigate("ResourcesListScreen"));
    case "withdraw":
      return navigateTo(() => navigation.navigate("PoolDetailsScreen", { userType }));
    default:
      return children;
  }
}
