import React from 'react';
import { HashLoader } from 'react-spinners';

const LoadingWrapper = ({className, loading, children }) => {
  return (
    <div className={className} style={{ position: 'relative' }}>
      {loading && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            zIndex: 10,
          }}
        >
          <HashLoader color="#6A55EA" loading={loading} size={40} />
        </div>
      )}
      <div className={className} style={{ opacity: loading ? 0.5 : 1, transition: 'opacity 0.3s' }}>
        {children}
      </div>
    </div>
  );
};

export default LoadingWrapper;
