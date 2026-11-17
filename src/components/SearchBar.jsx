import { TEXT } from '@/constants/ui';

import { useBrandSearch } from '@/hooks/useBrandSearch';

import { Card, Input } from '@/ui';

export default function SearchBar() {
  const { article, setArticle, apiKey, setApiKey } = useBrandSearch();

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  const handleChangeApiKey = (event) => {
    setApiKey(event.target.value);
  };

  const handleChangeArticle = (event) => {
    setArticle(event.target.value);
  };

  return (
    <form className="app-search" onSubmit={handleSubmit}>
      <Card>
        <div className="row g-3">
          <div className="col-md-4">
            <Input
              id="api-key"
              label={TEXT.apiKey}
              value={apiKey}
              autoComplete="off"
              spellCheck={false}
              onChange={handleChangeApiKey}
            />
          </div>
          <div className="col-md-8">
            <Input
              id="article"
              label={TEXT.article}
              hint={TEXT.articleHint}
              value={article}
              placeholder={TEXT.articlePlaceholder}
              autoComplete="off"
              spellCheck={false}
              onChange={handleChangeArticle}
            />
          </div>
        </div>
      </Card>
    </form>
  );
}
