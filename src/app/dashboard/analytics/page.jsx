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
  TrendingUp,
  Users,
  ShoppingBag,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

// Mock data for analytics
const mockGrowthData = {
  sales: [
    { month: "Jan", value: 4500 },
    { month: "Feb", value: 5200 },
    { month: "Mar", value: 4800 },
    { month: "Apr", value: 6300 },
    { month: "May", value: 7100 },
    { month: "Jun", value: 8200 },
  ],
  users: [
    { month: "Jan", value: 320 },
    { month: "Feb", value: 380 },
    { month: "Mar", value: 450 },
    { month: "Apr", value: 520 },
    { month: "May", value: 610 },
    { month: "Jun", value: 680 },
  ],
  orders: [
    { month: "Jan", value: 180 },
    { month: "Feb", value: 220 },
    { month: "Mar", value: 210 },
    { month: "Apr", value: 280 },
    { month: "May", value: 320 },
    { month: "Jun", value: 350 },
  ],
};

const mockPerformanceData = [
  { metric: "Sales Growth", value: "24%", change: 5.2, trend: "up" },
  { metric: "Customer Acquisition", value: "680", change: 12.5, trend: "up" },
  { metric: "Average Order Value", value: "$120.45", change: 2.3, trend: "up" },
  { metric: "Conversion Rate", value: "3.24%", change: -0.8, trend: "down" },
  { metric: "Customer Retention", value: "78%", change: 4.1, trend: "up" },
  { metric: "Cart Abandonment", value: "22%", change: -2.5, trend: "up" },
];

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [growthData, setGrowthData] = useState(mockGrowthData);
  const [performanceData, setPerformanceData] = useState(mockPerformanceData);

  useEffect(() => {
    // In a real app, you would fetch analytics data from your API
    // For now, we'll use the mock data
    const fetchAnalyticsData = async () => {
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500));

        setGrowthData(mockGrowthData);
        setPerformanceData(mockPerformanceData);
      } catch (error) {
        console.error("Error fetching analytics data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, []);

  // Simple line chart component
  const LineChart = ({ data, color = "blue" }) => {
    const maxValue = Math.max(...data.map((item) => item.value));
    const minValue = Math.min(...data.map((item) => item.value));
    const range = maxValue - minValue;

    // Calculate points for the SVG path
    const points = data
      .map((item, index) => {
        const x = (index / (data.length - 1)) * 100;
        const y = 100 - ((item.value - minValue) / range) * 100;
        return `${x},${y}`;
      })
      .join(" ");

    return (
      <div className="w-full h-32 mt-4">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {/* Line */}
          <polyline
            points={points}
            fill="none"
            stroke={`var(--${color}-500)`}
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
          />
          {/* Area under the line */}
          <polygon
            points={`0,100 ${points} 100,100`}
            fill={`var(--${color}-100)`}
            opacity="0.5"
          />
        </svg>
      </div>
    );
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Analytics & Growth</h1>
      </div>

      <Tabs defaultValue="growth" className="space-y-4">
        <TabsList>
          <TabsTrigger value="growth">Growth</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="audience">Audience</TabsTrigger>
          <TabsTrigger value="behavior">Behavior</TabsTrigger>
        </TabsList>

        <TabsContent value="growth" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Sales Growth
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24%</div>
                <p className="text-xs text-muted-foreground">
                  +5.2% from last month
                </p>
                {!loading && <LineChart data={growthData.sales} color="blue" />}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  User Growth
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12.5%</div>
                <p className="text-xs text-muted-foreground">
                  +3.1% from last month
                </p>
                {!loading && (
                  <LineChart data={growthData.users} color="green" />
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Order Growth
                </CardTitle>
                <ShoppingBag className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">18.2%</div>
                <p className="text-xs text-muted-foreground">
                  +4.3% from last month
                </p>
                {!loading && (
                  <LineChart data={growthData.orders} color="purple" />
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Growth Trends</CardTitle>
              <CardDescription>
                Comparative growth metrics over the last 6 months
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="h-64 flex items-center justify-center">
                  <p>Loading growth data...</p>
                </div>
              ) : (
                <div className="h-64 grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Sales Growth</h3>
                    <div className="h-40">
                      <LineChart data={growthData.sales} color="blue" />
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Jan</span>
                      <span>Jun</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">User Growth</h3>
                    <div className="h-40">
                      <LineChart data={growthData.users} color="green" />
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Jan</span>
                      <span>Jun</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Order Growth</h3>
                    <div className="h-40">
                      <LineChart data={growthData.orders} color="purple" />
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Jan</span>
                      <span>Jun</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {performanceData.map((metric, index) => (
              <Card key={index}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    {metric.metric}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metric.value}</div>
                  <div className="flex items-center mt-1">
                    {metric.trend === "up" ? (
                      <ArrowUpRight
                        className={`h-4 w-4 ${
                          metric.metric === "Cart Abandonment"
                            ? "text-red-500"
                            : "text-green-500"
                        }`}
                      />
                    ) : (
                      <ArrowDownRight
                        className={`h-4 w-4 ${
                          metric.metric === "Cart Abandonment"
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      />
                    )}
                    <span
                      className={`text-xs ml-1 ${
                        (metric.trend === "up" &&
                          metric.metric !== "Cart Abandonment") ||
                        (metric.trend === "down" &&
                          metric.metric === "Cart Abandonment")
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {metric.change > 0 ? "+" : ""}
                      {metric.change}% from last month
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent
          value="audience"
          className="h-[400px] flex items-center justify-center border rounded-md"
        >
          <p className="text-muted-foreground">
            Audience analytics will be available soon.
          </p>
        </TabsContent>

        <TabsContent
          value="behavior"
          className="h-[400px] flex items-center justify-center border rounded-md"
        >
          <p className="text-muted-foreground">
            Behavior analytics will be available soon.
          </p>
        </TabsContent>
      </Tabs>
    </div>
  );
}
