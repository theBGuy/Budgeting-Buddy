import { useState, useEffect } from "react";
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import Year from "./Year";
import api from "../../api/api";

const Years = () => {
  const [years, setYears] = useState([]);

  async function getYears() {
    const years = await api.getYears();
    setYears(years);
  }

  async function deleteYear(year) {
    const { acknowledged } = await api.deleteYear(year);
    if (acknowledged) {
      // setYears((prev) => prev.filter((year) => year.year !== year));
      getYears();
    }
  }

  useEffect(() => {
    getYears();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <TableContainer>
      <Table className="table table-striped" style={{ marginTop: 5 }}>
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            <TableCell>Year</TableCell>
            <TableCell align="right">Budget</TableCell>
            <TableCell align="right">Spent</TableCell>
            <TableCell align="right">Remaining</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {years.map((year) => (
            <Year year={year} deleteYear={deleteYear} key={year._id} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default Years;
