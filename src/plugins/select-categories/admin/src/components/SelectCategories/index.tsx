import { useCallback, useState } from 'react';

import { Accordion, Checkbox } from '@strapi/design-system';
import { Plus, Trash } from '@strapi/icons';
import {
  AccordionItem,
  AccordionRoot,
  AddParentButton,
  AddParentButtonWrapper,
  DeleteButton,
} from './StyledComponents';

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
  showAddBtn?: boolean;
  index: number;
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
  index,
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

  const marginLeft = index > 0 ? index + 30 : 5;

  return (
    <div key={node.id} style={{ marginLeft }}>
      <AccordionItem value={node.id}>
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
            <DeleteButton aria-label="Add child category" onClick={() => deleteChild(node.id)}>
              <Trash />
            </DeleteButton>
          </div>
        </Accordion.Header>
        <Accordion.Content>
          {node.children.length > 0 && (
            <AccordionRoot index={index} isNestedFirst={false} style={{ paddingTop: '1rem' }}>
              {node.children.map((child) =>
                renderNode({
                  node: child,
                  duplicateChild,
                  showAddBtn: false,
                  duplicateParent,
                  updateChild,
                  deleteChild,
                  index: index + 1,
                })
              )}
            </AccordionRoot>
          )}
          <AddParentButtonWrapper style={{ marginLeft: index + 30 }}>
            <AddParentButton onClick={handleAddChild}>
              <Plus />
            </AddParentButton>
            <p>Add new subcategory</p>
          </AddParentButtonWrapper>
        </Accordion.Content>
      </AccordionItem>
      {showAddBtn && (
        <AddParentButtonWrapper>
          <AddParentButton onClick={() => duplicateParent(node.id)}>
            <Plus />
          </AddParentButton>
          <p>Add new category</p>
        </AddParentButtonWrapper>
      )}
    </div>
  );
};

const SelectCategoriesAccordion = ({ passedTree, setPassedTree, attribute, onChange }: any) => {
  const realTree = attribute?.options?.categoriesTree
    ? JSON.parse(attribute.options.categoriesTree)
    : passedTree || [];

  const [tree, setTree] = useState<Node[]>(realTree);

  const updateChild = useCallback((id: string, updatedChild: Node) => {
    const callback = (prevTree: Node[]) => {
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

      if (onChange) {
        onChange({ target: { name: 'categoriesTree', value: updatedTree } });
      }

      return updatedTree;
    };

    setPassedTree(callback);
    setTree(callback);
  }, []);

  const duplicateChild = useCallback((id: string, newChild: Node) => {
    const callback = (prevTree: Node[]) => {
      const newTree = structuredClone(prevTree);

      const findNode = (nodes: Node[]): Node[] => {
        return nodes.map((node) => {
          if (node.id === id) {
            return {
              ...node,
              children: [...node.children, { ...newChild, id: `node-${Date.now()}` }],
            };
          }
          return { ...node, children: findNode(node.children) };
        });
      };

      const updatedTree = findNode(newTree);

      if (onChange) {
        onChange({ target: { name: 'categoriesTree', value: updatedTree } });
      }

      return updatedTree;
    };

    setPassedTree(callback);
    setTree(callback);
  }, []);

  const duplicateParent = useCallback((id: string) => {
    const callback = (prevTree: Node[]) => {
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

      if (onChange) {
        onChange({ target: { name: 'categoriesTree', value: updatedTree } });
      }

      return updatedTree;
    };
    setPassedTree(callback);
    setTree(callback);
  }, []);

  const deleteChild = useCallback((id: string) => {
    const callback = (prevTree: Node[]) => {
      const newTree = structuredClone(prevTree);

      const removeNode = (nodes: Node[]): Node[] => {
        return nodes
          .filter((node) => node.id !== id)
          .map((node) => ({ ...node, children: removeNode(node.children) }));
      };

      const updatedTree = removeNode(newTree);

      if (onChange) {
        onChange({ target: { name: 'categoriesTree', value: updatedTree } });
      }

      return updatedTree;
    };

    setPassedTree(callback);
    setTree(callback);
  }, []);

  return tree.length > 0 ? (
    <AccordionRoot index={0} isNestedFirst={true} style={{ border: 'none' }}>
      {tree.map((node, index, parrentArr) => {
        return renderNode({
          node,
          duplicateChild,
          duplicateParent,
          updateChild,
          deleteChild,
          showAddBtn: index === parrentArr.length - 1,
          index: 0,
        });
      })}
    </AccordionRoot>
  ) : (
    <AddParentButtonWrapper>
      <AddParentButton
        onClick={() =>
          setPassedTree((prev: Node[]) => [
            ...prev,
            {
              id: `node-${Date.now()}`,
              label: 'Category',
              checked: false,
              children: [],
            },
          ])
        }
      >
        <Plus />
      </AddParentButton>
      <p>Add new category</p>
    </AddParentButtonWrapper>
  );
};

export default SelectCategoriesAccordion;
