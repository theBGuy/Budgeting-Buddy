import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MonthsGrid from "./MonthsGrid";
import "./year.css";

export default function YearForm(props) {
  const navigate = useNavigate();
  const params = useParams();
  const [year, setYear] = useState("");
  const [remaining, setRemaining] = useState(0);
  const [budget, setBudget] = useState("");
  const [distribution, setDistribution] = useState(0);
  const [months, setMonths] = useState(createMonthsObject(0, 0));

  useEffect(() => {
    if (params.year) {
      async function fetchData() {
        const response = await fetch(`http://localhost:5000/years/${params.year}`);

        if (!response.ok) {
          const message = `An error has occurred: ${response.statusText}`;
          window.alert(message);
          return;
        }

        const record = await response.json();
        if (!record) {
          window.alert(`Record with id ${params.year} not found`);
          navigate("/");
          return;
        }
        const yearInfo = record[0];

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
    const monthsArr = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

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

    if (isCreate) {
      // When a post request is sent to the create url, we'll add a new record to the database.
      console.log(JSON.stringify(newYear));
      await fetch("http://localhost:5000/years/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newYear),
      }).catch((error) => {
        window.alert(error);
        return;
      });
    } else {
      // // This will send a patch request to update the data in the database.
      await fetch(`http://localhost:5000/years/${year}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newYear),
      });
    }

    navigate("/");
  }

  return (
    <div className="year-creation">
      <div className="container">
        <form onSubmit={onSubmit}>
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
