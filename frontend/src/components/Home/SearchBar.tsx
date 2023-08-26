import {
  Container,
  IconButton,
  InputAdornment,
  TextField,
} from '@mui/material';
import { useState, KeyboardEvent } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import { styled } from '@mui/material/styles';

const StyledSearchBar = styled(TextField)(({ theme }) => ({
  width: '100%',
  // Width for screens >= 600px
  [theme.breakpoints.up('sm')]: {
    width: 400,
  },
  // Width for screens >= 960px
  [theme.breakpoints.up('md')]: {
    width: 600,
  },
  paddingTop: '8px',
  paddingBottom: '8px',
  '& input': {
    padding: '8px 14px',
  },
  '& fieldset': {
    borderColor: 'black',
  },
  '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: '#c6799b',
  },
}));

interface SearchBarProps {
  handleSearch: (searchTerm: string) => void;
}

function SearchBar({ handleSearch }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      handleSearch(searchTerm);
    }
  };

  return (
    <Container maxWidth={'md'}>
      <StyledSearchBar
        label="Search Spark ✨"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={handleKeyDown}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="search"
                onClick={() => handleSearch(searchTerm)}
              >
                <SearchIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </Container>
  );
}

export default SearchBar;
