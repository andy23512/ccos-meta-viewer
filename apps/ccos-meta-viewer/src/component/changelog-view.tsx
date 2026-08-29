import {
  Box,
  List,
  ListItem,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import JsonView from '@uiw/react-json-view';
import { vscodeTheme } from '@uiw/react-json-view/vscode';
import { MouseEvent, useEffect, useState } from 'react';
import { Changelog, ChangelogItem } from '../model/changelog.model';
import { sanitizeInlineHtml } from '../util';

interface ChangelogViewProps {
  value: Changelog;
}

type ChangelogViewType = 'list' | 'json';

function ChangelogSection(props: {
  title: string;
  icon: string;
  iconColor: string;
  items: ChangelogItem[];
}) {
  if (props.items.length === 0) {
    return null;
  }
  return (
    <Box sx={{ mb: 3 }}>
      <Typography
        variant="h6"
        sx={{ px: 2, display: 'flex', alignItems: 'center', gap: 1 }}
      >
        <span className="material-icons" style={{ color: props.iconColor }}>
          {props.icon}
        </span>
        {props.title}
      </Typography>
      <List dense>
        {props.items.map((item, index) => (
          <ListItem key={index} sx={{ display: 'block', py: 0.75 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <span
                className="material-icons"
                style={{ fontSize: '8px', color: props.iconColor, flexShrink: 0 }}
              >
                circle
              </span>
              <Typography component="span">{item.summary}</Typography>
            </Box>
            {item.description && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ pl: '20px', whiteSpace: 'pre-wrap' }}
                dangerouslySetInnerHTML={{
                  __html: sanitizeInlineHtml(item.description),
                }}
              />
            )}
          </ListItem>
        ))}
      </List>
    </Box>
  );
}

function ChangelogView(props: ChangelogViewProps) {
  const [viewType, setViewType] = useState<ChangelogViewType>(
    () =>
      (localStorage.getItem('changelogViewType') as ChangelogViewType) ||
      'list'
  );

  useEffect(() => {
    localStorage.setItem('changelogViewType', viewType);
  }, [viewType]);

  const handleViewTypeToggleChange = (
    _: MouseEvent<HTMLElement>,
    nextViewType: ChangelogViewType
  ) => {
    if (nextViewType) {
      setViewType(nextViewType);
    }
  };

  return (
    <Box sx={{ position: 'relative', height: '100%' }}>
      {viewType === 'list' ? (
        <Box className="h-full overflow-auto" sx={{ pt: 1 }}>
          <ChangelogSection
            title="Features"
            icon="add_circle"
            iconColor="#4caf50"
            items={props.value.features ?? []}
          />
          <ChangelogSection
            title="Fixes"
            icon="bug_report"
            iconColor="#f44336"
            items={props.value.fixes ?? []}
          />
        </Box>
      ) : (
        <JsonView
          className="h-full overflow-auto"
          value={props.value}
          style={vscodeTheme}
        ></JsonView>
      )}
      <ToggleButtonGroup
        sx={{ position: 'absolute', right: 14, bottom: '100%', mb: '16px' }}
        value={viewType}
        exclusive
        onChange={handleViewTypeToggleChange}
      >
        <ToggleButton value="list" aria-label="list">
          List
        </ToggleButton>
        <ToggleButton value="json" aria-label="json">
          JSON
        </ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
}

export default ChangelogView;
