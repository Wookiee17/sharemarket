import React, { useEffect, useState, useRef } from "react";
import { Tooltip } from "antd";
import { uuid } from "uuidv4";

// Icons
import { FiCalendar, FiMoreHorizontal } from "react-icons/fi";
import { MdRemoveRedEye } from "react-icons/md";

// image
import Logo from "../../../assets/images/logo.png";

import {
  MdOutlineAttachFile,
  MdOutlineEmojiEmotions,
  MdDelete,
} from "react-icons/md";

// redux
import { useSelector } from "react-redux";

import { nhost } from "../../../../utils/nhost";

// component
import DropDown from "../../dropDown/DropDown";
import Button from "../../button/Button";
import CommentBox from "./CommentBox";
import ImageRes from "../../imageRes/ImageRes";
import { useQuery, useMutation, useApolloClient } from "@apollo/client/react";
import {
  GET_TICKET_CATEGORIES,
  GET_TICKET_TYPES,
  GET_CUSTOMER_TICKETS,
  GET_TICKET_COMMENTTS,
  MUTATE_TICKETS,
  CREATE_NEW_TICKET,
  CREATE_TICKET_COMMENT,
  INSERT_TICKET_RESOURCE,
  DELETE_TICKET_RESOURCES,
} from "../../../../gql/queries";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { time } from "highcharts";
import { useUserData } from "@nhost/nextjs";
import swal from "sweetalert";

dayjs.extend(relativeTime);

