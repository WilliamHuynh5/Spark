import { useState, KeyboardEvent } from 'react';
import {
  Container,
  IconButton,
  InputAdornment,
  TextField,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { styled } from '@mui/material/styles';
import CustomDateTimePicker from './CustomDateTimePicker';

const StyledTextField = styled(TextField)(({ theme }) => ({
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    width: 450,
  },
  [theme.breakpoints.up('md')]: {
    width: 700,
  },
  paddingTop: '8px',
  paddingBottom: '8px',
  '& input': {
    padding: '8px',
  },
  '& fieldset': {
    borderColor: 'black',
  },
  '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: '#c6799b',
  },
}));

interface SearchBarProps {
  handleSearch: (
    searchString: string,
    timeStart?: string,
    timeEnd?: string,
  ) => void;
}

const formatDate = (date: Date | null) => {
  if (!date) return undefined;
  return date.toISOString();
};

const determineIsTinyViewport = (size: number) => {
  return size < 450;
};

function EventSearchBar({ handleSearch }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [timeStart, setTimeStart] = useState<Date | null>(null);
  const [timeEnd, setTimeEnd] = useState<Date | null>(null);
  const [isTinyViewport, setIsTinyViewport] = useState<boolean>(
    determineIsTinyViewport(window.innerWidth),
  );

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      handleSearch(searchTerm, formatDate(timeStart), formatDate(timeEnd));
    }
  };

  const handleSearchButtonClick = () => {
    handleSearch(searchTerm, formatDate(timeStart), formatDate(timeEnd));
  };

  window.addEventListener('resize', () => {
    setIsTinyViewport(determineIsTinyViewport(window.innerWidth));
  });

  return (
    <Container maxWidth="md">
      <StyledTextField
        label="Search Spark ✨"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={handleKeyDown}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              {isTinyViewport ? null : (
                <>
                  <CustomDateTimePicker
                    label="From"
                    value={timeStart}
                    onAccept={(newValue: Date | null) => setTimeStart(newValue)}
                  />
                  <CustomDateTimePicker
                    label="To"
                    value={timeEnd}
                    onAccept={(newValue: Date | null) => setTimeEnd(newValue)}
                  />
                </>
              )}
              <IconButton aria-label="search" onClick={handleSearchButtonClick}>
                <SearchIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </Container>
  );
}

export default EventSearchBar;
