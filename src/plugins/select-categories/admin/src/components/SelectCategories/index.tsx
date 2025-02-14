import { useState, useRef, useEffect } from 'react';
import {
  Chevron,
  Input,
  InputWrapper,
  Menu,
  Select,
  SelectedCategoriesMenu,
  Wrapper,
} from './StyledComponents';
import { ICategory } from 'src/types';
import { RenderSelectOption } from './RenderSelectOption';
import { useFetchClient } from '@strapi/strapi/admin';
import type { IStrapiPayload, ICategoryTree } from '../../types';
import { PLUGIN_ID } from '../../pluginId';
import { ChevronDown } from '@strapi/icons';

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

const filterCategories = (categories: ICategory[], search: string): ICategory[] => {
  return categories
    .map((category) => {
      const filteredChildren = filterCategories(category.subcategories, search);

      if (
        category.title.toLowerCase().includes(search.toLowerCase()) ||
        filteredChildren.length > 0
      ) {
        return { ...category, subcategories: filteredChildren };
      }

      return null;
    })
    .filter(Boolean) as ICategory[];
};

const getAllSubcategoryIds = (category: ICategory) => {
  let ids = [category.id];
  category.subcategories.forEach((sub) => {
    ids = ids.concat(getAllSubcategoryIds(sub));
  });
  return ids;
};

const SelectCategories = () => {
  const client = useFetchClient();

  const [categories, setCategories] = useState<ICategory[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const filteredOptions = filterCategories(categories, search);
  const selectedCategories = flattenSelectedCategories(categories, selected).filter((category) =>
    selected.includes(category.id)
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
    setSelected((prev) => {
      const isSelected = prev.includes(category.id);
      return isSelected
        ? prev.filter((id) => !categoryIds.includes(id))
        : [...prev, ...categoryIds];
    });
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
    getCategoryTree();
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
              <RenderSelectOption
                key={category.id}
                category={category}
                handleSelect={handleSelect}
                selected={selected}
                selectable
                isFirst
              />
            ))
          ) : (
            <div style={{ padding: '8px', textAlign: 'center' }}>Categories not found</div>
          )}
        </Menu>
      )}

      {!isOpen && selectedCategories.length > 0 && (
        <SelectedCategoriesMenu>
          {selectedCategories.map((category) => (
            <RenderSelectOption
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
