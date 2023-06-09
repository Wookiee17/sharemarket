import React, { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Slider from "rc-slider";

// layout
import Layout from "../../../common/layouts/Layout";

// redux
import { useSelector, useDispatch } from "react-redux";
import { setActiveParticipantsDataTab } from "../../../store/participantsData/ParticipantsDataSlice";

// apollo
import { initializeApollo } from "../../../gql/apolloClient";
import { useQuery } from "@apollo/client";
import { GET_FII_DATES } from "../../../gql/queries";

// containers
import Buttom from "../../../common/component/button/Button";
import DropDown from "../../../common/component/dropDown/DropDown";
import ParticipantsCashMarket from "../../../common/component/participants/cashmarket/ParticipantsCashMarket";
import ParticipantsDerivatives from "../../../common/component/participants/derivatives/ParticipantsDerivatives";
import dayjs from "dayjs";

const start = dayjs().format("YYYY-MM-DD");
const end = dayjs().subtract(1, "month").format("YYYY-MM-DD");

const ParticipantsData = () => {
  const theme = useSelector((state) => state.Common.theme);
  const router = useRouter();
  const { tab } = router.query;
  const dispatch = useDispatch();
  const globalTabs = useSelector((state) => state.Common.GlobalTabs);
  const screens = useSelector(
    (state) => state.ParticipantsData.ParticipantsDataScreens
  );
  const Tabs = useSelector(
    (state) => state.ParticipantsData.ParticipantsDataTabs
  );
  const activeTab = useSelector(
    (state) => state.ParticipantsData.activeParticipantsDataTab
  );
  const activeScreen = useSelector(
    (state) => state.ParticipantsData.activeParticipantsDataScreen
  );
  const [selectedDate, setSelectedDate] = useState("");
  const [submitted, setSubmitted] = useState("");
  const [filterState, setFilterState] = useState(0);
  const { data } = useQuery(GET_FII_DATES, {
    variables: {
      start,
      end,
    },
    onCompleted: (data) => {
      setSelectedDate(data?.dates?.[0]?.priced_date);
      setSubmitted(data?.dates?.[0]?.priced_date);
    },
  });

  const dates = data?.dates?.map((d) => d?.priced_date);

  useEffect(() => {
    Tabs.forEach((item, i) => {
      if (tab == item.slug) {
        dispatch(setActiveParticipantsDataTab(item.id));
      }
    });
    // console.log(tab);
  }, [tab]);

  const _chnageTab = (slug, id) => {
    dispatch(setActiveParticipantsDataTab(id));
    if (id == 0) {
      router.push(
        `/${globalTabs[5].link}/${slug}/${screens[activeScreen].slug}`
      );
    } else {
      router.push(`/${globalTabs[5].link}/${slug}`);
    }
  };

  return (
    <Layout>
      <div className={`tabs-body ${theme}`}>
        <Head>
          <title>FII/DII Participants Data | IC Trading</title>
          <meta name="description" content="Generated by create next app" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <div className={`${theme} Participatns`}>
          <div className="Participatns_top">
            <div className="left">
              <div className={`secondary_tabs ${theme}`}>
                {Tabs.map((item, i) => (
                  <div
                    key={i}
                    className={`secondary_tabs-item ${
                      activeTab == item.id && "focused"
                    }`}
                    onClick={() => {
                      _chnageTab(item.slug, item.id);
                    }}
                  >
                    {item.name}
                  </div>
                ))}
              </div>
            </div>
            {activeTab == 0 && (
              <div className="viewBy">
                <p>View By</p>
                <div className="viewBy-slider">
                  <Slider
                    min={0}
                    defaultValue={16}
                    marks={{
                      0: `Daily`,
                      50: `Monthly`,
                      100: `Yearly`,
                    }}
                    step={null}
                    onChange={(v) => setFilterState(v)}
                  />
                </div>
              </div>
            )}
            {activeTab == 1 && (
              <div className="viewBy">
                <DropDown
                  lable={selectedDate}
                  options={dates}
                  setActive={(sdate) => {
                    setSelectedDate(sdate);
                  }}
                />
                <Buttom
                  type={"primary"}
                  size="sm"
                  onClick={() => setSubmitted(selectedDate)}
                >
                  GO
                </Buttom>
              </div>
            )}
          </div>
          <div className="Participatns_bottom">
            {/* {activeTab == 0 && (
              <>
                {screens.map((item, i) => (
                  <ParticipantsCashMarket
                    name={item.name}
                    filterstate={filterState}
                    fullScreenId={item.id}
                  />
                ))}
              </>
            )} */}
            {activeTab == 1 && <ParticipantsDerivatives date={submitted} />}
          </div>
        </div>
      </div>
    </Layout>
  );
};

// export async function getServerSideProps() {
//   const apolloClient = initializeApollo();

//   await apolloClient.query({
//     query: GET_FII_DATES,
//   });

//   return {
//     props: {
//       initialApolloState: apolloClient.cache.extract(),
//     },
//   };
// }

export default ParticipantsData;
