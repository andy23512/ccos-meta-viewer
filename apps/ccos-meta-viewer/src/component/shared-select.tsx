import {
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import { ReactNode } from 'react';

interface SharedSelectProps<T> {
  label: string;
  id: string;
  value: T;
  onChange: (value: T) => void;
  disabled: boolean;
  loading: boolean;
  children: ReactNode;
}

function SharedSelect<T>(props: SharedSelectProps<T>) {
  const handleChange = (event: SelectChangeEvent<T>) => {
    props.onChange(event.target.value as T);
  };
  return (
    <FormControl sx={{ width: 200 }}>
      <InputLabel id={props.id + '-label'}>{props.label}</InputLabel>
      <Select
        input={<OutlinedInput label={props.label} />}
        labelId={props.id + '-label'}
        id={props.id}
        value={props.value}
        onChange={handleChange}
        disabled={props.disabled}
      >
        {props.loading ? (
          <MenuItem disabled>
            <CircularProgress size={20}></CircularProgress>
          </MenuItem>
        ) : (
          props.children
        )}
      </Select>
    </FormControl>
  );
}

export default SharedSelect;
