import { View } from "react-native";
import { useTranslation } from "react-i18next";

import { ActionItem } from "@components";
import { PublisherUserType } from "@domain";

import { BurnTokens } from "./BurnTokens/BurnTokens";
import { ActionSheet } from "./Publisher/ActionSheet";
import { PublishResourceForm } from "./Publisher/PublishResourceForm";
import { CalculatorItemForm } from "./Publisher/CalculatorItemForm";
import { EvaluationMethodForm } from "./Publisher/EvaluationMethodForm";
import { InviteSameTypeForm } from "./Publisher/InviteSameTypeForm";

const LABELS: Record<PublisherUserType, { publish: string; publishDescription: string; invite: string; inviteDescription: string }> = {
  3: { publish: "publisher.publishResearch", publishDescription: "publisher.publishResearchDescription", invite: "publisher.inviteResearcher", inviteDescription: "publisher.inviteResearcherDescription" },
  4: { publish: "publisher.publishReport", publishDescription: "publisher.publishReportDescription", invite: "publisher.inviteDeveloper", inviteDescription: "publisher.inviteDeveloperDescription" },
  5: { publish: "publisher.publishContribution", publishDescription: "publisher.publishContributionDescription", invite: "publisher.inviteContributor", inviteDescription: "publisher.inviteContributorDescription" },
};

function ActionButton({ openModal, label }: { openModal?: () => void; label: string }) {
  return <ActionItem label={label} onPress={openModal} />;
}

function PublisherActions({ userType }: { userType: PublisherUserType }) {
  const { t } = useTranslation();
  const labels = LABELS[userType];

  return (
    <View>
      <ActionSheet
        title={t(labels.publish)}
        description={t(labels.publishDescription)}
        content={({ close }) => <PublishResourceForm userType={userType} onDone={close} />}
      >
        <ActionButton label={t(labels.publish)} />
      </ActionSheet>

      {userType === 3 && (
        <>
          <ActionSheet
            title={t("publisher.publishItem")}
            description={t("publisher.publishItemDescription")}
            content={({ close }) => <CalculatorItemForm onDone={close} />}
          >
            <ActionButton label={t("publisher.publishItem")} />
          </ActionSheet>
          <ActionSheet
            title={t("publisher.publishMethod")}
            description={t("publisher.publishMethodDescription")}
            content={({ close }) => <EvaluationMethodForm onDone={close} />}
          >
            <ActionButton label={t("publisher.publishMethod")} />
          </ActionSheet>
        </>
      )}

      <BurnTokens>
        <ActionButton label={t("actions.burnTokens")} />
      </BurnTokens>

      <ActionSheet
        title={t(labels.invite)}
        description={t(labels.inviteDescription)}
        content={({ close }) => <InviteSameTypeForm userType={userType} onDone={close} />}
      >
        <ActionButton label={t(labels.invite)} />
      </ActionSheet>
    </View>
  );
}

export const ResearcherActions = () => <PublisherActions userType={3} />;
export const DeveloperActions = () => <PublisherActions userType={4} />;
export const ContributorActions = () => <PublisherActions userType={5} />;
