import { Table } from 'aura-glass/data';

type Order = { id: string; customer: string; total: number };

const DATA: Order[] = [
  { id: 'o1', customer: 'Northwind', total: 1200 },
  { id: 'o2', customer: 'Contoso', total: 860 },
];

export default function TableMinimal() {
  return (
    <Table<Order>
      caption="Orders"
      data={DATA}
      getRowId={(r) => r.id}
      columns={[
        { accessorKey: 'customer', header: 'Customer' },
        { accessorKey: 'total', header: 'Total' },
      ]}
    />
  );
}
