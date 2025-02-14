import { FC, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Plus } from '@strapi/icons';
import { AccordionRoot, AddParentButton, AddParentButtonWrapper } from './StyledComponents';
import type { ICategory, ICategoryTree } from '../../types';
import { RenderNode } from './RenderNode';

type Props = {
  passedTree: ICategoryTree;
  setPassedTree: React.Dispatch<React.SetStateAction<ICategoryTree>>;
};

export const CategoriesAccordion: FC<Props> = ({ passedTree, setPassedTree }) => {
  const updateChild = useCallback((id: string, updatedChild: ICategory) => {
    const callback = (prevTree: ICategoryTree) => {
      const categoryArray = structuredClone(prevTree.data);

      const updateNode = (nodes: ICategory[]): ICategory[] => {
        return nodes.map((node) => {
          if (node.id === id) {
            return { ...node, ...updatedChild };
          }
          return { ...node, subcategories: updateNode(node.subcategories) };
        });
      };

      const data = updateNode(categoryArray);

      return { ...prevTree, data };
    };

    setPassedTree(callback);
  }, []);

  const duplicateChild = useCallback((id: string, newChild: Partial<ICategory>) => {
    const callback = (prevTree: ICategoryTree): ICategoryTree => {
      const categoryArray = structuredClone(prevTree.data);
      const uid = uuidv4();

      const findNode = (nodes: ICategory[]): ICategory[] => {
        return nodes.map((node) => {
          if (node.id === id) {
            return {
              ...node,
              subcategories: [
                ...node.subcategories,
                {
                  ...newChild,
                  id: uid,
                  title: '',
                  slug: '',
                },
              ],
            } as ICategory;
          }
          return { ...node, subcategories: findNode(node.subcategories) };
        });
      };

      const updatedTree = findNode(categoryArray);

      return { ...prevTree, data: updatedTree };
    };

    setPassedTree(callback);
  }, []);

  const duplicateParent = useCallback((id: string) => {
    const callback = (prevTree: ICategoryTree): ICategoryTree => {
      const categoryArray = structuredClone(prevTree.data);
      const uid = uuidv4();

      const findAndDuplicate = (nodes: ICategory[]): ICategory[] => {
        return nodes.flatMap((node) => {
          if (node.id === id) {
            return [
              node,
              {
                id: uid,
                title: ``,
                slug: ``,
                subcategories: [],
              },
            ];
          }

          return { ...node, subcategories: findAndDuplicate(node.subcategories) };
        });
      };

      const updatedTree = findAndDuplicate(categoryArray);

      return { ...prevTree, data: updatedTree };
    };

    setPassedTree(callback);
  }, []);

  const deleteChild = useCallback((id: string) => {
    const callback = (prevTree: ICategoryTree): ICategoryTree => {
      const categoryArray = structuredClone(prevTree.data);

      const removeNode = (nodes: ICategory[]): ICategory[] => {
        return nodes
          .filter((node) => node.id !== id)
          .map((node) => ({ ...node, subcategories: removeNode(node.subcategories) }));
      };

      const updatedTree = removeNode(categoryArray);

      return { ...prevTree, data: updatedTree };
    };

    setPassedTree(callback);
  }, []);

  const updateChildOrder = useCallback(
    (id: string, direction = 1) =>
      () => {
        const callback = (prevTree: ICategoryTree): ICategoryTree => {
          const categoryArray = structuredClone(prevTree.data);

          const reorderNodes = (nodes: ICategory[]): ICategory[] => {
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

          const updatedTree = reorderNodes(categoryArray);

          return { ...prevTree, data: updatedTree };
        };

        setPassedTree(callback);
      },
    []
  );

  const handleAddFirstNode = useCallback(() => {
    const uid = uuidv4();

    const callback = (prev: ICategoryTree): ICategoryTree => {
      return {
        ...prev,
        data: [
          {
            id: uid,
            title: '',
            slug: '',
            subcategories: [],
          },
        ],
      };
    };

    setPassedTree(callback);
  }, []);

  return passedTree?.data?.length > 0 ? (
    <>
      <AccordionRoot index={0} isNestedFirst={true} style={{ border: 'none' }}>
        {(passedTree.data || []).map((node, index, parentArr) => (
          <RenderNode
            node={node}
            duplicateChild={duplicateChild}
            duplicateParent={duplicateParent}
            updateChild={updateChild}
            deleteChild={deleteChild}
            updateChildOrder={updateChildOrder}
            index={0}
            currentIndex={index}
            showAddBtn={index === parentArr.length - 1}
            key={node.id}
            parentLength={parentArr.length}
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
