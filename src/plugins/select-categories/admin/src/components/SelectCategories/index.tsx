import { useState, useRef, useEffect, FC } from 'react';
import {
  Chevron,
  Input,
  InputWrapper,
  Menu,
  Option,
  OptionInner,
  Select,
  SelectedCategoriesMenu,
  SelectedCategory,
  Wrapper,
} from './StyledComponents';
import { CategoryNode } from '../CategoriesAccordion';
import { Checkbox } from '@strapi/design-system';
import { IconButton } from '@strapi/design-system';
import { ChevronDown, Cross } from '@strapi/icons';

const categories = [
  {
    id: '1',
    name: 'Category',
    slug: 'Slug Category',
    checked: false,
    subcategories: [],
  },
  {
    id: '2',
    name: 'Category',
    slug: 'Slug Category',
    checked: false,
    subcategories: [],
  },
  {
    id: '3',
    name: 'Category',
    slug: 'Slug Category',
    checked: false,
    subcategories: [],
  },
  {
    id: '4',
    name: 'Category',
    slug: 'Slug Category',
    checked: false,
    subcategories: [],
  },
  {
    id: 'node-1739476954580',
    name: 'New Category 2',
    slug: 'New Slug 2',
    checked: false,
    subcategories: [
      {
        name: 'New CategoryNode 1',
        checked: false,
        subcategories: [
          {
            name: 'New CategoryNode 1',
            checked: false,
            subcategories: [],
            slug: 'New Slug 1',
            id: 'node-1739476958579',
          },
          {
            name: 'New CategoryNode 2',
            checked: false,
            subcategories: [
              {
                name: 'New CategoryNode 1',
                checked: false,
                subcategories: [],
                slug: 'New Slug 1',
                id: 'node-1739476961863',
              },
            ],
            slug: 'New Slug 2',
            id: 'node-1739476959419',
          },
          {
            name: 'New CategoryNode 3',
            checked: false,
            subcategories: [],
            slug: 'New Slug 3',
            id: 'node-1739476963071',
          },
        ],
        slug: 'New Slug 1',
        id: 'node-1739476957523',
      },
      {
        name: 'New CategoryNode 2',
        checked: false,
        subcategories: [],
        slug: 'New Slug 2',
        id: 'node-1739476960578',
      },
    ],
  },
  {
    id: 'node-1739476955114',
    name: 'New Category 3',
    slug: 'New Slug 3',
    checked: false,
    subcategories: [
      {
        name: 'New CategoryNode 1',
        checked: false,
        subcategories: [],
        slug: 'New Slug 1',
        id: 'node-1739476966191',
      },
      {
        name: 'New CategoryNode 2',
        checked: false,
        subcategories: [],
        slug: 'New Slug 2',
        id: 'node-1739476966877',
      },
      {
        name: 'New CategoryNode 3',
        checked: false,
        subcategories: [],
        slug: 'New Slug 3',
        id: 'node-1739476967781',
      },
    ],
  },
];

const filterCategories = (categories: CategoryNode[], search: string): CategoryNode[] => {
  return categories
    .map((category) => {
      const filteredChildren = filterCategories(category.subcategories, search);

      if (
        category.name.toLowerCase().includes(search.toLowerCase()) ||
        filteredChildren.length > 0
      ) {
        return { ...category, subcategories: filteredChildren };
      }

      return null;
    })
    .filter(Boolean) as CategoryNode[];
};

const getAllSubcategoryIds = (category: CategoryNode) => {
  let ids = [category.id];
  category.subcategories.forEach((sub) => {
    ids = ids.concat(getAllSubcategoryIds(sub));
  });
  return ids;
};

const flattenSelectedCategories = (
  categories: CategoryNode[],
  selected: string[]
): CategoryNode[] => {
  return categories.reduce<CategoryNode[]>((acc, category) => {
    const filteredSubcategories = flattenSelectedCategories(category.subcategories, selected);

    if (selected.includes(category.id) || filteredSubcategories.length > 0) {
      acc.push({ ...category, subcategories: [] });
    }

    return acc.concat(filteredSubcategories);
  }, []);
};

type RenderOptionProps = {
  category: CategoryNode;
  handleSelect: (category: CategoryNode) => void;
  selected: string[];
  selectable?: boolean;
  isFirst?: boolean;
};

const RenderOption: FC<RenderOptionProps> = ({
  category,
  handleSelect,
  selected,
  selectable = true,
  isFirst = false,
}) => {
  const isSelected = selected.includes(category.id);
  const checked = category.subcategories.length > 0 && isSelected ? 'indeterminate' : isSelected;
  const hasSubcategories = category.subcategories.length > 0;

  return (
    <Option isFirst={isFirst}>
      <OptionInner checked={Boolean(checked)} selectable={selectable}>
        {selectable ? (
          <Checkbox
            value={category.id}
            checked={checked}
            onCheckedChange={() => handleSelect(category)}
          >
            {category.name}
          </Checkbox>
        ) : (
          <SelectedCategory>
            <span>{category.name}</span>
            <IconButton onClick={() => handleSelect(category)}>
              <Cross />
            </IconButton>
          </SelectedCategory>
        )}
      </OptionInner>

      {hasSubcategories &&
        category.subcategories.map((child) => (
          <RenderOption
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

const SelectCategories = () => {
  const [selected, setSelected] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const selectedCategories = flattenSelectedCategories(categories, selected);

  const handleSelect = (category: CategoryNode) => {
    const categoryIds = getAllSubcategoryIds(category);
    setSelected((prev) => {
      const isSelected = prev.includes(category.id);
      return isSelected
        ? prev.filter((id) => !categoryIds.includes(id))
        : [...prev, ...categoryIds];
    });
  };

  const filteredOptions = filterCategories(categories, search);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <Wrapper ref={menuRef}>
      <Select onClick={() => setIsOpen(true)}>
        <span>Select categories...</span>
        <Chevron isOpen={isOpen}>
          <ChevronDown />
        </Chevron>
      </Select>

      {isOpen && (
        <Menu>
          <InputWrapper>
            <Input
              placeholder="Select category"
              value={search}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
            />
          </InputWrapper>
          {filteredOptions.length > 0 ? (
            filteredOptions.map((category) => (
              <RenderOption
                key={category.id}
                category={category}
                handleSelect={handleSelect}
                selected={selected}
                selectable
                isFirst
              />
            ))
          ) : (
            <div style={{ padding: '8px', textAlign: 'center' }}>Not found...</div>
          )}
        </Menu>
      )}

      {!isOpen && selectedCategories.length > 0 && (
        <SelectedCategoriesMenu>
          {selectedCategories.map((category) => (
            <RenderOption
              key={category.id}
              category={category}
              handleSelect={handleSelect}
              selected={selected}
              selectable={false}
              isFirst={true}
            />
          ))}
        </SelectedCategoriesMenu>
      )}
    </Wrapper>
  );
};

export default SelectCategories;
