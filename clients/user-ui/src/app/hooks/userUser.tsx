import { GET_USER } from "@/src/graphql/actions/getUser.action";
import { useQuery } from "@apollo/client";


const useUser = () => {
  const { loading, data } = useQuery(GET_USER);
  console.log("🚀 ~ useUser ~ data:", data)
  
  return {
    loading,
    user: data?.getLoggedInUser?.user,
  };
};

export default useUser;
