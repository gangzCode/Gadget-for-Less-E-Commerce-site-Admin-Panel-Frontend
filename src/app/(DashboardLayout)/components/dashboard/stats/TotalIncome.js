import React from "react";
import DashboardCard from "../../shared/DashboardCard";
import { Typography } from "@mui/material";

const TotalIncome = () => {
  return (
    <DashboardCard title="Total Income">
      <Typography variant="h3" fontWeight="700">
        $6,820
      </Typography>
    </DashboardCard>
  );
};

export default TotalIncome;
