import { Accordion, TextInput, Modal, Typography, Button } from '@strapi/design-system';
import { ArrowUp, ArrowDown, Trash, Plus } from '@strapi/icons';
import { useState, useCallback, useMemo } from 'react';
import { ICategory } from 'src/types';
import {
  AccordionItem,
  TextFields,
  FieldRoot,
  Actions,
  ActionButton,
  AccordionRoot,
  AddParentButtonWrapper,
  AddParentButton,
} from './StyledComponents';

type RenderNodeParameters = {
  node: ICategory;
  duplicateChild: (id: string, node: Partial<ICategory>) => void;
  duplicateParent: (id: string) => void;
  updateChild: (id: string, newChild: ICategory) => void;
  deleteChild: (id: string) => void;
  updateChildOrder: (id: string, direction?: number) => () => void;
  showAddBtn?: boolean;
  index: number;
  currentIndex: number;
  parentLength: number;
};

export const RenderNode = ({
  node,
  duplicateChild,
  duplicateParent,
  updateChild,
  deleteChild,
  updateChildOrder,
  showAddBtn,
  index,
  currentIndex,
  parentLength,
}: RenderNodeParameters) => {
  const [valueName, setValueName] = useState(node.title);
  const [valueSlug, setValueSlug] = useState(node.slug);

  const handleAddChild = useCallback(() => {
    duplicateChild(node.id, {
      title: '',
      slug: '',
      subcategories: [],
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
    (updateValue: keyof ICategory) =>
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
                placeholder="Title"
                value={valueName}
                onChange={handleChange(setValueName)}
                onBlur={handleBlur('title')}
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
              {currentIndex > 0 && (
                <ActionButton onClick={updateChildOrder(node.id, -1)}>
                  <ArrowUp />
                </ActionButton>
              )}

              {currentIndex + 1 < parentLength && (
                <ActionButton onClick={updateChildOrder(node.id)}>
                  <ArrowDown />
                </ActionButton>
              )}

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
                      <Typography fontWeight="bold"> {node.title} </Typography>
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
              {node.subcategories.map((node, currentNestedIndex, parentArr) => (
                <RenderNode
                  key={node.id}
                  node={node}
                  duplicateChild={duplicateChild}
                  duplicateParent={duplicateParent}
                  updateChild={updateChild}
                  deleteChild={deleteChild}
                  updateChildOrder={updateChildOrder}
                  index={index + 1}
                  showAddBtn={false}
                  currentIndex={currentNestedIndex}
                  parentLength={parentArr.length}
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
