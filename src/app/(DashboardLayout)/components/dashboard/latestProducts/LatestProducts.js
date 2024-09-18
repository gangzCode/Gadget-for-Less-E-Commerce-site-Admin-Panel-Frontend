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
  TableHead,
  Paper,
} from "@mui/material";
import axios from "axios";
import { QuestionMark } from "@mui/icons-material";
import Image from "next/image";
const LatestProducts = () => {
  const [isLoading, setIsLoading] = useState(true);

  const [products, setProducts] = useState({});

  useEffect(() => {
    setIsLoading(true);

    axios.get("/api/dashboard/latestProducts").then((res) => {
      if (res.data.success && res.data.success === true) {
        console.log(res.data.products);
        setProducts(res.data.products);
        setIsLoading(false);
      }
    });
  }, []);

  const productTableRow = (row) => (
    <TableRow key={row._id + row.sku} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
      <TableCell>
        <Paper
          sx={{
            padding: 4,
            width: "70px",
            height: "70px",
            position: "relative",
            textAlign: "center",
            verticalAlign: "center",
          }}
        >
          {!!row.image ? (
            <Image src={row.image} alt="" objectFit="contain" fill />
          ) : (
            <QuestionMark fontSize="large" />
          )}
        </Paper>
      </TableCell>
      <TableCell component="th" scope="row">
        {/* name */}
        {row.name}
      </TableCell>
      <TableCell>
        {/* SKU */}
        {row.sku}
      </TableCell>
      <TableCell>
        {/* Price */}
        {row.price}
      </TableCell>
      <TableCell>
        {/* Discounted price */}
        {row.discountedPrice || "No discounts"}
      </TableCell>
      <TableCell>
        {/* Quantity */}
        {row.quantity}
      </TableCell>
    </TableRow>
  );

  return (
    <DashboardCard title="Latest Products">
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Image</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>SKU</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Discounted Price</TableCell>
              <TableCell>Quantity</TableCell>
            </TableRow>
          </TableHead>
          {isLoading ? (
            <TableBody>
              <TableRow>
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
              </TableRow>
            </TableBody>
          ) : (
            <TableBody>{products.map((row) => productTableRow(row))}</TableBody>
          )}
        </Table>
      </TableContainer>
    </DashboardCard>
  );
};

export default LatestProducts;
