import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { getText } from "../../libs/i18n/en";

interface InsuredTableProps {
  tableData: (Record<string, string | number> & { id: string })[];
  viewInsuredObject?: (id: string) => void;
}

const InsuredObjectTable = ({
  tableData,
  viewInsuredObject,
}: InsuredTableProps) => {
  const keys = ["order_text", ...Object.keys(tableData[0])].filter(
    (k) => k !== "id"
  );
  const handleTableBodyClick = (
    event: React.MouseEvent<HTMLTableSectionElement>
  ) => {
    const row = (event.target as HTMLElement).closest("tr");

    if (row) {
      const id = row.cells[0]?.textContent;
      if (id && viewInsuredObject) {
        viewInsuredObject(id);
      }
    }
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            {keys.map((head) => (
              <TableCell
                key={head}
                sx={{ fontWeight: "bold", backgroundColor: "#f5f5f5" }}
              >
                {getText(head)}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody
          onClick={handleTableBodyClick}
          sx={{
            cursor: "pointer",
            "& tr:hover": { backgroundColor: "#f0f0f0" },
          }}
        >
          {tableData.map((row, index) => (
            <TableRow key={row.id} id={row.id}>
              {keys.map((key) => {
                if (key === "order_text") {
                  return <TableCell key={index}>{index}</TableCell>;
                }
                if (typeof row[key] !== "string") {
                  return <TableCell key={key}>{"Unsupport Type"}</TableCell>;
                }
                return <TableCell key={key}>{row[key]}</TableCell>;
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default InsuredObjectTable;
