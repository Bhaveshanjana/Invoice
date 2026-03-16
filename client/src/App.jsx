import { Routes, Route } from "react-router-dom";
import CreateInvoice from "@/pages/CreateInvoice";
import ViewInvoice from "@/pages/ViewInvoice";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<CreateInvoice />} />
      <Route path="/invoice/:id" element={<ViewInvoice />} />
    </Routes>
  );
};

export default App;