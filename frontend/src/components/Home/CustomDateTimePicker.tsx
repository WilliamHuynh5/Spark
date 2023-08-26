import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers-pro';
import { styled } from '@mui/material/styles';

const StyledDateTimePicker = styled(DateTimePicker)(({ theme }) => ({
  width: '250px', // Default width for small screens
  [theme.breakpoints.down('sm')]: {
    width: '50px', // Width for screens < 600px
  },
  [theme.breakpoints.up('sm')]: {
    width: '75px', // Width for screens >= 600px
  },
  [theme.breakpoints.up('md')]: {
    width: '150px', // Width for screens >= 960px
  },
  paddingTop: '8px',
  paddingBottom: '8px',
  marginRight: '-2px',
  borderRadius: 0,
  '& .MuiInputBase-root': {
    borderRadius: 0,
  },
  '& .MuiIconButton-root': {
    borderRadius: 0,
  },
  '& .MuiDivider-root': {
    borderRadius: 0,
  },
}));

interface CustomDateTimePickerProps {
  label: string;
  value: Date | null;
  onAccept: (newValue: Date | null) => void;
}

function CustomDateTimePicker({
  label,
  value,
  onAccept,
}: CustomDateTimePickerProps) {
  // @ts-ignore

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <StyledDateTimePicker
        label={label}
        value={value}
        shrink={false}
        views={['month', 'day', 'hours', 'minutes']}
        // @ts-ignore: avoid casting newValue to unknown
        onAccept={(newValue: Date | null) => onAccept(newValue)}
      />
    </LocalizationProvider>
  );
}

export default CustomDateTimePicker;
