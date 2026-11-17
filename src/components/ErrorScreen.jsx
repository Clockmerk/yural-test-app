import { TEXT } from '@/constants/ui';

import { Button } from '@/ui';

export default function ErrorScreen({ onReload }) {
  return (
    <main className="error-screen">
      <section className="card shadow-sm error-screen__card">
        <div className="card-body p-4 p-md-5">
          <p className="text-secondary text-uppercase small fw-semibold mb-2">{TEXT.brandName}</p>
          <h1 className="h3 mb-3">{TEXT.errorTitle}</h1>
          <p className="text-secondary mb-4">{TEXT.errorText}</p>
          <Button onClick={onReload}>{TEXT.errorReload}</Button>
        </div>
      </section>
    </main>
  );
}
