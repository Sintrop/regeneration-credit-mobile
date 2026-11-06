import { cleanResourceText, resourceHeading } from '../src/utils/resourceText';

describe('cleanResourceText', () => {
  it('removes markdown headings and field labels', () => {
    expect(cleanResourceText('# Descrição  Explica o funcionamento das Eras')).toBe('Explica o funcionamento das Eras');
    expect(cleanResourceText('Description: A full pass over the site')).toBe('A full pass over the site');
  });

  it('removes a leading language code', () => {
    expect(cleanResourceText('EN Regeneration report')).toBe('Regeneration report');
  });

  it('collapses whitespace and handles empty values', () => {
    expect(cleanResourceText('line one\n\nline   two')).toBe('line one line two');
    expect(cleanResourceText(undefined)).toBe('');
  });
});

describe('resourceHeading', () => {
  it('prefers the title', () => {
    expect(resourceHeading('Impacto das Emissões', 'A produção global...')).toBe('Impacto das Emissões');
  });

  it('falls back to a shortened description', () => {
    const body = 'A full pass over regenerationcredit.org: baseline fixes, a visual refresh, live on-chain data';
    const heading = resourceHeading('', body);
    expect(heading.endsWith('…')).toBe(true);
    expect(heading.length).toBeLessThanOrEqual(71);
  });

  it('keeps short descriptions whole', () => {
    expect(resourceHeading(undefined, '# Descrição  Eras do protocolo')).toBe('Eras do protocolo');
  });
});
