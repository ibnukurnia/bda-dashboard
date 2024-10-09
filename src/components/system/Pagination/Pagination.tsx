import React, { useEffect, useState } from 'react';
import { Box, Button, MenuItem, Select, TextField, Typography } from '@mui/material';
import FirstPageIcon from '../Icon/FirstPageIcon';
import PreviousPageIcon from '../Icon/PreviousPageIcon';
import NextPageIcon from '../Icon/NextPageIcon';
import LastPageIcon from '../Icon/LastPageIcon';

interface PaginationProps {
  totalRows: number;
  rowsPerPageOptions: number[];
  currentPage: number;
  onPageChange: (page: number) => void;
  rowsPerPage: number;
  onRowsPerPageChange: (rows: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  totalRows,
  rowsPerPageOptions,
  currentPage,
  onPageChange,
  rowsPerPage,
  onRowsPerPageChange,
}) => {
  const totalPages = Math.ceil(totalRows / rowsPerPage);
  const [tempPage, setTempPage] = useState<number>(currentPage); // Temporary state for user input

  useEffect(() => {
    setTempPage(currentPage)
  }, [currentPage])
  
  const handleNext = () => {
    if (currentPage < totalPages) {
      setTempPage(currentPage + 1)
      onPageChange(currentPage + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setTempPage(currentPage - 1)
      onPageChange(currentPage - 1);
    }
  };

  const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempPage(Number(e.target.value)); // Set temporary value
  };

  const handlePageSubmit = () => {
    if (currentPage === tempPage) return
    if (tempPage < 1) {
      setTempPage(1)
      onPageChange(1);
      return
    }
    if (tempPage > totalPages) {
      setTempPage(totalPages)
      onPageChange(totalPages);
      return
    }
    onPageChange(tempPage);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handlePageSubmit(); // Call onPageChange when "Enter" is pressed
    }
  };

  const handleBlur = () => {
    handlePageSubmit(); // Call onPageChange when the input loses focus
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent={"flex-end"}
      color="white"
      gap={"50px"}
    >
      <Box display="flex" alignItems="center" gap="25px">
        <Box display="flex" alignItems="center" gap="11px">
          <Typography>Rows per page:</Typography>
          <Select
            value={rowsPerPage}
            onChange={(e) => onRowsPerPageChange(Number(e.target.value))}
            variant="outlined"
            size="small"
            sx={{
              color: 'white',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              },
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#FFFFFF30',
              },
              '& .MuiSvgIcon-root': {
                color: 'white',
              },
            }}
          >
            {rowsPerPageOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </Box>

        <Typography>
          {currentPage * rowsPerPage - rowsPerPage + 1}-
          {Math.min(currentPage * rowsPerPage, totalRows)} of {totalRows} rows
        </Typography>
      </Box>

      <Box display="flex" alignItems="center" gap="25px">
        <Box display="flex" alignItems="center" gap="15px">
          <Button
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
            size="small"
            sx={{
              p: 0,
              minWidth: '14px',
              '&.Mui-disabled': {
                opacity: 0.5,
                color: 'white',
              },
            }}
          >
            <FirstPageIcon />
          </Button>
          <Button
            onClick={handlePrevious}
            disabled={currentPage === 1}
            size="small"
            sx={{
              p: 0,
              color: 'white',
              gap: '7px',
              '&.Mui-disabled': {
                opacity: 0.5,
                color: 'white',
              },
            }}
          >
            <PreviousPageIcon /> Previous
          </Button>
        </Box>
        <Box display="flex" alignItems="center" gap="10px">
          <TextField
            type="number"
            value={tempPage}
            onChange={handlePageInputChange}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            inputProps={{ min: 1, max: totalPages }}
            size="small"
            sx={{
              width: '60px',
              input: {
                color: 'white',
                textAlign: 'center',
                // Hides the arrows for number input
                '&::-webkit-outer-spin-button': {
                  display: 'none',
                },
                '&::-webkit-inner-spin-button': {
                  display: 'none',
                },
                '&[type=number]': {
                  MozAppearance: 'textfield',
                },
              },
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#FFFFFF30',
                },
                '&:hover fieldset': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
              },
            }}
          />
          <Typography>of {totalPages}</Typography>
        </Box>
        <Box display="flex" alignItems="center" gap="15px">
          <Button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            size="small"
            sx={{
              p: 0,
              color: 'white',
              gap: '7px',
              '&.Mui-disabled': {
                opacity: 0.5,
                color: 'white',
              },
            }}
          >
            Next <NextPageIcon />
          </Button>
          <Button
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
            size="small"
            sx={{
              p: 0,
              minWidth: '14px',
              '&.Mui-disabled': {
                opacity: 0.5,
                color: 'white',
              },
            }}
          >
            <LastPageIcon />
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Pagination;
