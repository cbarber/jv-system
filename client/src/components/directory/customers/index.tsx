import React from 'react';
import { isEmpty } from 'ramda';

import api from 'api';
import { DataMessage } from 'components/page/message';
import Page from 'components/page';
import VirtualizedList from 'components/virtualized-list';
import useColumns, { SORT_ORDER } from 'hooks/use-columns';
import { Customer } from 'types';
import { LineItemCheckbox } from 'ui/checkbox';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';

import { breadcrumbs, SubDirectoryProps } from '..';
import ListItem from '../list-item';
import { listLabels } from './data-utils';

const gridTemplateColumns = '30px 1fr 2.5fr 1.5fr 1.5fr 0.5fr 30px';

const CustomerDirectory = ({
  actions,
  Search,
  selectedItems,
  selectItem,
  TabBar,
  toggleSelectAll,
}: SubDirectoryProps) => {
  const { data, loading, error } = api.useCustomers();
  const items = data ? data.nodes : [];

  const columnLabels = useColumns<Customer>(
    'customerName',
    SORT_ORDER.ASC,
    listLabels,
    'directory',
    'customer',
  );

  const isAllSelected =
    selectedItems.length > 0 &&
    selectedItems.length === (data ? data.totalCount : -1);
  const handleSelectAll = () => {
    toggleSelectAll(
      isAllSelected,
      (items as Customer[]).map((company) => ({
        id: company.id,
        email: '',
        description: ` - Customer`,
      })),
    );
  };

  return (
    <Page
      actions={actions}
      breadcrumbs={breadcrumbs}
      extraPaddingTop={122}
      headerChildren={
        <>
          <l.Flex alignCenter mb={th.spacing.sm} justifyBetween>
            {Search}
            <l.Div width={th.spacing.md} />
            {TabBar}
          </l.Flex>
          {!loading && (
            <>
              <ty.SmallText mb={th.spacing.lg} pl={th.spacing.sm}>
                Results: {data ? data.totalCount : '-'}
                {selectedItems.length > 0
                  ? `, Selected: ${selectedItems.length}`
                  : ''}
              </ty.SmallText>
              <l.Grid
                gridTemplateColumns={gridTemplateColumns}
                mb={th.spacing.sm}
                pl={th.spacing.sm}
                pr={data ? (data.totalCount > 12 ? th.spacing.md : 0) : 0}
              >
                <LineItemCheckbox
                  checked={isAllSelected}
                  onChange={handleSelectAll}
                />
                {columnLabels}
              </l.Grid>
            </>
          )}
        </>
      }
      title="Customer Directory"
    >
      {!isEmpty(items) ? (
        <VirtualizedList
          rowCount={data ? data.totalCount : 0}
          rowRenderer={({ key, index, style }) => {
            const item = items[index];
            return (
              item && (
                <div key={key} style={style}>
                  <ListItem<Customer>
                    data={item}
                    gridTemplateColumns={gridTemplateColumns}
                    key={key}
                    listLabels={listLabels}
                    onSelectItem={() =>
                      selectItem({
                        id: item.id,
                        email: '',
                        description: ` - Customer`,
                      })
                    }
                    selected={!!selectedItems.find((it) => it.id === item.id)}
                    slug={`customers/${item.id}`}
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
            header: 'No Customers Found 😔',
            text: 'Modify search parameters to view more results.',
          }}
        />
      )}
    </Page>
  );
};

export default CustomerDirectory;
