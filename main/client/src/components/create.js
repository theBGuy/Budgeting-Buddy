import React, { useState } from "react";
import { useNavigate } from "react-router";
 
export default function Create() {
 const [form, setForm] = useState({
   name: "",
   position: "",
   level: "",
 });
 const navigate = useNavigate();
 
 // These methods will update the state properties.
 function updateForm(value) {
   return setForm((prev) => {
     return { ...prev, ...value };
   });
 }
 
 // This function will handle the submission.
 async function onSubmit(e) {
   e.preventDefault();
 
   // When a post request is sent to the create url, we'll add a new record to the database.
   const newEnvelope = { ...form };
 
   await fetch("http://localhost:5000/envelope/", {
     method: "POST",
     headers: {
       "Content-Type": "application/json",
     },
     body: JSON.stringify(newEnvelope),
   })
   .catch(error => {
     window.alert(error);
     return;
   });
 
   setForm({ month: "", category: "", budget: "" });
   navigate("/");
 }
 
 // This following section will display the form that takes the input from the user.
 return (
   <div>
     <h3>Create New Envelope</h3>
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
       <div className="form-group">
         <input
           type="submit"
           value="Create envelope"
           className="btn btn-primary"
         />
       </div>
     </form>
   </div>
 );
}