import { ICellRendererParams } from 'ag-grid-community';
import { sanitizeInlineHtml } from '../util';

export default ({ value }: ICellRendererParams<unknown, string>) => {
  if (!value) {
    return null;
  }
  return (
    <span
      style={{ whiteSpace: 'pre-wrap' }}
      dangerouslySetInnerHTML={{ __html: sanitizeInlineHtml(value) }}
    />
  );
};
