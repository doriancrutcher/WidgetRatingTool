import "regenerator-runtime/runtime";
import React, { useState } from "react";

import "./assets/global.css";

import { EducationalText, SignInPrompt, SignOutButton } from "./ui-components";
import Scale from "./Components/Scale";

export default function App({ isSignedIn, contractId, wallet }) {
  return (
    <div>
      <Scale />
    </div>
  );
}
