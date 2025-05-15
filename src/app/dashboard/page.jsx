"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Package,
  Users,
  Star,
  TrendingUp,
  ShoppingCart,
  DollarSign,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useDashboard } from "@/context/dashboard-context";

export default function Dashboard() {
  const { stats, updateStats } = useDashboard();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [
          productsResponse,
          teamResponse,
          reviewsResponse,
          ordersResponse,
        ] = await Promise.all([
          fetch("http://localhost:8001/servicelength", {
            method: "GET",
            credentials: "include",
          }),
          fetch("http://localhost:8001/teamlength", {
            method: "GET",
            credentials: "include",
          }),
          fetch("http://localhost:8001/reviewlength", {
            method: "GET",
            credentials: "include",
          }),
          fetch("http://localhost:8001/checkoutlength", {
            method: "GET",
            credentials: "include",
          }),
        ]);

        const productsData = productsResponse.ok
          ? await productsResponse.json()
          : { data: 0 };
        const teamData = teamResponse.ok
          ? await teamResponse.json()
          : { data: 0 };
        const reviewsData = reviewsResponse.ok
          ? await reviewsResponse.json()
          : { data: 0 };
        const ordersData = ordersResponse.ok
          ? await ordersResponse.json()
          : { data: 0 };

        updateStats({
          products: productsData.data || 0,
          team: teamData.data || 0,
          reviews: reviewsData.data || 0,
          orders: ordersData.data || 0,
          revenue: 0, // or calculate from ordersData if needed
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []); // ⛔ NO `updateStats` in dependency array

  const cards = [
    {
      title: "Products",
      value: stats.products,
      description: "Total products in inventory",
      icon: Package,
      link: "/dashboard/products",
      color: "bg-blue-50 text-blue-700",
    },
    {
      title: "Team Members",
      value: stats.team,
      description: "Active team members",
      icon: Users,
      link: "/dashboard/team",
      color: "bg-purple-50 text-purple-700",
    },
    {
      title: "Reviews",
      value: stats.reviews,
      description: "Customer reviews",
      icon: Star,
      link: "/dashboard/reviews",
      color: "bg-yellow-50 text-yellow-700",
    },
    {
      title: "Orders",
      value: stats.orders,
      description: "Total orders processed",
      icon: ShoppingCart,
      link: "/dashboard/orders",
      color: "bg-green-50 text-green-700",
    },
    {
      title: "Revenue",
      value: 0,
      description: "Total revenue this month",
      icon: DollarSign,
      link: "/dashboard/revenue",
      color: "bg-red-50 text-red-700",
    },
    {
      title: "Category",
      value: "24%",
      description: "Varieties of Flavors",
      icon: TrendingUp,
      link: "/dashboard/category",
      color: "bg-indigo-50 text-indigo-700",
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard Overview</h1>
        <p className="text-sm text-muted-foreground">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-6 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-10 bg-gray-200 rounded w-1/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card, index) => (
            <Link href={card.link} key={index}>
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2 flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>{card.title}</CardTitle>
                    <CardDescription>{card.description}</CardDescription>
                  </div>
                  <div className={`p-2 rounded-full ${card.color}`}>
                    <card.icon className="h-5 w-5" />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{card.value}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      <div className="mt-12">
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/dashboard/products/add">
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6 flex items-center">
                <Package className="h-5 w-5 mr-3 text-blue-600" />
                <span>Add New Product</span>
              </CardContent>
            </Card>
          </Link>
          <Link href="/dashboard/team/add">
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6 flex items-center">
                <Users className="h-5 w-5 mr-3 text-purple-600" />
                <span>Add Team Member</span>
              </CardContent>
            </Card>
          </Link>
          <Link href="/dashboard/reviews/add">
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6 flex items-center">
                <Star className="h-5 w-5 mr-3 text-yellow-600" />
                <span>Add Review</span>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
