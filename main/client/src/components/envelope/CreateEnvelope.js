import React from "react";
import EnvelopeForm from "./EnvelopeForm";
 
export default function CreateEnvelope() {
  return (
    <div>
      <h3>Create New Envelope</h3>
      <EnvelopeForm isCreate />
    </div>
  );
}