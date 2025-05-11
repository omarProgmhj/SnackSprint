import { GET_USER } from "@/src/graphql/actions/getUser.action";
import { useQuery } from "@apollo/client";



const useUser = () => {
  const { loading, data, error } = useQuery(GET_USER);
  console.log("🚀 useUser ata:", data)
  
  
  return {
    loading,
    user: data,
    error
  };
};

export default useUser;
