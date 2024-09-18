import React, { useEffect, useState } from "react";
import DashboardCard from "../../shared/DashboardCard";
import { Typography } from "@mui/material";
import axios from "axios";

const TotalCost = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [cost, setCost] = useState(0);

  useEffect(() => {
    setIsLoading(true);
    axios.get("/api/dashboard/totalCost").then((res) => {
      if (res.data.success && res.data.success === true) {
        console.log(res.data.cost);
        setCost(res.data.cost.totalCost);
        setIsLoading(false);
      }
    });
  }, []);

  return (
    <DashboardCard title="Total Cost">
      <Typography variant="h3" fontWeight="700">
        ${cost}
      </Typography>
    </DashboardCard>
  );
};

export default TotalCost;
