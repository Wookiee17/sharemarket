import React, { useState, useRef, useEffect } from "react";

// Icons
import { FiTrash } from "react-icons/fi";
import { AiOutlineComment } from "react-icons/ai";
//
import dayjs from "dayjs";
import axios from "axios";
import { UPDATE_CUSTOMER_TICKET } from "../../../../gql/queries";
import { useMutation } from "@apollo/client/react";

const RaiseTicketItem = ({
  item,
  isScroll,
  isActive,
  setActive,
  stateColor,
  parentRef,
  setNewTicketState,
  refetch,
}) => {
  const ref = useRef(null);

  const [mutateFunction, { data, loading, error }] = useMutation(
    UPDATE_CUSTOMER_TICKET
  );
  //mutation
  const cancelTicketHandler = async (id) => {
    const shouldDelete = await swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this file!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    });
    if (shouldDelete) {
      setNewTicketState(true);
      const result = await mutateFunction({
        variables: {
          id: id,
          set: {
            state: "cancelled",
          },
        },
      });
      refetch();
    }
  };
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
    let yOffset = ref.current.offsetTop - 194;

    if (isScroll) {
      parentRef.scrollTo(0, yOffset);
    }
  }, [isScroll, refetch]);

  return (
    <div
      className={`RaiseTicket_item ${isActive && "active"}`}
      onClick={setActive}
      ref={ref}
    >
      {item?.state === "open" && (
        <div
          className="RaiseTicket_item-delete"
          onClick={() => {
            cancelTicketHandler(item?.id);
          }}
        >
          <FiTrash />
        </div>
      )}
      <div className="RaiseTicket_item-number">
        <div className={`help-RaiseTicket-tab-indicator ${stateColor}`}></div>
        <div className="RaiseTicket_item-number-text">
          TICKET ID {item?.uid}
        </div>
      </div>
      <div className="RaiseTicket_item-subject">
        {item?.enum_ticket_category?.comments}:
        {item?.enum_ticket_type?.comments}
      </div>
      <div className="RaiseTicket_item-message">{item?.descriptions}</div>
      <div className="commentbox_files-list">
        {item?.ticket_resources?.length > 0 &&
          item?.ticket_resources?.map((i) => (
            <div
              className="commentbox_files-item"
              key={i?.id}
              onClick={() => FileDownloadHandler(i?.link, i?.name)}
            >
              {i?.name}
            </div>
          ))}
      </div>
      <div className="RaiseTicket_item-bottom">
        <div className="RaiseTicket_item-bottom_left">
          <AiOutlineComment />
          <span>{item?.ticket_comments?.length}</span>
        </div>
        <div className="RaiseTicket_item-bottom_right">
          submitted:{dayjs(item?.created_at).format("DD MMM YYYY hh:mm a")}
        </div>
      </div>
    </div>
  );
};

export default RaiseTicketItem;
