import { LabelInfo } from 'components/column-label';
import { SORT_ORDER } from 'hooks/use-columns';
import { Shipper } from 'types';
import ty from 'ui/typography';
import { LineItemCheckbox } from 'ui/checkbox';

export const DEFAULT_VESSEL_CONTROL_DAYS_UNTIL_DUE = 45;

export type ShipperLabelInfo = LabelInfo<Shipper>;

export const listLabels: ShipperLabelInfo[] = [
  {
    key: 'id',
    label: 'ID',
  },
  {
    defaultSortOrder: SORT_ORDER.ASC,
    key: 'shipperName',
    label: 'Shipper Name',
    sortable: true,
  },
  {
    defaultSortOrder: SORT_ORDER.ASC,
    key: 'countryId',
    label: 'Country',
    filterPanelProps: { columnCount: 3 },
    filterable: true,
    sortable: true,
    getValue: (data) =>
      data.country ? (
        <ty.BodyText>{data.country?.countryName}</ty.BodyText>
      ) : (
        ''
      ),
  },
  {
    key: 'groupId',
    label: 'Group ID',
  },
];

export const baseLabels: ShipperLabelInfo[] = [
  {
    key: 'id',
    label: 'ID',
    readOnly: true,
  },
  {
    key: 'shipperName',
    label: 'Shipper Name',
    readOnly: true,
  },
  {
    key: 'countryId',
    label: 'Country',
    getValue: (data) =>
      data.country ? (
        <ty.BodyText>{data.country?.countryName}</ty.BodyText>
      ) : (
        ''
      ),
    readOnly: true,
  },
  {
    key: 'groupId',
    label: 'Group ID',
    readOnly: true,
  },
  {
    key: 'vendor',
    label: 'Vendor',
    getValue: ({ vendor }) =>
      vendor ? (
        <ty.LinkText hover="false" to={`/directory/vendors/${vendor.id}`}>
          {vendor.id}
        </ty.LinkText>
      ) : (
        '-'
      ),
    readOnly: true,
  },
  {
    key: 'notes',
    label: 'Notes',
  },
  {
    key: 'sendProjectionRequest',
    label: 'Send Projection Request',
    isBoolean: true,
    getValue: (data) => (
      <LineItemCheckbox
        checked={!!data.sendProjectionRequest}
        disabled
        onChange={() => ({})}
      />
    ),
  },
  {
    key: 'projectionRequestStartDate',
    label: 'Projections Start Date',
    isDate: true,
  },
  {
    key: 'projectionRequestEndDate',
    label: 'Projections End Date',
    isDate: true,
  },
  {
    key: 'vesselControlDaysUntilDue',
    label: 'Vessel Control Days Until Due',
    getValue: ({ vesselControlDaysUntilDue }) => (
      <ty.BodyText
        disabled={
          !vesselControlDaysUntilDue ||
          vesselControlDaysUntilDue === DEFAULT_VESSEL_CONTROL_DAYS_UNTIL_DUE
        }
      >
        {vesselControlDaysUntilDue || DEFAULT_VESSEL_CONTROL_DAYS_UNTIL_DUE}
      </ty.BodyText>
    ),
    validate: ({ vesselControlDaysUntilDue }) =>
      !vesselControlDaysUntilDue || !isNaN(Number(vesselControlDaysUntilDue)),
  },
];
