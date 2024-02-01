import { useNavigation } from "@remix-run/react";

const useLoading = () => {
  const navigation = useNavigation();

  console.log(navigation);

  const isLoading = navigation.state === "loading";
  return {
    isLoading,
    loadingState: navigation.location?.state,
  };
};

export default useLoading;
