import { useSearchParams, useSubmit } from "@remix-run/react";

const useParams = () => {
  const [searchParams] = useSearchParams();
  const submit = useSubmit();

  const params = Object.fromEntries(searchParams.entries());

  const setParams = (vals: Record<string, string>) => {
    submit({ ...params, ...vals });
  };

  const clearParams = () => {
    submit({});
  };

  return {
    params,
    setParams,
    clearParams,
  };
};

export default useParams;
