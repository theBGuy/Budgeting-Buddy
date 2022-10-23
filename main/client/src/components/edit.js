import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
 
export default function Edit() {
 const [form, setForm] = useState({
   name: "",
   position: "",
   level: "",
   records: [],
 });
 const params = useParams();
 const navigate = useNavigate();
 
 useEffect(() => {
   async function fetchData() {
     const id = params.id.toString();
     const response = await fetch(`http://localhost:5000/envelope/${params.id.toString()}`);
 
     if (!response.ok) {
       const message = `An error has occurred: ${response.statusText}`;
       window.alert(message);
       return;
     }
 
     const record = await response.json();
     if (!record) {
       window.alert(`Record with id ${id} not found`);
       navigate("/");
       return;
     }
 
     setForm(record);
   }
 
   fetchData();
 
   return;
 }, [params.id, navigate]);
 
 // These methods will update the state properties.
 function updateForm(value) {
   return setForm((prev) => {
     return { ...prev, ...value };
   });
 }
 
 async function onSubmit(e) {
   e.preventDefault();
   const editedEnvelope = {
     month: form.month,
     category: form.category,
     budget: form.budget,
   };
 
   // This will send a post request to update the data in the database.
   await fetch(`http://localhost:5000/envelope/update/${params.id}`, {
     method: "PATCH",
     body: JSON.stringify(editedEnvelope),
     headers: {
       'Content-Type': 'application/json'
     },
   });
 
   navigate("/");
 }
 
 // This following section will display the form that takes input from the user to update the data.
 return (
   <div>
     <h3>Update Envelope</h3>
     <form onSubmit={onSubmit}>
       <div className="form-group">
         <label htmlFor="month">Month</label>
         <select value={form.month} className="form-control" onChange={(e) => updateForm({ month: e.target.value })} required>
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
       <br />
 
       <div className="form-group">
         <input
           type="submit"
           value="Update Envelope"
           className="btn btn-primary"
         />
       </div>
     </form>
   </div>
 );
}