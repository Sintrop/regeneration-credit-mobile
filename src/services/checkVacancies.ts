interface CheckVacanciesProps {
  userType: number;
  regeneratorsCount: number;
  userTypeCount: number;
}

interface ReturnCheckVacanciesProps {
  availableVacancie: boolean;
  ammount: number;
}

const INSPECTOR_PROPORTIONALITY = 20;
const RESEARCHER_PROPORTIONALITY = 10;
const DEVELOPER_PROPORTIONALITY = 10;
const CONTRIBUTOR_PROPORTIONALITY = 10;
const ACTIVIST_PROPORTIONALITY = 10;

export function checkVacancies(props: CheckVacanciesProps): ReturnCheckVacanciesProps {
  const { regeneratorsCount, userType, userTypeCount } = props;

  const limitInspectors = regeneratorsCount * INSPECTOR_PROPORTIONALITY;
  const limitResearchers = regeneratorsCount / RESEARCHER_PROPORTIONALITY;
  const limitDevelopers = regeneratorsCount / DEVELOPER_PROPORTIONALITY;
  const limitContributors = regeneratorsCount / CONTRIBUTOR_PROPORTIONALITY;
  const limitActivists = regeneratorsCount / ACTIVIST_PROPORTIONALITY;

  let availableVacancie: boolean = false;
  let ammountVacancies: number = 0;

  if (userType === 1) {
    availableVacancie = true;
  }

  if (userType === 2) {
    const calcInspector = limitInspectors - userTypeCount;
    if (calcInspector >= 1) {
      availableVacancie = true;
      ammountVacancies = calcInspector;
    }
  }

  if (userType === 3) {
    const calcResearcher = limitResearchers - userTypeCount;
    if (calcResearcher >= 1) {
      availableVacancie = true;
      ammountVacancies = calcResearcher;
    }
  }

  if (userType === 4) {
    const calcDeveloper = limitDevelopers - userTypeCount;
    if (calcDeveloper >= 1) {
      availableVacancie = true;
      ammountVacancies = calcDeveloper;
    }
  }

  if (userType === 5) {
    const calcContributor = limitContributors - userTypeCount;
    if (calcContributor >= 1) {
      availableVacancie = true;
      ammountVacancies = calcContributor;
    }
  }

  if (userType === 6) {
    const calcActivists = limitActivists - userTypeCount;
    if (calcActivists >= 1) {
      availableVacancie = true;
      ammountVacancies = calcActivists;
    }
  }

  if (userTypeCount <= 5) {
    availableVacancie = true;
  }

  return {
    availableVacancie,
    ammount: Math.floor(ammountVacancies)
  }
}