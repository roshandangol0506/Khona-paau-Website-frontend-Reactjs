"use client";
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DollarSign,
  TrendingUp,
  CreditCard,
  Users,
  Package,
} from "lucide-react";

export default function RevenuePage() {
  const [period, setPeriod] = useState("weekly");
  const [loading, setLoading] = useState(true);
  const [totalRevenue, setTotalRevenue] = useState(null);
  const [averageOrderValue, setAverageOrderValue] = useState(null);
  const [conversionRate, setConversionRate] = useState(null);
  const [totalUser, setTotalUser] = useState(null);
  const [bestSelling, setBestSelling] = useState([]);

  const fetchTotalRevenue = async () => {
    try {
      const response = await fetch("http://localhost:8001/totalrevenue", {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const totalrevenue = data.data || 0;
      setTotalRevenue(totalrevenue);
    } catch (error) {
      console.error("Error fetching Revenue:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAverageOrderValue = async () => {
    try {
      const response = await fetch("http://localhost:8001/averageordervalue", {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const averageordervalue = data.data || 0;
      setAverageOrderValue(averageordervalue);
    } catch (error) {
      console.error("Error fetching Orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchConversionRate = async () => {
    try {
      const response = await fetch("http://localhost:8001/conversionrate", {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const conversionrate = data.data || 0;
      setConversionRate(conversionrate.toFixed(2));
    } catch (error) {
      console.error("Error fetching Conversion Rate:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTotalUser = async () => {
    try {
      const response = await fetch("http://localhost:8001/totalusers", {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const totalusers = data.data || 0;
      setTotalUser(totalusers);
    } catch (error) {
      console.error("Error fetching Total Users:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBestSelling = async () => {
    try {
      const response = await fetch("http://localhost:8001/bestsellingrevenue", {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const bestselling = data.data || [];
      setBestSelling(bestselling);
    } catch (error) {
      console.error("Error fetching Best Selling Products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTotalRevenue();
    fetchAverageOrderValue();
    fetchConversionRate();
    fetchTotalUser();
    fetchBestSelling();
  }, []);

  const groupedProducts = bestSelling.reduce((acc, curr) => {
    const id = curr.service_id._id;
    const key = id.toString(); // make sure it's treated as string

    if (!acc[key]) {
      acc[key] = {
        ...curr,
        totalRevenue: curr.quantity * curr.service_id.amount,
        totalQuantity: curr.quantity,
      };
    } else {
      acc[key].totalRevenue += curr.quantity * curr.service_id.amount;
      acc[key].totalQuantity += curr.quantity;
    }

    return acc;
  }, {});

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Revenue</h1>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Revenue
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Rs. {totalRevenue}</div>
                <p className="text-xs text-muted-foreground"></p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Average Order Value
                </CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  Rs. {averageOrderValue}
                </div>
                <p className="text-xs text-muted-foreground"></p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Conversion Rate
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{conversionRate}%</div>
                <p className="text-xs text-muted-foreground"></p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Customers
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalUser}</div>
                <p className="text-xs text-muted-foreground"></p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Revenue Over Time</CardTitle>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setPeriod("daily")}
                      className={`px-2 py-1 text-xs rounded ${
                        period === "daily"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      Daily
                    </button>
                    <button
                      onClick={() => setPeriod("weekly")}
                      className={`px-2 py-1 text-xs rounded ${
                        period === "weekly"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      Weekly
                    </button>
                    <button
                      onClick={() => setPeriod("monthly")}
                      className={`px-2 py-1 text-xs rounded ${
                        period === "monthly"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      Monthly
                    </button>
                  </div>
                </div>
                <CardDescription>
                  Revenue trends over {period} periods
                </CardDescription>
              </CardHeader>
              <CardContent></CardContent>
            </Card>

            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Top Selling Products</CardTitle>
                <CardDescription>
                  Products with the highest revenue this month
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="h-64 flex items-center justify-center">
                    <p>Loading product data...</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {Object.values(groupedProducts).map((product) => (
                      <div
                        key={product.service_id._id}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="h-8 w-8 rounded bg-muted flex items-center justify-center">
                            <Package className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">
                              {product.service_id.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {product.service_id.subtitle} (
                              {product.totalQuantity} sales)
                            </p>
                          </div>
                        </div>
                        <p className="text-sm font-medium">
                          ${product.totalRevenue}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent
          value="analytics"
          className="h-[400px] flex items-center justify-center border rounded-md"
        >
          <p className="text-muted-foreground">
            Detailed analytics will be available soon.
          </p>
        </TabsContent>

        <TabsContent
          value="reports"
          className="h-[400px] flex items-center justify-center border rounded-md"
        >
          <p className="text-muted-foreground">
            Report generation will be available soon.
          </p>
        </TabsContent>

        <TabsContent
          value="notifications"
          className="h-[400px] flex items-center justify-center border rounded-md"
        >
          <p className="text-muted-foreground">
            Notification settings will be available soon.
          </p>
        </TabsContent>
      </Tabs>
    </div>
  );
}
