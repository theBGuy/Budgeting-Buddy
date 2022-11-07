import React from "react";
import EnvelopeForm from "./envelopeForm";
 
export default function CreateEnvelope() {
 
  // This following section will display the form that takes the input from the user.
  return (
    <div>
      <h3>Create New Envelope</h3>
      <EnvelopeForm isCreate />
    </div>
  );
}