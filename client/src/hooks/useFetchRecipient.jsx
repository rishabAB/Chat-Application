import { useEffect, useState, useCallback, useContext } from "react";
import { getRequest, baseUrl } from "../utils/services";

import { ChatContext } from "../context/chatContext";
import female_user_2 from "../../public/female_user_2.svg";
import male_user_2 from "../../public/male_user_2.svg";

export const useFetchRecipientUser = (chat, user) => {
  const [recipientUser, setRecipientUser] = useState(null);

  const recipientId = chat?.members.find((id) => id !== user?._id);
  const { notification } = useContext(ChatContext);
  const [recipientNotification, setRecipientNotification] = useState(null);

  useEffect(() => {
    setRecipientNotification(null);
    for (let elem of notification) {
      if (elem.senderId == recipientUser?._id) {
        setRecipientNotification(elem);
      }
    }
  }, [notification, recipientUser]);

  // Here recipient User is the person whom with we are showing the conversation
  useEffect(() => {
    const getUser = async () => {
      if (!recipientId || !user) {
        setRecipientUser(null);
        return;
      }

      const response = await getRequest(`${baseUrl}/users/find/${recipientId}`);

      if (response?.error) {
        // return setError(true);
      } else {
        // setError(false);
        setRecipientUser(response);
      }
    };
    getUser();
  }, [recipientId, user]);

  // ----Images Part-------
  const bufferToUrl = (bufferArray, imageType) => {
    return new Promise((resolve) => {
      const byteArray = new Uint8Array(bufferArray.data);
      const blob = new Blob([byteArray], { type: `image/${imageType}` }); // or "image/jpeg"
      const imageUrl = URL.createObjectURL(blob);
      resolve(imageUrl);
    });
  };
  let [imageUrl, setImageUrl] = useState(null);

  let imageObjectUrl;
  const loadImage = useCallback(async () => {
    imageObjectUrl = await bufferToUrl(
      recipientUser?.profile,
      recipientUser?.imageType
    );
    setImageUrl(imageObjectUrl);
  }, [recipientUser]);

  useEffect(() => {
    if (recipientUser) {
      if (recipientUser?.profile) loadImage();
      else {
        recipientUser?.gender == "male"
          ? setImageUrl(male_user_2)
          : setImageUrl(female_user_2);
      }
    }
  }, [recipientUser]);

  return {
    recipientUser,
    imageUrl,
    recipientNotification,
  };
};
