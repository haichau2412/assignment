import { useStepper, Stepper } from "../../libs/formBuilder/UI/Stepper";
import FormChildrenGenerator from "../../libs/formBuilder/UI/FormChildrenBuilder";
import { JSONSchema } from "../../libs/formBuilder/helper/policySchemaParser";
import { createSchemaHelper } from "../../libs/formBuilder/helper/policySchemaParser";
import { SearchAddInsuredObject } from "./InsuredObject/InsureObject";
import { Box, Button, Grid2 } from "@mui/material";
import guestDataManager from "../helper/storage";
import { v4 as uuid } from "uuid";
import { useReducer } from "react";
import { SavedPolicy } from "../helper/storage";
import { useEffect, memo } from "react";
import InsuredObjectTable from "../sharedUI/InsuredObjectList";

type Action = { type: "UPDATE_DATA"; payload: Record<string, any> };
const policyReducer = (state: SavedPolicy, action: Action): SavedPolicy => {
  switch (action.type) {
    case "UPDATE_DATA":
      return { ...state, data: { ...state.data, ...action.payload } };
    default:
      return state;
  }
};

const useContract = (initialPolicyState: SavedPolicy) => {
  const [state, dispatch] = useReducer(policyReducer, initialPolicyState);

  return {
    state,
    updateData: (data: Record<string, any>) =>
      dispatch({ type: "UPDATE_DATA", payload: data }),
  };
};

interface NewContractProps {
  schemaId: string;
}

export const NewContract = memo(({ schemaId }: NewContractProps) => {
  const { state, updateData } = useContract({
    contractId: uuid(),
    contractName: `createdAt ${Date.now()}`,
    policySchemaId: schemaId,
    data: {},
  });

  useEffect(() => {
    guestDataManager.updateSavedContract(state.contractId, state);
  }, [state]);

  const JSONData: JSONSchema = guestDataManager.getPolicySchemaById(schemaId);
  
  const productSchemaHelper = createSchemaHelper(JSONData);

  const data = useStepper({
    steps: productSchemaHelper.getGeneralSteps(),
  });

  const onSubmit = (formData: Record<string, any>) => {
    if (data.active === "insured_object") {
      const insured_object = state.data.insured_object || [];
      updateData({
        insured_object: [...insured_object, formData],
      });
    } else {
      updateData({
        [data.active]: formData,
      });
    }
    data.setComplete(data.active);

    if (data.canMoveNext && data.active !== "insured_object") {
      data.moveNext();
    }
  };

  const renderView = () => {
    if (data.active === "insured_object") {
      return (
        <Grid2
          container
          direction={"column"}
          sx={{ width: " 100%", alignItems: "flex-end" }}
        >
          <SearchAddInsuredObject
            policySchema={JSONData}
            onSubmit={onSubmit}
            dataSet={productSchemaHelper.getInsuredObjectProductList()}
          />

          {state.data.insured_object?.length > 0 && (
            <InsuredObjectTable tableData={state.data.insured_object} />
          )}

          <Button
            variant="contained"
            sx={{ mt: "10px" }}
            onClick={() => {
              data.moveNext();
            }}
          >
            Next
          </Button>
        </Grid2>
      );
    }

    if (data.active === "done") {
      return (
        <Grid2
          container
          direction={"column"}
          sx={{ width: " 100%", alignItems: "flex-end" }}
        >
          <p>New Insurance Policy Registration Successfully</p>
        </Grid2>
      );
    }

    return (
      <FormChildrenGenerator
        schema={productSchemaHelper.getGeneralStepSchema(data.active)}
        onSubmit={onSubmit}
      />
    );
  };

  return (
    <Box sx={{ width: " 100%" }}>
      <Stepper {...data} />
      {renderView()}
    </Box>
  );
});
