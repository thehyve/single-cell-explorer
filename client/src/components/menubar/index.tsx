import React from "react";
import { connect } from "react-redux";
import { ButtonGroup, AnchorButton, Tooltip } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";

import * as globals from "../../globals";
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module './menubar.css' or its correspo... Remove this comment to see the full error message
import styles from "./menubar.css";
import actions from "../../actions";
import Clip from "./clip";

import InfoDrawer from "../infoDrawer/infoDrawer";
import Subset from "./subset";
import DiffexpButtons from "./diffexpButtons";
import { getEmbSubsetView } from "../../util/stateManager/viewStackHelpers";
import { selectIsSeamlessEnabled } from "../../selectors/datasetMetadata";
import { track } from "../../analytics";
import { EVENTS } from "../../analytics/events";
import Embedding from "../embedding";
import { getFeatureFlag } from "../../util/featureFlags/featureFlags";
import { FEATURES } from "../../util/featureFlags/features";

// eslint-disable-next-line @typescript-eslint/no-explicit-any --- FIXME: disabled temporarily on migrate to TS.
type State = any;

// @ts-expect-error ts-migrate(1238) FIXME: Unable to resolve signature of class decorator whe... Remove this comment to see the full error message
@connect((state: State) => {
  const { annoMatrix } = state;
  const crossfilter = state.obsCrossfilter;
  const selectedCount = crossfilter.countSelected();

  const subsetPossible =
    selectedCount !== 0 && selectedCount !== crossfilter.size(); // ie, not all and not none are selected
  const embSubsetView = getEmbSubsetView(annoMatrix);
  const subsetResetPossible = !embSubsetView
    ? annoMatrix.nObs !== annoMatrix.schema.dataframe.nObs
    : annoMatrix.nObs !== embSubsetView.nObs;

  return {
    subsetPossible,
    subsetResetPossible,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any --- FIXME: disabled temporarily on migrate to TS.
    graphInteractionMode: state.controls.graphInteractionMode,
    clipPercentileMin: Math.round(100 * (annoMatrix?.clipRange?.[0] ?? 0)),
    clipPercentileMax: Math.round(100 * (annoMatrix?.clipRange?.[1] ?? 1)),
    userDefinedGenes: state.quickGenes.userDefinedGenes,
    colorAccessor: state.colors.colorAccessor,
    scatterplotXXaccessor: state.controls.scatterplotXXaccessor,
    scatterplotYYaccessor: state.controls.scatterplotYYaccessor,
    libraryVersions: state.config?.library_versions,
    aboutLink: state.config?.links?.["about-dataset"],
    disableDiffexp: state.config?.parameters?.["disable-diffexp"] ?? false,
    diffexpMayBeSlow:
      state.config?.parameters?.["diffexp-may-be-slow"] ?? false,
    showCentroidLabels: state.centroidLabels.showLabels,
    tosURL: state.config?.parameters?.about_legal_tos,
    privacyURL: state.config?.parameters?.about_legal_privacy,
    categoricalSelection: state.categoricalSelection,
    seamlessEnabled: selectIsSeamlessEnabled(state),
    screenCap: state.controls.screenCap,
    imageUnderlay: state.imageUnderlay,
    layoutChoice: state.layoutChoice,
  };
})
// eslint-disable-next-line @typescript-eslint/ban-types --- FIXME: disabled temporarily on migrate to TS.
class MenuBar extends React.PureComponent<{}, State> {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any -- - FIXME: disabled temporarily on migrate to TS.
  static isValidDigitKeyEvent(e: any) {
    /*
    Return true if this event is necessary to enter a percent number input.
    Return false if not.

    Returns true for events with keys: backspace, control, alt, meta, [0-9],
    or events that don't have a key.
    */
    if (e.key === null) return true;
    if (e.ctrlKey || e.altKey || e.metaKey) return true;

    // concept borrowed from blueprint's numericInputUtils:
    // keys that print a single character when pressed have a `key` name of
    // length 1. every other key has a longer `key` name (e.g. "Backspace",
    // "ArrowUp", "Shift"). since none of those keys can print a character
    // to the field--and since they may have important native behaviors
    // beyond printing a character--we don't want to disable their effects.
    const isSingleCharKey = e.key.length === 1;
    if (!isSingleCharKey) return true;

    const key = e.key.charCodeAt(0) - 48; /* "0" */
    return key >= 0 && key <= 9;
  }

