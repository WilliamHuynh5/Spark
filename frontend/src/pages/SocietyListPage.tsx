import React, { useEffect, useState } from 'react';
import { Box, Container, styled, Button } from '@mui/material';
import SocietyList from '../components/SocietyListComponents/SocietyList';
import { Society } from '../api/utils/interfaces';
import api from '../api';
import HomeHeader from '../components/Common/HomeHeader';
import ErrorPopup from '../components/Common/ErrorPopup';
import { ApiError } from '../api/utils/apiTypes';
import SearchBar from '../components/Home/SearchBar';

/**
 * Root container for the Society List page.
 */
const Root = styled(Container)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  marginTop: '100px',
  gap: '10px',
});

/**
 * Box container with custom styles for the Society List page.
 */
const NewBox = styled(Box)({
  display: 'flex',
  marginBottom: '20px',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '20px',
});

const NextButton = styled(Button)({
  marginLeft: '10px',
});

const PrevButton = styled(Button)({
  marginRight: '10px',
});

/**
 * The Society List page component.
 */
const SocietyListPage = () => {
  const [societies, setSocieties] = useState<Society[]>([]);
  const [errorMsg, setErrorMsg] = React.useState<string>('');
  const [showError, setShowError] = React.useState<boolean>(false);
  const [paginationStart, setPaginationStart] = useState<number>(0);
  const [paginationEnd, setPaginationEnd] = useState<number>(9);
  const [searchString, setSearchString] = useState<string | undefined>();
  const [isMore, setIsMore] = useState<boolean>(false);
  /**
   * Fetches the society data from the API based on pagination start and end values.
   * @param start - The start index for pagination.
   * @param end - The end index for pagination.
   */
  const fetchData = async () => {
    try {
      const societiesResponse = await api.society.list(
        searchString,
        paginationStart,
        paginationEnd + 1
      );
      // setSocieties(societies);
      const newSocs: Society[] = Array.from(societiesResponse.societies);
      setIsMore(newSocs.length === 10);
      setSocieties(newSocs.splice(0, 9));
    } catch (err: unknown) {
      let message = `An unknown error has occured. Contact your system admin\n${err}`;
      if (err instanceof ApiError) {
        message = err.message;
      }
      setErrorMsg(message);
      setShowError(true);
    }
  };

  const searchSocieties = async (searchString?: string) => {
    try {
      setSocieties([]);
      setPaginationStart(0);
      setPaginationEnd(9);
      const tempSocieties = await api.society.list(
        searchString,
        paginationStart,
        paginationEnd + 1
      );
      setSocieties(tempSocieties.societies.splice(0, 9));
      setIsMore(tempSocieties.societies.length === 10);

      setSearchString(searchString);
    } catch (err: unknown) {
      let message = `An unknown error has occured. Contact your system admin\n${err}`;
      if (err instanceof ApiError) {
        message = err.message;
      }
      setErrorMsg(message);
      setShowError(true);
    }
  };

  useEffect(() => {
    fetchData();
  }, [paginationStart, paginationEnd]); // eslint-disable-line

  /**
   * Handles the "Previous" button click to navigate to the previous page.
   */
  const handlePreviousPage = () => {
    setPaginationEnd(paginationStart);
    setPaginationStart(paginationStart - 9);
  };

  /**
   * Handles the "Next" button click to navigate to the next page.
   */
  const handleNextPage = async () => {
    setPaginationStart(paginationEnd);

    setPaginationEnd(paginationEnd + 9);
  };
  return (
    <React.Fragment>
      <HomeHeader searchBar={<SearchBar handleSearch={searchSocieties} />} />
      <Root maxWidth="sm">
        <NewBox sx={{ typography: 'h3' }}>Societies</NewBox>
        <SocietyList societies={societies} />
        <Box
          sx={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}
        >
          <PrevButton
            variant="contained"
            onClick={handlePreviousPage}
            disabled={paginationStart === 0}
          >
            Previous
          </PrevButton>
          <NextButton
            variant="contained"
            onClick={handleNextPage}
            disabled={!isMore}
          >
            Next
          </NextButton>
        </Box>
      </Root>
      {showError && (
        <ErrorPopup
          errorMessage={errorMsg}
          closeError={() => setShowError(false)}
        />
      )}
    </React.Fragment>
  );
};

export default SocietyListPage;
