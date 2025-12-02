import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';

function OverlayScrollContainer({ className, children }) {
  return (
    <OverlayScrollbarsComponent
      element="section"
      className={className}
      options={{
        overflow: {
          x: 'hidden',
        },
        scrollbars: {
          autoHide: 'leave',
          autoHideSuspend: true,
          autoHideDelay: 600,
          theme: 'os-theme-light',
        },
      }}
      defer
    >
      {children}
    </OverlayScrollbarsComponent>
  );
}

export default OverlayScrollContainer;
