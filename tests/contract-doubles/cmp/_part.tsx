import * as React from 'react';
export const withPart = <P extends object>(C: React.ComponentType<P>, part: string) =>
  function DoublePart(props: P) {
    return <C {...({ 'data-ag-part': part, 'data-ag-double': '' } as unknown as P)} {...props} />;
  };
export const kebab = (s: string) => s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
