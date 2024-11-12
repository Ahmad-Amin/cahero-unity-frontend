import React, { useState, useEffect, useCallback } from "react";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ChatIcon from "@mui/icons-material/Chat";
import SendIcon from "@mui/icons-material/Send";
import StarIcon from "@mui/icons-material/Star";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Rating } from "react-simple-star-rating";
import axiosInstance from "../lib/axiosInstance";
import { useParams } from "react-router-dom";
import { StarBorder, ThumbUpOutlined } from "@mui/icons-material";
import { toast } from "react-toastify";
import LoadingWrapper from "./ui/LoadingWrapper";
import { IconButton, Menu, MenuItem } from "@mui/material";
import { useSelector } from "react-redux";
import { formatDate } from "../utils/helper_functions";
import { Trash2Icon } from "lucide-react";

const urlBasedOnType = (type, id) => {
  if (type === "webinar") return `/webinars/${id}/reviews`;
  if (type === "lecture") return `/lectures/${id}/reviews`;
  if (type === "book") return `/books/${id}/reviews`;
  return "";
};

const Comments = ({ type, onCommentAdded }) => {
  const [rating, setRating] = useState(0);
  const [commentText, setCommentText] = useState("");
  const [commentsData, setCommentsData] = useState([]);
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const [replyTexts, setReplyTexts] = useState({});

  const [menuAnchor, setMenuAnchor] = useState({
    anchorEl: null,
    commentId: null,
  });
  const open = Boolean(menuAnchor.anchorEl);

  const handleClick = (event, commentId) => {
    setMenuAnchor({ anchorEl: event.currentTarget, commentId });
  };

  const handleClose = () => {
    setMenuAnchor({ anchorEl: null, commentId: null });
  };

  const baseApiPath = urlBasedOnType(type, id);

  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(baseApiPath);
      setCommentsData(response.data);
    } catch (error) {
      console.error("Failed to fetch reviews", error);
    } finally {
      setLoading(false);
    }
  }, [baseApiPath]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleRating = (rate) => setRating(rate);

  const handleSubmitReview = async () => {
    if (!commentText || rating === 0) {
      toast.error("Please provide a review and rating");
      return;
    }
    try {
      const newReview = { content: commentText, rating };
      await axiosInstance.post(baseApiPath, newReview);
      toast.success("Review added successfully");
      onCommentAdded();
      setCommentText("");
      setRating(0);
      fetchReviews();
    } catch (error) {
      console.error("Failed to submit review", error);
    }
  };

  const handleDelete = async () => {
    const { commentId } = menuAnchor;
    try {
      setLoading(true);
      await axiosInstance.delete(`${baseApiPath}/${commentId}`);
      toast.success("Review deleted successfully");
      onCommentAdded();
      fetchReviews();
    } catch (error) {
      console.error("Failed to delete review", error);
      toast.error("Failed to delete review");
    } finally {
      handleClose();
      setLoading(false);
    }
  };

  const deleteReviewReply = async (commentId, replyId) => {
    try {
      setLoading(true);
      await axiosInstance.delete(
        `${baseApiPath}/${commentId}/replies/${replyId}`
      );
      toast.success("Reply deleted successfully");
      fetchReviews();
    } catch (error) {
      console.error("Failed to delete reply", error);
      toast.error("Failed to delete reply");
    } finally {
      handleClose();
      setLoading(false);
    }
  };

  const handleToggleLike = async (reviewId) => {
    const url = `${baseApiPath}/${reviewId}/toggle-like`;
    try {
      await axiosInstance.post(url);
      fetchReviews();
    } catch (error) {
      console.error("Error toggling like", error);
      toast.error("Error toggling the like");
    }
  };

  const handleSubmitReply = async (reviewId) => {
    const replyText = replyTexts[reviewId];

    if (!replyText) {
      toast.error("Please provide a reply text");
      return;
    }
    try {
      const reply = { content: replyText };
      await axiosInstance.post(`${baseApiPath}/${reviewId}/replies`, reply);
      toast.success("Reply added successfully");
      setReplyTexts((prev) => ({ ...prev, [reviewId]: "" }));
      fetchReviews();
    } catch (error) {
      console.error("Failed to submit reply", error);
    }
  };

  const handleReplyTextChange = (reviewId, text) => {
    setReplyTexts((prev) => ({ ...prev, [reviewId]: text }));
  };

  return (
    <LoadingWrapper loading={loading}>
      <div className="bg-[#101011] mx-8 py-4 rounded-lg border-2 border-[#404041]">
        <div className="flex flex-row">
          <div className="flex-1">
            <div className="flex items-center m-5">
              <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                <img
                  src={`${process.env.PUBLIC_URL}/images/Rectangle.png`}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
              <textarea
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="bg-black text-white h-9 rounded-full w-full border border-[#b1b1b1] resize-none outline-none pt-1 pl-3"
                placeholder="Write your Review.."
              />
            </div>
          </div>
          <div className="flex flex-row m-5 space-x-3">
            <div
              className="w-10 h-10 rounded-full border border-[#6a55ea] flex items-center justify-center cursor-pointer"
              onClick={handleSubmitReview}
            >
              <SendIcon className="text-[#6a55ea]" />
            </div>
          </div>
        </div>
        <div className="pl-20">
          <Rating initialValue={rating} onClick={handleRating} />
        </div>
      </div>
      <div className="flex justify-center items-center py-10">
        {!loading && commentsData.length === 0 && (
          <p className="text-3xl text-white">No Reviews</p>
        )}
      </div>
      {commentsData.map((comment) => (
        <div
          key={comment.id}
          className="bg-[#101011] mx-8 my-4 rounded-lg border-2 border-[#404041]"
        >
          <div>
            <div className="flex flex-row items-center bg-transparent w-full h-16 mt-2">
              <div className="w-10 h-10 rounded-full overflow-hidden mx-5">
                <img
                  src={`${process.env.PUBLIC_URL}/images/Rectangle.png`}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h2 className="text-[#b1b1b1] font-semibold">
                  {comment.createdBy.firstName +
                    " " +
                    comment.createdBy.lastName}
                </h2>
                <div className="flex flex-row space-x-2 items-center">
                  <p className="text-yellow-400 flex items-center">
                    {[...Array(5)].map((_, index) =>
                      index < Math.round(comment.rating) ? (
                        <StarIcon key={index} fontSize="small" />
                      ) : (
                        <StarBorder key={index} fontSize="small" />
                      )
                    )}
                  </p>
                  <p className="font-light text-white text-xs">
                    {formatDate(comment.createdAt)}
                  </p>
                </div>
              </div>
              {comment.createdBy.id === user.id && (
                <div className="text-white flex justify-end px-4">
                  <IconButton onClick={(e) => handleClick(e, comment.id)}>
                    <MoreVertIcon className="text-white" />
                  </IconButton>
                  <Menu
                    anchorEl={menuAnchor.anchorEl}
                    open={open}
                    onClose={handleClose}
                    anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                  >
                    <MenuItem onClick={handleDelete}>Delete</MenuItem>
                  </Menu>
                </div>
              )}
            </div>
            <div className="border-b-2 border-[#232323]">
              <p className="text-white m-5 font-light">{comment.content}</p>
              <div className="flex flex-row my-5">
                <div
                  className="flex flex-row cursor-pointer"
                  onClick={() => handleToggleLike(comment.id)}
                >
                  {comment.likes.includes(user.id) ? (
                    <ThumbUpAltIcon className="text-white ml-8 mr-3" />
                  ) : (
                    <ThumbUpOutlined className="text-white ml-8 mr-3" />
                  )}
                  <p className="text-white">{comment.likeCount} Likes</p>
                </div>
                <div className="flex flex-row">
                  <ChatIcon className="text-white ml-8 mr-3" />
                  <p className="text-white">{comment.replies.length} Replies</p>
                </div>
              </div>
            </div>
            <div className="flex flex-row">
              <div className="flex-1">
                <div className="flex items-center m-5">
                  <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                    <img
                      src={`${process.env.PUBLIC_URL}/images/Rectangle.png`}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <textarea
                    type="text"
                    value={replyTexts[comment.id] || ""}
                    onChange={(e) =>
                      handleReplyTextChange(comment.id, e.target.value)
                    }
                    className="bg-black text-white h-9 rounded-full w-full border border-[#b1b1b1] resize-none outline-none pt-1 pl-3"
                    placeholder="Write your Reply.."
                  />
                </div>
              </div>
              <div className="flex flex-row m-5 space-x-3">
                <div
                  className="w-10 h-10 rounded-full border border-[#6a55ea] flex items-center justify-center cursor-pointer"
                  onClick={() => handleSubmitReply(comment.id)}
                >
                  <SendIcon className="text-[#6a55ea]" />
                </div>
              </div>
            </div>
            {comment.replies.map((reply) => (
              <div
                key={reply.id}
                className="pl-20 text-white border-b border-[#404041] py-3"
              >
                <div className="flex items-center mx-3 mb-3">
                  <div className="w-8 h-8 rounded-full overflow-hidden mr-3">
                    <img
                      src={`${process.env.PUBLIC_URL}/images/Rectangle.png`}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex flex-row items-center justify-between flex-1">
                    <div>
                      <h2 className="text-sm font-semibold">
                        {reply.createdBy.firstName +
                          " " +
                          reply.createdBy.lastName}
                      </h2>
                      <p className="font-light text-xs">
                        {formatDate(reply.createdAt)}
                      </p>
                    </div>
                    {reply.createdBy.id === user.id && (
                      <div
                        className="cursor-pointer"
                        onClick={() => deleteReviewReply(comment.id, reply.id)}
                      >
                        <Trash2Icon className="text-red-600" />
                      </div>
                    )}
                  </div>
                </div>
                <p className="text-sm ml-16">{reply.content}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </LoadingWrapper>
  );
};

export default Comments;
