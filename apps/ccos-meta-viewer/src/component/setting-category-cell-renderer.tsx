import { ICellRendererParams } from 'ag-grid-community';
import { SettingCategoryRowData } from '../model/setting-table.model';
import { sanitizeInlineHtml } from '../util';

export default ({ node }: ICellRendererParams<SettingCategoryRowData>) => {
  const data = node.data;
  return (
    <div className="flex items-center h-full text-lg pl-2 gap-3 font-bold bg-blue-500/40">
      <span>{data?.name}</span>
      {data?.description && (
        <span
          className="text-sm font-normal opacity-80"
          dangerouslySetInnerHTML={{
            __html: sanitizeInlineHtml(data.description),
          }}
        />
      )}
    </div>
  );
};
