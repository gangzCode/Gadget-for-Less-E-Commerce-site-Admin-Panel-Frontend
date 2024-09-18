import React, { useEffect, useState } from "react";
import DashboardCard from "../../shared/DashboardCard";
import { Typography } from "@mui/material";
import axios from "axios";

const TotalIncome = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [income, setIncome] = useState(0);

  useEffect(() => {
    setIsLoading(true);
    axios.get("/api/dashboard/totalIncome").then((res) => {
      if (res.data.success && res.data.success === true) {
        console.log(res.data.income);
        setIncome(res.data.income.totalIncome);
        setIsLoading(false);
      }
    });
  }, []);

  return (
    <DashboardCard title="Total Income">
      <Typography variant="h3" fontWeight="700">
        ${income}
      </Typography>
    </DashboardCard>
  );
};

export default TotalIncome;
