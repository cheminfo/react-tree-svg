import React from 'react';
import ReactDOM from 'react-dom/client';

import Fragmentation from './Fragmentation';
import Taxonomy from './Taxonomy';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <h1>Fragmentation</h1>
    <Fragmentation />
    <h1>Taxonomy</h1>
    <Taxonomy />
  </React.StrictMode>,
);