  // eslint-disable-next-line @typescript-eslint/ban-types --- FIXME: disabled temporarily on migrate to TS.
  constructor(props: {}) {
    super(props);
    this.state = {
      pendingClipPercentiles: null,
    };
  }

  componentDidUpdate(prevProps: any): void {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'dispatch' does not exist on type 'Readon... Remove this comment to see the full error message
    const { layoutChoice, dispatch } = this.props;
    const prevConditionMet = prevProps.layoutChoice?.current?.includes(
      globals.spatialEmbeddingKeyword
    );
    const currentConditionMet = layoutChoice?.current?.includes(
      globals.spatialEmbeddingKeyword
    );

    if (!prevConditionMet && currentConditionMet) {
      dispatch({
        type: "toggle image underlay",
      });
    }
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types --- FIXME: disabled temporarily on migrate to TS.
  isClipDisabled = () => {
    /*
    return true if clip button should be disabled.
    */
    const { pendingClipPercentiles } = this.state;
    const clipPercentileMin = pendingClipPercentiles?.clipPercentileMin;
    const clipPercentileMax = pendingClipPercentiles?.clipPercentileMax;
    const {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'clipPercentileMin' does not exist on typ... Remove this comment to see the full error message
      clipPercentileMin: currentClipMin,
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'clipPercentileMax' does not exist on typ... Remove this comment to see the full error message
      clipPercentileMax: currentClipMax,
    } = this.props;

    // if you change this test, be careful with logic around
    // comparisons between undefined / NaN handling.
    const isDisabled =
      !(clipPercentileMin < clipPercentileMax) ||
      (clipPercentileMin === currentClipMin &&
        clipPercentileMax === currentClipMax);

    return isDisabled;
  };

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any -- - FIXME: disabled temporarily on migrate to TS.
  handleClipOnKeyPress = (e: any) => {
    /*
    allow only numbers, plus other critical keys which
    may be required to make a number
    */
    if (!MenuBar.isValidDigitKeyEvent(e)) {
      e.preventDefault();
    }
  };

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any -- - FIXME: disabled temporarily on migrate to TS.
  handleClipPercentileMinValueChange = (v: any) => {
    /*
    Ignore anything that isn't a legit number
    */
    if (!Number.isFinite(v)) return;

    const { pendingClipPercentiles } = this.state;
    const clipPercentileMax = pendingClipPercentiles?.clipPercentileMax;

    /*
    clamp to [0, currentClipPercentileMax]
    */
    if (v <= 0) v = 0;
    if (v > 100) v = 100;
    const clipPercentileMin = Math.round(v); // paranoia
    this.setState({
      pendingClipPercentiles: { clipPercentileMin, clipPercentileMax },
    });
  };

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any -- - FIXME: disabled temporarily on migrate to TS.
  handleClipPercentileMaxValueChange = (v: any) => {
    /*
    Ignore anything that isn't a legit number
    */
    if (!Number.isFinite(v)) return;

    const { pendingClipPercentiles } = this.state;
    const clipPercentileMin = pendingClipPercentiles?.clipPercentileMin;

    /*
    clamp to [0, 100]
    */
    if (v < 0) v = 0;
    if (v > 100) v = 100;
    const clipPercentileMax = Math.round(v); // paranoia

    this.setState({
      pendingClipPercentiles: { clipPercentileMin, clipPercentileMax },
    });
  };

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types --- FIXME: disabled temporarily on migrate to TS.
  handleClipCommit = () => {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'dispatch' does not exist on type 'Readon... Remove this comment to see the full error message
    const { dispatch } = this.props;
    const { pendingClipPercentiles } = this.state;
    const { clipPercentileMin, clipPercentileMax } = pendingClipPercentiles;
    const min = clipPercentileMin / 100;
    const max = clipPercentileMax / 100;
    dispatch(actions.clipAction(min, max));
  };

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types --- FIXME: disabled temporarily on migrate to TS.
  handleClipOpening = () => {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'clipPercentileMin' does not exist on typ... Remove this comment to see the full error message
    const { clipPercentileMin, clipPercentileMax } = this.props;
    this.setState({
      pendingClipPercentiles: { clipPercentileMin, clipPercentileMax },
    });
  };

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types --- FIXME: disabled temporarily on migrate to TS.
  handleClipClosing = () => {
    this.setState({ pendingClipPercentiles: null });
  };

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types --- FIXME: disabled temporarily on migrate to TS.
  handleCentroidChange = () => {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'dispatch' does not exist on type 'Readon... Remove this comment to see the full error message
    const { dispatch, showCentroidLabels } = this.props;

    track(EVENTS.EXPLORER_CENTROID_LABEL_TOGGLE_BUTTON_CLICKED);

    dispatch({
      type: "show centroid labels for category",
      showLabels: !showCentroidLabels,
    });
  };

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types --- FIXME: disabled temporarily on migrate to TS.
  handleSubset = () => {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'dispatch' does not exist on type 'Readon... Remove this comment to see the full error message
    const { dispatch } = this.props;

    track(EVENTS.EXPLORER_SUBSET_BUTTON_CLICKED);

    dispatch(actions.subsetAction());
  };

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types --- FIXME: disabled temporarily on migrate to TS.
  handleSubsetReset = () => {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'dispatch' does not exist on type 'Readon... Remove this comment to see the full error message
    const { dispatch } = this.props;

    track(EVENTS.EXPLORER_RESET_SUBSET_BUTTON_CLICKED);

    dispatch(actions.resetSubsetAction());
  };

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types --- FIXME: disabled temporarily on migrate to TS.
  render() {
    const {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'dispatch' does not exist on type 'Readon... Remove this comment to see the full error message
      dispatch,
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'disableDiffexp' does not exist on type '... Remove this comment to see the full error message
      disableDiffexp,
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'undoDisabled' does not exist on type 'Re... Remove this comment to see the full error message
      undoDisabled,
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'redoDisabled' does not exist on type 'Re... Remove this comment to see the full error message
      redoDisabled,
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'selectionTool' does not exist on type 'R... Remove this comment to see the full error message
      selectionTool,
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'clipPercentileMin' does not exist on typ... Remove this comment to see the full error message
      clipPercentileMin,
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'clipPercentileMax' does not exist on typ... Remove this comment to see the full error message
      clipPercentileMax,
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'graphInteractionMode' does not exist on ... Remove this comment to see the full error message
      graphInteractionMode,
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'showCentroidLabels' does not exist on ty... Remove this comment to see the full error message
      showCentroidLabels,
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'categoricalSelection' does not exist on ... Remove this comment to see the full error message
      categoricalSelection,
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'colorAccessor' does not exist on type 'R... Remove this comment to see the full error message
      colorAccessor,
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'subsetPossible' does not exist on type '... Remove this comment to see the full error message
      subsetPossible,
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'subsetResetPossible' does not exist on t... Remove this comment to see the full error message
      subsetResetPossible,
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'subsetResetPossible' does not exist on t... Remove this comment to see the full error message
      seamlessEnabled,
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'subsetResetPossible' does not exist on t... Remove this comment to see the full error message
      screenCap,
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'subsetResetPossible' does not exist on t... Remove this comment to see the full error message
      imageUnderlay,
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'subsetResetPossible' does not exist on t... Remove this comment to see the full error message
      layoutChoice,
    } = this.props;
    const { pendingClipPercentiles } = this.state;

    const isColoredByCategorical = !!categoricalSelection?.[colorAccessor];

    const isTest = getFeatureFlag(FEATURES.TEST);
    const isDownload = getFeatureFlag(FEATURES.DOWNLOAD);
    const isSpatial = getFeatureFlag(FEATURES.SPATIAL);
    // constants used to create selection tool button
    const [selectionTooltip, selectionButtonIcon] =
      selectionTool === "brush"
        ? ["Brush selection", "Lasso selection"]
        : ["select", "polygon-filter"];

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "left",
          }}
        >
          <Embedding />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row-reverse",
            flexWrap: "wrap",
            justifyContent: "right",
          }}
        >
          {seamlessEnabled ? (
            <ButtonGroup className={styles.menubarButton}>
              <AnchorButton
                type="button"
                icon={IconNames.INFO_SIGN}
                onClick={() => {
                  dispatch({ type: "toggle dataset drawer" });
                }}
                style={{
                  cursor: "pointer",
                }}
                data-testid="drawer"
              />
            </ButtonGroup>
          ) : null}
          {isDownload && (
            <Tooltip
              content="Download the current graph view as a PNG"
              position="bottom"
              hoverOpenDelay={globals.tooltipHoverOpenDelay}
            >
              <AnchorButton
                className={styles.menubarButton}
                type="button"
                icon={IconNames.CAMERA}
                style={{
                  cursor: "pointer",
                }}
                onClick={() => dispatch({ type: "graph: screencap start" })}
              />
            </Tooltip>
          )}
          {isTest && (
            <Tooltip
              content="🌊"
              position="bottom"
              hoverOpenDelay={globals.tooltipHoverOpenDelay}
            >
              <AnchorButton
                className={styles.menubarButton}
                type="button"
                icon={IconNames.TORCH}
                style={{
                  cursor: "pointer",
                }}
                data-testid="capture-and-display-graph"
                loading={screenCap}
                onClick={() => dispatch({ type: "test: screencap start" })}
              />
            </Tooltip>
          )}
          <Clip
            // @ts-expect-error ts-migrate(2322) FIXME: Type '{ pendingClipPercentiles: any; clipPercentil... Remove this comment to see the full error message
            pendingClipPercentiles={pendingClipPercentiles}
            clipPercentileMin={clipPercentileMin}
            clipPercentileMax={clipPercentileMax}
            handleClipOpening={this.handleClipOpening}
            handleClipClosing={this.handleClipClosing}
            handleClipCommit={this.handleClipCommit}
            isClipDisabled={this.isClipDisabled}
            handleClipOnKeyPress={this.handleClipOnKeyPress}
            handleClipPercentileMaxValueChange={
              this.handleClipPercentileMaxValueChange
            }
            handleClipPercentileMinValueChange={
              this.handleClipPercentileMinValueChange
            }
          />
          <Tooltip
            content="When a category is colored by, show labels on the graph"
            position="bottom"
            disabled={graphInteractionMode === "zoom"}
            hoverOpenDelay={globals.tooltipHoverOpenDelay}
          >
            <AnchorButton
              className={styles.menubarButton}
              type="button"
              data-testid="centroid-label-toggle"
              icon="property"
              onClick={this.handleCentroidChange}
              active={showCentroidLabels}
              intent={showCentroidLabels ? "primary" : "none"}
              disabled={!isColoredByCategorical}
            />
          </Tooltip>
          {layoutChoice?.current?.includes(globals.spatialEmbeddingKeyword) &&
            isSpatial && (
              <ButtonGroup className={styles.menubarButton}>
                <Tooltip
                  content="Toggle image"
                  position="bottom"
                  hoverOpenDelay={globals.tooltipHoverOpenDelay}
                >
                  <AnchorButton
                    type="button"
                    data-testid="toggle-image-underlay"
                    icon="media"
                    intent={imageUnderlay.isActive ? "primary" : "none"}
                    active={imageUnderlay.isActive}
                    onClick={() => {
                      dispatch({
                        type: "toggle image underlay",
                      });
                    }}
                  />
                </Tooltip>
              </ButtonGroup>
            )}
          <ButtonGroup className={styles.menubarButton}>
            <Tooltip
              content={selectionTooltip}
              position="bottom"
              hoverOpenDelay={globals.tooltipHoverOpenDelay}
            >
              <AnchorButton
                type="button"
                data-testid="mode-lasso"
                // @ts-expect-error ts-migrate(2322) FIXME: Type 'string' is not assignable to type 'IconName ... Remove this comment to see the full error message
                icon={selectionButtonIcon}
                active={graphInteractionMode === "select"}
                onClick={() => {
                  track(EVENTS.EXPLORER_MODE_LASSO_BUTTON_CLICKED);

                  dispatch({
                    type: "change graph interaction mode",
                    data: "select",
                  });
                }}
              />
            </Tooltip>
            <Tooltip
              content="Drag to pan, scroll to zoom"
              position="bottom"
              hoverOpenDelay={globals.tooltipHoverOpenDelay}
            >
              <AnchorButton
                type="button"
                data-testid="mode-pan-zoom"
                icon="zoom-in"
                active={graphInteractionMode === "zoom"}
                onClick={() => {
                  track(EVENTS.EXPLORER_MODE_PAN_ZOOM_BUTTON_CLICKED);

                  dispatch({
                    type: "change graph interaction mode",
                    data: "zoom",
                  });
                }}
              />
            </Tooltip>
          </ButtonGroup>
          <Subset
            // @ts-expect-error ts-migrate(2322) FIXME: Type '{ subsetPossible: any; subsetResetPossible: ... Remove this comment to see the full error message
            subsetPossible={subsetPossible}
            subsetResetPossible={subsetResetPossible}
            handleSubset={this.handleSubset}
            handleSubsetReset={this.handleSubsetReset}
          />
          {disableDiffexp ? null : <DiffexpButtons />}
          <InfoDrawer />
        </div>
      </div>
    );
  }
}

export default MenuBar;
