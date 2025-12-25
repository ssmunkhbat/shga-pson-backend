import { Injectable } from '@nestjs/common';
import { UmSystemUser } from 'src/entity/um/um-ystem-user.entity';

interface TableFieldMeta {
  header: string;
  type: string;
  sortable?: boolean;
  filterable?: boolean;
  width?: number;
}

type TableFields = Record<string, TableFieldMeta>;
type DynamicTable = { getTableFields(): TableFields };

const dynamicTables: Record<string, DynamicTable> = {
  'user': UmSystemUser as unknown as DynamicTable,
};

@Injectable()
export class TableConfigService {
  constructor(
  ) { }

  getColumns(entityName: string) {
    if (!dynamicTables[entityName]) {
      throw new Error('Not found');
    }
    const fields = dynamicTables[entityName].getTableFields();
    if (!fields) {
      throw new Error('Not found');
    }
    const columns = Object.entries(fields).map(([key, meta]) => ({
      key,
      header: meta.header,
      type: meta.type,
      sortable: meta.sortable,
      filterable: meta.filterable,
      width: meta.width,
    }));
    return columns;
  }
}
