import { useCallback, useMemo, useState } from 'react';

import { Accordion } from '@strapi/design-system';
import { ArrowDown, ArrowUp, Plus, Trash } from '@strapi/icons';
import {
  AccordionItem,
  AccordionRoot,
  Actions,
  AddParentButton,
  AddParentButtonWrapper,
  ActionButton,
  TextFields,
  FieldRoot,
} from './StyledComponents';
import { TextInput } from '@strapi/design-system';
import { Modal } from '@strapi/design-system';
import { Button } from '@strapi/design-system';
import { Typography } from '@strapi/design-system';

type CategoryNode = {
  id: string;
  name: string;
  slug: string;
  checked: boolean;
  subcategories: CategoryNode[];
};

type UpdatedCategoryValue = Exclude<keyof CategoryNode, 'id'>;

type RenderNodeParameters = {
  node: CategoryNode;
  duplicateChild: (id: string, node: CategoryNode) => void;
  duplicateParent: (id: string) => void;
  updateChild: (id: string, node: CategoryNode) => void;
  deleteChild: (id: string) => void;
  updateChildOrder: (id: string, direction?: number) => () => void;
  showAddBtn?: boolean;
  index: number;
};

const toggleCheckedById = (tree: CategoryNode[], id: string): CategoryNode[] => {
  return tree.map((node) => ({
    ...node,
    checked: node.id === id ? !node.checked : node.checked,
    subcategories: toggleCheckedById(node.subcategories, id),
  }));
};

