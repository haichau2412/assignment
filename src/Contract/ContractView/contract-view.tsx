import { Box } from "@mui/material";
import guestDataManager from "../helper/storage";
import SearchAddPolicy from "../ContractCreate/PolicySchemaViewer";
import InsuredObjectTable from "../sharedUI/InsuredObjectList";
import { useStepper, Stepper } from "../../libs/formBuilder/UI/Stepper";
import FormChildrenGenerator from "../../libs/formBuilder/UI/FormChildrenBuilder";
import { JSONSchema } from "../../libs/formBuilder/helper/policySchemaParser";
import { createSchemaHelper } from "../../libs/formBuilder/helper/policySchemaParser";
import { useState } from "react";

interface ViewContractProps {
  contractId: string;
}

const ViewContract = ({ contractId }: ViewContractProps) => {
  const insuredData = guestDataManager.getSavedContract(contractId);
  const insuredObject = insuredData?.data?.insured_object;

  const JSONData: JSONSchema = guestDataManager.getPolicySchemaById(
    insuredData?.policySchemaId
  );
  const productSchemaHelper = createSchemaHelper(JSONData);

  const data = useStepper({
    steps: productSchemaHelper.getGeneralSteps(true),
  });

  return (
    <Box sx={{ width: " 100%", maxHeight: "50vh" }}>
      <Stepper {...data} />

      {data.active === "insured_object" ? (
        <>
          {insuredObject?.length > 0 && (
            <InsuredObjectTable tableData={insuredObject} />
          )}
        </>
      ) : (
        <FormChildrenGenerator
          schema={productSchemaHelper.getGeneralStepSchema(data.active)}
          value={insuredData?.data[data.active]}
          readOnly={true}
        />
      )}
    </Box>
  );
};

export const ContractView = () => {
  const [contractId, setContractId] = useState<string | null>(null);
  const insuredData = guestDataManager.getAllSavedContract();

  return (
    <Box sx={{ maxWidth: "100%", marginX: "30px", mt: "7rem" }}>
      <SearchAddPolicy
        label={"Search Contract Id"}
        onAddItem={setContractId}
        buttonText="View"
        dataSet={insuredData.map((d) => ({
          id: d.contractId,
          content: d.contractId,
        }))}
      />
      {contractId && <ViewContract contractId={contractId} />}
    </Box>
  );
};
