import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Table, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { Box, Collapse, IconButton, TableBody, Typography } from '@mui/material';
import { KeyboardArrowDownIcon, KeyboardArrowUpIcon } from '@mui/icons-material';
 
// const Record = (props) => (
//   <tr>
//     <td>
//       <Link className="btn btn-link" to={`/view/${props.record.year}`}>{props.record.year}</Link> 
//     </td>
//     <td>{props.record.budget}</td>
//     <td>{props.record.spent}</td>
//     <td>{props.record.remaining}</td>
//     <td>
//       <Link className="btn btn-link" to={`/edit/${props.record.year}`}>Edit</Link> |
//       <button className="btn btn-link"
//         onClick={() => {
//           props.deleteRecord(props.record.year);
//         }}
//       >
//        Delete
//       </button>
//     </td>
//   </tr>
// );

const YearRecord = (props) => {
  const [open, setOpen] = useState(false);
  // const [open, setOpen] = useState(false);

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {props.record.year}
        </TableCell>
        <TableCell align="right">{props.record.budget}</TableCell>
        <TableCell align="right">{props.record.spent}</TableCell>
        <TableCell align="right">{props.record.remaining}</TableCell>
        <TableCell align="right">
          <Link className="btn btn-link" to={`/edit/${props.record.year}`}>Edit</Link> |
          <button className="btn btn-link"
            onClick={() => {
              props.deleteRecord(props.record.year);
            }}
          >
          Delete
          </button>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Months
              </Typography>
              <Table size="small" className="months">
                <TableHead>
                  <TableRow>
                    <TableCell>Month</TableCell>
                    <TableCell align="right">Budget</TableCell>
                    <TableCell align="right">Spent</TableCell>
                    <TableCell align="right">Remaining</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {props.record.months.map(row => (
                    <TableRow key={row._id} sx={{ '& > *': { borderBottom: 'unset' } }}>
                      <TableCell>{row.month}</TableCell>
                      <TableCell align="right">{row.budget}</TableCell>
                      <TableCell align="right">{row.spent}</TableCell>
                      <TableCell align="right">{row.remaining}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};
 
export default function RecordList() {
  const [records, setRecords] = useState([]);
 
  // This method fetches the records from the database.
  useEffect(() => {
    async function getRecords() {
      const response = await fetch(`http://localhost:5000/year/all`);
 
      if (!response.ok) {
        const message = `An error occurred: ${response.statusText}`;
        window.alert(message);
        return;
      }
 
      const records = await response.json();
      setRecords(records);
    }
 
    getRecords();
 
    return;
  }, [records.length]);
 
  // This method will delete a record
  async function deleteRecord(year) {
    await fetch(`http://localhost:5000/year/${year}`, {
      method: "DELETE"
    });
 
    const newYears = records.filter((el) => el.year !== year);
    setRecords(newYears);
  }
 
  // This method will map out the records on the table
  function recordList() {
    return records.map((record) => {
      return (
        <YearRecord
          record={record}
          deleteRecord={() => deleteRecord(record.year)}
          key={record._id}
        />
      );
    });
  }
 
  // This following section will display the table with the records of individuals.
  return (
    <TableContainer>
      <Table className="table table-striped" style={{ marginTop: 20 }}>
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            <TableCell>Year</TableCell>
            <TableCell align="right">Budget</TableCell>
            <TableCell align="right">Spent</TableCell>
            <TableCell align="right">Remaining</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>{recordList()}</TableBody>
      </Table>
    </TableContainer>
  );
}