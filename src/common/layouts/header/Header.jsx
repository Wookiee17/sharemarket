import React, { useState } from "react";
import moment from "moment/moment";
import { useRouter } from "next/router";

// Icons
import {
  FiBell,
  FiHelpCircle,
  FiSettings,
  FiStar,
} from "react-icons/fi";
import { FaLongArrowAltDown } from "react-icons/fa";
// redux
import { useSelector, useDispatch } from "react-redux";
import {
  setLatestNiftyStock,
  setEODNiftyStock,
  setHolidays,
  addUserDefineTab,
  setAllIndices
} from "../../../store/common/CommonSlice";

//graphql
import { useQuery } from "@apollo/client";
import { GET_LATEST_NIFTY_STOCK, GET_HOLIDAY_LIST, GET_INDICES_BASIC } from "../../../gql/queries";

// constants
import Logo from "../../assets/images/logo.png";
import PP from "../../assets/images/pp.jpeg";

// components
import ImageRes from "../../component/imageRes/ImageRes";
import DropDownMenu from "../../component/dropDownMenu/DropDownMenu";
import Button from "../../component/button/Button";
import Search from "../../component/search/Search";

// parts
import HeaderLinks from "./parts/headerLinks/HeaderLinks";
import HamburgerMenu from "./parts/hamburgerMenu/HamburgerMenu";
import HeaderLinksIcons from "./parts/headerLinksIcons/HeaderLinksIcons";
import HeaderThemeToggler from "./parts/headerThemeToggler/HeaderThemeToggler";

import { useUserData } from "@nhost/nextjs";

const Header = () => {
  const userData = useUserData();
  const dispatch = useDispatch();
  const router = useRouter();
  const theme = useSelector((state) => state.Common.theme);
  const GlobalTabs = useSelector((state) => state.Common.GlobalTabs);
  const latestNifty = useSelector((state) => state.Common.latestNiftyStock);
  const indices = useSelector((state) => state.Common.indices);
  const { isAuth } = useSelector((state) => state.Shield);

  const [drop2, setDrop2] = useState([
    "My Account",
    isAuth ? "Log Out" : "Log In",
  ]);
  const [drop1, setDrop1] = useState(["1", "2", "3", "4", "5"]);
  const HelpTabs = useSelector((state) => state.Help.HelpTabs);
  const HelpActiveTab = useSelector((state) => state.Help.activeHelpTab);
  const WebinarTabs = useSelector((state) => state.Webinar.webinarTabs);
  const user = useSelector((state) => state.Shield.user);

  const WebinarActiveTab = useSelector(
    (state) => state.Webinar.activeWebinarTab
  );
  // console.log(user, "dropuser");
  useQuery(GET_LATEST_NIFTY_STOCK, {
    pollInterval: process.env.NEXT_PUBLIC_REFETCH_INTERVAL, //fetch data in every 3 minutes
    onCompleted: (v) => {
      if (v.stock_prices?.length && Array.isArray(v.stock_prices)) {
        dispatch(setLatestNiftyStock(v.stock_prices[0]));
      }
      if (v.stock_prices_eod?.length && Array.isArray(v.stock_prices_eod)) {
        dispatch(setEODNiftyStock(v.stock_prices_eod[0]));
      }
    },
  });

  useQuery(GET_HOLIDAY_LIST, {
    pollInterval: process.env.NEXT_PUBLIC_REFETCH_INTERVAL, //fetch data in every 3 minutes
    onCompleted: (v) => {
      if (Array.isArray(v?.holidays) && v.holidays?.length) {
        dispatch(setHolidays(v.holidays));
      }
    },
  });
  useQuery(GET_INDICES_BASIC, {
    fetchPolicy: "cache-first",
    skip: indices?.length > 0,
    onCompleted: (v) => {
      if(Array.isArray(v?.indices)){
        dispatch(setAllIndices(v?.indices))
      }
    },
  });
  const _openTab = (name) => {
    let isWebinarOpen = true;
    let isHelpOpen = true;

    if (name == "Webinars") {
      isWebinarOpen = GlobalTabs.some((item) => item.name === "Webinar");

      if (!isWebinarOpen) {
        dispatch(
          addUserDefineTab({
            name: "Webinar",
            link: `webinar`,
            userDefined: true,
          })
        );
        router.push(`/webinar/${WebinarTabs[WebinarActiveTab].slug}`);
      }
    }

    if (name == "Help") {
      isHelpOpen = GlobalTabs.some((item) => item.name === "Help");

      if (!isHelpOpen) {
        dispatch(
          addUserDefineTab({
            name: "Help",
            link: `help`,
            userDefined: true,
          })
        );
        router.push(`/help/${HelpTabs[HelpActiveTab].slug}`);
      }
    }
  };
  return (
    <header className={`Header ${theme}`}>
      <div className="Header_left">
        <div className="logo">
          <ImageRes imgSrc={Logo.src} width={0} height={0} />
        </div>
        <HamburgerMenu />
        <Search placeholderText={"Global Search"} />
      </div>
      <div className="Header_right">
        {/* <HeaderThemeToggler /> */}
        <div className={`dt ${theme}`}>
          <span>
            {latestNifty !== null &&
              moment(latestNifty.created_at).format("DD MMM YYYY hh:mm A")}{" "}
            IST
          </span>
        </div>
        <div className={`divider ${theme}`}></div>
        <DropDownMenu
          lable={"156"}
          isIcon
          icon={<FiStar className="color-yellow" />}
          options={drop1}
        />
        <HeaderLinks lable={"My Alert"} link="/" isBage bageNo={"5"} />
        <div className={`divider ${theme}`}></div>
        <HeaderLinks
          lable={"Webinars"}
          isLink={false}
          handleClick={() => _openTab("Webinars")}
        />
        <HeaderLinks lable={"Subscribe"} />
        <Button type={"primary"} size={"md"}>
          <FaLongArrowAltDown style={{ marginRight: 5, marginTop: -2 }} />
          Install
        </Button>
        <HeaderLinksIcons icon={<FiSettings />} link="/" />
        <HeaderLinksIcons
          icon={<FiHelpCircle />}
          isLink={false}
          handleClick={() => _openTab("Help")}
        />
        <HeaderLinksIcons icon={<FiBell />} link="/" isBage bageNo={"10"} />
        {isAuth ? (
          <DropDownMenu
            imgUrl={user?.avatarUrl}
            lable={user?.displayName}
            options={drop2}
          />
        ) : (
          <div style={{ marginLeft: "1rem" }}>
            <HeaderLinks
              lable={"Log In"}
              isLink={false}
              handleClick={() => router.push(`/authentication`)}
            />
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
