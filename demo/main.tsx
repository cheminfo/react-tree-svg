import React from 'react';
import ReactDOM from 'react-dom/client';

import Expandable from './Expandable.tsx';
import Fragmentation from './Fragmentation.tsx';
import Taxonomy from './Taxonomy.tsx';

ReactDOM.createRoot(document.querySelector('#root') as HTMLElement).render(
  <React.StrictMode>
    <h1>Expandable</h1>
    <Expandable />
    <h1>Fragmentation</h1>
    <Fragmentation />
    <h1>Taxonomy</h1>
    <Taxonomy />
  </React.StrictMode>,
);
