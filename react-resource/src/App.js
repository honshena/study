import logo from "./logo.svg";
import "./App.css";
import Index from "./pages/Index";
import { __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED } from "react";
window.ReactSharedInternals =
  __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
console.log(
  "ReactSharedInternals:",
  __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED
);

function App() {
  return <Index />;
}

export default App;
