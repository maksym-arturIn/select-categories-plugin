import { useState, useRef, useEffect } from 'react';
import {
  Chevron,
  Input,
  InputWrapper,
  Label,
  Menu,
  Select,
  Error,
  Wrapper,
  SelectedCategoriesMenu,
} from './StyledComponents';
import { RenderSelectOption } from './RenderSelectOption';
import { useFetchClient } from '@strapi/strapi/admin';
import type { IStrapiPayload, ICategoryTree, ISelectCategoriesProps, ICategory } from '../../types';
import { PLUGIN_ID } from '../../pluginId';
import { ChevronDown } from '@strapi/icons';
import {
  filterCategories,
  filterSelectedCategories,
  getAllSubcategoryIds,
} from '../../utils/helpers';

const SelectCategories = ({
  name,
  onChange,
  value,
  disabled,
  error,
  required,
}: ISelectCategoriesProps) => {
  const client = useFetchClient();

  const [categories, setCategories] = useState<ICategory[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const filteredOptions = filterCategories(categories, search);

  const selectedCategories = filterSelectedCategories(categories, selectedIds).filter(
    (category) => selectedIds.includes(category.id) && !!category.title
  );

  const getCategoryTree = async () => {
    const { data = [] } = await client.get<IStrapiPayload<ICategoryTree>>(
      `${PLUGIN_ID}/category-trees`
    );

    const [categoryTree] = data as ICategoryTree[];

    if (!categoryTree) {
      return;
    }

    setCategories(categoryTree?.data || []);
  };

  const handleSelect = (category: ICategory) => {
    const categoryIds = getAllSubcategoryIds(category);

    const newSelectedIds = selectedIds.includes(category.id)
      ? selectedIds.filter((id) => !categoryIds.includes(id))
      : [...selectedIds, ...categoryIds];

    setSelectedIds(newSelectedIds);

    // Create tree structure from selected IDs
    const selectedCategories = categories
      .map((cat) => {
        if (newSelectedIds.includes(cat.id)) {
          return {
            ...cat,
            subcategories: cat.subcategories
              .filter((sub) => newSelectedIds.includes(sub.id))
              .map((sub) => ({ ...sub, subcategories: [] })),
          };
        }
        return null;
      })
      .filter(Boolean) as ICategory[];

    onChange?.({ target: { name, value: selectedCategories } });
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (value) {
      const extractIds = (cats: ICategory[]): string[] => {
        return cats.reduce<string[]>((acc, cat) => {
          return [...acc, cat.id, ...extractIds(cat.subcategories)];
        }, []);
      };

      const newSelectedIds = extractIds(value);
      setSelectedIds(newSelectedIds);
    }

    getCategoryTree();
  }, []);

  return (
    <Wrapper ref={menuRef}>
      <div>
        <Label>
          {name}
          {required && <span style={{ color: 'red' }}> *</span>}
        </Label>

        <Select disabled={disabled} onClick={() => !disabled && setIsOpen(true)}>
          <span>Select categories...</span>

          <Chevron $isOpen={isOpen}>
            <ChevronDown />
          </Chevron>
        </Select>

        {error && <Error>{error}</Error>}
      </div>

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
              <RenderSelectOption
                key={category.id}
                category={category}
                handleSelect={handleSelect}
                selected={selectedIds}
                selectable
                isFirst
              />
            ))
          ) : (
            <div style={{ padding: '8px', textAlign: 'center' }}>Categories not found</div>
          )}
        </Menu>
      )}

      {!isOpen && !!selectedCategories.length && (
        <SelectedCategoriesMenu>
          {selectedCategories.map((category) => (
            <RenderSelectOption
              key={category.id}
              category={category}
              handleSelect={handleSelect}
              selected={selectedIds}
              selectable={false}
              isFirst
            />
          ))}
        </SelectedCategoriesMenu>
      )}
    </Wrapper>
  );
};

export default SelectCategories;
