"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Skeleton,
  Paper,
  Button,
} from "@mui/material";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";
import { useEffect, useState } from "react";
import axios from "axios";

const SubscribersPage = () => {
  const [forceReload, setForceReload] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [subs, setSubs] = useState([]);

  useEffect(() => {
    setIsLoading(true);

    axios.get("/api/subscribers").then((res) => {
      if (res.data.success && res.data.success === true) {
        setSubs(res.data.subscribers);
        console.log(res.data.subscribers);

        setForceReload(false);
        setIsLoading(false);
      }
    });
  }, [, forceReload]);

  const deleteSubscriber = (id) => {
    axios
      .delete("/api/subscribers/", {
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
            <TableCell align="right">
              <Skeleton height={50} />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );

  const subscriberRow = (row) => {
    return (
      <TableRow key={row._id}>
        <TableCell>{row.email}</TableCell>
        <TableCell align="right">
          <Button
            variant="contained"
            onClick={() => {
              deleteSubscriber(row._id);
            }}
          >
            Delete
          </Button>
        </TableCell>
      </TableRow>
    );
  };

  const subscriberTable = (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Email</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>{subs.map((sub) => subscriberRow(sub))}</TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <PageContainer title="Subscribers" description="this is Sample page">
      <DashboardCard title="Subscribers">
        {/* <Typography>This is a Subscribers page</Typography> */}
        {!isLoading ? subscriberTable : skeletonTable}
      </DashboardCard>
    </PageContainer>
  );
};

export default SubscribersPage;
