import { Box } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import JsonView from '@uiw/react-json-view';
import { vscodeTheme } from '@uiw/react-json-view/vscode';
import { getMetaFile } from '../api';

interface MetaViewProps {
  device: string | null;
  version: string | null;
  meta: string | null;
}

function MetaView(props: MetaViewProps) {
  const metaFileQuery = useQuery({
    queryKey: [
      'devices',
      props.device,
      'versions',
      props.version,
      'meta',
      props.meta ?? 'meta.json',
    ],
    queryFn: async () =>
      getMetaFile(
        props.device as string,
        props.version as string,
        props.meta ?? 'meta.json'
      ),
    enabled: !!props.device && !!props.version,
  });
  return (
    <Box sx={{ flex: '1 1 0', minHeight: 0, overflow: 'auto' }}>
      {metaFileQuery?.data && (
        <JsonView value={metaFileQuery.data} style={vscodeTheme}></JsonView>
      )}
    </Box>
  );
}

export default MetaView;
