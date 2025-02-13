import { useState, useRef, useEffect, FC } from 'react';
import { TextInput } from '@strapi/design-system';
import { Menu, Option, OptionInner, Wrapper } from './StyledComponents';
import { CategoryNode } from '../CategoriesAccordion';
import { Checkbox } from '@strapi/design-system';

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

type RenderOptionProps = {
  category: CategoryNode;
  handleSelect: (category: CategoryNode) => void;
  selected: string[];
};

const RenderOption: FC<RenderOptionProps> = ({ category, handleSelect, selected }) => {
  const isSelected = selected.includes(category.id);

  const checked = category.subcategories.length > 0 && isSelected ? 'indeterminate' : isSelected;

  return (
    <Option>
      <OptionInner checked={Boolean(checked)}>
        <Checkbox
          value={category.id}
          checked={checked}
          onCheckedChange={() => handleSelect(category)}
          style={{ display: 'grid' }}
        >
          {category.name}
        </Checkbox>
      </OptionInner>

      {category.subcategories.length > 0 &&
        category.subcategories.map((child) => (
          <RenderOption category={child} handleSelect={handleSelect} selected={selected} />
        ))}
    </Option>
  );
};

const SelectCategories = () => {
  const [selected, setSelected] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

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
      <TextInput
        placeholder="Select category"
        value={search}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
        onFocus={() => setIsOpen(true)}
      />

      {isOpen && (
        <Menu>
          {filteredOptions.length > 0 ? (
            filteredOptions.map((category) => (
              <RenderOption
                key={category.id}
                category={category}
                handleSelect={handleSelect}
                selected={selected}
              />
            ))
          ) : (
            <div style={{ padding: '8px', textAlign: 'center' }}>Ничего не найдено</div>
          )}
        </Menu>
      )}
    </Wrapper>
  );
};

export default SelectCategories;
