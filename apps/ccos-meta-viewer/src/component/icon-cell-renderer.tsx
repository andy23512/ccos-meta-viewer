import { ICellRendererParams } from 'ag-grid-community';
import { ActionInfoRowData } from '../model/action-table.model';

export default ({ node }: ICellRendererParams<ActionInfoRowData>) => {
  const data = node.data;
  return (
    <div className="flex items-center h-[41px] text-lg pl-2">
      <span className="material-icons">{data?.icon}</span>
    </div>
  );
};