const RaiseTicketDetail = ({
  selectedTicketId,
  newTicketState,
  setNewTicketState,
  refetch,
  FileDownloadHandler,
  ticketsData: Data,
}) => {
  const theme = useSelector((state) => state.Common.theme);
  const client = useApolloClient();

  //ref

  const commentBoxRef = useRef(null);

  const [category, setCategory] = useState();
  const [activeCategory, setActiveCategory] = useState("scanner");
  const [activeCategoryLabel, setActiveCategoryLabel] = useState("Scanners");
  const [activeTypeLabel, setActiveTypeLabel] = useState(
    "New Featured Requested"
  );

  const [type, setType] = useState();

  const [activeType, setActiveType] = useState();

  const [textValue, setTextValue] = useState();

  const [selectedTicket, setSelectedTicket] = useState();
  const [comments, setComments] = useState([]);

  const [commentText, setCommentText] = useState("");

  const [replyToId, setReplyToId] = useState("");

  const [replyToCommentState, setReplyToCommentState] = useState(false);

  const [ticketDescFileList, setTicketDescFileList] = useState([]);

  const [selectedTicketFiles, setSelectedTicketFiles] = useState([]);

  const [newFiles, setNewFiles] = useState([]);

  const [resourceDeleteIds, setResourcesDeleteIds] = useState([]);

  const [commentFiles, setCommentFiles] = useState([]);

  const userData = useUserData();

  const [ticketsData, setTicketsData] = useState(null);
  //queries

  const { data: ticket } = useQuery(GET_CUSTOMER_TICKETS, {
    variables: {
      where: {
        id: { _eq: selectedTicketId },
      },
    },
    skip: !selectedTicketId,
    onCompleted: (v) => {
      setTicketsData(v?.indiacharts_customer_tickets);
      setSelectedTicket(v?.indiacharts_customer_tickets?.[0]);
      setActiveCategory(v?.indiacharts_customer_tickets?.[0]?.category),
        setActiveType(v?.indiacharts_customer_tickets?.[0]?.type);
      setTextValue(v?.indiacharts_customer_tickets?.[0]?.descriptions);
      setActiveCategoryLabel(
        v?.indiacharts_customer_tickets?.[0]?.enum_ticket_category?.comments
      );
      setActiveTypeLabel(
        v?.indiacharts_customer_tickets?.[0]?.enum_ticket_type?.comments
      );
      setSelectedTicketFiles(
        v?.indiacharts_customer_tickets?.[0]?.ticket_resources
      );
    },
  });

  useEffect(() => {
    setActiveCategory("scanners");
    setActiveType("feature_request");
  }, [category, type]);

  const { data: categories, loading: loadingCategory } = useQuery(
    GET_TICKET_CATEGORIES,
    {
      onCompleted: (v) => {
        setCategory(
          v?.indiacharts_enum_ticket_categories?.map((i) => ({
            value: i?.name,
            label: i?.comments,
          }))
        );
      },
    }
  );

  const { data: types, loading: loadingType } = useQuery(GET_TICKET_TYPES, {
    onCompleted: (v) => {
      setType(
        v?.indiacharts_enum_ticket_type?.map((i) => ({
          value: i?.name,
          label: i?.comments,
        }))
      );
    },
  });

  const { data: ticketComments, refetch: commentsRefetch } = useQuery(
    GET_TICKET_COMMENTTS,
    {
      variables: {
        id: selectedTicketId,
      },
      onCompleted: (v) => setComments(v?.indiacharts_ticket_comments),
    }
  );

  //event-handlers

  const uploadFile = async (file) => {
    const fileres = await nhost.storage.upload({ file, bucketId: "public" });
    const fileUrl = await nhost.storage.getPublicUrl({
      fileId: fileres.fileMetadata?.id || "",
    });
    const resFile = {
      id: fileres?.fileMetadata?.id,
      url: fileUrl,
    };
    console.log(resFile, "ff");

    return resFile;
  };

  const CommentPostHandler = async (e) => {
    const commentFileUrls = await Promise.all(commentFiles?.map(uploadFile));

    e.preventDefault();
    if (!replyToCommentState) {
      createTicketComment({
        variables: {
          object: {
            ticket_id: selectedTicketId,
            comment: commentText,
            created_by: "7d30148b-a7bd-4102-95ad-7f1b760e4a32",
            ticket_resources: {
              data: commentFiles?.map((i, idx) => ({
                link: commentFileUrls?.[idx]?.url,
                file_id: commentFileUrls?.[idx]?.id,
                //  nhost.storage.getPublicUrl({
                //   fileId: i?.uid || "",
                // }),
                // file_id:uuid,
                name: i?.name,
                created_by: "7d30148b-a7bd-4102-95ad-7f1b760e4a32",
              })),
            },
          },
        },
      });
    }
    if (replyToCommentState) {
      createTicketComment({
        variables: {
          object: {
            reply_to: replyToId,
            ticket_id: selectedTicketId,
            comment: commentText,
            created_by: "7d30148b-a7bd-4102-95ad-7f1b760e4a32",
            ticket_resources: {
              data: commentFiles?.map((i, idx) => ({
                link: commentFileUrls?.[idx]?.url,
                file_id: commentFileUrls?.[idx]?.id,
                //  nhost.storage.getPublicUrl({
                //   fileId: i?.uid || "",
                // }),
                // file_id:uuid,
                name: i?.name,
                created_by: "7d30148b-a7bd-4102-95ad-7f1b760e4a32",
              })),
            },
          },
        },
      });
      setReplyToCommentState(false);
    }
    commentsRefetch();
  };

  const replyToCommentHandler = (comment_id) => {
    commentBoxRef?.current?.focus();
    setReplyToId(comment_id);
    setReplyToCommentState(true);
  };

  const UpdateTicketHandler = async () => {
    const fileUrls = await Promise.all(ticketDescFileList?.map(uploadFile));
    const newFileUrls = await Promise.all(newFiles?.map(uploadFile));
    console.log(fileUrls, "file");
    if (newTicketState || !ticketsData) {
      createTicket({
        variables: {
          object: {
            created_by: "7d30148b-a7bd-4102-95ad-7f1b760e4a32",
            category: activeCategory,
            // customer_id: "1a446805-0bc9-4ad1-8358-1f7baab479f2",
            customer_id: userData?.id,
            descriptions: textValue,
            rejection_reason: "none",
            state: "open",
            title: "some title",
            type: activeType,
            ticket_resources: {
              data: ticketDescFileList?.map((f, idx) => ({
                link: fileUrls?.[idx]?.url,
                file_id: fileUrls?.[idx]?.id,
                name: f?.name,
                created_by: "7d30148b-a7bd-4102-95ad-7f1b760e4a32",
              })),
            },
          },
        },
        onCompleted: (v) => {
          setNewTicketState(true);
          setTextValue("");
        },
        // console.log(v, "v"),
      });
    }
    if (!newTicketState && ticketsData) {
      updateTicket({
        variables: {
          set: {
            category: activeCategory,
            type: activeType,
            descriptions: textValue,
          },
          id: selectedTicketId,
        },
      });
      insertTicketResource({
        variables: {
          object: newFiles?.map((item, idx) => ({
            ticket_id: selectedTicketId,
            created_by: "7d30148b-a7bd-4102-95ad-7f1b760e4a32",
            link: newFileUrls?.[idx]?.url,
            file_id: newFileUrls?.[idx]?.id,

            //  .storage.getPublicUrl({
            //   fileId: item?.uid || "",
            // }),
            name: item?.name,
          })),
        },
      });

      deleteTicketResource({
        variables: {
          ids: resourceDeleteIds,
        },
      });
    }
    client.refetchQueries({
      include: ["GET_CUSTOMER_TICKETS"],
    });
  };

  const _fileDeletedHandler = (item, i) => {
    if (newTicketState) {
      const newTicketArr = ticketDescFileList?.filter(
        (x) => ticketDescFileList?.indexOf(x) !== i
      );
      setTicketDescFileList(newTicketArr);
    }
    if (!newTicketState) {
      const newArr = selectedTicketFiles?.filter(
        (x) => selectedTicketFiles.indexOf(x) !== i
      );
      setSelectedTicketFiles(newArr);
      setResourcesDeleteIds((prev) => [...prev, item?.id]);
    }
  };

  const commentDeleteHandler = (item, i) => {
    const newArr = commentFiles?.filter((x) => commentFiles?.indexOf(x) !== i);
    setCommentFiles(newArr);
  };

  //props
  const fileUpdateProps = {
    // onRemove: (file) => {
    //   const index = ticketDescFileList.indexOf(file);
    //   const newFileList = ticketDescFileList.slice();
    //   newFileList.splice(index, 1);
    //   setTicketDescFileList(newFileList);
    // },
    beforeUpload: (file) => {
      if (newTicketState) {
        setTicketDescFileList([...ticketDescFileList, file]);
      }
      if (!newTicketState) {
        setSelectedTicketFiles([
          ...selectedTicketFiles,
          {
            uid: file?.uid,
            name: file?.name,
            link: nhost.storage.getPublicUrl({
              fileId: file?.uid || "",
            }),
          },
        ]);
        setNewFiles([...newFiles, file]);
      }
      return false;
    },
    ticketDescFileList,
  };

  const commentProps = {
    beforeUpload: (file) => {
      setCommentFiles([...commentFiles, file]);
    },
  };
  //

  const [
    createTicket,
    {
      data: createTicketData,
      loading: createTicketLoading,
      error: createTicketError,
    },
  ] = useMutation(CREATE_NEW_TICKET, {
    refetchQueries: [{ query: GET_CUSTOMER_TICKETS }, "getCustomerTickets"],
    onCompleted: (v) => {
      swal({
        text: "Ticket is Created Successfully",
        icon: "success",
        title: "Success",
      });
      setTicketDescFileList([]);
      setNewTicketState(false);
    },
  });

  //ticket-mutation

  const [createTicketComment] = useMutation(CREATE_TICKET_COMMENT, {
    refetchQueries: [
      { query: GET_TICKET_COMMENTTS },
      { query: GET_CUSTOMER_TICKETS },
      "getTicketComments",
      "getCustomerTickets",
    ],
    onCompleted: (v) => {
      swal({
        text: "Comment Created",
        icon: "success",
        title: "Success",
      }),
        setCommentFiles([]);
      setCommentText("");
    },
  });

  const [updateTicket, { data, loading, error }] = useMutation(MUTATE_TICKETS, {
    refetchQueries: [{ query: GET_CUSTOMER_TICKETS }, "getCustomerTickets"],
    onCompleted: (v) =>
      swal({
        text: "Ticket is Updated Successfully",
        icon: "success",
        title: "Success",
      }),
  });

  //insert-file

  const [insertTicketResource] = useMutation(INSERT_TICKET_RESOURCE, {
    refetchQueries: [{ query: GET_CUSTOMER_TICKETS }, "getCustomerTickets"],
  });

  //delete-ticket
  const [deleteTicketResource] = useMutation(DELETE_TICKET_RESOURCES, {
    refetchQueries: [{ query: GET_CUSTOMER_TICKETS }, "getCustomerTickets"],
  });

  //side effects

  useEffect(() => {
    if (newTicketState) {
      setTextValue("");
    }
  }, [newTicketState]);

  useEffect(() => {
    setNewFiles([]);
    setCommentFiles([]);
  }, [selectedTicketId]);

  //checking tickets effect
  useEffect(() => {
    if (Data?.length == 0) {
      setTicketsData();
    } else {
      console.log("refetch in ticketdetail");
      setTicketsData();
      setTextValue("");
    }
  }, [Data, refetch]);

  const timeFun = (tim) => {
    return dayjs(tim).fromNow(true);
  };

  const _renderComment = (item, i) => {
    return (
      <div className="commentbox_item">
        <div className="commentbox_item_top">
          <div className="commentbox_item_top-img">
            <ImageRes imgSrc={Logo.src} width={0} height={0} />
          </div>
          <div className="commentbox_item_top-name">
            {item?.creator?.displayName}
          </div>
          <div className="commentbox_item_top-date">
            // {`${dayjs().diff(item?.created_at, "hours")}hr`}
            {timeFun(item?.created_at)}
          </div>
        </div>
        <div className="commentbox_item_msg">{item?.comment}</div>
        <div className="commentbox_files-list">
          {item?.ticket_resources?.map((item, i) => (
            <div
              className="commentbox_files-item"
              key={i}
              onClick={() => FileDownloadHandler(item?.link, item?.name)}
            >
              <Tooltip title={item.name} color={"#353a48"}>
                <p>{item.name}</p>
              </Tooltip>
              {/* <div
                className="bt"
                onClick={() => commentFileDeleteHandler(item, i)}
              >
                <MdDelete />
              </div> */}
            </div>
          ))}
        </div>
        <div className="commentbox_item_bottom">
          <div
            className="commentbox_item_bottom-left"
            onClick={() => replyToCommentHandler(item?.id)}
          >
            <div className="bt">Reply</div>
          </div>
          <div className="commentbox_item_bottom-right">
            <div className="bt">
              <FiMoreHorizontal />
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`RaiseTicket_detail ${theme}`}>
      {!newTicketState && ticketsData?.length && (
        <div className="RaiseTicket_detail-header">
          <div className="RaiseTicket_detail-header_main">
            <div className="help-RaiseTicket-tab-indicator bg-blue"></div>
            <div className="RaiseTicket_detail-header_main-text">
              TICKET ID {selectedTicket?.uid}
            </div>
          </div>
          <div className="RaiseTicket_detail-header_sub">
            <div className="RaiseTicket_detail-header_sub-text">
              {selectedTicket?.enum_ticket_category?.comments}:
              {selectedTicket?.enum_ticket_type?.comments}
            </div>
            {/* <div className="RaiseTicket_detail-header_sub-date">
              <FiCalendar />
              <span>This Ticket has no Due Date</span>
            </div> */}
          </div>
        </div>
      )}
      {(newTicketState || !ticketsData) && (
        <div style={{ marginLeft: 35 }}>
          <h1>NEW TICKET</h1>
        </div>
      )}
      <div className="RaiseTicket_detail-body `${isActive}`">
        <div className="RaiseTicket_detail-body_row">
          <div className="RaiseTicket_detail-body_row-col_sm">
            <p>Name:</p>
          </div>
          <div className="RaiseTicket_detail-body_row-col_lg">
            <p>{userData?.displayName}</p>
          </div>
        </div>
        <div className="RaiseTicket_detail-body_row">
          <div className="RaiseTicket_detail-body_row-col_sm">
            <p>Email:</p>
          </div>
          <div className="RaiseTicket_detail-body_row-col_lg">
            <p>{userData?.email}</p>
          </div>
        </div>
        <div className="RaiseTicket_detail-body_row">
          <div className="RaiseTicket_detail-body_row-col_sm">
            <p>Mobile:</p>
          </div>
          <div className="RaiseTicket_detail-body_row-col_lg">
            <p>{userData?.phoneNumber}</p>
          </div>
        </div>
        <div className="RaiseTicket_detail-body_row">
          <div className="RaiseTicket_detail-body_row-col_sm">
            <p>Category:</p>
          </div>
          {selectedTicket?.state === "open" ||
          newTicketState ||
          !ticketsData ? (
            <div className="RaiseTicket_detail-body_row-col_lg">
              <DropDown
                lable={activeCategoryLabel}
                options={category}
                border={true}
                setActive={setActiveCategory}
                setLabel={setActiveCategoryLabel}
                // defaultActive={loadingCategory}
              />
            </div>
          ) : (
            <div>{activeCategoryLabel}</div>
          )}
        </div>
        <div className="RaiseTicket_detail-body_row">
          <div className="RaiseTicket_detail-body_row-col_sm">
            <p>Type:</p>
          </div>
          {selectedTicket?.state === "open" ||
          newTicketState ||
          !ticketsData ? (
            <div className="RaiseTicket_detail-body_row-col_lg">
              <DropDown
                lable={activeTypeLabel}
                options={type}
                border={true}
                setActive={setActiveType}
                setLabel={setActiveTypeLabel}
                // defaultActive={loadingType}
              />
            </div>
          ) : (
            <div>{activeTypeLabel}</div>
          )}
        </div>
        <div className="RaiseTicket_detail-body_row">
          <div className="RaiseTicket_detail-body_row-col_sm">
            <p>Description:</p>
          </div>
          {selectedTicket?.state === "open" ||
          newTicketState ||
          !ticketsData ? (
            <div className="RaiseTicket_detail-body_row-col_lg">
              <CommentBox
                id={0}
                ticketsData={Data}
                text={textValue}
                setText={setTextValue}
                fileList={ticketDescFileList}
                newTicketState={newTicketState}
                selectedTicketFiles={selectedTicketFiles}
                fileDeletedHandler={_fileDeletedHandler}
                fileUpdateProps={fileUpdateProps}
                FileDownloadHandler={FileDownloadHandler}
              />
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div>{textValue}</div>
              <div className="commentbox_files-list">
                {selectedTicketFiles?.map((item, i) => (
                  <div className="commentbox_files-item" key={i}>
                    <Tooltip title={item.name} color={"#353a48"}>
                      <p>{item.name}</p>
                    </Tooltip>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="RaiseTicket_detail-body_row">
          <div className="RaiseTicket_detail-body_row-col_sm">
            <Button
              type={"primary"}
              disabled={
                textValue?.length === 0 || (!textValue && !newTicketState)
              }
              onClick={textValue?.length != 0 ? UpdateTicketHandler : null}
            >
              {newTicketState || !ticketsData ? "CREATE" : "UPDATE"}
            </Button>
          </div>
          <div className="RaiseTicket_detail-body_row-col_lg"></div>
        </div>

        {!newTicketState && ticketsData && (
          <>
            <div className="RaiseTicket_detail-body_row">
              <div className="RaiseTicket_detail-body_row-col_lg">
                <p>Comments ({comments?.length})</p>
              </div>
            </div>
            <CommentBox
              commentref={commentBoxRef}
              isPostBtn
              id={1}
              text={commentText}
              setText={setCommentText}
              onPostClick={CommentPostHandler}
              fileList={commentFiles}
              setFileList={setCommentFiles}
              commentState={true}
              fileDeletedHandler={commentDeleteHandler}
              fileUpdateProps={commentProps}
              FileDownloadHandler={FileDownloadHandler}
            />
            <div className="commentbox_list">
              {comments.map((item, i) => (
                <React.Fragment key={i}>
                  {_renderComment(item, i)}
                </React.Fragment>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RaiseTicketDetail;
