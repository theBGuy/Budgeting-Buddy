import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { generateMonthsArr } from "../../utils/general";
import MonthsGrid from "./MonthsGrid";
import api from "../../api/api";
import "./year.css";

export default function YearForm(props) {
  const navigate = useNavigate();
  const params = useParams();
  const [year, setYear] = useState(params.year ? params.year : new Date().getFullYear());
  const [usedYears, setUsedYears] = useState([]);
  const [remaining, setRemaining] = useState(0);
  const [budget, setBudget] = useState("");
  const [distribution] = useState(0);
  const [months, setMonths] = useState(createMonthsObject(0, 0));

  useEffect(() => {
    if (params.year) {
      async function fetchData() {
        const yearInfo = await api.getYear(params.year);

        setYear(yearInfo.year);
        setBudget(yearInfo.budget);

        const total = yearInfo.months.reduce((a, b) => a + b.budget, 0);
        const leftover = yearInfo.budget - total;
        setRemaining(leftover);
        const currMonths = Object.fromEntries(
          yearInfo.months.map((month) => [
            month.month,
            { budget: month.budget, max: month.budget + leftover },
          ])
        );
        setMonths(currMonths);
      }

      fetchData();

      return;
    } else {
      async function getUsedYears() {
        const years = await api.getYears();
        setUsedYears(years.map((el) => el.year));
      }

      getUsedYears();
    }
  }, [params.year, navigate]);

  const updateYear = (e) => setYear(Number(e.target.value));

  function getDistribution(n) {
    const distributed = Math.floor(n / 12);
    const remainder = n % 12;
    return { distributed, remainder };
  }

  function populateYears() {
    const currentYear = new Date().getFullYear();
    const maxYear = currentYear + 99;
    const yearsArr = [];

    for (let i = currentYear; i <= maxYear; i++) {
      if (usedYears.includes(i)) continue;
      yearsArr.push(
        <option key={i} value={i}>
          {i}
        </option>
      );
    }

    if (usedYears.includes(year)) {
      let nextYear = year + 1;
      while (usedYears.includes(nextYear)) {
        nextYear++;
      }
      setYear(nextYear);
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

  async function onSubmit(e) {
    e.preventDefault();
    const { isCreate } = props;
    const newYear = { year, budget, months };
    console.log("newYear", newYear);

    try {
      isCreate ? await api.createYear(newYear) : await api.updateYear(newYear);
      navigate("/");
    } catch(e) {
      console.log(e);
      window.alert(e);
    }
  }

  return (
    <div className="year-creation">
      <div className="container">
        <h3>{props.isCreate ? "Create Year" : "Edit Year"}</h3>
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label htmlFor="year">Year</label>
            <select 
              value={year}
              className="form-control"
              onChange={updateYear}
              required
              disabled={params.year ? true : false}
            >
              {params.year
                ? <option key={params.year} value={params.year}> {params.year} </option>
                : populateYears()
              }
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
            <input
              type="submit"
              value={props.isCreate ? "Create Year" : "Edit Year"}
              className="btn btn-primary"
            />
          </div>
        </form>
      </div>
    </div>
  );
}
