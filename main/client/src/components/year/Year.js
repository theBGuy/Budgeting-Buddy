import { useState } from "react";
import { Link } from "react-router-dom";
import { Table, TableCell, TableHead, TableRow } from "@mui/material";
import {
  Box,
  Collapse,
  IconButton,
  TableBody,
  Typography,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Months from "../month/Months";

const Year = ({ year, deleteYear }) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
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
          {year.year}
        </TableCell>
        <TableCell align="right">{year.budget}</TableCell>
        <TableCell align="right">{year.spent}</TableCell>
        <TableCell align="right">{year.remaining}</TableCell>
        <TableCell align="right">
          <Link className="btn btn-link" to={`/editYear/${year.year}`}>
            Edit
          </Link>{" "}
          |
          <button
            className="btn btn-link"
            onClick={() => deleteYear(year.year)}
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
                    <TableCell></TableCell>
                    <TableCell>Month</TableCell>
                    <TableCell align="right">Budget</TableCell>
                    <TableCell align="right">Spent</TableCell>
                    <TableCell align="right">Remaining</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <Months year={year} months={year.months} />
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

export default Year;
