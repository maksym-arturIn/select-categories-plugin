import { useState, useRef, useEffect } from 'react';
import { TextInput } from '@strapi/design-system';
import { Menu, Option, Wrapper } from './StyledComponents';

const categories = [
  {
    label: 'Еда',
    value: 'food',
    children: [
      { label: 'Фастфуд', value: 'fast-food' },
      { label: 'Здоровая еда', value: 'healthy' },
    ],
  },
  {
    label: 'Напитки',
    value: 'drinks',
    children: [
      { label: 'Алкогольные', value: 'alcohol' },
      { label: 'Безалкогольные', value: 'non-alcohol' },
    ],
  },
];

const RenderOption = ({ category, handleSelect, selected }: any) => {
  return (
    <Option key={category.value}>
      <div
        style={{
          cursor: 'pointer',
          padding: '4px 8px',
          background: selected.includes(category.value) ? '#eee' : '',
        }}
        onClick={() => handleSelect(category.value)}
      >
        {category.label}
      </div>

      {category?.children?.length > 0 &&
        category?.children?.map((child) => (
          <RenderOption
            key={child.value}
            category={child}
            handleSelect={handleSelect}
            selected={selected}
          />
        ))}
    </Option>
  );
};

const SelectCategories = () => {
  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const filterCategories = (categories, search) => {
    if (!search) return categories;

    return categories
      .map((category) => {
        const filteredChildren = category.children.filter((child) =>
          child.label.toLowerCase().includes(search.toLowerCase())
        );

        if (
          category.label.toLowerCase().includes(search.toLowerCase()) ||
          filteredChildren.length > 0
        ) {
          return { ...category, children: filteredChildren };
        }

        return null;
      })
      .filter(Boolean);
  };

  const filteredOptions = filterCategories(categories, search);

  const handleSelect = (value) => {
    setSelected((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
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
        onChange={(e) => setSearch(e.target.value)}
        onFocus={() => setIsOpen(true)}
      />

      {isOpen && (
        <Menu>
          {filteredOptions.length > 0 ? (
            filteredOptions.map((category) => (
              <RenderOption
                key={category.value}
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
