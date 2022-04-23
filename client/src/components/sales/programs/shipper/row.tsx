import React, { ChangeEvent } from 'react';
import { ApolloError } from '@apollo/client';
import styled from '@emotion/styled';
import { pascalCase } from 'change-case';
import { equals, pick, pluck, sortBy, sum, times } from 'ramda';

import PlusInCircle from 'assets/images/plus-in-circle';
import EditableCell from 'components/editable-cell';
import useItemSelector from 'components/item-selector';
import ItemLinkRow, { ItemLink } from 'components/item-selector/link';
import { BasicModal } from 'components/modal';
import { useProgramsQueryParams, useQueryValue } from 'hooks/use-query-params';
import { CommonSpecies, ShipperProgram, CustomerProgramEntry } from 'types';
import l, { divPropsSet } from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';
import { getDateOfISOWeek, getWeekNumber } from 'utils/date';

import { ProgramProps, ShipperProgramUpdate } from '../types';
import { getShipperAvailablePalletEntryTotals } from '../utils';
import ShipperProgramAllocateModal from './allocate';

export const ProgramWrapper = styled(l.Grid)(
  {
    alignItems: 'center',
    height: 24,
    zIndex: 2,
  },
  divPropsSet,
);

export const NewProgramRow = ({
  newItemHandlers: { handleNewShipperProgram },
  hasPrograms,
}: ProgramProps & { hasPrograms: boolean }) => {
  const [arrivalPort] = useQueryValue('coast');
  const [shipperId] = useQueryValue('shipperId');

  const newProgram = {
    id: -1,
    commonSpeciesId: '',
    commonVarietyId: '',
    commonSizeId: '',
    commonPackTypeId: '',
    plu: '',
    shipperId,
    arrivalPort,
  };

  return (
    <ProgramWrapper mt={hasPrograms ? th.spacing.xs : th.spacing.md}>
      <l.Flex
        border={th.borders.transparent}
        alignCenter
        marginLeft={52}
        relative
      >
        <l.HoverButton
          onClick={() => {
            handleNewShipperProgram(newProgram);
          }}
          position="absolute"
          left={-23}
        >
          <PlusInCircle height={th.sizes.xs} width={th.sizes.xs} />
        </l.HoverButton>
      </l.Flex>
    </ProgramWrapper>
  );
};

export const ProgramTotalRow = ({
  editing,
  gridTemplateColumns,
  programTotals,
  showAllocated,
  species,
}: {
  editing: boolean;
  gridTemplateColumns: string;
  programTotals: { total: number; available: number }[];
  showAllocated: boolean;
  species: string;
}) => {
  const totals = pluck('total', programTotals);
  const availableTotals = pluck('available', programTotals);

  return (
    <l.Div py={th.spacing.md}>
      <ProgramWrapper
        gridTemplateColumns={gridTemplateColumns}
        mt={species === 'Grand' ? `-${th.spacing.sm}` : th.spacing.xs}
        relative
      >
        <l.Flex alignCenter justifyEnd ml={52}>
          <ty.CaptionText textAlign="right">
            {species === 'Grand' ? 'Grand ' : ''}Total:
          </ty.CaptionText>
          <ty.CaptionText
            bold
            ml={th.spacing.lg}
            mr={th.spacing.md}
            textAlign="right"
            width={th.spacing.lg}
          >
            {sum(totals)}
          </ty.CaptionText>
        </l.Flex>
        {totals.map((total, idx) => (
          <l.Flex alignCenter justifyCenter key={idx}>
            <ty.CaptionText center mr={th.spacing.md}>
              {total <= 0 ? '' : total}
            </ty.CaptionText>
          </l.Flex>
        ))}
      </ProgramWrapper>
      {!editing && showAllocated && (
        <ProgramWrapper
          gridTemplateColumns={gridTemplateColumns}
          mt={th.spacing.tn}
        >
          {[
            sum(availableTotals.map((val) => (val < 0 ? 0 : val))),
            ...availableTotals,
          ].map((total, idx) => (
            <ty.SmallText
              bold={idx === 0}
              color={
                total === 0 ? th.colors.status.success : th.colors.status.error
              }
              key={idx}
              mr={th.spacing.md}
              secondary
              textAlign={idx === 0 ? 'right' : 'center'}
            >
              {total !== null && total !== undefined && total !== -1
                ? `(${total})`
                : ''}
            </ty.SmallText>
          ))}
        </ProgramWrapper>
      )}
    </l.Div>
  );
};

