import { useContext } from "react";
import { AppContext } from "./AppContext";

// Context: Step-3
// creating UseAppContext
export const UseAppContext = () => {
  return useContext(AppContext);
};

// Context: Step-4
// check main.jsx component. I've wrapped <App /> component with <AppContextProvider>.