const RenderNode = ({
  node,
  duplicateChild,
  duplicateParent,
  updateChild,
  deleteChild,
  updateChildOrder,
  showAddBtn,
  index,
}: RenderNodeParameters) => {
  const [valueName, setValueName] = useState(node.name);
  const [valueSlug, setValueSlug] = useState(node.slug);

  // const handleCheckboxChange = (node: CategoryNode) => {
  //   updateChild(node.id, { ...node, checked: !node.checked });
  // };

  const handleAddChild = useCallback(() => {
    duplicateChild(node.id, {
      id: `${node.id}-${Date.now()}`,
      name: `New CategoryNode ${node.subcategories.length + 1}`,
      checked: false,
      subcategories: [],
      slug: `New Slug ${node.subcategories.length + 1}`,
    });
  }, []);

  const handleChange = useCallback(
    (setValue: React.Dispatch<React.SetStateAction<string>>) =>
      ({ target }: React.ChangeEvent<HTMLInputElement>) => {
        setValue(target.value);
      },
    []
  );

  const handleBlur = useCallback(
    (updateValue: UpdatedCategoryValue) =>
      ({ target }: React.FocusEvent<HTMLInputElement, Element>) => {
        if (node[updateValue] === target.value) return;

        updateChild(node.id, { ...node, [updateValue]: target.value });
      },
    []
  );

  const marginLeft = useMemo(() => (index > 0 ? index + 30 : 5), []);

  return (
    <div key={node.id} style={{ marginLeft }}>
      <AccordionItem value={node.id}>
        <Accordion.Header>
          <Accordion.Trigger style={{ display: 'block', width: 'auto' }} />
          <TextFields>
            <FieldRoot>
              <TextInput
                name={node.id}
                id={node.id}
                placeholder="Name"
                value={valueName}
                onChange={handleChange(setValueName)}
                onBlur={handleBlur('name')}
              />
            </FieldRoot>
            <FieldRoot>
              <TextInput
                name={node.id}
                id={node.id}
                placeholder="Slug"
                value={valueSlug}
                onChange={handleChange(setValueSlug)}
                onBlur={handleBlur('slug')}
              />
            </FieldRoot>
            {/* <Checkbox checked={node.checked} onCheckedChange={() => handleCheckboxChange(node)}>
              {node.name}
            </Checkbox> */}
            <Actions>
              <ActionButton onClick={updateChildOrder(node.id, -1)}>
                <ArrowUp />
              </ActionButton>
              <ActionButton onClick={updateChildOrder(node.id)}>
                <ArrowDown />
              </ActionButton>
              <Modal.Root>
                <Modal.Trigger>
                  <ActionButton aria-label="Add child category">
                    <Trash />
                  </ActionButton>
                </Modal.Trigger>
                <Modal.Content>
                  <Modal.Body>
                    <Typography textAlign="center">
                      Are you sure you want to remove
                      <Typography fontWeight="bold"> {node.name} </Typography>
                      and its children
                    </Typography>
                  </Modal.Body>
                  <Modal.Footer>
                    <Modal.Close>
                      <Button variant="tertiary">Cancel</Button>
                    </Modal.Close>
                    <Button variant="danger" onClick={() => deleteChild(node.id)}>
                      Delete
                    </Button>
                  </Modal.Footer>
                </Modal.Content>
              </Modal.Root>
            </Actions>
          </TextFields>
        </Accordion.Header>
        <Accordion.Content>
          {node.subcategories.length > 0 && (
            <AccordionRoot index={index} isNestedFirst={false} style={{ paddingTop: '1.5rem' }}>
              {node.subcategories.map((node) => (
                <RenderNode
                  node={node}
                  duplicateChild={duplicateChild}
                  duplicateParent={duplicateParent}
                  updateChild={updateChild}
                  deleteChild={deleteChild}
                  updateChildOrder={updateChildOrder}
                  index={index + 1}
                  showAddBtn={false}
                />
              ))}
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

export const CategoriesAccordion = ({ passedTree, setPassedTree, attribute, onChange }: any) => {
  const realTree = attribute?.options?.categoriesTree
    ? JSON.parse(attribute.options.categoriesTree)
    : passedTree || [];

  const [tree, setTree] = useState<CategoryNode[]>(realTree);

  const updateChild = useCallback((id: string, updatedChild: CategoryNode) => {
    const callback = (prevTree: CategoryNode[]) => {
      const newTree = structuredClone(prevTree);

      const updateNode = (nodes: CategoryNode[]): CategoryNode[] => {
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

    if (setPassedTree) {
      setPassedTree(callback);
    }

    setTree(callback);
  }, []);

  const duplicateChild = useCallback((id: string, newChild: CategoryNode) => {
    const callback = (prevTree: CategoryNode[]) => {
      const newTree = structuredClone(prevTree);

      const findNode = (nodes: CategoryNode[]): CategoryNode[] => {
        return nodes.map((node) => {
          if (node.id === id) {
            return {
              ...node,
              subcategories: [
                ...node.subcategories,
                {
                  ...newChild,
                  name: `New CategoryNode ${node.subcategories.length + 1}`,
                  slug: `New Slug ${node.subcategories.length + 1}`,
                  id: `node-${Date.now()}`,
                },
              ],
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

    if (setPassedTree) {
      setPassedTree(callback);
    }
    setTree(callback);
  }, []);

  const duplicateParent = useCallback((id: string) => {
    const callback = (prevTree: CategoryNode[]) => {
      const newTree = structuredClone(prevTree);

      const findAndDuplicate = (nodes: CategoryNode[]): CategoryNode[] => {
        return nodes.flatMap((node) => {
          if (node.id === id) {
            return [
              node,
              {
                id: `node-${Date.now()}`,
                name: `New Category ${nodes.length + 1}`,
                slug: `New Slug ${nodes.length + 1}`,
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

    if (setPassedTree) {
      setPassedTree(callback);
    }
    setTree(callback);
  }, []);

  const deleteChild = useCallback((id: string) => {
    const callback = (prevTree: CategoryNode[]) => {
      const newTree = structuredClone(prevTree);

      const removeNode = (nodes: CategoryNode[]): CategoryNode[] => {
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

    if (setPassedTree) {
      setPassedTree(callback);
    }
    setTree(callback);
  }, []);

  const updateChildOrder = useCallback(
    (id: string, direction = 1) =>
      () => {
        const callback = (prevTree: CategoryNode[]) => {
          const newTree = structuredClone(prevTree);

          const reorderNodes = (nodes: CategoryNode[]): CategoryNode[] => {
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

        if (setPassedTree) {
          setPassedTree(callback);
        }
        setTree(callback);
      },
    []
  );

  const handleAddFirstNode = useCallback(() => {
    const callback = (prev: CategoryNode[]) => [
      ...prev,
      {
        id: `node-${Date.now()}`,
        name: 'Category',
        slug: 'Slug',
        checked: false,
        subcategories: [],
      },
    ];

    if (setPassedTree) {
      setPassedTree(callback);
    }
    setTree(callback);
  }, []);

  return tree.length > 0 ? (
    <>
      <AccordionRoot index={0} isNestedFirst={true} style={{ border: 'none' }}>
        {tree.map((node, index, parrentArr) => (
          <RenderNode
            node={node}
            duplicateChild={duplicateChild}
            duplicateParent={duplicateParent}
            updateChild={updateChild}
            deleteChild={deleteChild}
            updateChildOrder={updateChildOrder}
            index={0}
            showAddBtn={index === parrentArr.length - 1}
            key={node.id}
          />
        ))}
      </AccordionRoot>
    </>
  ) : (
    <AddParentButtonWrapper>
      <AddParentButton onClick={handleAddFirstNode}>
        <Plus />
      </AddParentButton>
      <p>Add new category</p>
    </AddParentButtonWrapper>
  );
};
