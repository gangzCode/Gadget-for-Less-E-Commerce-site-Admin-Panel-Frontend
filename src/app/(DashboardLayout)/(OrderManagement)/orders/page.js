"use client";
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Modal,
  Paper,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  TextField,
  Chip,
} from "@mui/material";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";
import { useEffect, useState } from "react";
import axios from "axios";
import { LocalPhone } from "@mui/icons-material";
import Image from "next/image";

const Orders = () => {
  const [forceReload, setForceReload] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [orders, setOrders] = useState([]);

  const [viewOrder, setViewOrder] = useState({});
  const [viewOpen, setViewOpen] = useState(false);

  const [editForm, setEditForm] = useState({
    orderId: "",
    newStatus: "",
    remark: "",
  });

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

  useEffect(() => {
    setIsLoading(true);
    axios.get("/api/orders").then((res) => {
      if (res.data.success && res.data.success === true) {
        setOrders(res.data.orders);
        setForceReload(false);
        setIsLoading(false);
      }
    });
  }, [, forceReload]);

  const updateOrder = () => {
    axios.post("/api/orders", editForm).then((res) => {
      if (res.data.success && res.data.success === true) {
        setForceReload(true);
        setViewOrder({});
        setViewOpen(false);
        setEditForm({
          orderId: "",
          newStatus: "",
          remark: "",
        });
      }
    });
  };

  const downloadInvoice = (id) => {
    setIsLoading(true);
    axios.post("/api/orders/invoice", { orderId: id }).then((res) => {
      if (res.data.success && res.data.success === true) {
        console.log(res.data.invoice);

        setIsLoading(false);
        let link = document.createElement("a");
        link.download = "order-invoice.pdf";
        link.href = res.data.invoice.dataStr;
        // Append to html link element page
        document.body.appendChild(link);
        // Start download
        link.click();
        // Clean up and remove the link
        link.parentNode.removeChild(link);

        // setForceReload(true);
        // setViewOrder({});
        // setViewOpen(false);
        // setEditForm({
        //   orderId: "",
        //   newStatus: "",
        //   remark: "",
        // });
      }
    });
  };

  const skeletonTable = (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell style={{ fontWeight: "bold" }}>Username</TableCell>
            <TableCell style={{ fontWeight: "bold" }}>Address Summary</TableCell>
            <TableCell style={{ fontWeight: "bold" }}>Delivery Type</TableCell>
            <TableCell style={{ fontWeight: "bold" }}>Total Items</TableCell>
            <TableCell style={{ fontWeight: "bold" }}>Subtotal</TableCell>
            <TableCell style={{ fontWeight: "bold" }}>Discounts</TableCell>
            <TableCell style={{ fontWeight: "bold" }}>Shipping</TableCell>
            <TableCell style={{ fontWeight: "bold" }}>Status</TableCell>
            <TableCell align="right" style={{ fontWeight: "bold" }}>
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
            <TableCell component="th" scope="row" sx={{ width: "10rem", maxWidth: "10rem" }}>
              <Skeleton height={50} />
            </TableCell>
            <TableCell sx={{ width: "10rem", maxWidth: "10rem" }}>
              <Skeleton height={50} />
            </TableCell>
            <TableCell>
              <Skeleton height={50} />
            </TableCell>
            <TableCell>
              <Skeleton height={50} />
            </TableCell>
            <TableCell>
              <Skeleton height={50} />
            </TableCell>
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

  const ordersRow = (order) => {
    return (
      <TableRow key={order._id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
        <TableCell component="th" scope="row" sx={{ width: "10rem", maxWidth: "10rem" }}>
          {order.username}
        </TableCell>
        <TableCell sx={{ width: "11rem", maxWidth: "15rem" }}>
          <Stack direction={"column"} spacing={0}>
            <Box>{order.address.name}</Box>
            <Box>{order.address.address}</Box>
            <Box>
              {order.address.state}, {order.address.country}
            </Box>
            <Box>
              <LocalPhone sx={{ fontSize: "0.7rem", marginRight: 1 }} />
              {order.address.number}
            </Box>
          </Stack>
        </TableCell>
        <TableCell>{order.delivery}</TableCell>
        <TableCell align="center">{order.orderItems.length}</TableCell>
        <TableCell align="center">{order.rawTotal}</TableCell>
        <TableCell align="center">{order.discounts}</TableCell>
        <TableCell align="center">{order.shipping}</TableCell>
        <TableCell align="right">
          <Chip color={statusColor[order.status]} label={statusEnum[order.status]} />
        </TableCell>
        <TableCell align="right">
          <Stack direction={"row"} gap={2}>
            <Button
              variant="contained"
              onClick={() => {
                downloadInvoice(order._id);
              }}
            >
              Invoice
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                setViewOrder(order);
                setViewOpen(true);
                setEditForm({
                  orderId: order._id,
                  newStatus: order.status,
                  remark: order.remark,
                });
              }}
            >
              View
            </Button>
          </Stack>
        </TableCell>
      </TableRow>
    );
  };

  const ordersTable = (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell style={{ fontWeight: "bold" }}>Username</TableCell>
            <TableCell style={{ fontWeight: "bold" }}>Address summary</TableCell>
            <TableCell style={{ fontWeight: "bold" }}>Delivery type</TableCell>
            <TableCell style={{ fontWeight: "bold" }}>Total items</TableCell>
            <TableCell style={{ fontWeight: "bold" }}>Subtotal</TableCell>
            <TableCell style={{ fontWeight: "bold" }}>Discounts</TableCell>
            <TableCell style={{ fontWeight: "bold" }}>Shipping</TableCell>
            <TableCell align="right" style={{ fontWeight: "bold" }}>
              Status
            </TableCell>
            <TableCell align="right" style={{ fontWeight: "bold" }}>
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map((order) => {
            return ordersRow(order);
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const orderItems = (item) =>
    item.itemId?._id && (
      <TableRow key={item.itemId._id}>
        <TableCell>
          <Image src={item.itemId.image} width={100} height={100} alt="" />
        </TableCell>
        <TableCell>
          {item.itemId._id} - {item.itemId.name}
        </TableCell>
        <TableCell>{item.variationName || "Variation unavailable"}</TableCell>
        <TableCell>{item.itemQuantity}</TableCell>
        <TableCell>{item.itemPrice}</TableCell>
        <TableCell>{item.itemDiscountedPrice || "Discount unavailable"}</TableCell>
        <TableCell>
          {item.itemDiscountedPrice != null
            ? item.itemQuantity * item.itemDiscountedPrice
            : item.itemQuantity * item.itemPrice}
        </TableCell>
      </TableRow>
    );

  const orderModal = (
    <Paper
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "70vw",
        height: "80vh",
        padding: 4,
        borderRadius: 4,
      }}
    >
      <Box
        sx={{
          overflow: "auto",
          height: "100%",
          padding: 4,
        }}
      >
        <Stack spacing={2}>
          <Typography variant="h5">Order ID - {viewOrder._id}</Typography>
          <DashboardCard
            title="Order info"
            action={
              <Stack direction={"row"} spacing={2}>
                <TextField
                  variant="outlined"
                  label="Remarks"
                  value={editForm.remark}
                  onChange={(e) => {
                    setEditForm({ ...editForm, remark: e.target.value });
                  }}
                />
                <ToggleButtonGroup
                  value={editForm.newStatus}
                  exclusive
                  size="small"
                  onChange={(e, newValue) => {
                    if (newValue !== null)
                      setEditForm({
                        ...editForm,
                        newStatus: newValue,
                      });
                  }}
                >
                  <ToggleButton value="P" color="error">
                    Pending
                  </ToggleButton>
                  <ToggleButton value="PR" color="warning">
                    Processing
                  </ToggleButton>
                  <ToggleButton value="S" color="success">
                    Shipped
                  </ToggleButton>
                  <ToggleButton value="D" color="success">
                    Delivered
                  </ToggleButton>
                  <ToggleButton value="F" color="secondary">
                    Completed
                  </ToggleButton>
                  <ToggleButton value="C" color="error">
                    Cancelled
                  </ToggleButton>
                </ToggleButtonGroup>
                <Button variant="contained" onClick={updateOrder}>
                  Update
                </Button>
              </Stack>
            }
          >
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Data</TableCell>
                    <TableCell>Value</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>Username</TableCell>
                    <TableCell>{viewOrder.username}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Address</TableCell>
                    <TableCell>
                      <Stack>
                        <Box>{viewOrder.address?.name}</Box>
                        <Box>{viewOrder.address?.address}</Box>
                        <Box>{viewOrder.address?.town}</Box>
                        <Box>{viewOrder.address?.state}</Box>
                        <Box>{viewOrder.address?.country}</Box>
                        <Box>{viewOrder.address?.postalCode}</Box>
                        <Box>{viewOrder.address?.number}</Box>
                      </Stack>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Delivery mode</TableCell>
                    <TableCell>{viewOrder.delivery}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Status</TableCell>
                    <TableCell>
                      <Chip
                        color={statusColor[viewOrder.status]}
                        label={statusEnum[viewOrder.status]}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Remarks</TableCell>
                    <TableCell>{viewOrder.remark || "Remarks unavailable"}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </DashboardCard>
          <DashboardCard title="Items">
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Image</TableCell>
                    <TableCell>Item</TableCell>
                    <TableCell>Variation</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell>Base price</TableCell>
                    <TableCell>Discounted price</TableCell>
                    <TableCell>Item total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>{viewOrder.orderItems?.map((item) => orderItems(item))}</TableBody>
              </Table>
            </TableContainer>
          </DashboardCard>
        </Stack>
      </Box>
    </Paper>
  );

  return (
    <PageContainer title="Orders" description="this is Sample page">
      <DashboardCard title="Orders">{isLoading ? skeletonTable : ordersTable}</DashboardCard>
      <Modal
        open={viewOpen}
        onClose={() => {
          setViewOpen(false);
          setViewOrder({});
        }}
      >
        {orderModal}
      </Modal>
    </PageContainer>
  );
};

export default Orders;
