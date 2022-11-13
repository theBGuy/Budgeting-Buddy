import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FormGroup,
  FormControlLabel,
  Checkbox,
  TextField,
  Button,
  FormControl,
  FormLabel,
  ButtonGroup,
} from "@mui/material";
import api from "../../api/api";
import "./envelope.css";

function CreateEnvelope() {
  const params = useParams();
  const navigate = useNavigate();
  const [months, setMonths] = useState([]);
  const [monthIds, setMonthIds] = useState([]);
  const [category, setCategory] = useState("");
  const [budget, setBudget] = useState("");

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
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const envelope = { monthIds, category, budget };
    const { success } = await api.createEnvelope(envelope);
    if (success) {
      navigate("/");
    }
  }

  function selectAll() {
    setMonthIds(months.map((month) => month._id));
  }

  function deselectAll() {
    const paramMonthId = months.find((month) => month.month === params.month)._id;
    setMonthIds([paramMonthId]);
  }

  useEffect(() => {
    async function getMonths() {
      const year = await api.getYear(params.year);
      const months = year.months;
      const paramsMonth = months.find((month) => month.month === params.month);
      setMonths(months);
      setMonthIds([paramsMonth._id]);
    }

    getMonths();
  }, [params.month, params.year]);

  return (
    <div className="create-envelope-container">
      <form onSubmit={handleSubmit}>
        <FormGroup>
          <FormControl
            required
            error={false}
            component="fieldset"
            sx={{ m: 3 }}
            variant="standard"
          >
            <FormLabel component="legend">Select Months</FormLabel>

            {months.map((month) => (
              <FormControlLabel
                key={month._id}
                control={
                  <Checkbox
                    id={month._id}
                    checked={monthIds.includes(month._id)}
                    onChange={updateMonthIds}
                    disabled={monthIds.length === 1 && monthIds[0] === month._id}
                  />
                }
                label={month.month}
              />
            ))}
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
            value={category}
            onChange={updateCategory}
            margin="normal"
            sx={{ width: "40ch" }}
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
    </div>
  );
}

export default CreateEnvelope;
