import { BrowserRouter, Route, Routes } from "react-router";
import DashboardLayout from "./Dashboard/dashboard-layout";
import PolicyCreate from "./Contract/ContractCreate/contract-create";
import DashboardMain from "./Dashboard/dashboard-main";
import { ContractView } from "./Contract/ContractView/contract-view";

const RoutesWrapper = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<DashboardMain />} />
          <Route path="create-policy" element={<PolicyCreate />} />
          <Route path="saved-policy" element={<ContractView />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export { RoutesWrapper };
