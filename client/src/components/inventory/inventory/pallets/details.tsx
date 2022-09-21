import React from 'react';
import { useLocation, useParams } from 'react-router-dom';

import api from 'api';
import BaseData from 'components/base-data';
import Page from 'components/page';
import { DataMessage } from 'components/page/message';
import StatusIndicator from 'components/status-indicator';
import { Tab, useTabBar } from 'components/tab-bar';
import { Pallet, PalletSection as PalletSectionType } from 'types';
import b from 'ui/button';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';

import { baseLabels } from './data-utils';
import PalletSection from './section';

const breadcrumbs = (
  id: string,
  vesselId: string,
  itemId: string,
  search: string,
) => {
  const crumbs = [
    vesselId
      ? {
          text: 'Vessels',
          to: `/inventory/vessels${search}`,
        }
      : {
          text: 'Inventory',
          to: `/inventory${search}`,
        },
    itemId
      ? {
          text: 'Item',
          to: `/inventory/${
            vesselId ? 'vessels/' + vesselId + '/' : ''
          }items/${itemId}${search}`,
        }
      : { text: 'Pallets', to: `/inventory/pallets${search}` },
    {
      text: 'Pallet',
      to: `/inventory/${vesselId ? 'vessels/' + vesselId + '/' : ''}${
        itemId ? 'items/' + itemId + '/' : ''
      }pallets/${id}${search}`,
    },
  ];
  if (vesselId) {
    crumbs.splice(1, 0, {
      text: 'Vessel',
      to: `/inventory/${vesselId ? 'vessels/' + vesselId + '/' : ''}${search}`,
    });
  }
  return crumbs;
};

const tabs: Tab[] = [
  {
    id: 'sections',
    text: 'Sections',
  },
];

const Details = () => {
  const { search } = useLocation();
  const { id, vesselId, itemId } = useParams<{
    id: string;
    vesselId: string;
    itemId: string;
  }>();
  const { data, error, loading } = api.usePallet(id);

  const { TabBar } = useTabBar(tabs);

  return (
    <Page
      actions={
        data && data.psaArrivalReport
          ? [
              <l.AreaLink
                key={0}
                to={`/reports/inspections/arrival/${data.psaArrivalReport.id}`}
              >
                <b.Primary>Inspection</b.Primary>
              </l.AreaLink>,
            ]
          : []
      }
      breadcrumbs={breadcrumbs(id, vesselId, itemId, search)}
      title={data ? 'Pallet' : 'Loading...'}
    >
      {data ? (
        <>
          <l.Flex mb={th.spacing.md}>
            <l.Flex
              alignCenter
              bg={th.colors.brand.containerBackground}
              border={th.borders.primary}
              borderRadius={th.borderRadii.default}
              p={th.spacing.md}
            >
              <ty.CaptionText mr={th.spacing.md}>Order ID:</ty.CaptionText>
              <ty.LinkText
                hover="false"
                mr={th.spacing.lg}
                to={`/inventory/orders/${data.orderId}?`}
              >
                {data.orderId === undefined ? '-' : data.orderId}
              </ty.LinkText>
              <ty.CaptionText mr={th.spacing.md}>Back Order ID:</ty.CaptionText>
              <ty.LinkText
                hover="false"
                to={`/inventory/orders/${data.orderId}?backOrderId=${data.backOrderId}`}
                mr={th.spacing.lg}
              >
                {data.backOrderId === undefined ? '-' : data.backOrderId}
              </ty.LinkText>
              <ty.CaptionText mr={th.spacing.md}>Shipped:</ty.CaptionText>
              <StatusIndicator status={data.shipped ? 'success' : 'error'} />
            </l.Flex>
          </l.Flex>
          <BaseData<Pallet> data={data} labels={baseLabels} />
          <l.Div my={th.spacing.lg}>
            <TabBar />
          </l.Div>
          {(data.palletSections.nodes as PalletSectionType[]).map(
            (section, idx) => (
              <PalletSection key={idx} section={section} />
            ),
          )}
          <l.Div height={th.spacing.xxl} />
        </>
      ) : (
        <DataMessage data={data || []} error={error} loading={loading} />
      )}
    </Page>
  );
};

export default Details;