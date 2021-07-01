import React from 'react';
import { isEmpty, reduce } from 'ramda';

import { DataMessage } from 'components/page/message';
import useColumns, { SORT_ORDER } from 'hooks/use-columns';
import { Customer, PersonContact, Shipper, Warehouse } from 'types';
import l from 'ui/layout';
import th from 'ui/theme';

import ListItem from '../list-item';
import { groupContactListLabels, contactListLabels } from './data-utils';
import { LineItemCheckbox } from 'ui/checkbox';

const ContactList = ({
  baseUrl,
  isGroup,
  isAllContactsSelected,
  personContacts,
  selectContact,
  selectedItem,
  toggleAllContacts,
}: {
  baseUrl?: string;
  isGroup?: boolean;
  isAllContactsSelected?: boolean;
  personContacts: PersonContact[];
  selectedItem?: { selectedContacts: PersonContact[] } & any;
  selectContact?: (item: PersonContact) => void;
  toggleAllContacts?: () => void;
}) => {
  const hasCustomerIds = reduce(
    (acc, contact) =>
      acc ||
      (contact.customersByCustomerPersonContactPersonContactIdAndCustomerId &&
        !isEmpty(
          contact.customersByCustomerPersonContactPersonContactIdAndCustomerId
            .nodes,
        )),
    false,
    personContacts,
  );
  const hasShipperIds = reduce(
    (acc, contact) =>
      acc ||
      (contact.shippersByShipperPersonContactPersonContactIdAndShipperId &&
        !isEmpty(
          contact.shippersByShipperPersonContactPersonContactIdAndShipperId
            .nodes,
        )),
    false,
    personContacts,
  );
  const hasWarehouseIds = reduce(
    (acc, contact) =>
      acc ||
      (contact.warehousesByWarehousePersonContactPersonContactIdAndWarehouseId &&
        !isEmpty(
          contact
            .warehousesByWarehousePersonContactPersonContactIdAndWarehouseId
            .nodes,
        )),
    false,
    personContacts,
  );

  const listLabels = isGroup
    ? groupContactListLabels(hasCustomerIds, hasShipperIds, hasWarehouseIds)
    : contactListLabels;

  const columnLabels = useColumns<PersonContact>(
    'firstName',
    SORT_ORDER.ASC,
    listLabels,
    'directory',
    'person_contact',
  );

  const gridTemplateColumns = isGroup
    ? `30px 1fr 1.5fr 2.5fr ${hasCustomerIds ? '1.5fr ' : ''}${
        hasShipperIds ? '1.5fr ' : ''
      }${hasWarehouseIds ? '1.5fr ' : ''}30px`
    : '30px 1fr 1.5fr 2fr 2.5fr 90px 30px';

  const getSlug = (item: PersonContact) => {
    const baseSlug = baseUrl ? `${baseUrl}/contacts/${item.id}` : '';
    const customers =
      item.customersByCustomerPersonContactPersonContactIdAndCustomerId &&
      item.customersByCustomerPersonContactPersonContactIdAndCustomerId.nodes;
    const customerSlug =
      customers && customers.length > 0
        ? `customers/${(customers[0] as Customer).id}/contacts/${item.id}`
        : '';
    const shippers =
      item.shippersByShipperPersonContactPersonContactIdAndShipperId &&
      item.shippersByShipperPersonContactPersonContactIdAndShipperId.nodes;
    const shipperSlug =
      shippers && shippers.length > 0
        ? `shippers/${(shippers[0] as Shipper).id}/contacts/${item.id}`
        : '';
    const warehouses =
      item.warehousesByWarehousePersonContactPersonContactIdAndWarehouseId &&
      item.warehousesByWarehousePersonContactPersonContactIdAndWarehouseId
        .nodes;
    const warehouseSlug =
      warehouses && warehouses.length > 0
        ? `warehouses/${(warehouses[0] as Warehouse).id}/contacts/${item.id}`
        : '';
    const internalSlug = `internal/${item.id}`;
    return (
      baseSlug || customerSlug || shipperSlug || warehouseSlug || internalSlug
    );
  };

  return (
    <>
      <l.Grid
        gridTemplateColumns={gridTemplateColumns}
        mb={th.spacing.sm}
        pl={th.spacing.sm}
      >
        {toggleAllContacts && (
          <LineItemCheckbox
            checked={!!isAllContactsSelected}
            onChange={toggleAllContacts}
          />
        )}
        {columnLabels}
      </l.Grid>
      {!isEmpty(personContacts) ? (
        personContacts.map(
          (item, idx) =>
            item && (
              <ListItem<PersonContact>
                data={item}
                gridTemplateColumns={gridTemplateColumns}
                key={idx}
                onSelectItem={
                  selectContact ? () => selectContact(item) : undefined
                }
                selected={
                  selectedItem
                    ? !!selectedItem.selectedContacts.find(
                        (it: PersonContact) => it.id === item.id,
                      )
                    : undefined
                }
                listLabels={listLabels}
                slug={getSlug(item)}
              />
            ),
        )
      ) : (
        <DataMessage
          data={personContacts}
          error={null}
          loading={false}
          emptyProps={{
            header: 'No Contacts Found 😔',
          }}
        />
      )}
    </>
  );
};

export default ContactList;
