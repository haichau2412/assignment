import { useState } from "react";
import {
  TextField,
  Box,
  List,
  ListItem,
  ListItemText,
  Button,
  Grid2,
  Modal,
} from "@mui/material";
import FormChildrenGenerator from "../../../libs/formBuilder/UI/FormChildrenBuilder";
import { createSchemaHelper } from "../../../libs/formBuilder/helper/policySchemaParser";
import { useStepper, Stepper } from "../../../libs/formBuilder/UI/Stepper";
import { JSONSchema } from "../../../libs/formBuilder/helper/policySchemaParser";
import { useReducer, useMemo } from "react";
import { v4 as uuid } from "uuid";

interface SearchBarProps {
  dataSet: {
    id: string;
    content: string;
  }[];
  onSubmit: (data: Record<string, any>) => void;
  policySchema: JSONSchema;
}

export function SearchAddInsuredObject({
  dataSet,
  onSubmit,
  policySchema,
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [selectedData, setSelected] = useState<{
    id: string;
    content: string;
  } | null>(null);
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const filteredItems = dataSet.filter((item) =>
    item.content.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <>
      <Grid2
        container
        direction="row"
        sx={{
          p: "10px",
          justifyContent: "center",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <Box sx={{ width: 300 }}>
          <TextField
            fullWidth
            label="Search Insured Object"
            variant="outlined"
            value={selectedData?.content || query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (selectedData) {
                setSelected(null);
              }
            }}
          />

          {!selectedData && query && (
            <List
              sx={{
                mt: 2,
                maxHeight: 200,
                overflow: "auto",
                border: "1px solid #ccc",
                borderRadius: 1,
              }}
            >
              {filteredItems.length > 0 ? (
                filteredItems.map((item, index) => (
                  <ListItem
                    key={index}
                    onClick={() => {
                      setSelected(item);
                    }}
                  >
                    <ListItemText primary={item.content} />
                  </ListItem>
                ))
              ) : (
                <ListItem>
                  <ListItemText primary="No results found" />
                </ListItem>
              )}
            </List>
          )}
        </Box>
        {selectedData && (
          <Button
            variant="contained"
            onClick={() => {
              handleOpen();
            }}
          >
            Add
          </Button>
        )}
      </Grid2>
      <Modal
        open={open}
        onClose={() => {
          setOpen(false);
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{
          backgroundColor: "white",
          width: "90%",
          maxHeight: "80vh",
          height: "100%",
          margin: "auto",
          overflow: "scroll",
          overflowX: "hidden",
        }}
      >
        <>
          {selectedData?.id && (
            <InsuredObjectModal
              openModal={(open: boolean) => {
                setOpen(open);
              }}
              onSubmit={onSubmit}
              policySchema={policySchema}
              insuredObjectId={selectedData?.id}
            />
          )}
        </>
      </Modal>
    </>
  );
}

interface InsuredObjectModal {
  openModal: (open: boolean) => void;
  onSubmit: (data: Record<string, any>) => void;
  policySchema: JSONSchema;
  insuredObjectId: string;
}

type Action =
  | { type: "UPDATE_DATA"; payload: Record<string, any> }
  | { type: "RESET" };

const insuredObjectReducer = (
  state: Record<string, any>,
  action: Action
): Record<string, any> => {
  switch (action.type) {
    case "UPDATE_DATA":
      return { ...state, data: { ...state.data, ...action.payload } };
    case "RESET":
      return {};
    default:
      return state;
  }
};

function ChildModal({
  setOpen1,
  open,
  onConfirm,
}: {
  setOpen1: (toOpen: boolean) => void;
  onConfirm: () => void;
  open: boolean;
}) {
  // const handleClose = () => {
  //   setOpen1(false);
  // };

  return (
    <>
      <Modal
        open={open}
        onClose={() => {
          setOpen1(false);
          onConfirm();
        }}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
      >
        <Box sx={{ width: 200, margin: "auto", backgroundColor: "white" }}>
          <h2 id="child-modal-title">Unsaved Changes!</h2>
          <p id="child-modal-description">
            You have unsaved changes. Are you sure you want to leave this page?
            Your progress will be lost.
          </p>
          <Button color="error" onClick={onConfirm}>
            Leave page
          </Button>
        </Box>
      </Modal>
    </>
  );
}

const InsuredObjectModal = ({
  onSubmit,
  openModal,
  policySchema,
  insuredObjectId,
}: InsuredObjectModal) => {
  const [openChildModal, setOpenChildModal] = useState(false);
  const [newId, _setNewId] = useState(uuid());
  const [state, dispatch] = useReducer(insuredObjectReducer, {});

  const productSchemaHelper = useMemo(() => {
    return createSchemaHelper(policySchema);
  }, [policySchema, insuredObjectId]);

  const data = useStepper({
    steps: productSchemaHelper.getInsuredObjectSteps(insuredObjectId),
  });

  const _onSubmit = (formData: Record<string, any>) => {
    data.setComplete(data.active);
    dispatch({ type: "UPDATE_DATA", payload: formData });

    if (
      !data.complete.includes(data.active) &&
      data.steps.length - data.complete.length === 1
    ) {
      onSubmit({
        ...formData,
        ...state.data,
        id: newId,
      });

      dispatch({ type: "RESET" });
      openModal(false);
      return;
    }

    if (data.canMoveNext) {
      data.moveNext();
    }
  };

  let schema = productSchemaHelper.getInsuredStepSchema(insuredObjectId, data.active);

  return (
    <Grid2
      container
      direction="column"
      sx={{
        display: "flex",
        flexWrap: "nowrap",
        minHeight: "100%",
        width: "100%",
        padding: ".75rem",
        alignItems: "center",
        backgroundColor: "white",
      }}
    >
      <ChildModal
        open={openChildModal}
        setOpen1={(toOpen: boolean) => {
          setOpenChildModal(toOpen);
        }}
        onConfirm={() => {
          setOpenChildModal(false);
          openModal(false);
        }}
      />
      <Grid2 size={12}>
        <Stepper {...data} />
      </Grid2>
      <FormChildrenGenerator schema={schema} onSubmit={_onSubmit} />
    </Grid2>
  );
};
