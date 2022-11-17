import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Table, TableCell, TableHead, TableRow } from "@mui/material";
import { Box, Collapse, IconButton, TableBody } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Envelopes from "../envelope/Envelopes";

const Month = ({ year, month }) => {
  const [showEnv, setOpenEnv] = useState(false);

  return (
    <React.Fragment>
      <TableRow>
        <TableCell>
          <IconButton
            aria-label="expand month"
            size="small"
            onClick={() => setOpenEnv(!showEnv)}
          >
            {showEnv ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>{month.month}</TableCell>
        <TableCell align="right">{month.budget}</TableCell>
        <TableCell align="right">{month.spent}</TableCell>
        <TableCell align="right">{month.remaining}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={showEnv} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Table
                size="small"
                className="envelopes"
                sx={{ bgcolor: "darkgray" }}
              >
                <TableHead>
                  <TableRow>
                    <TableCell>Category</TableCell>
                    <TableCell align="right">Budget</TableCell>
                    <TableCell align="right">Spent</TableCell>
                    <TableCell align="right">Remaining</TableCell>
                    <TableCell align="right">
                      <Link
                        className="btn btn-link"
                        to={`/${year.year}/${month.month}/createEnvelope`}
                        state={{ year, month }}
                      >
                        Create Envelope
                      </Link>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <Envelopes year={year} month={month} key={month._id} />
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};

export default Month;
