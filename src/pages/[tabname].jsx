import React from "react";
import { useRouter } from "next/router";

// layout
import Layout from "../common/layouts/Layout";

// redux
import { useSelector } from "react-redux";

// containers
// import DashboardLayout from "../containers/dashboard/dashboardLayout/DashboardLayout";

const UserDefined = () => {
  const theme = useSelector((state) => state.Common.theme);
  const tabs = useSelector((state) => state.Common.GlobalTabs);
  const router = useRouter();
  const { tabname } = router.query;

  return (
    <Layout>
      <>
        <div className={`tabs-body ${theme}`}>
          {/* loop for the userdesined tabs */}
          {tabs.map((item, index) => (
            <React.Fragment key={index}>
              {item.userDefined == true && (
                <>{tabname == item.link && <>{/* <DashboardLayout /> */}</>}</>
              )}
            </React.Fragment>
          ))}
        </div>
      </>
    </Layout>
  );
};

export default UserDefined;
