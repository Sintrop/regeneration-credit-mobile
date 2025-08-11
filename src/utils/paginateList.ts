interface Props<T> {
  list: T[];
  itemsPerPage: number;
  atualPage: number;
}
export function paginateList<T>({ atualPage, itemsPerPage, list }: Props<T>): { list: T[]; totalPages: number } {
  const totalPages = Math.ceil(list.length / itemsPerPage);

  if (atualPage < 1) atualPage = 1;
  if (atualPage > totalPages) atualPage = totalPages;

  const initialIndice = (atualPage - 1) * itemsPerPage;
  const finalIndice = initialIndice + itemsPerPage;

  return {
    list: list.slice(initialIndice, finalIndice),
    totalPages
  }
}