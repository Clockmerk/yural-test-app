import { TEXT } from '@/constants/ui';

import { BrandQueryProvider } from '@/hooks/useBrandSearch';

import BrandList from '@/components/BrandList';
import OffersPanel from '@/components/OffersPanel';
import SearchBar from '@/components/SearchBar';

export default function App() {
  return (
    <BrandQueryProvider>
      <div className="app-shell">
        <header className="bg-white border-bottom app-header">
          <div className="container-xl py-3">
            <p className="text-secondary text-uppercase small fw-semibold mb-1">{TEXT.brandName}</p>
            <h1 className="h4 mb-0">{TEXT.appTitle}</h1>
          </div>
        </header>
        <main className="container-xl app-main">
          <SearchBar />
          <div className="app-columns">
            <div className="app-columns__pane">
              <BrandList />
            </div>
            <div className="app-columns__pane">
              <OffersPanel />
            </div>
          </div>
        </main>
      </div>
    </BrandQueryProvider>
  );
}
