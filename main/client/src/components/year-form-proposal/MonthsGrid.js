import { useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import './some.css';
const activeStyle = { color: 'white', background: 'blue', height: '100%'};
const inactiveStyle = { color: 'gray', background: 'dimgray', height: '100%'};
function MonthsGrid({budget, months, setMonths, remaining, setRemaining}) {
  const [step, setStep] = useState(1);

  function stepUp(month) {
    /* 
    todo:
      copy behavior for increasing monthly budget.
      create stepButtons that change step state value.
      increment by step value.
      if newValue is to go over remaining, set newValue to what's left of remaining.
    */
  }

  function stepDown(month) {
    /* 
    todo:
    copy behavior for decreasing monthly budget.
    step buttons.
    decrement by step value.
    if newValue is to go below zero, set it to zero instead.
    */
  }

  function handleChange(e) {
    const month = e.target.id;
    const updatedMonths = {...months};
    const previousMonthBudget = months[month].budget;
    // ensure we don't go over max value
    const currentMonthBudget = Number(e.target.value) < months[month].max ? Number(e.target.value) : months[month].max;

    if (previousMonthBudget > currentMonthBudget) {
      for (const month in updatedMonths) {
        if (month !== e.target.id) {
          months[month].max += (previousMonthBudget - currentMonthBudget)
        }
      }
    }

    if (previousMonthBudget < currentMonthBudget) {
      for (const month in updatedMonths) {
        if (month !== e.target.id) {
          months[month].max -= (currentMonthBudget - previousMonthBudget)
        }
      }
    }
    console.log(previousMonthBudget);
    console.log(currentMonthBudget);
    updatedMonths[month].budget = currentMonthBudget;
    const total = Object.entries(updatedMonths).reduce((a, b) => a + b[1].budget, 0);
    console.log(total);
    setMonths(updatedMonths);
    setRemaining(budget - total);
  }

  return (
    <div className="months-grid">
      {Object.keys(months).map(month => {
        return <div className="month">
          <div>{month}</div>
          <div className="month-budget">
            <RemoveIcon onClick={() => stepDown(month)} sx={activeStyle} />
            <input id={month} type="number" value={months[month].budget <= 0 ? "" : months[month].budget} min={0} max={months[month].max} onChange={handleChange} disabled={false}/>
            <AddIcon onClick={() => stepUp(month)} sx={remaining <= 0 ? inactiveStyle : activeStyle}/>
          </div>
        </div>
      })}
    </div>
  )
}

export default MonthsGrid;