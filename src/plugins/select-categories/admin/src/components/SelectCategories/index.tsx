import { useCallback, useState } from 'react';

import { Accordion, Checkbox } from '@strapi/design-system';
import { ArrowDown, ArrowUp, Pencil, Plus, Trash } from '@strapi/icons';
import {
  AccordionItem,
  AccordionRoot,
  Actions,
  AddParentButton,
  AddParentButtonWrapper,
  ActionButton,
} from './StyledComponents';

type Node = {
  id: string;
  label: string;
  checked: boolean;
  subcategories: Node[];
};

type RenderNodeParameters = {
  node: Node;
  duplicateChild: (id: string, node: Node) => void;
  duplicateParent: (id: string) => void;
  updateChild: (id: string, node: Node) => void;
  deleteChild: (id: string) => void;
  updateChildOrder: (id: string, direction?: number) => () => void;
  showAddBtn?: boolean;
  index: number;
};

const toggleCheckedById = (tree: Node[], id: string): Node[] => {
  return tree.map((node) => ({
    ...node,
    checked: node.id === id ? !node.checked : node.checked,
    subcategories: toggleCheckedById(node.subcategories, id),
  }));
};

const renderNode = ({
  node,
  duplicateChild,
  duplicateParent,
  updateChild,
  deleteChild,
  updateChildOrder,
  showAddBtn,
  index,
}: RenderNodeParameters) => {
  const handleCheckboxChange = (node: Node) => {
    updateChild(node.id, { ...node, checked: !node.checked });
  };

  const handleAddChild = () => {
    duplicateChild(node.id, {
      id: `${node.id}-${node.subcategories.length + 1}`,
      label: `New Node ${node.subcategories.length + 1}`,
      checked: false,
      subcategories: [],
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
            <Actions>
              <ActionButton onClick={updateChildOrder(node.id, -1)}>
                <ArrowUp />
              </ActionButton>
              <ActionButton onClick={updateChildOrder(node.id)}>
                <ArrowDown />
              </ActionButton>
              <ActionButton onClick={() => {}}>
                <Pencil />
              </ActionButton>
              <ActionButton aria-label="Add child category" onClick={() => deleteChild(node.id)}>
                <Trash />
              </ActionButton>
            </Actions>
          </div>
        </Accordion.Header>
        <Accordion.Content>
          {node.subcategories.length > 0 && (
            <AccordionRoot index={index} isNestedFirst={false} style={{ paddingTop: '1rem' }}>
              {node.subcategories.map((child) =>
                renderNode({
                  node: child,
                  duplicateChild,
                  showAddBtn: false,
                  duplicateParent,
                  updateChild,
                  deleteChild,
                  index: index + 1,
                  updateChildOrder,
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
          return { ...node, subcategories: updateNode(node.subcategories) };
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
              subcategories: [...node.subcategories, { ...newChild, id: `node-${Date.now()}` }],
            };
          }
          return { ...node, subcategories: findNode(node.subcategories) };
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
                label: `New Category ${nodes.length + 1}`,
                checked: false,
                subcategories: [],
              },
            ];
          }

          return { ...node, subcategories: findAndDuplicate(node.subcategories) };
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
          .map((node) => ({ ...node, subcategories: removeNode(node.subcategories) }));
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

  const updateChildOrder = useCallback(
    (id: string, direction = 1) =>
      () => {
        const callback = (prevTree: Node[]) => {
          const newTree = structuredClone(prevTree);

          const reorderNodes = (nodes: Node[]): Node[] => {
            const index = nodes.findIndex((node) => node.id === id);

            if (index === -1) {
              return nodes.map((node) => ({
                ...node,
                subcategories: reorderNodes(node.subcategories),
              }));
            }

            const newIndex = index + direction;
            if (newIndex < 0 || newIndex >= nodes.length) return nodes;

            const updatedNodes = [...nodes];
            [updatedNodes[index], updatedNodes[newIndex]] = [
              updatedNodes[newIndex],
              updatedNodes[index],
            ];

            return updatedNodes;
          };

          const updatedTree = reorderNodes(newTree);

          if (onChange) {
            onChange({ target: { name: 'categoriesTree', value: updatedTree } });
          }

          return updatedTree;
        };

        setPassedTree(callback);
        setTree(callback);
      },
    []
  );

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
          updateChildOrder,
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
              subcategories: [],
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
