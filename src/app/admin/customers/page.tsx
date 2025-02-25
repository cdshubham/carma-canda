import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
}

const customersData: Customer[] = [
  {
    id: "C001",
    name: "John Doe",
    email: "john@example.com",
    phone: "1234567890",
  },
  {
    id: "C002",
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "0987654321",
  },
  {
    id: "C003",
    name: "Alice Johnson",
    email: "alice@example.com",
    phone: "5678901234",
  },
];

export default function CustomersPage() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Customers</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Customer ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customersData.map((customer) => (
            <TableRow key={customer.id} className="h-12">
              <TableCell>{customer.id}</TableCell>
              <TableCell>{customer.name}</TableCell>
              <TableCell>{customer.email}</TableCell>
              <TableCell>{customer.phone}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
