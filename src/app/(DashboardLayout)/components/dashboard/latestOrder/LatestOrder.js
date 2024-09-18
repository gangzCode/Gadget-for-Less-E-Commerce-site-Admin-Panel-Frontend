import React, { useEffect, useState } from "react";
import DashboardCard from "../../shared/DashboardCard";
import {
  Table,
  TableContainer,
  Typography,
  TableBody,
  TableRow,
  TableCell,
  Skeleton,
  Stack,
  Box,
  Chip,
} from "@mui/material";
import axios from "axios";

const LatestOrder = () => {
  const [isLoading, setIsLoading] = useState(true);

  const [order, setOrder] = useState({});

  useEffect(() => {
    setIsLoading(true);

    axios.get("/api/dashboard/latestOrder").then((res) => {
      if (res.data.success && res.data.success === true) {
        console.log(res.data.order);
        setOrder(res.data.order[0]);
        setIsLoading(false);
      }
    });
  }, []);

  const statusEnum = {
    P: "Pending",
    PR: "Processing",
    S: "Shipped",
    D: "Delivered",
    F: "Completed",
    C: "Cancelled",
  };

  const statusColor = {
    P: "error",
    PR: "warning",
    S: "success",
    D: "success",
    F: "secondary",
    C: "error",
  };

  const tableData = (data) => (isLoading ? <Skeleton height={20} /> : data || "N/A");

  return (
    <DashboardCard title="Latest Order">
      <TableContainer>
        <Table>
          <TableBody>
            <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
              <TableCell component="th" scope="row">
                Username
              </TableCell>
              <TableCell>{tableData(order.username)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Address</TableCell>
              <TableCell>
                {tableData(
                  <Stack>
                    <Box>{order.address?.name}</Box>
                    <Box>{order.address?.address}</Box>
                    <Box>{order.address?.town}</Box>
                    <Box>{order.address?.state}</Box>
                    <Box>{order.address?.country}</Box>
                    <Box>{order.address?.postalCode}</Box>
                    <Box>{order.address?.number}</Box>
                  </Stack>
                )}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Delivery Mode</TableCell>
              <TableCell>{tableData(order.delivery)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Status</TableCell>
              <TableCell>
                {tableData(
                  <Chip color={statusColor[order.status]} label={statusEnum[order.status]} />
                )}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Remarks</TableCell>
              <TableCell>{tableData(order.remark || "Remarks unavailable")}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </DashboardCard>
  );
};

export default LatestOrder;
