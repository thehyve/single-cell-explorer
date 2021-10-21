/* Core dependencies */
import { Menu, MenuItem, Popover, Position } from "@blueprintjs/core";
import React from "react";

/* App dependencies */
import { Dataset } from "../../common/types/entities";

/* Styles */
// @ts-expect-error --- TODO fix import
import styles from "./datasetSelector.css";

/**
 * Function invoked on select of dataset.
 */
export type DatasetSelectedFn = (dataset: Dataset) => void;

interface Props {
  children: React.ReactNode;
  datasets: Dataset[];
  onDatasetSelected: DatasetSelectedFn;
  selectedDatasetId: string;
}

/**
 * Build menu item elements from given array of menu item props.
 * @param datasets - Set of menu item props to display as menu item.
 * @param selectedDatasetId - ID of the dataset currently being explored.
 * @param onDatasetSelected - Function invoked on click of menu item.
 * @returns Array of MenuItem elements.
 */
const buildDatasetMenuItems = (
  datasets: Dataset[],
  selectedDatasetId: string,
  onDatasetSelected: DatasetSelectedFn
): JSX.Element[] =>
  datasets.sort(sortDatasets).map((dataset) => {
    const active = dataset.id === selectedDatasetId;
    const classNames = active
      ? `${styles.datasetSelectorMenuItem} ${styles.datasetSelectorMenuItemActive}`
      : undefined;
    return (
      <MenuItem
        className={classNames}
        disabled={active}
        key={dataset.id}
        onClick={() => {
          onDatasetSelected(dataset);
        }}
        text={dataset.name}
      />
    );
  });

/**
 * Sort datasets by cell count, descending.
 * @param {Dataset} d0 - First dataset to compare.
 * @param {Dataset} d1 - Second dataset to compare.
 * @returns Number indicating sort precedence of d0 vs d1.
 */
export function sortDatasets(d0: Dataset, d1: Dataset): number {
  return (d1.cell_count ?? 0) - (d0.cell_count ?? 0);
}

/**
 * Dataset menu, toggled from dataset name in app-level breadcrumbs.
 */
const DatasetMenu = React.memo<Props>(
  ({
    children,
    datasets,
    onDatasetSelected,
    selectedDatasetId,
  }): JSX.Element => (
    <Popover
      boundary="viewport"
      content={
        <Menu
          style={{
            maxHeight:
              "290px" /* show 9.5 datasets at 30px height each, plus top padding of 5px */,
            maxWidth: "680px",
            overflow: "auto",
          }}
        >
          {buildDatasetMenuItems(
            datasets,
            selectedDatasetId,
            onDatasetSelected
          )}
        </Menu>
      }
      hasBackdrop
      minimal
      modifiers={{ offset: { offset: "0, 10" } }}
      position={Position.BOTTOM_LEFT}
      targetClassName={styles.datasetSelectorMenuPopoverTarget}
    >
      {children}
    </Popover>
  )
);
export default DatasetMenu;
