import { Box, Typography } from "@mui/material";
import { useState } from "react";
import PolicySchema from "../helper/import";
import guestDataManager from "../helper/storage";
import { JSONSchema } from "../schema/schema-to-form/policySchemaParser";

const PolicyImport = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileContent, _setFileContent] = useState<string | null>(null);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const readFile = new Promise<string>((resolve, _reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          resolve(e.target?.result as string);
          return;
        };
        reader.readAsText(file);
      });
      try {
        const content = await readFile;
        const parsedData = JSON.parse(content);
        const parsedZod = PolicySchema.parse(parsedData);
        guestDataManager.addPolicySchema(
          parsedZod as JSONSchema, // Error
          `import ${parsedZod.policyName}-${Date.now()} `
        );
        // setFileContent(content)
      } catch (err) {
        console.log("err", err);
      }
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
      }}
    >
      <Typography variant="h4">Import Policy</Typography>
      <input type="file" onChange={handleFileChange} />
      {selectedFile && (
        <Box mt={2}>
          <Typography>Selected File: {selectedFile.name}</Typography>
        </Box>
      )}
      {fileContent && (
        <Box mt={2}>
          <Typography>File Content:</Typography>
          <pre>{fileContent}</pre>
        </Box>
      )}
    </Box>
  );
};

export default PolicyImport;
