"use client";
import { useState, useEffect, useRef } from "react";
import {
  Search,
  Filter,
  MoreHorizontal,
  Download,
  Printer,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDashboard } from "@/context/dashboard-context";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useReactToPrint } from "react-to-print";

// Mock data for orders

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { updateStats } = useDashboard();
  const ordersTableRef = useRef();

  useEffect(() => {
    const fetchCheckout = async () => {
      try {
        const response = await fetch("http://localhost:8001/allcheckouts", {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const orderList = data.data || [];
        setOrders(orderList);

        updateStats({ orders: orderList.length });
      } catch (error) {
        console.error("Error fetching Orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCheckout();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const response = await fetch(
        `http://localhost:8001/changestatus/${orderId}`,
        {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // In a real app, you would update the order status via API
      setOrders(
        orders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  // Filter orders based on search term and status filter
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user_id?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user_id?.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case "completed":
        return "success";
      case "processing":
        return "default";
      case "pending":
        return "warning";
      case "shipped":
        return "secondary";
      case "cancelled":
        return "destructive";
      default:
        return "outline";
    }
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Function to handle PDF export
  const handleExportPDF = () => {
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(16);
    doc.text("Orders Report", 14, 15);
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 22);

    // Create table structure for PDF
    const tableColumn = [
      "Order",
      "Customer",
      "Date",
      "Status",
      "Quantity",
      "Total",
    ];
    const tableRows = filteredOrders.map((order) => [
      order.service_id?.name,
      order.user_id?.name || "Unknown",
      formatDate(order.added_at),
      order.status,
      order.quantity,
      `Rs ${(order.quantity * order.service_id?.amount).toFixed(2)}`,
    ]);

    // Add the table to the PDF
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 30,
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [66, 66, 66] },
    });

    // Save the PDF
    doc.save("orders-report.pdf");
  };

  // Function to handle printing
  const handlePrint = useReactToPrint({
    content: () => ordersTableRef.current,
    documentTitle: "Orders Report",
    onBeforeGetContent: () => {
      return new Promise((resolve) => {
        resolve();
      });
    },
    onAfterPrint: () => {
      console.log("Print completed");
    },
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Orders</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleExportPDF}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search orders..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-full md:w-[200px]">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <div className="flex items-center">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10">
          <p>Loading orders...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-10 border rounded-lg">
          <p className="text-muted-foreground">No orders found</p>
        </div>
      ) : (
        <div ref={ordersTableRef} className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order Name</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead className="text-right">Location</TableHead>
                <TableHead className="text-right">Phone No</TableHead>
                <TableHead className="hidden md:table-cell">Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order._id}>
                  <TableCell className="font-medium">
                    {order.service_id?.name}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p>{order.user_id?.name || "Unknown User"}</p>
                      <p className="text-sm text-muted-foreground">
                        {order.user_id?.email || "No email"}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">{order.location}</TableCell>
                  <TableCell className="text-right">{order.phoneno}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {formatDate(order.added_at)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(order.status)}>
                      {order.status.charAt(0).toUpperCase() +
                        order.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">{order.quantity}</TableCell>
                  <TableCell className="text-right">
                    Rs {(order.quantity * order.service_id?.amount).toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            handleStatusChange(order._id, "processing")
                          }
                        >
                          Mark as Processing
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            handleStatusChange(order._id, "shipped")
                          }
                        >
                          Mark as Shipped
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            handleStatusChange(order._id, "completed")
                          }
                        >
                          Mark as Completed
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            handleStatusChange(order._id, "cancelled")
                          }
                        >
                          Mark as Cancelled
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
