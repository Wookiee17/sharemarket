import React, { useState, useRef, useEffect } from "react";
import { Tooltip, Upload } from "antd";
import Picker from "emoji-picker-react";

// Icons
import {
  MdOutlineAttachFile,
  MdOutlineEmojiEmotions,
  MdDelete,
} from "react-icons/md";
import { GoMention } from "react-icons/go";

// redux
import { useSelector } from "react-redux";

// component
import Button from "../../button/Button";

const CommentBox = ({
  isPostBtn,
  onPostClick,
  id,
  text,
  setText,
  commentref,
  fileList,
  newTicketState,
  selectedTicketFiles,
  fileDeletedHandler,
  commentState,
  fileUpdateProps,
  FileDownloadHandler,
}) => {
  const theme = useSelector((state) => state.Common.theme);
  const wrapperRef = useRef(null);
  const [emoji, setEmoji] = useState(false);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setEmoji(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  const _onChangeText = (value) => {
    setText(value);
  };

  const _onSelectEmoji = (value) => {
    setText(text + value);
  };

  return (
    <>
      <div className={`commentbox ${theme}`}>
        <textarea
          ref={commentref}
          placeholder=""
          value={text}
          required
          minLength={10}
          onChange={(e) => {
            _onChangeText(e.target.value);
          }}
        ></textarea>

        {/* {fileList?.length > 0 && ( */}
        {newTicketState && (
          <div className="commentbox_files-list">
            {fileList?.map((item, i) => (
              <div className="commentbox_files-item" key={i}>
                <Tooltip
                  title={item.name}
                  color={"#353a48"}
                  onClick={() => FileDownloadHandler(item?.link, item?.name)}
                >
                  <p>{item.name}</p>
                </Tooltip>
                <div className="bt" onClick={() => fileDeletedHandler(item, i)}>
                  <MdDelete />
                </div>
              </div>
            ))}
          </div>
        )}
        {!newTicketState && selectedTicketFiles && (
          <div className="commentbox_files-list">
            {selectedTicketFiles?.map((item, i) => (
              <div className="commentbox_files-item" key={i}>
                <Tooltip
                  title={item?.name}
                  color={"#353a48"}
                  onClick={() => FileDownloadHandler(item?.link, item?.name)}
                >
                  <p>{item?.name}</p>
                </Tooltip>
                <div className="bt" onClick={() => fileDeletedHandler(item, i)}>
                  <MdDelete />
                </div>
              </div>
            ))}
          </div>
        )}
        {commentState && (
          <div className="commentbox_files-list">
            {fileList?.map((item, i) => (
              <div
                className="commentbox_files-item"
                key={i}
                onClick={() => FileDownloadHandler(item?.link, item?.name)}
              >
                <Tooltip title={item.name} color={"#353a48"}>
                  <p>{item.name}</p>
                </Tooltip>
                {/* {!commentState && ( */}
                <div className="bt" onClick={() => fileDeletedHandler(item, i)}>
                  <MdDelete />
                </div>
                {/* )} */}
              </div>
            ))}
          </div>
        )}
        {/* )} */}
        <div className="commentbox_bottom">
          <div className="commentbox_bottom-left">
            <div>
              <Upload {...fileUpdateProps}>
                <label className="bt" htmlFor={`CommentboxFileInput-${id}`}>
                  <MdOutlineAttachFile />
                </label>
              </Upload>
            </div>

            {/* <div className="bt">
            {emoji && (
              <div className="emojyPicker" ref={wrapperRef}>
                <Picker
                  native
                  theme="dark"
                  onEmojiClick={(e) => {
                    _onSelectEmoji(e?.emoji);
                  }}
                />
              </div>
            )}
            <MdOutlineEmojiEmotions onClick={() => setEmoji(!emoji)} />
          </div> */}
            {/* <div className="bt">
            <GoMention />
          </div> */}
          </div>
          <div className="commentbox_bottom-right">
            {isPostBtn && (
              <Button
                type={"primary"}
                onClick={text?.length != 0 ? onPostClick : null}
                disabled={text?.length === 0}
              >
                POST
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CommentBox;
