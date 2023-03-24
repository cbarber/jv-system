import React from 'react';
import { isEmpty } from 'ramda';

import api from 'api';
import ListItem from 'components/list-item';
import { DataMessage } from 'components/page/message';
import Page from 'components/page';
import VirtualizedList from 'components/virtualized-list';
import useColumns, { SORT_ORDER } from 'hooks/use-columns';
import useSearch from 'hooks/use-search';
import { PersonContact } from 'types';
import { LineItemCheckbox } from 'ui/checkbox';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';

import { breadcrumbs, SubDirectoryProps } from '..';
import { useDirectorySelectionContext } from '../selection-context';
import { internalListLabels as listLabels } from './data-utils';

const gridTemplateColumns = '30px 1.5fr 2fr 3.5fr 2fr 2fr 30px';

const ContactDirectory = ({ actions }: SubDirectoryProps) => {
  const { Search } = useSearch();
  const { data, loading, error } = api.useInternalPersonContacts();
  const items = data ? data.nodes : [];

  const columnLabels = useColumns<PersonContact>(
    'firstName',
    SORT_ORDER.ASC,
    listLabels,
    'directory',
    'person_contact',
  );

  const [
    allSelectedItems,
    {
      selectInternalContact,
      isAllInternalContactsSelected,
      toggleAllInternalContacts,
    },
  ] = useDirectorySelectionContext();

  const selectedItems = allSelectedItems.internal;

  return (
    <Page
      actions={actions}
      breadcrumbs={breadcrumbs('internal')}
      extraPaddingTop={117}
      headerChildren={
        <>
          <l.Flex alignEnd mb={th.spacing.lg} justifyBetween>
            <div>
              <l.Flex alignCenter justifyBetween mb={th.spacing.sm}>
                <ty.SmallText secondary>Search</ty.SmallText>
                {!loading && (
                  <ty.SmallText secondary>
                    Results: {data ? data.totalCount : '-'}
                    {selectedItems.length > 0
                      ? `, Selected: ${selectedItems.length}`
                      : ''}
                  </ty.SmallText>
                )}
              </l.Flex>
              {Search}
            </div>
          </l.Flex>
          {!loading && (
            <l.Grid
              gridTemplateColumns={gridTemplateColumns}
              mb={th.spacing.sm}
              pl={th.spacing.sm}
              pr={data ? (data.totalCount > 12 ? th.spacing.md : 0) : 0}
            >
              <LineItemCheckbox
                checked={isAllInternalContactsSelected(items)}
                onChange={() => toggleAllInternalContacts(items)}
              />
              {columnLabels}
            </l.Grid>
          )}
        </>
      }
      title="JV Internal"
    >
      {!isEmpty(items) ? (
        <VirtualizedList
          height={582}
          rowCount={data ? items.length : 0}
          rowRenderer={({ key, index, style }) => {
            const item = items[index];
            return (
              item && (
                <div key={key} style={style}>
                  <ListItem<PersonContact>
                    data={item}
                    gridTemplateColumns={gridTemplateColumns}
                    listLabels={listLabels}
                    onSelectItem={() =>
                      item.email && selectInternalContact(item)
                    }
                    selected={!!selectedItems.find((it) => it.id === item.id)}
                    to={`/directory/internal/${item.id}`}
                  />
                </div>
              )
            );
          }}
        />
      ) : (
        <DataMessage
          data={items}
          error={error}
          loading={loading}
          emptyProps={{
            header: 'No contacts found',
            text: 'Modify search parameters to view more results.',
          }}
        />
      )}
    </Page>
  );
};

export default ContactDirectory;
