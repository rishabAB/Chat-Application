import {useFetchRecipientUser} from "../../hooks/useFetchRecipient";

const UserChat = ({chat,user}) => {
    const {recipientUser} = useFetchRecipientUser(chat,user);

    console.log("dsjd",recipientUser);

    return ( <>UserChat tests</> );
}
 
export default UserChat;