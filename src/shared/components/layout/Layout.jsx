import { useEffect, useRef, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  HOME_WAVEBAR_SECTION_IDS,
  WAVEBAR_SPECIAL_SECTION_ID,
  HOME_SECTION_IDS
} from "@/core/constants";
import { useLayoutHeights, useScrollSpy } from "@/shared/hooks";
import WaveBars from "./WaveBars";
import SteppedPanel from "./SteppedPanel";
import TalkPanel from "./TalkPanel";
import Footer from "./Footer";

export default function Layout() {
  const layoutRef = useRef(null);
  const { headerRef, wavebarRef, panelRef } = useLayoutHeights(layoutRef);
  const { i18n } = useTranslation();
  const { pathname } = useLocation();
  const [actionsInnerWidthPx, setActionsInnerWidthPx] = useState(null);
  const talkPanelRef = useRef(null);

  const { sectionAtWavebar, isAtTalkPanel } = useScrollSpy(
    HOME_WAVEBAR_SECTION_IDS,
    HOME_SECTION_IDS.EXPERIENCE,
    pathname,
    wavebarRef,
    talkPanelRef
  );

  const isSpecialWavebarSection = sectionAtWavebar === WAVEBAR_SPECIAL_SECTION_ID;
  const wavebarClassName = `layout__wavebar${isSpecialWavebarSection ? " layout__wavebar--alt" : ""}`;

  useEffect(() => {
    document.title = i18n.t("meta.pageTitle");
  }, [i18n.language, i18n]);

  return (
    <div ref={layoutRef} className="layout">
      <header ref={headerRef} className="layout__header">
        <div ref={wavebarRef} className={wavebarClassName}>
          <WaveBars onActionsInnerWidthChange={setActionsInnerWidthPx} />
        </div>
        <div ref={panelRef} className="container layout__panel-row">
          <SteppedPanel />
          <TalkPanel
            ref={talkPanelRef}
            widthPx={actionsInnerWidthPx}
            isExperienceAtPanel={isAtTalkPanel}
          />
        </div>
      </header>
      <main className="layout__main">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
