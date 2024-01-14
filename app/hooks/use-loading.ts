import { useNavigation } from "@remix-run/react";

const useLoading = () => {
  const navigation = useNavigation();

  const isLoading = navigation.state === "loading";
  return {
    isLoading,
  };
};

export default useLoading;
