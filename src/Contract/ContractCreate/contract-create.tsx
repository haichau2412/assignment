import PolicyImport from "./PolicyImport";
import SearchAddPolicy from "./PolicySchemaViewer";
import { Box } from "@mui/material";
import guestDataManager from "../helper/storage";
import { NewContract } from "./ContractCreate";
import { useEffect, useState } from "react";
import { JSONSchema } from "../../libs/formBuilder/helper/policySchemaParser";

const PolicyCreate = () => {
  const [newContractSchema, setNewContractSchema] = useState<string | null>(
    null
  );
  const [policySchema, setPolicySchema] = useState<
    (JSONSchema & {
      policyName: string;
    })[]
  >(guestDataManager.getAllPolicySchema());

  useEffect(() => {
    const onImport = () => {

      setPolicySchema(guestDataManager.getAllPolicySchema());
    };

    guestDataManager.emitter.on("new-policy", onImport);

    return () => {
      guestDataManager.emitter.off("new-policy", onImport);
    };
  }, []);
  return (
    <Box
      sx={{
        display: "flex",
        p: "3rem 2rem",
        mt: "7rem",
      }}
    >
      {newContractSchema ? (
        <NewContract schemaId={newContractSchema} />
      ) : (
        <>
          <PolicyImport />
          <SearchAddPolicy
            label={"Search Policy Schema"}
            buttonText="Add"
            onAddItem={setNewContractSchema}
            dataSet={policySchema.map((d) => ({
              id: d.productId,
              content: d.policyName,
            }))}
          />
        </>
      )}
    </Box>
  );
};

export default PolicyCreate;
