import { Box, ToggleButton, ToggleButtonGroup } from '@mui/material';
import JsonView from '@uiw/react-json-view';
import { vscodeTheme } from '@uiw/react-json-view/vscode';
import { MouseEvent, useEffect, useState } from 'react';
import { KeymapCategory } from '../model/keymap.model';

interface ActionsViewProps {
  value: KeymapCategory[];
}

type ActionsViewType = 'table' | 'json';

function ActionsView(props: ActionsViewProps) {
  const [viewType, setViewType] = useState<ActionsViewType>(
    () => (localStorage.getItem('actionsViewType') as ActionsViewType) || 'json'
  );

  useEffect(() => {
    localStorage.setItem('actionsViewType', viewType);
  }, [viewType]);

  const handleViewTypeToggleChange = (
    _: MouseEvent<HTMLElement>,
    nextViewType: ActionsViewType
  ) => {
    setViewType(nextViewType);
  };

  return (
    <Box sx={{ position: 'relative', height: '100%' }}>
      {viewType === 'table' ? (
        <div>Table</div>
      ) : (
        <JsonView
          className="h-full overflow-auto"
          value={props.value}
          style={vscodeTheme}
        ></JsonView>
      )}
      <ToggleButtonGroup
        sx={{ position: 'absolute', right: 14, top: 0 }}
        value={viewType}
        exclusive
        onChange={handleViewTypeToggleChange}
      >
        <ToggleButton value="table" aria-label="table">
          Table
        </ToggleButton>
        <ToggleButton value="json" aria-label="json">
          JSON
        </ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
}

export default ActionsView;
