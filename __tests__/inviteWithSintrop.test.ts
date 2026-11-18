import { inviteWithSintrop } from '../src/domain/InvitationRules/useCases/inviteWithSintrop';

const INVITED = '0x0000000000000000000000000000000000000abc';

describe('inviteWithSintrop', () => {
  it('sends only the invite when no SINTROP was chosen', () => {
    expect(inviteWithSintrop(INVITED, null)).toBeUndefined();
    expect(inviteWithSintrop(INVITED, undefined)).toBeUndefined();
  });

  it('adds a native transfer of the chosen amount to the invited wallet as the second step', () => {
    const options = inviteWithSintrop(INVITED, '100000000000000000');
    expect(options?.followUp?.tx).toEqual({
      interactWithContract: false,
      params: [{ to: INVITED, value: '100000000000000000' }],
    });
  });
});
