import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import { useEffect } from 'react';

function OverlayScrollContainer({ className, children }) {
  useEffect(() => {
    import('overlayscrollbars/styles/overlayscrollbars.css');
  }, []);
  return (
    <OverlayScrollbarsComponent
      element="section"
      className={className}
      options={{
        overflow: {
          x: 'hidden',
        },
        scrollbars: {
          autoHide: 'scroll',
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
