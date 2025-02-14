import { Checkbox } from '@strapi/design-system';
import { FC } from 'react';
import { ICategory } from 'src/types';
import { Option, OptionInner, SelectedCategory } from './StyledComponents';
import { IconButton } from '@strapi/design-system';
import { Cross } from '@strapi/icons';

type RenderOptionProps = {
  category: ICategory;
  handleSelect: (category: ICategory) => void;
  selected: string[];
  selectable?: boolean;
  isFirst?: boolean;
  isFlat?: boolean;
};

export const RenderSelectOption: FC<RenderOptionProps> = ({
  category,
  handleSelect,
  selected,
  selectable = true,
  isFirst = false,
  isFlat = false,
}) => {
  const isSelected = selected.includes(category.id);
  const checked = category.subcategories.length > 0 && isSelected ? 'indeterminate' : isSelected;
  const hasSubcategories = category.subcategories.length > 0;

  return (
    <Option $isFirst={isFirst} $isFlat={isFlat}>
      <OptionInner $checked={Boolean(checked)} $selectable={selectable}>
        {selectable ? (
          <Checkbox
            value={category.id}
            checked={checked}
            onCheckedChange={() => handleSelect(category)}
          >
            {category.title}
          </Checkbox>
        ) : (
          <SelectedCategory>
            <span>{category.title}</span>
            <IconButton onClick={() => handleSelect(category)}>
              <Cross />
            </IconButton>
          </SelectedCategory>
        )}
      </OptionInner>

      {hasSubcategories &&
        category.subcategories.map((child) => (
          <RenderSelectOption
            key={child.id}
            category={child}
            handleSelect={handleSelect}
            selected={selected}
            selectable={selectable}
            isFirst={false}
          />
        ))}
    </Option>
  );
};
