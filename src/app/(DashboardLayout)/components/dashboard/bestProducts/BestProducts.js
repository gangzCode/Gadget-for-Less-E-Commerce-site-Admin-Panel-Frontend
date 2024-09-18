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

const BestProducts = () => {
  const [isLoading, setIsLoading] = useState(true);

  const [products, setProducts] = useState({});

  useEffect(() => {
    setIsLoading(true);

    axios.get("/api/dashboard/bestProducts").then((res) => {
      if (res.data.success && res.data.success === true) {
        const data = res.data.products.map((product) => {
          return {
            ...product,
            quantity: product.variations.reduce((total, current) => total + current.quantity, 0),
          };
        });

        console.log(data);
        setProducts(data);
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
        {/* Quantity */}
        {row.quantity}
      </TableCell>
    </TableRow>
  );

  return (
    <DashboardCard title="Best Products">
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Image</TableCell>
              <TableCell>Name</TableCell>
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

export default BestProducts;
