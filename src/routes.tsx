import { BrowserRouter, Route, Routes } from "react-router";
import DashboardLayout from "dashboard/Layout";
import PolicyCreate from "contract/contract-view/ContractCreate";
import DashboardMain from "dashboard/Main";
import ContractView from "contract/contract-view/ContractView";

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
