import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  FormGroup,
  Checkbox,
  TextField,
  Button,
  FormControl,
  FormLabel,
  ButtonGroup,
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
} from "@mui/material";
import api from "../../api/api";
import "./envelope.css";

function EnvelopeForm() {
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const isEdit = location.pathname.split("/").at(-1) === "edit";
  const { year, month, envelope } = location.state;

  const [monthIds, setMonthIds] = useState([month._id]);
  const [category, setCategory] = useState(envelope ? envelope.category : "");
  const [months, setMonths] = useState(year.months);
  const [budget, setBudget] = useState("");
  const [envelopes, setEnvlopes] = useState([]);

  const updateBudget = (e) => setBudget(e.target.value);
  const updateCategory = (e) => setCategory(e.target.value);
  function updateMonthIds(e) {
    const monthId = e.target.id;
    const checked = e.target.checked;
    if (checked) {
      setMonthIds((prev) => [...prev, monthId]);
    } else {
      setMonthIds((prev) => prev.filter((x) => x !== monthId));
    }
    console.log(monthIds);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const envelopeData = {
      year: year.year,
      category,
      budget,
      monthIds,
      envelopes,
    };
    if (isEdit) {
      await api.updateEnvelopes(envelopeData);
    } else {
      await api.createEnvelope(envelopeData);
    }
    navigate("/");
  }

  async function selectAll() {
    setMonthIds(year.months.map((month) => month._id));
  }

  function deselectAll() {
    const paramMonthId = year.months.find(
      (month) => month.month === params.month
    )._id;
    setMonthIds([paramMonthId]);
  }

  function filterMonths(months, envelopesMonthIds) {
    return months.filter((month) => envelopesMonthIds.includes(month._id));
  }

  async function getEnvelopesByCategory(category) {
    const envelopesByCategory = await api.getEnvelopesByCategory(category);
    return envelopesByCategory;
  }

  function extractMonthIds(envelopes) {
    const monthIds = envelopes.map((envelope) => envelope.monthId);
    return monthIds;
  }

  async function determineAvailableMonths(category, months) {
    const envelopesByCategory = await getEnvelopesByCategory(category);
    setEnvlopes(envelopesByCategory);
    const extractedMonthIds = extractMonthIds(envelopesByCategory);
    const availableMonths = filterMonths(months, extractedMonthIds);
    return availableMonths;
  }

  async function getAndSetAvailableMonths(category, months) {
    const availableMonths = await determineAvailableMonths(category, months);
    setMonths(availableMonths);
  }

  useEffect(() => {
    if (isEdit) {
      getAndSetAvailableMonths(envelope.category, months);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="create-envelope-container">
      <Box sx={{ margin: 1, border: 2, borderRadius: 2, paddingLeft: 2, paddingRight: 2, paddingBottom: 2 }}>
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <FormControl
              required
              error={false}
              component="fieldset"
              sx={{ m: 3 }}
              variant="standard"
            >
              <Typography variant="h5" gutterBottom component="div">
                Year  {year.year}
              </Typography>
              <FormLabel component="legend">Select Months</FormLabel>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox"></TableCell>
                    <TableCell>Month</TableCell>
                    <TableCell align="right">Budget</TableCell>
                    <TableCell align="right">Non Allocated</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {months.map((month) => (
                    <>
                      <TableRow key={month._id}>
                        <TableCell padding="checkbox">
                          <Checkbox
                            id={month._id}
                            checked={monthIds.includes(month._id)}
                            onChange={updateMonthIds}
                            disabled={
                              monthIds.length === 1 && monthIds[0] === month._id
                            }
                          />
                        </TableCell>
                        <TableCell>{month.month}</TableCell>
                        <TableCell align="right">{month.budget}</TableCell>
                        <TableCell align="right">{month.budget - month.allocatedBudget}</TableCell>
                      </TableRow>
                      {envelopes.filter((el) => el.monthId === month._id).map((el) => (
                        <TableRow key={el._id} sx={{ backgroundColor: "lightgray"}}>
                          <TableCell></TableCell>
                          <TableCell>{el.category}</TableCell>
                          <TableCell align="right">{el.budget}</TableCell>
                          <TableCell></TableCell>
                        </TableRow>
                      ))}
                    </>
                  ))}
                </TableBody>
              </Table>
              <ButtonGroup>
                <Button onClick={selectAll}>Select All</Button>
                <Button onClick={deselectAll}>Deselect All</Button>
              </ButtonGroup>
            </FormControl>
          </FormGroup>

          <FormGroup>
            <TextField
              id="outlined"
              label="Category"
              name="category"
              value={isEdit ? envelope.category : category}
              onChange={updateCategory}
              margin="normal"
              sx={{ width: "40ch" }}
              disabled={isEdit ? true : false}
              required
            />
          </FormGroup>

          <FormGroup>
            <TextField
              id="outlined"
              label="Budget"
              name="budget"
              value={budget}
              onChange={updateBudget}
              inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
              margin="normal"
              sx={{ width: "40ch" }}
              required
            />
          </FormGroup>

          <Button type="submit" variant="contained">
            Submit
          </Button>
        </form>
      </Box>
    </div>
  );
}

export default EnvelopeForm;
