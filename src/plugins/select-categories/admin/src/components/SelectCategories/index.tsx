import { useCallback, useState } from 'react';

import { Accordion, Checkbox, IconButton, Button } from '@strapi/design-system';
import { Plus, Trash } from '@strapi/icons';

type Node = {
  id: string;
  label: string;
  checked: boolean;
  children: Node[];
};

type RenderNodeParameters = {
  node: Node;
  duplicateChild: (id: string, node: Node) => void;
  duplicateParent: (id: string) => void;
  updateChild: (id: string, node: Node) => void;
  deleteChild: (id: string) => void;
  showAddBtn: boolean;
};

const toggleCheckedById = (tree: Node[], id: string): Node[] => {
  return tree.map((node) => ({
    ...node,
    checked: node.id === id ? !node.checked : node.checked,
    children: toggleCheckedById(node.children, id),
  }));
};

const renderNode = ({
  node,
  duplicateChild,
  duplicateParent,
  updateChild,
  deleteChild,
  showAddBtn,
}: RenderNodeParameters) => {
  const handleCheckboxChange = (node: Node) => {
    updateChild(node.id, { ...node, checked: !node.checked });
  };

  const handleAddChild = () => {
    duplicateChild(node.id, {
      id: `${node.id}-${node.children.length + 1}`,
      label: 'New Node',
      checked: false,
      children: [],
    });
  };

  return (
    <div key={node.id}>
      <Accordion.Item style={{ border: '1px solid #dcdce4' }} value={node.id}>
        <Accordion.Header>
          <Accordion.Trigger style={{ display: 'block', width: 'auto' }} />
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              paddingRight: '1.5rem',
            }}
          >
            <Checkbox checked={node.checked} onCheckedChange={() => handleCheckboxChange(node)}>
              {node.label}
            </Checkbox>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <IconButton aria-label="Add child category" onClick={handleAddChild}>
                <Plus />
              </IconButton>
              <IconButton aria-label="Add child category" onClick={() => deleteChild(node.id)}>
                <Trash />
              </IconButton>
            </div>
          </div>
        </Accordion.Header>
        <Accordion.Content>
          {node.children.length > 0 && (
            <Accordion.Root>
              {node.children.map((child, index, parrentArr) =>
                renderNode({
                  node: child,
                  duplicateChild,
                  showAddBtn: index === parrentArr.length - 1,
                  duplicateParent,
                  updateChild,
                  deleteChild,
                })
              )}
            </Accordion.Root>
          )}
        </Accordion.Content>
      </Accordion.Item>
      {showAddBtn && <Button onClick={() => duplicateParent(node.id)}>add</Button>}
    </div>
  );
};

const SelectCategoriesAccordion = ({ attribute, onChange }: any) => {
  const [tree, setTree] = useState<Node[]>(JSON.parse(attribute.options.categoriesTree) || []);

  const updateChild = useCallback((id: string, updatedChild: Node) => {
    setTree((prevTree) => {
      const newTree = structuredClone(prevTree);

      const updateNode = (nodes: Node[]): Node[] => {
        return nodes.map((node) => {
          if (node.id === id) {
            return { ...node, ...updatedChild };
          }
          return { ...node, children: updateNode(node.children) };
        });
      };

      const updatedTree = updateNode(newTree);
      onChange({ target: { name: 'categoriesTree', value: updatedTree } });

      return updatedTree;
    });
  }, []);

  const duplicateChild = useCallback((id: string, newChild: Node) => {
    setTree((prevTree) => {
      const newTree = structuredClone(prevTree);

      const findNode = (nodes: Node[]): Node[] => {
        return nodes.map((node) => {
          if (node.id === id) {
            return { ...node, children: [...node.children, newChild] };
          }
          return { ...node, children: findNode(node.children) };
        });
      };

      const updatedTree = findNode(newTree);
      onChange({ target: { name: 'categoriesTree', value: updatedTree } });

      return updatedTree;
    });
  }, []);

  const duplicateParent = useCallback((id: string) => {
    setTree((prevTree) => {
      const newTree = structuredClone(prevTree);

      const findAndDuplicate = (nodes: Node[]): Node[] => {
        return nodes.flatMap((node) => {
          if (node.id === id) {
            return [
              node,
              {
                id: `node-${Date.now()}`,
                label: 'New Category',
                checked: false,
                children: [],
              },
            ];
          }
          return { ...node, children: findAndDuplicate(node.children) };
        });
      };

      const updatedTree = findAndDuplicate(newTree);
      onChange({ target: { name: 'categoriesTree', value: updatedTree } });

      return updatedTree;
    });
  }, []);

  const deleteChild = useCallback((id: string) => {
    setTree((prevTree) => {
      const newTree = structuredClone(prevTree);

      const removeNode = (nodes: Node[]): Node[] => {
        return nodes
          .filter((node) => node.id !== id)
          .map((node) => ({ ...node, children: removeNode(node.children) }));
      };

      const updatedTree = removeNode(newTree);
      onChange({ target: { name: 'categoriesTree', value: updatedTree } });

      return updatedTree;
    });
  }, []);

  return (
    <Accordion.Root style={{ border: 'none' }}>
      {tree.map((node, index, parrentArr) => {
        return renderNode({
          node,
          duplicateChild,
          duplicateParent,
          updateChild,
          deleteChild,
          showAddBtn: index === parrentArr.length - 1,
        });
      })}
    </Accordion.Root>
  );
};

export default SelectCategoriesAccordion;
