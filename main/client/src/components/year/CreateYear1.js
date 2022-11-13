import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { generateMonthsArr } from "../../utils/general";
import MonthsGrid from "./MonthsGrid";
import api from "../../api/api";
import "./year.css";

export default function YearForm(props) {
  const navigate = useNavigate();
  const [year, setYear] = useState(new Date().getFullYear());
  const [remaining, setRemaining] = useState(0);
  const [budget, setBudget] = useState("");
  const [distribution, setDistribution] = useState(0);
  const [months, setMonths] = useState(createMonthsObject(0, 0));

  const updateYear = (e) => setYear(Number(e.target.value));

  function getDistribution(n) {
    const distributed = Math.floor(n / 12);
    const remainder = n % 12;
    return { distributed, remainder };
  }

  function populateYears() {
    const currentYear = new Date().getFullYear();
    const maxYear = currentYear + 99;
    let yearsArr = [];

    for (let i = currentYear; i <= maxYear; i++) {
      yearsArr.push(
        <option key={i} value={i}>
          {i}
        </option>
      );
    }

    return yearsArr;
  }

  function createMonthsObject(distributed, remainder) {
    const monthsArr = generateMonthsArr();
    const months = Object.fromEntries(
      monthsArr.map((month) => [month, { budget: distributed, max: distributed }])
    );
    months["January"].budget += remainder;
    months["January"].max += remainder;
    return months;
  }

  const updateBudget = (e) => {
    const newBudget = e.target.value > 0 ? e.target.value : 0;
    const { distributed, remainder } = getDistribution(newBudget);
    setBudget(newBudget);
    setRemaining(0);
    setMonths(createMonthsObject(distributed, remainder));
  };

  async function handleSubmit(e) {
    e.preventDefault();
    const newYear = { year, budget, months };
    console.log("newYear", newYear);
    const { success } = await api.createYear(newYear);
    if (success) {
      navigate("/");
    }
  }

  return (
    <div className="year-creation">
      <div className="container">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="year">Year</label>
            <select value={year} className="form-control" onChange={updateYear} required>
              {populateYears()}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="budget">Budget</label>
            <input
              type="number"
              className="form-control"
              id="budget"
              value={budget}
              min={0}
              onChange={updateBudget}
              required
            />
          </div>
          <div className="remaining">Remaining {remaining}</div>
          <MonthsGrid
            distribution={distribution}
            budget={budget}
            months={months}
            setMonths={setMonths}
            remaining={remaining}
            setRemaining={setRemaining}
          />
          <div className="form-group">
            <input type="submit" value="Create Year" className="btn btn-primary" />
          </div>
        </form>
      </div>
    </div>
  );
}
