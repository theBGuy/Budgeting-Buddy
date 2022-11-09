import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function YearForm (props) {
  const [form, setForm] = useState({
    year: "",
    budget: "",
  });
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (params.year) {
      async function fetchData() {
          
        const response = await fetch(`http://localhost:5000/year/${params.year}`);
            
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
            
        setForm(record);
      }
            
      fetchData();
            
      return;
    }
  }, [params.year, navigate]);
    
  function updateForm(value) {
    return setForm((prev) => {
      return { ...prev, ...value };
    });
  }

  async function onSubmit(e) {
    e.preventDefault();
    const { isCreate } = props;
        
    if (isCreate) {
      // When a post request is sent to the create url, we'll add a new record to the database.
      const newYear = { ...form };
            
      await fetch("http://localhost:5000/year/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newYear),
      })
        .catch(error => {
          window.alert(error);
          return;
        });
            
      setForm({ year: "", budget: "" });
    } else {
      const editedYear = {
        year: form.year,
        budget: form.budget,
      };
            
      // This will send a patch request to update the data in the database.
      await fetch(`http://localhost:5000/year/${params.year}`, {
        method: "PATCH",
        body: JSON.stringify(editedYear),
        headers: {
          'Content-Type': 'application/json'
        },
      });
    }
        
    navigate("/");
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="form-group">
        <label htmlFor="year">Year</label>
        <input
          type="text"
          className="form-control"
          id="year"
          minLength={4}
          maxLength={4}
          value={form.year}
          onChange={(e) => updateForm({ year: e.target.value })}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="budget">Budget</label>
        <input
          type="number"
          className="form-control"
          id="budget"
          value={form.budget}
          onChange={(e) => updateForm({ budget: e.target.value })}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="budget">Months</label>
        <input
          type="number"
          className="form-control"
          id="budget"
          value={form.budget}
          onChange={(e) => updateForm({ budget: e.target.value })}
          required
        />
      </div>
      <div className="form-group">
        <input
          type="submit"
          value={props.isCreate ? "Create Year" : "Edit Year"}
          className="btn btn-primary"
        />
      </div>
    </form>
  );
}