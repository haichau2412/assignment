import { useState } from "react";
import {
  TextField,
  Box,
  List,
  ListItem,
  ListItemText,
  Button,
  Grid2,
} from "@mui/material";

interface SearchBarProps {
  dataSet: {
    id: string;
    content: string;
  }[];
  buttonText: string;
  onAddItem: (id: string) => void;
  label: string;
}

export default function SearchAddPolicy({
  dataSet,
  onAddItem,
  buttonText,
  label,
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [selectedData, setSelected] = useState<{
    id: string;
    content: string;
  } | null>(null);

  const filteredItems = dataSet.filter((item) =>
    item.content.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <>
      <Grid2
        container
        direction="row"
        sx={{
          flexWrap: "nowrap",
          justifyContent: "center",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <Box sx={{ width: 300 }}>
          <TextField
            fullWidth
            label={label}
            variant="outlined"
            value={selectedData?.id || query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (selectedData) {
                setSelected(null);
              }
            }}
          />

          {!selectedData && (
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
              onAddItem(selectedData.id);
            }}
          >
            {buttonText}
          </Button>
        )}
      </Grid2>
    </>
  );
}
