import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';

function OverlayScrollContainer({ className, children }) {
  return (
    <OverlayScrollbarsComponent
      element="section"
      className={className}
      options={{ scrollbars: { autoHide: 'scroll', theme: 'os-theme-light' } }}
      defer
    >
      {children}
    </OverlayScrollbarsComponent>
  );
}

export default OverlayScrollContainer;
