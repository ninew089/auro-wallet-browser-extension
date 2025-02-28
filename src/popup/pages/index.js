import extension from "extensionizer";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { getBaseInfo } from "../../background/api";
import { FROM_BACK_TO_RECORD, SET_LOCK } from "../../constant/types";
import { languageInit } from "../../i18n";
import { setLanguage } from "../../reducers/appReducer";
import { updateExtensionBaseInfo } from "../../reducers/cache";
import {
  ENTRY_WITCH_ROUTE,
  updateEntryWitchRoute,
} from "../../reducers/entryRouteReducer";
import ApprovePage from "./ApprovePage";
import { LockPage } from "./Lock";
import HomePage from "./Main";
import SignTransaction from "./SignTransaction";
import Welcome from "./Welcome";

const MainRouter = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [nextRoute, setNextRoute] = useState(<></>);

  const entryWitchRoute = useSelector(
    (state) => state.entryRouteReducer.entryWitchRoute
  );

  const initBaseInfo = useCallback(async () => {
    let baseInfo = await getBaseInfo().catch((err) => err);
    if (baseInfo) {
      dispatch(updateExtensionBaseInfo(baseInfo));
    }
  }, []);

  useEffect(() => {
    let lan = languageInit();
    dispatch(setLanguage(lan));
    initBaseInfo();
  }, []);

  useEffect(() => {
    let lockEvent = (message, sender, sendResponse) => {
      const { type, action } = message;
      if (type === FROM_BACK_TO_RECORD && action === SET_LOCK) {
        dispatch(updateEntryWitchRoute(ENTRY_WITCH_ROUTE.LOCK_PAGE));
        history.push("/");
      }
      return true;
    };
    extension.runtime.onMessage.addListener(lockEvent);
  }, []);

  useEffect(() => {
    switch (entryWitchRoute) {
      case ENTRY_WITCH_ROUTE.WELCOME:
        setNextRoute(<Welcome />);
        return;
      case ENTRY_WITCH_ROUTE.HOME_PAGE:
        setNextRoute(<HomePage />);
        return;
      case ENTRY_WITCH_ROUTE.LOCK_PAGE:
        setNextRoute(<LockPage />);
        return;
      case ENTRY_WITCH_ROUTE.DAPP_APPROVE_PAGE:
        setNextRoute(<ApprovePage />);
        return;
      case ENTRY_WITCH_ROUTE.DAPP_SIGN_PAGE:
        setNextRoute(<SignTransaction />);
        return;
      default:
        setNextRoute(<></>);
        return;
    }
  }, [entryWitchRoute]);

  return nextRoute;
};
export default MainRouter;
