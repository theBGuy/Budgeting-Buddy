import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function EnvelopeForm(props) {
  const params = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    month: "",
    category: "",
    budget: "",
  });

  useEffect(() => {
    if (params.id) {
      async function fetchData() {
        const response = await fetch(
          `http://localhost:5000/envelope/${params.id}`
        );

        if (!response.ok) {
          const message = `An error has occurred: ${response.statusText}`;
          window.alert(message);
          return;
        }

        const record = await response.json();
        if (!record) {
          window.alert(`Record with id ${params.id} not found`);
          navigate("/");
          return;
        }

        setForm(record);
      }

      fetchData();

      return;
    }
  }, [params.id, navigate]);

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
      const newEnvelope = { ...form };
      await fetch(
        `http://localhost:5000/year/${params.year}/${params.month}/add`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(
            Object.assign(newEnvelope, { monthId: params.month })
          ),
        }
      ).catch((error) => {
        window.alert(error);
        return;
      });

      setForm({ month: "", category: "", budget: "" });
    } else {
      const editedEnvelope = {
        month: form.month,
        category: form.category,
        budget: form.budget,
      };

      // This will send a patch request to update the data in the database.
      await fetch(`http://localhost:5000/envelope/update/${params.id}`, {
        method: "PATCH",
        body: JSON.stringify(editedEnvelope),
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    navigate("/");
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="form-group">
        <label htmlFor="month">Month</label>
        <select
          value={form.month}
          className="form-control"
          onChange={(e) => updateForm({ month: e.target.value })}
          required
        >
          <option value="January">January</option>
          <option value="Febuary">Febuary</option>
          <option value="March">March</option>
          <option value="April">April</option>
          <option value="May">May</option>
          <option value="June">June</option>
          <option value="July">July</option>
          <option value="August">August</option>
          <option value="September">September</option>
          <option value="October">October</option>
          <option value="November">November</option>
          <option value="December">December</option>
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="category">Category</label>
        <input
          type="text"
          className="form-control"
          id="category"
          value={form.category}
          onChange={(e) => updateForm({ category: e.target.value })}
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
        {/* todo - exit button?*/}
        <input
          type="submit"
          value={props.isCreate ? "Create Envelope" : "Edit Envelope"}
          className="btn btn-primary"
        />
      </div>
    </form>
  );
}
