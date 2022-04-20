import { loader } from 'graphql.macro';
import { pluck } from 'ramda';

import ColorPicker from 'components/color-picker';
import { LabelInfo } from 'components/column-label';
import { CommonVariety, CommonVarietyTag, ProductVariety } from 'types';
import th from 'ui/theme';
import ty from 'ui/typography';

const PRODUCT_VARIETY_QUERY = loader(
  '../../../../api/sales/inventory/products/varieties/list.gql',
);

export type CommonVarietyLabelInfo = LabelInfo<CommonVariety>;

export const listLabels: CommonVarietyLabelInfo[] = [
  {
    key: 'uiColor',
    label: 'UI Color',
    getValue: ({ uiColor }) => (
      <ColorPicker
        activeColor={uiColor || ''}
        color={uiColor || ''}
        onChange={() => ({})}
        readOnly
      />
    ),
  },
  {
    key: 'varietyName',
    label: 'Variety Name',
    sortable: true,
  },
  {
    key: 'varietyDescription',
    label: 'Description',
  },
  {
    key: 'commonVarietyTags',
    label: 'Tags',
    getValue: ({ commonVarietyTags }) => (
      <ty.BodyText>
        {pluck('tagText', commonVarietyTags?.nodes as CommonVarietyTag[]).join(
          ', ',
        )}
      </ty.BodyText>
    ),
  },
];

export const baseLabels: CommonVarietyLabelInfo[] = [
  {
    key: 'uiColor',
    label: 'UI Color',
    getValue: ({ uiColor }) => (
      <ColorPicker
        activeColor={uiColor || ''}
        color={uiColor || ''}
        onChange={() => ({})}
        readOnly
      />
    ),
    isColor: true,
  },
  {
    key: 'varietyName',
    label: 'Name',
  },
  {
    key: 'varietyDescription',
    label: 'Description',
  },
  {
    key: 'productVarietyId',
    label: 'Code',
    itemSelectorQueryProps: {
      errorLabel: 'varieties',
      getItemContent: ({ id, varietyDescription }: ProductVariety) => (
        <ty.BodyText pl={th.spacing.sm}>
          {id} - {varietyDescription}
        </ty.BodyText>
      ),
      query: PRODUCT_VARIETY_QUERY,
      queryName: 'productVarieties',
    },
  },
];