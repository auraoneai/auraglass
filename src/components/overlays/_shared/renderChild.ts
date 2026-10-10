/* REQ-CMP-17: a single element child (e.g. <Button>) is forwarded as BU's
   render prop — <Trigger><Button/></Trigger> must produce ONE button, never
   nested. Returns {render, children} for the BU element. */
import * as React from 'react';

export function childAsRender(children: React.ReactNode): { render: React.ReactElement | undefined; children: React.ReactNode } {
  if (React.isValidElement(children) && !Array.isArray(children) && children.type !== React.Fragment) {
    return { render: children, children: (children.props as { children?: React.ReactNode }).children };
  }
  return { render: undefined, children };
}
