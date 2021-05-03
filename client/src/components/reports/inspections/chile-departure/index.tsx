import React from 'react';
import { isEmpty } from 'ramda';

import api from 'api';
import { DataMessage } from 'components/page/message';
import Page from 'components/page';
import useColumns, { SORT_ORDER } from 'hooks/use-columns';
import { ChileDepartureInspection } from 'types';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';

import { gridTemplateColumns, InspectionTypes, SubInspectionsProps } from '..';
import ListItem from '../list-item';
import { listLabels } from './data-utils';

const ChileDepartureInspections = ({
  breadcrumbs,
  DateRangePicker,
  Search,
  TabBar,
}: SubInspectionsProps) => {
  const { data, loading, error } = api.useChileDepartureInspections();
  const inspections = data ? data.nodes : [];

  const columnLabels = useColumns<ChileDepartureInspection>(
    'inspectionDate',
    SORT_ORDER.DESC,
    listLabels,
    'inspection',
    'chile_departure_inspection_pallet',
  );

  return (
    <Page
      breadcrumbs={breadcrumbs}
      extraPaddingTop={122}
      headerChildren={
        <>
          <l.Flex alignCenter mb={th.spacing.sm} justifyBetween>
            <l.Flex>
              {Search}
              <l.Div width={th.spacing.md} />
              {DateRangePicker}
              <l.Div width={th.spacing.md} />
            </l.Flex>
            {TabBar}
          </l.Flex>
          {!loading && (
            <>
              <ty.SmallText mb={th.spacing.lg} pl={th.spacing.sm}>
                Results: {data ? data.totalCount : '-'}
              </ty.SmallText>
              <l.Grid
                gridTemplateColumns={gridTemplateColumns}
                mb={th.spacing.sm}
                pl={th.spacing.sm}
              >
                {columnLabels}
                <ty.SmallText px={th.spacing.sm} secondary>
                  Images
                </ty.SmallText>
              </l.Grid>
            </>
          )}
        </>
      }
      title="Product Inspection Reports"
    >
      {!isEmpty(inspections) ? (
        inspections.map(
          (item, idx) =>
            item && (
              <ListItem<ChileDepartureInspection>
                data={item}
                key={idx}
                lightboxTitle={`${item.lotNumber}`}
                listLabels={listLabels}
                slug={`${InspectionTypes.CHILE_DEPARTURE}/${item.lotNumber}`}
              />
            ),
        )
      ) : (
        <DataMessage
          data={inspections}
          error={error}
          loading={loading}
          emptyProps={{
            header: 'No Reports Found 😔',
            text: 'Modify search and date parameters to view more results.',
          }}
        />
      )}
    </Page>
  );
};

export default ChileDepartureInspections;
