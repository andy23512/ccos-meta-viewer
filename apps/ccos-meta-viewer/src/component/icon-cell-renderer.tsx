import { ICellRendererParams } from 'ag-grid-community';
import { ActionInfoRowData } from '../model/action-table.model';

export default ({ node }: ICellRendererParams<ActionInfoRowData>) => {
  const data = node.data;

  return (
    <div className="flex items-center h-full pl-2 gap-2">
      <span className="material-icons text-lg">{data?.icon}</span>
      {data?.icon}
    </div>
  );
};
