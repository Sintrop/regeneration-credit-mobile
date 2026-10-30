export type PublishedResourceType = 'research' | 'contribution' | 'report';

export interface PublishedResource {
  type: PublishedResourceType;
  id: number;
  title: string;
  body: string;
  author: string;
  era: number;
  file: string;
  createdAtBlock: number;
  validationsCount: number;
}
