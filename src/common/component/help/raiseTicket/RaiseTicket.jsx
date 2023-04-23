import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
// Icons
import { FiArrowUp, FiArrowDown, FiPlus, FiTrash } from "react-icons/fi";
import { AiOutlineComment } from "react-icons/ai";

// redux
import { useSelector, useDispatch } from "react-redux";
import { setActiveRaiseTicketTabs } from "../../../../store/help/HelpSlice";
// component
import Search from "../../search/Search";
import Button from "../../button/Button";
import RaiseTicketDetail from "./RaiseTicketDetail";
import RaiseTicketItem from "./RaiseTicketItem";

//queries
import { GET_CUSTOMER_TICKETS, MUTATE_TICKETS } from "../../../../gql/queries";

import { useQuery } from "@apollo/client/react";
import { useMutation, useApolloClient } from "@apollo/client/react";
import dayjs from "dayjs";
import { useUserData } from "@nhost/nextjs";

import axios from "axios";

const RaiseTicket = () => {
  const router = useRouter();
  const [filterSearch, setFilterSearch] = useState("");
  const leftRef = useRef(null);
  //data
  const [ticketsData, setTicketsData] = useState();

  const [selectedTicket, setSelectedTicket] = useState();

  const [newTicketState, setNewTicketState] = useState(false);

  const theme = useSelector((state) => state.Common.theme);
  const dispatch = useDispatch();
  const tabs = useSelector((state) => state.Help.raiseTicketTabs);
  const activeTab = useSelector((state) => state.Help.activeRaiseTicketTabs);
  const [sort, setSort] = useState(true);
  const ref = useRef(null);
  const userData = useUserData();
  const _changeTab = (id, slug) => {
    dispatch(setActiveRaiseTicketTabs(id));
  };
  const tabFun = () => {
    if (activeTab === 0) {
      return "";
    }
    if (activeTab === 1) {
      return "open";
    }
    if (activeTab === 2) {
      return "in_progress";
    }
    if (activeTab === 3) {
      return "resolved";
    }
    if (activeTab === 4) {
      return "not_viable";
    }
  };

  const stateBg = (item) => {
    if (item?.state === "open") {
      return "bg-blue";
    }
    if (item?.state === "in_progress") {
      return "bg-green";
    }
    if (item?.state === "resolved") {
      return "bg-pink";
    }
    if (item?.state === "not_viable") {
      return "bg-red";
    }
  };

  const { data: ticketList, refetch } = useQuery(GET_CUSTOMER_TICKETS, {
    variables: {
      where: {
        _and: [
          { state: { _ilike: `%${tabFun()}%` } },
          { state: { _neq: "cancelled" } },
          { customer_id: { _eq: userData?.id } },
          {
            enum_ticket_category: {
              comments: { _ilike: `%${filterSearch}%` },
            },
          },
        ],
      },
      order_by: { created_at: sort ? "desc" : "asc" },
    },
    onCompleted: (v) => {
      if (v?.indiacharts_customer_tickets?.length == 0) {
       return  setTicketsData([])
      }
      setSelectedTicket(
        selectedTicket || v?.indiacharts_customer_tickets?.[0]?.id
      );
      setNewTicketState(false);
      setTicketsData(v?.indiacharts_customer_tickets);
      // setSelectedTicket(router.query.id);
    },
  });

  useEffect(() => {}, []);
  //mutation
  const [updateTicket] = useMutation(MUTATE_TICKETS, {
    refetchQueries: [{ query: GET_CUSTOMER_TICKETS }, "getCustomerTickets"],
    onCompleted: (v) => alert("Ticket cancelled"),
  });

  const FileDownloadHandler = (url, name) => {
    // debugger;
    axios({
      url: url,
      method: "GET",
      responseType: "blob",
    })
      ?.then((response) => {
        const href = URL.createObjectURL(response?.data);

        const link = document.createElement("a");
        link.href = href;
        link.setAttribute("download", name);
        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
        URL.revokeObjectURL(href);
      })
      ?.catch((err) => "");
  };
  useEffect(() => {
    if (router?.query?.id) {
      const id = router.query.id;
      setSelectedTicket(id);
    }
  }, [router]);

  useEffect(() => {
    refetch();
  }, [activeTab]);

  useEffect(() => {
    dispatch(setActiveRaiseTicketTabs(activeTab));
  }, []);

  return (
    <div className={`RaiseTicket ${theme}`}>
      <div className="RaiseTicket_header">
        <div className="RaiseTicket_header-title">My Tickets</div>
        <div className="RaiseTicket_header-filters">
          <div className="RaiseTicket_header-filters_left">
            <div className="tabs">
              <div className={`innerTabs ${theme}`}>
                {tabs.map((item, i) => (
                  <div
                    className={`innerTabs-item ${
                      activeTab == item.id && "focused"
                    }`}
                    key={i}
                    onClick={() => _changeTab(item.id, item.slug)}
                  >
                    <div
                      className={`help-RaiseTicket-tab-indicator ${
                        item.color != null ? `bg-${item.color}` : "d-none"
                      }`}
                    ></div>
                    {item.name}
                  </div>
                ))}
              </div>
            </div>
            <div
              className="RaiseTicket_header-sort"
              onClick={() => {
                setSort((prev) => !prev);
              }}
            >
              {sort == true ? (
                <>
                  <FiArrowDown style={{ marginRight: 5 }} />
                  <span>Latest</span>
                </>
              ) : (
                <>
                  <FiArrowUp style={{ marginRight: 5 }} />
                  <span>Oldest</span>
                </>
              )}
            </div>
            <div className="RaiseTicket_header-search">
              <Search
                placeholderText="Enter keyword"
                onChange={(v) => setFilterSearch(v.target.value)}
              />
            </div>
          </div>
          <div className="RaiseTicket_header-filters_right">
            <Button type={"primary"} onClick={() => setNewTicketState(true)}>
              <FiPlus style={{ marginRight: 5 }} /> New Ticket
            </Button>
          </div>
        </div>
      </div>
      <div className="RaiseTicket_body">
        <div className="RaiseTicket_body-left" ref={leftRef}>
          {ticketsData?.map((item, i) => (
            <RaiseTicketItem
              key={i}
              item={item}
              refetch={refetch}
              isActive={item.id == selectedTicket}
              setNewTicketState={setNewTicketState}
              setActive={() => {
                setSelectedTicket(item?.id);
                setNewTicketState(false);
              }}
              isScroll={item.id === router.query.id}
              stateColor={stateBg(item)}
              parentRef={leftRef?.current}
            />
          ))}
        </div>

        <div className="RaiseTicket_body-right">
          <RaiseTicketDetail
            refetch={refetch}
            FileDownloadHandler={FileDownloadHandler}
            selectedTicketId={selectedTicket}
            ticketsData={ticketsData}
            newTicketState={newTicketState}
            setNewTicketState={setNewTicketState}
          />
        </div>
      </div>
    </div>
  );
};

export default RaiseTicket;
