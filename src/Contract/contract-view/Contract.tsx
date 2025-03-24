import { useStepper, Stepper } from "./form-element/Stepper";
import FormChildrenGenerator from "./form-element/FormChildrenBuilder";
import { JSONSchema } from "../schema/schema-to-form/policySchemaParser";
import { createSchemaHelper } from "../schema/schema-to-form/policySchemaParser";
import { SearchAddInsuredObject } from "./InsuredObject";
import { Box, Button, Grid2 } from "@mui/material";
import guestDataManager from "../helper/storage";
import { v4 as uuid } from "uuid";
import { useReducer } from "react";
import { SavedPolicy } from "../helper/storage";
import { useEffect, memo } from "react";
import InsuredObjectTable from "../sharedUI/InsuredObjectList";
import { ErrorBoundary } from "react-error-boundary";
import FallbackBoundary from "../sharedUI/FallbackBoundary";

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

const NewContractView = ({
  contractSchema,
  schemaId,
}: {
  schemaId: string;
  contractSchema: JSONSchema;
}) => {
  const { state, updateData } = useContract({
    contractId: uuid(),
    contractName: `createdAt ${Date.now()}`,
    policySchemaId: schemaId,
    data: {},
  });

  useEffect(() => {
    guestDataManager.updateSavedContract(state.contractId, state);
  }, [state]);

  const productSchemaHelper = createSchemaHelper(contractSchema);

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
            policySchema={contractSchema}
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
    <ErrorBoundary FallbackComponent={FallbackBoundary}>
      <Box sx={{ width: " 100%" }}>
        <Stepper {...data} />
        {renderView()}
      </Box>
    </ErrorBoundary>
  );
};

export const NewContract = memo(({ schemaId }: NewContractProps) => {
  const JSONData: JSONSchema | undefined =
    guestDataManager.getPolicySchemaById(schemaId);

  return (
    <>
      {JSONData ? (
        <NewContractView schemaId={schemaId} contractSchema={JSONData} />
      ) : (
        <div>Can't not find schema config for {schemaId}</div>
      )}
    </>
  );
});
