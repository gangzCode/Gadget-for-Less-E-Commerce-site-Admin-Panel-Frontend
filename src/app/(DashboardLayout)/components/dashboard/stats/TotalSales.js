import React from "react";
import DashboardCard from "../../shared/DashboardCard";
import { Typography } from "@mui/material";

const TotalSales = () => {
  return (
    <DashboardCard title="Total Sales">
      <Typography variant="h3" fontWeight="700">
        $6,820
      </Typography>
    </DashboardCard>
  );
};

export default TotalSales;
