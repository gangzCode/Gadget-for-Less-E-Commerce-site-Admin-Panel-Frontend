"use client";
import {
  Button,
  Checkbox,
  FormControlLabel,
  Paper,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";
import { useEffect, useState } from "react";
import axios from "axios";

const TaxPage = () => {
  const [forceReload, setForceReload] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [taxes, setTaxes] = useState([]);

  const [createForm, setCreateForm] = useState({
    taxname: "",
    percentage: "",
    isActive: false,
  });

  const [editingItemId, setEditingItemId] = useState("");
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    setIsLoading(true);

    axios.get("/api/taxes").then((res) => {
      if (res.data.success && res.data.success === true) {
        setTaxes(res.data.taxes);
        setForceReload(false);
        setIsLoading(false);
      }
    });
  }, [, forceReload]);

  const createTax = () => {
    if (createForm.taxname.trim() === "") return;
    if (createForm.percentage.trim() === "") return;

    axios.post("/api/taxes/", createForm).then((res) => {
      if (res.data.success && res.data.success === true) {
        setForceReload(true);
        setCreateForm({
          taxname: "",
          percentage: "",
          isActive: false,
        });
      }
    });
  };

  const updateTax = () => {
    if (editForm.taxname.trim() === "") return;
    if (editForm.percentage.trim() === "") return;

    axios.put("/api/taxes/", { ...editForm, id: editingItemId }).then((res) => {
      if (res.data.success && res.data.success === true) {
        setForceReload(true);
        setEditForm({});
        setEditingItemId("");
      }
    });
  };

  const deleteTax = (id) => {
    axios
      .delete("/api/taxes/", {
        params: {
          id,
        },
      })
      .then((res) => {
        if (res.data.success && res.data.success === true) {
          setForceReload(true);
        }
      });
  };

  const skeletonTable = (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Percentage</TableCell>
            <TableCell>Is Active</TableCell>
            <TableCell align="right" style={{ fontWeight: "bold" }}>
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
            <TableCell>
              <Skeleton height={50} />
            </TableCell>
            <TableCell>
              <Skeleton height={50} />
            </TableCell>
            <TableCell>
              <Skeleton height={50} />
            </TableCell>
            <TableCell align="right">
              <Skeleton height={50} />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );

  const taxesRow = (tax) => {
    return tax._id != editingItemId ? (
      <TableRow key={tax._id}>
        <TableCell>{tax.taxname}</TableCell>
        <TableCell>{tax.percentage}</TableCell>
        <TableCell>{tax.isActive.toString()}</TableCell>
        <TableCell align="right">
          <Button
            variant="contained"
            sx={{ marginRight: 2 }}
            disabled={editingItemId != ""}
            onClick={() => {
              // deleteItem("category", row._id);
              setEditingItemId(tax._id);
              setEditForm({
                taxname: tax.taxname,
                percentage: tax.percentage.toString(),
                isActive: tax.isActive,
              });
            }}
          >
            Edit
          </Button>
          <Button
            variant="contained"
            disabled={editingItemId != ""}
            onClick={() => {
              deleteTax(tax._id);
            }}
          >
            Delete
          </Button>
        </TableCell>
      </TableRow>
    ) : (
      <TableRow key={tax._id}>
        <TableCell>
          <TextField
            id="tax-name"
            label="Tax name"
            variant="outlined"
            value={editForm.taxname}
            onChange={(e) => {
              setEditForm((form) => {
                return {
                  ...form,
                  taxname: e.target.value,
                };
              });
            }}
          />
        </TableCell>
        <TableCell>
          <TextField
            id="tax-name"
            label="Percentage"
            variant="outlined"
            value={editForm.percentage}
            onChange={(e) => {
              setEditForm((form) => {
                return { ...form, percentage: e.target.value };
              });
            }}
          />
        </TableCell>
        <TableCell>
          <FormControlLabel
            control={
              <Checkbox
                onChange={(e) => {
                  setEditForm((form) => {
                    return { ...form, isActive: e.target.checked };
                  });
                }}
                checked={editForm.isActive}
              />
            }
            label="Is Active"
          />
        </TableCell>
        <TableCell align="right">
          <Button
            variant="contained"
            sx={{ marginRight: 2 }}
            onClick={() => {
              updateTax();
            }}
          >
            Save
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              setEditingItemId("");
              setEditForm({});
            }}
          >
            Cancel
          </Button>
        </TableCell>
      </TableRow>
    );
  };

  const taxesTable = (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Percentage</TableCell>
            <TableCell>Is Active</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>{taxes.map((tax) => taxesRow(tax))}</TableBody>
      </Table>
    </TableContainer>
  );

  const taxCreator = (
    <Stack alignItems={"center"} spacing={2} direction="row">
      <TextField
        id="tax-name"
        label="Tax name"
        variant="outlined"
        value={createForm.taxname}
        onChange={(e) => {
          setCreateForm((form) => {
            return { ...form, taxname: e.target.value };
          });
        }}
      />
      <TextField
        id="tax-name"
        label="Percentage"
        variant="outlined"
        value={createForm.percentage}
        onChange={(e) => {
          setCreateForm((form) => {
            return { ...form, percentage: e.target.value };
          });
        }}
      />
      <FormControlLabel
        control={
          <Checkbox
            onChange={(e) => {
              setCreateForm((form) => {
                return { ...form, isActive: e.target.checked };
              });
            }}
            checked={createForm.isActive}
          />
        }
        label="Is Active"
      />
      <Button variant="contained" onClick={createTax} disabled={editingItemId != ""}>
        Create
      </Button>
    </Stack>
  );
  return (
    <PageContainer title="Taxes" description="this is Sample page">
      <DashboardCard
        title="Taxes"
        action={isLoading ? <Skeleton width={500} height={50} /> : taxCreator}
      >
        {!isLoading ? taxesTable : skeletonTable}
      </DashboardCard>
    </PageContainer>
  );
};

export default TaxPage;
