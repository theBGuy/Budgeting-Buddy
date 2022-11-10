import React from "react";
import YearForm from "./year-form-proposal/yearForm1.js";
 
export default function CreateYear() {
 
  // This following section will display the form that takes the input from the user.
  return (
    <div>
      <h3>Create New Year</h3>
      <YearForm isCreate />
    </div>
  );
}