const Cell = styled(l.Flex)(
  ({
    active,
    disabled,
    error,
    onClick,
    warning,
  }: {
    active?: boolean;
    disabled?: boolean;
    error?: boolean;
    onClick?: () => void;
    warning?: boolean;
  }) => ({
    alignItems: 'center',
    background: th.colors.background,
    border: error
      ? th.borders.error
      : warning
      ? th.borders.warning
      : active
      ? th.borders.primaryAccent
      : th.borders.disabled,
    height: 20,
    cursor: onClick ? 'pointer' : 'default',
    opacity: disabled ? th.opacities.disabled : 1,
    padding: `0 ${th.spacing.tn}`,
    position: 'relative',
    transition: th.transitions.default,
    width: `calc(${th.sizes.fill} - ${th.spacing.sm} - 2px)`,
    ':hover': {
      border: onClick
        ? error
          ? th.borders.error
          : warning
          ? th.borders.warning
          : th.borders.primaryAccent
        : undefined,
    },
  }),
);

const ProgramRow = (
  props: {
    error?: ApolloError;
    loading: boolean;
    commonSpecieses: CommonSpecies[];
    duplicateProgramIds: number[];
    gridTemplateColumns: string;
    index: number;
    previousProgram?: ShipperProgram;
    program: ShipperProgram;
    customerProgramEntries: CustomerProgramEntry[];
    showSpecies: boolean;
    showVariety: boolean;
  } & ProgramProps,
) => {
  const {
    commonSpecieses,
    changeHandlers: {
      handleShipperProgramChange,
      handleShipperProgramEntryChange,
    },
    handleRemoveItem,
    newItemHandlers: { handleNewShipperProgram, handleNewShipperProgramEntry },
    valueGetters: { getShipperProgramEntryValue, getShipperProgramValue },
    editing,
    error,
    duplicateProgramIds,
    gridTemplateColumns,
    loading,
    previousProgram,
    program,
    selectedWeekNumber,
    customerProgramEntries,
    showAllocated,
    showSpecies,
    showVariety,
    weekCount,
    handleWeekRangeChange,
    startWeeks,
    endWeeks,
  } = props;
  const { id } = program;

  const [, setProgramsQueryParams] = useProgramsQueryParams();

  const isDuplicate = duplicateProgramIds.includes(parseInt(id, 10));

  const updatedProgram = {
    id: program.id,
    arrivalPort: program.arrivalPort,
    shipperId: program.shipperId,
    plu: getShipperProgramValue(program, 'plu').value,
    commonSpeciesId: getShipperProgramValue(program, 'commonSpeciesId').value,
    commonVarietyId: getShipperProgramValue(program, 'commonVarietyId').value,
    commonSizeId: getShipperProgramValue(program, 'commonSizeId').value,
    commonPackTypeId: getShipperProgramValue(program, 'commonPackTypeId').value,
    shipperProgramEntries: {
      edges: [],
      nodes: [],
      pageInfo: {
        hasNextPage: false,
        hasPreviousPage: false,
      },
      totalCount: 0,
    },
  };
  const {
    plu,
    commonSpeciesId,
    commonVarietyId,
    commonSizeId,
    commonPackTypeId,
  } = updatedProgram;

  const commonSpecies = commonSpecieses.find((sp) => sp.id === commonSpeciesId);
  const commonVariety = commonSpecies?.commonVarieties.nodes.find(
    (v) => v && v.id === commonVarietyId,
  );
  const commonSize = commonSpecies?.commonSizes.nodes.find(
    (sz) => sz && sz.id === commonSizeId,
  );
  const commonPackType = commonSpecies?.commonPackTypes.nodes.find(
    (pt) => pt && pt.id === commonPackTypeId,
  );

  const handleChange = (key: keyof ShipperProgram, value: string | null) => {
    handleShipperProgramChange({
      ...updatedProgram,
      [key]: value,
    });
  };

  const commonSelectorProps = {
    closeOnSelect: true,
    error,
    height: 150,
    loading,
    panelGap: 0,
    width: 250,
  };

  const getSelectorValue = (
    type: 'species' | 'variety' | 'size' | 'packType',
  ) => {
    switch (type) {
      case 'species':
        return commonSpecies?.speciesName || '';
      case 'variety':
        return commonVariety?.varietyName || '';
      case 'size':
        return commonSize?.sizeName || '';
      case 'packType':
        return commonPackType?.packTypeName || '';
      default:
        return '';
    }
  };

  const isValueDirty = (type: 'species' | 'variety' | 'size' | 'packType') => {
    switch (type) {
      case 'species':
        return commonSpeciesId !== program.commonSpeciesId;
      case 'variety':
        return commonVarietyId !== program.commonVarietyId;
      case 'size':
        return commonSizeId !== program.commonSizeId;
      case 'packType':
        return commonPackTypeId !== program.commonPackTypeId;
      default:
        return true;
    }
  };

  const getLinkSelectorProps = (
    type: 'species' | 'variety' | 'size' | 'packType',
  ) => {
    const value = getSelectorValue(type);
    const isDirty = isValueDirty(type);

    const allItems = sortBy(
      (p) => p.text,
      commonSpecieses
        .map((s) => {
          const speciesIsValid = s.id === commonSpeciesId;
          switch (type) {
            case 'variety':
              return (
                speciesIsValid &&
                s.commonVarieties.nodes.map(
                  (v) =>
                    v && {
                      color: v.uiColor,
                      id: v.id,
                      text: v.varietyName || '',
                    },
                )
              );
            case 'size':
              return (
                speciesIsValid &&
                s.commonSizes.nodes.map(
                  (sz) =>
                    sz && {
                      id: sz.id,
                      text: sz.sizeName || '',
                    },
                )
              );
            case 'packType':
              return (
                speciesIsValid &&
                s.commonPackTypes.nodes.map(
                  (pt) =>
                    pt && {
                      id: pt.id,
                      text: pt.packTypeName || '',
                    },
                )
              );
            default:
              return {
                color: s.uiColor,
                id: s.id,
                text: s.speciesName || '',
              };
          }
        })
        .flat()
        .filter((link) => !!link) as ItemLink[],
    );

    const commonProductId =
      updatedProgram[
        `common${pascalCase(type)}Id` as keyof ShipperProgramUpdate
      ];

    const getItemContent = (link: ItemLink) => (
      <ItemLinkRow active={link.id === commonProductId} link={link} />
    );

    const selectItem = ({ id }: ItemLink) => {
      handleChange(
        `common${pascalCase(type)}Id` as keyof ShipperProgramUpdate,
        id === '-1' ? null : id,
      );
    };

    return {
      ...commonSelectorProps,
      allItems,
      editableCellProps: {
        content: { dirty: isDirty, value },
        defaultChildren: null,
        editing,
        error: !commonProductId || isDuplicate,
        onChange: (e: ChangeEvent<HTMLInputElement>) => {
          handleChange(
            `common${pascalCase(type)}Id` as keyof ShipperProgramUpdate,
            e.target.value,
          );
        },
        warning: false,
      },
      getItemContent,
      nameKey: 'text' as keyof ItemLink,
      selectItem,
    };
  };

  const speciesLinkSelectorProps = getLinkSelectorProps('species');
  const varietyLinkSelectorProps = getLinkSelectorProps('variety');
  const sizeLinkSelectorProps = getLinkSelectorProps('size');
  const packTypeLinkSelectorProps = getLinkSelectorProps('packType');

  const { ItemSelector: SpeciesSelector } = useItemSelector({
    errorLabel: 'species',
    ...speciesLinkSelectorProps,
  });

  const { ItemSelector: VarietySelector } = useItemSelector({
    errorLabel: 'varieties',
    ...varietyLinkSelectorProps,
  });

  const { ItemSelector: SizeSelector } = useItemSelector({
    errorLabel: 'sizes',
    ...sizeLinkSelectorProps,
  });

  const { ItemSelector: PackTypeSelector } = useItemSelector({
    errorLabel: 'pack types',
    ...packTypeLinkSelectorProps,
  });

  const isDifferentVariety =
    previousProgram &&
    !equals(
      updatedProgram.commonVarietyId,
      getShipperProgramValue(previousProgram, 'commonVarietyId').value,
    );

  const availablePalletEntryTotals = getShipperAvailablePalletEntryTotals(
    program,
    selectedWeekNumber,
    weekCount,
  );
  const availablePalletTotals = [
    sum(
      availablePalletEntryTotals.map((total) =>
        total !== null && total !== undefined && total < 0 ? 0 : total || 0,
      ),
    ),
    ...availablePalletEntryTotals,
  ];

  return (
    <>
      <ProgramWrapper
        gridTemplateColumns={gridTemplateColumns}
        mt={isDifferentVariety ? th.spacing.md : undefined}
      >
        <l.Grid
          alignCenter
          key={program.id}
          gridColumnGap={th.spacing.xs}
          gridTemplateColumns="repeat(2, 1fr) repeat(3, 0.7fr)"
          ml={52}
          relative
        >
          {editing && (
            <>
              <BasicModal
                title="Confirm Remove Product"
                content={
                  <ty.BodyText mb={th.spacing.md}>
                    Are you sure you want to remove this product? This action
                    cannot be undone.
                  </ty.BodyText>
                }
                handleConfirm={() => {
                  handleRemoveItem('shipperPrograms', id);
                }}
                shouldConfirm={program.id >= 0}
                triggerProps={{
                  position: 'absolute',
                  left: -45,
                }}
                triggerType="remove-icon"
              />
              <l.HoverButton
                onClick={() => {
                  handleNewShipperProgram(updatedProgram);
                }}
                position="absolute"
                left={-22}
              >
                <PlusInCircle height={th.sizes.xs} width={th.sizes.xs} />
              </l.HoverButton>
            </>
          )}
          {editing ? (
            SpeciesSelector
          ) : showSpecies ? (
            <Cell
              {...pick(
                ['error', 'warning'],
                speciesLinkSelectorProps.editableCellProps,
              )}
              onClick={
                commonSpeciesId
                  ? () => {
                      setProgramsQueryParams({ commonSpeciesId });
                    }
                  : undefined
              }
              width={89}
            >
              <ty.CaptionText
                bold
                ellipsis
                title={program.commonSpecies?.speciesName}
              >
                {program.commonSpecies?.speciesName}
              </ty.CaptionText>
            </Cell>
          ) : (
            <div />
          )}
          {commonSpecies && (
            <>
              {editing ? (
                VarietySelector
              ) : showVariety ? (
                <Cell
                  {...pick(
                    ['error', 'warning'],
                    varietyLinkSelectorProps.editableCellProps,
                  )}
                  onClick={
                    commonSpeciesId && commonVarietyId
                      ? () => {
                          setProgramsQueryParams({
                            commonSpeciesId,
                            commonVarietyId,
                          });
                        }
                      : undefined
                  }
                  width={89}
                >
                  <ty.CaptionText
                    ellipsis
                    title={program.commonVariety?.varietyName}
                  >
                    {program.commonVariety?.varietyName}
                  </ty.CaptionText>
                </Cell>
              ) : (
                <div />
              )}
              {editing ? (
                SizeSelector
              ) : (
                <Cell
                  {...pick(
                    ['error', 'warning'],
                    sizeLinkSelectorProps.editableCellProps,
                  )}
                  onClick={
                    commonSpecies && commonSizeId
                      ? () => {
                          setProgramsQueryParams({
                            commonSpeciesId,
                            commonSizeId,
                          });
                        }
                      : undefined
                  }
                  width={58}
                >
                  <ty.CaptionText ellipsis title={program.commonSize?.sizeName}>
                    {program.commonSize?.sizeName}
                  </ty.CaptionText>
                </Cell>
              )}
              {editing ? (
                PackTypeSelector
              ) : (
                <Cell
                  {...pick(
                    ['error', 'warning'],
                    packTypeLinkSelectorProps.editableCellProps,
                  )}
                  onClick={
                    commonSpeciesId && commonPackTypeId
                      ? () => {
                          setProgramsQueryParams({
                            commonSpeciesId,
                            commonPackTypeId,
                          });
                        }
                      : undefined
                  }
                  width={58}
                >
                  <ty.CaptionText
                    ellipsis
                    title={program.commonPackType?.packTypeName}
                  >
                    {program.commonPackType?.packTypeName}
                  </ty.CaptionText>
                </Cell>
              )}
              <EditableCell
                content={{ dirty: plu !== program.plu, value: plu || '' }}
                defaultChildren={
                  <Cell
                    onClick={
                      commonSpeciesId && plu
                        ? () => {
                            setProgramsQueryParams({
                              commonSpeciesId,
                              plu,
                            });
                          }
                        : undefined
                    }
                    width={58}
                  >
                    <ty.CaptionText>{plu}</ty.CaptionText>
                  </Cell>
                }
                editing={!!editing}
                error={isDuplicate}
                onChange={(e) => {
                  handleChange('plu', e.target.value);
                }}
                showBorder={false}
              />
            </>
          )}
        </l.Grid>
        {times((index) => {
          const entry = program.shipperProgramEntries.nodes.find(
            (entry) =>
              entry &&
              getWeekNumber(new Date(entry.programDate.replace(/-/g, '/'))) ===
                selectedWeekNumber + index,
          );

          const palletCountCurrentValue = getShipperProgramEntryValue(
            entry,
            'palletCount',
          ).value;
          const palletCountInputValue =
            !!palletCountCurrentValue && palletCountCurrentValue !== '0'
              ? palletCountCurrentValue
              : '';
          const palletCountValue = !!entry?.palletCount
            ? parseInt(entry?.palletCount, 10)
            : 0;
          const isEntryDirty =
            getShipperProgramEntryValue(entry, 'palletCount').value !==
            entry?.palletCount;

          return editing ? (
            <l.Flex
              alignCenter
              height={`calc(${th.sizes.fill} - 6px)`}
              justifyCenter
              key={index}
              mx={th.spacing.tn}
            >
              <EditableCell
                content={{
                  dirty: entry?.id < 0 || isEntryDirty,
                  value: palletCountInputValue,
                }}
                defaultChildren={null}
                editing={true}
                inputProps={{
                  min: 0,
                  textAlign: 'center',
                  type: 'number',
                }}
                onChange={(e) => {
                  entry
                    ? handleShipperProgramEntryChange({
                        ...entry,
                        palletCount: e.target.value,
                      })
                    : handleNewShipperProgramEntry({
                        id: 0,
                        notes: '',
                        palletCount: e.target.value,
                        programDate: getDateOfISOWeek(
                          selectedWeekNumber + index,
                          'yyyy-MM-dd',
                        ),
                        shipperProgramId: program.id,
                        shipperProgram: program,
                      });
                }}
              />
            </l.Flex>
          ) : (
            <l.Div key={index}>
              <ShipperProgramAllocateModal
                disabled={editing || !palletCountValue}
                customerProgramEntries={customerProgramEntries}
                entry={entry}
                loading={loading}
                trigger={(focused) => (
                  <Cell
                    active={focused}
                    alignCenter
                    disabled={!palletCountValue}
                    onClick={palletCountValue ? () => ({}) : undefined}
                    height={`calc(${th.sizes.fill} - 6px)`}
                    justifyCenter
                    mx={th.spacing.tn}
                  >
                    <ty.CaptionText center mr={th.spacing.md}>
                      {palletCountValue || '-'}
                    </ty.CaptionText>
                  </Cell>
                )}
                weekCount={weekCount}
                handleWeekRangeChange={handleWeekRangeChange}
                startWeeks={startWeeks}
                endWeeks={endWeeks}
              />
            </l.Div>
          );
        }, weekCount)}
      </ProgramWrapper>
      {!editing && showAllocated && (
        <ProgramWrapper
          gridTemplateColumns={gridTemplateColumns}
          mt={th.spacing.tn}
        >
          {availablePalletTotals.map((total, idx) => (
            <ty.SmallText
              bold={idx === 0}
              color={
                total === 0 ? th.colors.status.success : th.colors.status.error
              }
              key={idx}
              mr={th.spacing.md}
              secondary
              textAlign={idx === 0 ? 'right' : 'center'}
            >
              {total !== null && total !== undefined ? `(${total})` : ''}
            </ty.SmallText>
          ))}
        </ProgramWrapper>
      )}
    </>
  );
};

export default ProgramRow;
