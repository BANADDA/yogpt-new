import { MoreVert } from '@mui/icons-material';
import { Box, Button, FormControl, IconButton, InputLabel, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { CSVLink } from 'react-csv';
import * as XLSX from 'xlsx';

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [filters, setFilters] = useState({ from: '', to: '', type: 'All', status: 'All' });

  useEffect(() => {
    const fetchTransactions = async () => {
      const data = [
        { date: '2024-03-12', time: '21:12', invoiceNo: '21031200001', type: 'USD', status: 'Paid', amount: '2000 USD' },
        { date: '2024-03-11', time: '12:18', invoiceNo: '21031100001', type: 'TAO', status: 'Pending', amount: '6 TAO' },
      ];
      setTransactions(data);
      setFilteredTransactions(data);
    };

    fetchTransactions();
  }, []);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const applyFilters = () => {
    let filtered = transactions;
    if (filters.from) {
      filtered = filtered.filter(transaction => new Date(transaction.date) >= new Date(filters.from));
    }
    if (filters.to) {
      filtered = filtered.filter(transaction => new Date(transaction.date) <= new Date(filters.to));
    }
    if (filters.type !== 'All') {
      filtered = filtered.filter(transaction => transaction.type === filters.type);
    }
    if (filters.status !== 'All') {
      filtered = filtered.filter(transaction => transaction.status === filters.status);
    }
    setFilteredTransactions(filtered);
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredTransactions);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");
    XLSX.writeFile(workbook, "transaction_history.xlsx");
  };

  const StatusLabel = ({ status }) => {
    const color = status === 'Paid' ? 'green' : '#990707';
    const bgColor = status === 'Paid' ? '#e0ffe0' : '#ffe0e0';

    return (
      <Box sx={{ border: `1px solid ${color}`, borderRadius: 2, padding: '2px 8px', display: 'inline-block', backgroundColor: bgColor }}>
        <Typography variant="body2" sx={{ color: color, fontWeight: 'bold' }}>
          {status}
        </Typography>
      </Box>
    );
  };

  return (
    <Box>
      <Paper elevation={3} sx={{ borderRadius: 2, padding: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
            Transaction History
          </Typography>
          <Box display="flex" gap={2}>
            <Button
              variant="contained"
              sx={{ textTransform: 'none', }}
              style={{ backgroundColor: '#a777e3' }}

              onClick={exportToExcel}
            >
              Export to Excel
            </Button>
            <CSVLink data={filteredTransactions} filename="transaction_history.csv" style={{ textDecoration: 'none' }}>
              <Button
                variant="contained"
                sx={{ textTransform: 'none', }}
                style={{ backgroundColor: '#a777e3' }}

              >
                Export to CSV
              </Button>
            </CSVLink>
          </Box>
        </Box>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="body2" component="div" sx={{ color: 'grey' }}>
            View your transaction history
          </Typography>
        </Box>
        <Box display="flex" gap={2} mb={2}>
          <FormControl sx={{ minWidth: 150 }}>
            <TextField
              type="date"
              name="from"
              value={filters.from}
              onChange={handleFilterChange}
              InputLabelProps={{ shrink: true }}
              label="From"
            />
          </FormControl>
          <FormControl sx={{ minWidth: 150 }}>
            <TextField
              type="date"
              name="to"
              value={filters.to}
              onChange={handleFilterChange}
              InputLabelProps={{ shrink: true }}
              label="To"
            />
          </FormControl>
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Type</InputLabel>
            <Select
              name="type"
              value={filters.type}
              onChange={handleFilterChange}
              label="Type"
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="USD">USD</MenuItem>
              <MenuItem value="TAO">TAO</MenuItem>
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Status</InputLabel>
            <Select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              label="Status"
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Paid">Paid</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
            </Select>
          </FormControl>
          <Button variant="contained" onClick={applyFilters} sx={{ textTransform: 'none', }} style={{ backgroundColor: '#a777e3' }}
          >
            Apply Filter
          </Button>
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>DATE & TIME</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>INVOICE NO.</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>TYPE</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>STATUS</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>AMOUNT</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTransactions.map((transaction, index) => (
                <TableRow key={index}>
                  <TableCell sx={{ fontWeight: 'bold' }}>{transaction.date} {transaction.time}</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>{transaction.invoiceNo}</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>{transaction.type}</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>
                    <StatusLabel status={transaction.status} />
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>{transaction.amount}</TableCell>
                  <TableCell>
                    <IconButton>
                      <MoreVert />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filteredTransactions.length === 0 && (
            <Box mt={2} p={2} sx={{ backgroundColor: '#FEDBDB', borderRadius: 1, textAlign: 'center' }}>
              <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', color: '#d32f2f' }}>
                No transactions found.
              </Typography>
            </Box>
          )}
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default TransactionHistory;
