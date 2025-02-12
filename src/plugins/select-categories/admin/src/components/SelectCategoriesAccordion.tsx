import { Accordion, Checkbox, Button } from '@strapi/design-system';
import { Key, useState } from 'react';
import { useIntl } from 'react-intl';
import { PLUGIN_ID } from '../pluginId';

const renderNode = (
  node: { children: any[]; id: Key | null | undefined; label: any; checked: any },
  onChange: { (path: any, value: any): void; (arg0: string[], arg1: any[]): void },
  path = []
) => {
  const handleCheckboxChange = (checked: any) => {
    onChange([...path, 'checked'], checked);
  };

  const handleAddChild = () => {
    onChange(
      [...path, 'children'],
      [
        ...node.children,
        {
          id: `${node.id}-${node.children.length + 1}`,
          label: 'New Node',
          checked: false,
          children: [],
        },
      ]
    );
  };

  return (
    <Accordion.Item key={node.id} value={node.id}>
      <Accordion.Header>
        <Accordion.Trigger>{node.label}</Accordion.Trigger>
      </Accordion.Header>
      <Accordion.Content>
        <Checkbox checked={node.checked} onChange={handleCheckboxChange}>
          {node.label}
        </Checkbox>
        <Button onClick={handleAddChild}>Add Subcategory</Button>
        {node.children.length > 0 && (
          <Accordion.Root>
            {node.children.map((child: any, index: any) =>
              // @ts-ignore
              renderNode(child, onChange, [...path, 'children', index])
            )}
          </Accordion.Root>
        )}
      </Accordion.Content>
    </Accordion.Item>
  );
};

const SelectCategoriesAccording = ({ attribute, onChange, ...props }: any) => {
  const { formatMessage } = useIntl();
  const [tree, setTree] = useState(attribute.categoriesTree || []);

  const { intlLabel = { id: PLUGIN_ID } } = props;

  // console.log('props', { attribute, ...props });
  console.log('attribute', attribute);
  console.log('formatMessage(intlLabel)', formatMessage(intlLabel));

  const updateTree = (path: string | any[], value: any) => {
    const newTree = [...tree];
    let obj = newTree;
    for (let i = 0; i < path.length - 1; i++) {
      obj = obj[path[i]];
    }
    obj[path[path.length - 1]] = value;
    setTree(newTree);
    onChange({ target: { name: 'categoriesTree', value: newTree } });
  };

  return (
    <div>
      <Accordion.Root>
        {/* @ts-ignore */}
        {tree.map((node: any, index: any) => renderNode(node, updateTree, [index]))}
      </Accordion.Root>
      <Button
        onClick={() =>
          setTree([
            ...tree,
            { id: `node-${tree.length + 1}`, label: 'New Category', checked: false, children: [] },
          ])
        }
      >
        Add Category
      </Button>
    </div>
  );
};

export default SelectCategoriesAccording;
