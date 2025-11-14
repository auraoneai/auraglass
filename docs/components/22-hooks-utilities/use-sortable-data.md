### useSortableData
Advanced data sorting with multiple criteria and search capabilities.

```tsx
import { useSortableData } from 'aura-glass';

function SortableTable({ data }) {
  const {
    data: sortedData,
    sort,
    clearSort,
    isSorted,
    getSortDirection,
    getSortPriority
  } = useSortableData(data, {
    multiSort: true,
    maxSortLevels: 3,
    stable: true,
  });

  return (
    <table>
      <thead>
        <tr>
          <th onClick={() => sort('name')}>
            Name {isSorted('name') && getSortDirection('name')}
            {getSortPriority('name') && `(${getSortPriority('name')})`}
          </th>
          <th onClick={() => sort('date')}>Date</th>
        </tr>
      </thead>
      <tbody>
        {sortedData.map(item => (
          <tr key={item.id}>
            <td>{item.name}</td>
            <td>{item.date}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```