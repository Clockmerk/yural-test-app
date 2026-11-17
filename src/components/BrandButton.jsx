import { memo } from 'react';

import { TEXT } from '@/constants/ui';

import { Badge, ListItem } from '@/ui';

function BrandButton({ brand, isSelected, onSelect }) {
  const handleClick = () => {
    onSelect(brand);
  };

  return (
    <ListItem selected={isSelected} onClick={handleClick}>
      <span className="flex-grow-1">
        <span className="d-block fw-semibold">{brand.brand || TEXT.dash}</span>
        <span className={`d-block small ${isSelected ? 'text-white-50' : 'text-body-secondary'}`}>
          {brand.name || TEXT.unnamed}
        </span>
      </span>
      <Badge>{brand.number || TEXT.dash}</Badge>
    </ListItem>
  );
}

export default memo(BrandButton);
