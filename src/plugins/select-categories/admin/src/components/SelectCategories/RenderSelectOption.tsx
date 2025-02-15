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
};

export const RenderSelectOption: FC<RenderOptionProps> = ({
  category,
  handleSelect,
  selected,
  selectable = true,
  isFirst = false,
}) => {
  const isSelected = selected.includes(category.id);
  const checked = category.subcategories.length > 0 && isSelected ? 'indeterminate' : isSelected;
  const hasSubcategories = category.subcategories.length > 0;
  const disabled = Boolean(!category.title);

  return (
    <Option $isFirst={isFirst}>
      <OptionInner $disabled={disabled} $checked={Boolean(checked)} $selectable={selectable}>
        {selectable ? (
          <Checkbox
            disabled={disabled}
            value={category.id}
            checked={checked}
            onCheckedChange={() => handleSelect(category)}
          >
            {category.title || 'Has no title'}
          </Checkbox>
        ) : (
          <SelectedCategory>
            <span>{category.title || 'Has no title'}</span>
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
