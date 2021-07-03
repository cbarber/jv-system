import React, { Fragment, useEffect, useState } from 'react';
import { sortBy, prop, equals } from 'ramda';

import api from 'api';
import RemoveImg from 'assets/images/remove';
import usePrevious from 'hooks/use-previous';
import { Customer, Maybe, Shipper, Warehouse } from 'types';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';

import AddCompanyToContact from './add-company';

const CompanyContent = <T extends { id: string }>({
  allItems,
  baseTo,
  editing,
  label,
  nameKey,
  setAdditionalItems,
}: {
  allItems: T[];
  baseTo?: string;
  editing: boolean;
  label: string;
  nameKey: keyof T;
  setAdditionalItems: (items: T[]) => void;
}) => (
  <>
    {allItems.map((it, idx) => (
      <Fragment key={idx}>
        {idx === 0 ? (
          <ty.BodyText>
            {label}
            {allItems.length > 1 ? 's' : ''}:{' '}
          </ty.BodyText>
        ) : (
          <div />
        )}
        <l.Flex alignCenter>
          {baseTo && !editing ? (
            <ty.LinkText mr={th.spacing.sm} to={`${baseTo}/${it.id}`}>
              <ty.Span bold>{it[nameKey]}</ty.Span> ({it.id})
            </ty.LinkText>
          ) : (
            <ty.BodyText mr={th.spacing.sm}>
              <ty.Span bold>{it[nameKey]}</ty.Span> ({it.id})
            </ty.BodyText>
          )}
          {editing && idx > 0 && (
            <l.Div
              cursor="pointer"
              height={th.sizes.xs}
              onClick={() => {
                setAdditionalItems(
                  allItems.slice(1).filter((i) => i.id !== it.id),
                );
              }}
            >
              <RemoveImg height={th.sizes.xs} width={th.sizes.xs} />
            </l.Div>
          )}
        </l.Flex>
      </Fragment>
    ))}
  </>
);

interface Props {
  customer?: Maybe<Customer>;
  defaultAdditionalCustomers?: Customer[];
  defaultAdditionalShippers?: Shipper[];
  defaultAdditionalWarehouses?: Warehouse[];
  editing: boolean;
  shipper?: Maybe<Shipper>;
  warehouse?: Maybe<Warehouse>;
}

