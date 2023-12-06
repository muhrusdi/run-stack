import { useNavigation } from "@remix-run/react";

const useLoading = () => {
  const navigation = useNavigation();
  console.log(navigation.formData);

  const isLoading = navigation.state === "loading";
  return {
    isLoading,
  };
};

export default useLoading;
