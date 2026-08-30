import { Box } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import JsonView from '@uiw/react-json-view';
import { vscodeTheme } from '@uiw/react-json-view/vscode';
import { getMetaFile } from '../api';
import { Changelog } from '../model/changelog.model';
import { ChordFile } from '../model/chord.model';
import { KeymapCategory } from '../model/keymap.model';
import { Settings } from '../model/settings.model';
import ActionsView from './actions-view';
import ChangelogView from './changelog-view';
import ChordsView from './chords-view';
import SettingsView from './settings-view';

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
        ) : props.meta === 'changelog.json' ? (
          <ChangelogView value={metaFileQuery.data as Changelog} />
        ) : props.meta === 'settings.json' ? (
          <SettingsView value={metaFileQuery.data as Settings} />
        ) : props.meta === 'starter_chords.json' ||
          props.meta === 'functional_chords.json' ? (
          <ChordsView
            device={props.device as string}
            version={props.version as string}
            value={metaFileQuery.data as ChordFile}
          />
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
