import { Box } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import JsonView from '@uiw/react-json-view';
import { vscodeTheme } from '@uiw/react-json-view/vscode';
import { getMetaFile } from '../api';
import { KeymapCategory } from '../model/keymap.model';
import ActionsView from './actions-view';

interface MetaViewProps {
  device: string | null;
  version: string | null;
  meta: string | null;
}

function MetaView(props: MetaViewProps) {
  const metaFileQuery = useQuery<any>({
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
    <Box sx={{ flex: '1 1 0', minHeight: 0, height: '100%' }}>
      {metaFileQuery?.data &&
        (props.meta === 'actions.json' ? (
          <ActionsView value={metaFileQuery.data as KeymapCategory[]} />
        ) : (
          <JsonView
            className="h-full overflow-auto"
            value={metaFileQuery.data}
            style={vscodeTheme}
          ></JsonView>
        ))}
    </Box>
  );
}

export default MetaView;
