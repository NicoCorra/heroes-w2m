import { Injectable } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';

@Injectable()
export class PaginatorIntlService extends MatPaginatorIntl {
  override itemsPerPageLabel = 'Heroes por página';
  override nextPageLabel = 'Página siguiente';
  override previousPageLabel = 'Página anterior';

  override getRangeLabel = (page: number, pageSize: number, length: number) => {
    const startIndex = page * pageSize;
    const endIndex = Math.min(startIndex + pageSize, length);
    return `${startIndex + 1} - ${endIndex} de ${length}`;
  };
}
