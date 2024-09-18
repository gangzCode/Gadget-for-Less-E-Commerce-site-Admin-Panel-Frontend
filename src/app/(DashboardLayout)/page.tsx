"use client";
import { Grid, Box } from "@mui/material";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
// components
import SalesOverview from "@/app/(DashboardLayout)/components/dashboard/SalesOverview";
import YearlyBreakup from "@/app/(DashboardLayout)/components/dashboard/YearlyBreakup";
import RecentTransactions from "@/app/(DashboardLayout)/components/dashboard/RecentTransactions";
import ProductPerformance from "@/app/(DashboardLayout)/components/dashboard/ProductPerformance";
import Blog from "@/app/(DashboardLayout)/components/dashboard/Blog";
import MonthlyEarnings from "@/app/(DashboardLayout)/components/dashboard/MonthlyEarnings";
import TotalIncome from "./components/dashboard/stats/TotalIncome";
import TotalSales from "./components/dashboard/stats/TotalSales";
import TotalCost from "./components/dashboard/stats/TotalCost";
import LatestOrder from "./components/dashboard/latestOrder/LatestOrder";
import LatestProducts from "./components/dashboard/latestProducts/LatestProducts";
import BestProducts from "./components/dashboard/bestProducts/BestProducts";

const Dashboard = () => {
  return (
    <PageContainer title="Dashboard" description="this is Dashboard">
      <Box>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={4}>
            <TotalSales />
          </Grid>
          <Grid item xs={12} lg={4}>
            <TotalCost />
          </Grid>
          <Grid item xs={12} lg={4}>
            <TotalIncome />
          </Grid>
          <Grid item xs={12} lg={8}>
            <SalesOverview />
          </Grid>
          <Grid item xs={12} lg={4}>
            <LatestOrder />
            {/* <Grid container spacing={3}>
              <Grid item xs={12}>
                <YearlyBreakup />
              </Grid>
              <Grid item xs={12}>
                <MonthlyEarnings />
              </Grid>
            </Grid> */}
          </Grid>
          {/* <Grid item xs={12} lg={4}>
            <RecentTransactions />
          </Grid> */}
          <Grid item xs={4}>
            {/* <ProductPerformance /> */}
            <BestProducts />
          </Grid>
          <Grid item xs={8}>
            {/* <ProductPerformance /> */}
            <LatestProducts />
          </Grid>
          {/* <Grid item xs={12}>
            <Blog />
          </Grid> */}
        </Grid>
      </Box>
    </PageContainer>
  );
};

export default Dashboard;
