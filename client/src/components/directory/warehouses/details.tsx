import React from 'react';
import { useParams } from 'react-router-dom';

import api from 'api';
import BaseData from 'components/base-data';
import Page from 'components/page';
import { DataMessage } from 'components/page/message';
import { Warehouse } from 'types';

import { baseLabels } from './data-utils';

const breadcrumbs = (id: string) => [
  {
    text: 'Directory',
    to: `/directory/warehouses`,
  },
  { text: 'Warehouse', to: `/directory/warehouses/${id}` },
];

const Details = () => {
  const { id } =
    useParams<{
      id: string;
    }>();
  const { data, error, loading } = api.useWarehouse(id);

  return (
    <Page
      breadcrumbs={breadcrumbs(id)}
      title={data ? data.warehouseName : 'Directory - Warehouse'}
    >
      {data ? (
        <BaseData<Warehouse> data={data} labels={baseLabels} />
      ) : (
        <DataMessage data={data || []} error={error} loading={loading} />
      )}
    </Page>
  );
};

export default Details;