const useContactCompanyInfo = ({
  customer,
  defaultAdditionalCustomers = [],
  editing,
  shipper,
  defaultAdditionalShippers = [],
  warehouse,
  defaultAdditionalWarehouses = [],
}: Props) => {
  const previousDefaultAdditionalCustomers = usePrevious(
    defaultAdditionalCustomers,
  );
  const previousDefaultAdditionalShippers = usePrevious(
    defaultAdditionalShippers,
  );
  const previousDefaultAdditionalWarehouses = usePrevious(
    defaultAdditionalWarehouses,
  );
  const [additionalCustomers, setAdditionalCustomers] = useState<Customer[]>(
    defaultAdditionalCustomers,
  );
  const [additionalShippers, setAdditionalShippers] = useState<Shipper[]>(
    defaultAdditionalShippers,
  );
  const [additionalWarehouses, setAdditionalWarehouses] = useState<Warehouse[]>(
    defaultAdditionalWarehouses,
  );
  const {
    data: customerData,
    loading: customerDataLoading,
    error: customerDataError,
  } = api.useCustomers();
  const {
    data: shipperData,
    loading: shipperDataLoading,
    error: shipperDataError,
  } = api.useShippers();
  const {
    data: warehouseData,
    loading: warehouseDataLoading,
    error: warehouseDataError,
  } = api.useWarehouses();
  const allCustomers = customer
    ? [customer, ...sortBy(prop('customerName'), additionalCustomers)]
    : [];
  const allShippers = shipper
    ? [shipper, ...sortBy(prop('shipperName'), additionalShippers)]
    : [];
  const allWarehouses = warehouse
    ? [warehouse, ...sortBy(prop('warehouseName'), additionalWarehouses)]
    : [];

  const handleReset = () => {
    setAdditionalCustomers(defaultAdditionalCustomers);
    setAdditionalShippers(defaultAdditionalShippers);
    setAdditionalWarehouses(defaultAdditionalWarehouses);
  };

  useEffect(() => {
    if (
      !equals(previousDefaultAdditionalCustomers, defaultAdditionalCustomers)
    ) {
      setAdditionalCustomers(defaultAdditionalCustomers);
    }
  }, [defaultAdditionalCustomers, previousDefaultAdditionalCustomers]);

  useEffect(() => {
    if (!equals(previousDefaultAdditionalShippers, defaultAdditionalShippers)) {
      setAdditionalShippers(defaultAdditionalShippers);
    }
  }, [defaultAdditionalShippers, previousDefaultAdditionalShippers]);

  useEffect(() => {
    if (
      !equals(previousDefaultAdditionalWarehouses, defaultAdditionalWarehouses)
    ) {
      setAdditionalWarehouses(defaultAdditionalWarehouses);
    }
  }, [defaultAdditionalWarehouses, previousDefaultAdditionalWarehouses]);

  const customerInfo = customer && (
    <>
      <l.Grid gridTemplateColumns="120px 1fr">
        <CompanyContent
          allItems={allCustomers}
          baseTo="/directory/customers"
          editing={editing}
          label="Customer"
          nameKey="customerName"
          setAdditionalItems={setAdditionalCustomers}
        />
        {editing && (
          <>
            <div />
            <l.Flex>
              <AddCompanyToContact<Customer>
                addItem={(c) => {
                  setAdditionalCustomers([...additionalCustomers, c]);
                }}
                allItems={
                  (customerData ? customerData.nodes : []) as Customer[]
                }
                currentItems={allCustomers}
                error={customerDataError}
                errorLabel="Customers"
                loading={customerDataLoading}
                nameKey="customerName"
                placeholder="Add customers"
              />
            </l.Flex>
          </>
        )}
      </l.Grid>
    </>
  );
  const shipperInfo = shipper && (
    <l.Grid gridTemplateColumns="120px 1fr">
      <CompanyContent
        allItems={allShippers}
        baseTo="/directory/shippers"
        editing={editing}
        label="Shipper"
        nameKey="shipperName"
        setAdditionalItems={setAdditionalShippers}
      />
      {editing && (
        <>
          <div />
          <l.Flex>
            <AddCompanyToContact<Shipper>
              addItem={(s) => {
                setAdditionalShippers([...additionalShippers, s]);
              }}
              allItems={(shipperData ? shipperData.nodes : []) as Shipper[]}
              currentItems={allShippers}
              error={shipperDataError}
              errorLabel="Shippers"
              loading={shipperDataLoading}
              nameKey="shipperName"
              placeholder="Add shippers"
            />
          </l.Flex>
        </>
      )}
    </l.Grid>
  );
  const warehouseInfo = warehouse && (
    <l.Grid gridTemplateColumns="120px 1fr">
      <CompanyContent
        allItems={allWarehouses}
        baseTo="/directory/warehouses"
        editing={editing}
        label="Warehouse"
        nameKey="warehouseName"
        setAdditionalItems={setAdditionalWarehouses}
      />
      {editing && (
        <>
          <div />
          <l.Flex>
            <AddCompanyToContact<Warehouse>
              addItem={(w) => {
                setAdditionalWarehouses([...additionalWarehouses, w]);
              }}
              allItems={
                (warehouseData ? warehouseData.nodes : []) as Warehouse[]
              }
              currentItems={allWarehouses}
              error={warehouseDataError}
              errorLabel="Warehouses"
              loading={warehouseDataLoading}
              nameKey="warehouseName"
              placeholder="Add warehouses"
            />
          </l.Flex>
        </>
      )}
    </l.Grid>
  );

  const info = !!customer
    ? customerInfo
    : !!shipper
    ? shipperInfo
    : !!warehouse
    ? warehouseInfo
    : null;

  return { allCustomers, allShippers, allWarehouses, info, handleReset };
};

export default useContactCompanyInfo;