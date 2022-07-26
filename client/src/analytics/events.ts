/**
 * Plausible event namespace: EXPLORER_*
 * Since Data Portal and Explorer share the same Plausible account, we need to
 * namespace the events to differentiate between them.
 *
 * NOTE: If you modify this file, you must update Plausible custom event page for
 * both staging and prod environments as well.
 * Staging: https://plausible.io/cellxgene.staging.single-cell.czi.technology/settings/goals
 * Prod: https://plausible.io/cellxgene.cziscience.com/settings/goals
 */
export enum EVENTS {
  EXPLORER_DIFF_EXP_BUTTON_CLICKED = "EXPLORER_DIFF_EXP_BUTTON_CLICKED",
  EXPLORER_CATEGORY_EXPAND_BUTTON_CLICKED = "EXPLORER_CATEGORY_EXPAND_BUTTON_CLICKED",
  EXPLORER_CELLSET_BUTTON_CLICKED = "EXPLORER_CELLSET_BUTTON_CLICKED",
  EXPLORER_SUBSET_BUTTON_CLICKED = "EXPLORER_SUBSET_BUTTON_CLICKED",
  EXPLORER_RESET_SUBSET_BUTTON_CLICKED = "EXPLORER_RESET_SUBSET_BUTTON_CLICKED",
  EXPLORER_MODE_LASSO_BUTTON_CLICKED = "EXPLORER_MODE_LASSO_BUTTON_CLICKED",
  EXPLORER_MODE_PAN_ZOOM_BUTTON_CLICKED = "EXPLORER_MODE_PAN_ZOOM_BUTTON_CLICKED",
  EXPLORER_CENTROID_LABEL_TOGGLE_BUTTON_CLICKED = "EXPLORER_CENTROID_LABEL_TOGGLE_BUTTON_CLICKED",
  EXPLORER_VISUALIZATION_SETTINGS_BUTTON_CLICKED = "EXPLORER_VISUALIZATION_SETTINGS_BUTTON_CLICKED",
  EXPLORER_UNDO_BUTTON_CLICKED = "EXPLORER_UNDO_BUTTON_CLICKED",
  EXPLORER_REDO_BUTTON_CLICKED = "EXPLORER_REDO_BUTTON_CLICKED",
  EXPLORER_LAYOUT_CHOICE_BUTTON_CLICKED = "EXPLORER_LAYOUT_CHOICE_BUTTON_CLICKED",
  EXPLORER_LAYOUT_CHOICE_CHANGE_ITEM_CLICKED = "EXPLORER_LAYOUT_CHOICE_CHANGE_ITEM_CLICKED",
  EXPLORER_FLOATING_BUTTON_CLICKED = "EXPLORER_FLOATING_BUTTON_CLICKED",
  EXPLORER_COLORBY_CATEGORIES_BUTTON_CLICKED = "EXPLORER_COLORBY_CATEGORIES_BUTTON_CLICKED",
  EXPLORER_COLORBY_HISTOGRAM_CONTINUOUS_BUTTON_CLICKED = "EXPLORER_COLORBY_HISTOGRAM_CONTINUOUS_BUTTON_CLICKED",
  EXPLORER_COLORBY_GENE_BUTTON_CLICKED = "EXPLORER_COLORBY_GENE_BUTTON_CLICKED",
  EXPLORER_SUGGEST_MENU_ITEM_CLICKED = "EXPLORER_SUGGEST_MENU_ITEM_CLICKED",
  EXPLORER_GENESET_EXPAND_BUTTON_CLICKED = "EXPLORER_GENESET_EXPAND_BUTTON_CLICKED",
  EXPLORER_GENESET_HEADING_EXPAND_BUTTON_CLICKED = "EXPLORER_GENESET_HEADING_EXPAND_BUTTON_CLICKED",
  EXPLORER_HANDLE_ADD_NEW_GENE_TO_GENESET_BUTTON_CLICKED = "EXPLORER_HANDLE_ADD_NEW_GENE_TO_GENESET_BUTTON_CLICKED",
  EXPLORER_SEE_ACTIONS_BUTTON_CLICKED = "EXPLORER_SEE_ACTIONS_BUTTON_CLICKED",
  EXPLORER_COLOR_BY_ENTIRE_GENESET_BUTTON_CLICKED = "EXPLORER_COLOR_BY_ENTIRE_GENESET_BUTTON_CLICKED",
  EXPLORER_MENU_BUTTON_CLICKED = "EXPLORER_MENU_BUTTON_CLICKED",
  EXPLORER_OPEN_CREATE_GENESET_DIALOG_BUTTON_CLICKED = "EXPLORER_OPEN_CREATE_GENESET_DIALOG_BUTTON_CLICKED",
  EXPLORER_SUBMIT_GENESET_BUTTON_CLICKED = "EXPLORER_SUBMIT_GENESET_BUTTON_CLICKED",
  EXPLORER_SUBMIT_GENE_BUTTON_CLICKED = "EXPLORER_SUBMIT_GENE_BUTTON_CLICKED",
  EXPLORER_DELETE_FROM_GENESET_BUTTON_CLICKED = "EXPLORER_DELETE_FROM_GENESET_BUTTON_CLICKED",
  EXPLORER_PLOT_X_BUTTON_CLICKED = "EXPLORER_PLOT_X_BUTTON_CLICKED",
  EXPLORER_PLOT_Y_BUTTON_CLICKED = "EXPLORER_PLOT_Y_BUTTON_CLICKED",
  EXPLORER_MAXIMIZE_GENE_BUTTON_CLICKED = "EXPLORER_MAXIMIZE_GENE_BUTTON_CLICKED",
  EXPLORER_CATEGORY_SELECT_BUTTON_CLICKED = "EXPLORER_CATEGORY_SELECT_BUTTON_CLICKED",
  EXPLORER_CATEGORICAL_VALUE_SELECT_BUTTON_CLICKED = "EXPLORER_CATEGORICAL_VALUE_SELECT_BUTTON_CLICKED",
  EXPLORER_GENE_INFO_BUTTON_CLICKED = "EXPLORER_GENE_INFO_BUTTON_CLICKED",
  EXPLORER_ADD_GENE_AND_COLORBY = "EXPLORER_ADD_GENE_AND_COLORBY",
  EXPLORER_ADD_GENE_AND_DISPLAY_SCATTERPLOT = "EXPLORER_ADD_GENE_AND_DISPLAY_SCATTERPLOT",
  EXPLORER_DISPLAY_SCATTERPLOT = "EXPLORER_DISPLAY_SCATTERPLOT",
  EXPLORER_ADD_GENE_AND_SELECT_HISTOGRAM = "EXPLORER_ADD_GENE_AND_SELECT_HISTOGRAM",
  EXPLORER_SELECT_HISTOGRAM = "EXPLORER_SELECT_HISTOGRAM",
}
