import { checkVacancies } from '../src/services/checkVacancies';

const INSPECTOR = 2;
const RESEARCHER = 3;
const ACTIVIST = 6;
const SUPPORTER = 7;

describe('checkVacancies', () => {
  it('always allows types without proportionality', () => {
    expect(checkVacancies({ userType: 1, regeneratorsCount: 0, userTypeCount: 1000 }).availableVacancie).toBe(true);
    expect(checkVacancies({ userType: SUPPORTER, regeneratorsCount: 0, userTypeCount: 1000 }).availableVacancie).toBe(true);
  });

  it('allows registration while the type has fewer than 5 users', () => {
    const result = checkVacancies({ userType: ACTIVIST, regeneratorsCount: 0, userTypeCount: 4 });
    expect(result).toEqual({ availableVacancie: true, ammount: 1 });
  });

  it('blocks the 6th activist with 39 regenerators, as the contract does', () => {
    // 5 < 5 is false and 5 <= floor(39 / 10) is false
    const result = checkVacancies({ userType: ACTIVIST, regeneratorsCount: 39, userTypeCount: 5 });
    expect(result).toEqual({ availableVacancie: false, ammount: 0 });
  });

  it('uses floor division and <= for inverse proportionality', () => {
    // contract allows while count <= floor(regenerators / 10)
    expect(checkVacancies({ userType: RESEARCHER, regeneratorsCount: 60, userTypeCount: 6 })).toEqual({
      availableVacancie: true,
      ammount: 1,
    });
    expect(checkVacancies({ userType: RESEARCHER, regeneratorsCount: 69, userTypeCount: 7 }).availableVacancie).toBe(false);
  });

  it('uses multiplication for inspectors', () => {
    expect(checkVacancies({ userType: INSPECTOR, regeneratorsCount: 39, userTypeCount: 32 })).toEqual({
      availableVacancie: true,
      ammount: 748,
    });
    expect(checkVacancies({ userType: INSPECTOR, regeneratorsCount: 1, userTypeCount: 20 }).availableVacancie).toBe(false);
  });
});
