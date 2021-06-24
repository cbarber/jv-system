import React, { Fragment, useRef, useState } from 'react';
import JoditEditor, { JoditProps } from 'jodit-react';

import { BasicModal } from 'components/modal';
import SortControl from 'components/sort-control';
import b from 'ui/button';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';

import { AgendaItemProps } from './types';

const AgendaItem = ({
  handleChange,
  handleRemoveItem,
  handleSave,
  handleSortChange,
  hasChanges,
  item,
  isFirst,
  isLast,
  onCancel,
}: AgendaItemProps) => {
  const ref = useRef(null);
  const [editing, setEditing] = useState(item.id < 0);

  const config: Partial<JoditProps['config']> & any = {
    askBeforePasteHTML: false,
    autofocus: editing,
    showPlaceholder: false,
    spellcheck: false,
    showBrowserColorPicker: false,
    readonly: !editing,
    colorPickerDefaultTab: 'background',
    statusbar: false,
    buttonsMD: [
      'bold',
      'italic',
      'underline',
      '|',
      'ul',
      'ol',
      '|',
      'font',
      'fontsize',
      'brush',
      'paragraph',
      'indent',
      '|',
      'table',
      '|',
      'align',
      '|',
      'undo',
      'redo',
      '|',
      'hr',
      '|',
      'fullsize',
    ],
    style: {
      background: th.colors.background,
    },
    toolbar: editing,
    tabIndex: item.id,
  };

  const handleEdit = () => {
    setEditing(true);
  };

  const handleCancel = () => {
    setEditing(false);
    onCancel(item.id);
  };

  return (
    <l.Div
      borderBottom={th.borders.disabled}
      pb={th.spacing.lg}
      mb={th.spacing.lg}
      minHeight={250}
      relative
    >
      <l.Div mr={175} overflow="hidden">
        <l.Div m={-1}>
          <JoditEditor
            ref={ref}
            value={item.content}
            key={`${item.id}-${item.sortOrder}`}
            config={config as JoditProps['config']}
            onBlur={(content) => handleChange([{ ...item, content }])}
          />
        </l.Div>
      </l.Div>
      {!editing && (
        <l.Div position="absolute" right={113} top={7}>
          <SortControl
            disableUp={isFirst}
            disableDown={isLast}
            onDown={() => {
              handleSortChange(item, 'down');
            }}
            onUp={() => {
              handleSortChange(item, 'up');
            }}
            sideLength={th.sizes.icon}
            arrowSideLength={21}
          />
        </l.Div>
      )}
      <l.Flex column position="absolute" right={0} top={0}>
        {editing ? (
          <Fragment key={0}>
            <BasicModal
              title="Confirm Discard Changes"
              content={
                <ty.BodyText>
                  You will lose all unsaved agenda changes.
                </ty.BodyText>
              }
              confirmText="Discard"
              handleConfirm={handleCancel}
              shouldConfirm={item.id >= 0 || hasChanges}
              triggerStyles={{ mb: th.spacing.md, width: 100 }}
              triggerText="Cancel"
            />
            <b.Primary
              onClick={() => {
                handleSave(item.id, handleCancel);
              }}
              width={100}
            >
              Save
            </b.Primary>
          </Fragment>
        ) : (
          <Fragment key={1}>
            <b.Primary onClick={handleEdit} width={100}>
              Edit
            </b.Primary>
            <BasicModal
              title="Confirm Remove Item"
              content={
                <ty.BodyText>
                  Are you sure you want to remove this agenda item?
                </ty.BodyText>
              }
              confirmText="Remove"
              handleConfirm={() => handleRemoveItem(item.id, item.sortOrder)}
              triggerStyles={{ mt: th.spacing.md, width: 100 }}
              triggerText="Remove"
            />
          </Fragment>
        )}
      </l.Flex>
    </l.Div>
  );
};

export default AgendaItem;
