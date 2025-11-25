import { ICellRendererParams } from 'ag-grid-community';
import { KeymapCategoryRowData } from '../model/action-table.model';

export default ({ node }: ICellRendererParams<KeymapCategoryRowData>) => {
  const data = node.data;
  return (
    <div className="flex items-center h-full text-lg pl-2 font-bold bg-blue-500/40">
      {data?.name}
    </div>
  );
};
