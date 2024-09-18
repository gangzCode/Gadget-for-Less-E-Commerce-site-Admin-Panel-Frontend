import React, { useEffect, useState } from "react";
import DashboardCard from "../../shared/DashboardCard";
import { Typography } from "@mui/material";
import axios from "axios";

const TotalSales = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [sales, setSales] = useState(0);

  useEffect(() => {
    setIsLoading(true);
    axios.get("/api/dashboard/totalSales").then((res) => {
      if (res.data.success && res.data.success === true) {
        console.log(res.data.sales);
        setSales(res.data.sales.totalGross);
        setIsLoading(false);
      }
    });
  }, []);

  return (
    <DashboardCard title="Total Sales">
      <Typography variant="h3" fontWeight="700">
        ${sales}
      </Typography>
    </DashboardCard>
  );
};

export default TotalSales;
