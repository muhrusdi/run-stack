import { useSearchParams, useSubmit } from "@remix-run/react";

const useFilter = () => {
  const [searchParams] = useSearchParams();
  const submit = useSubmit();

  const filter = Object.fromEntries(searchParams.entries());

  const setParams = (vals: Record<string, string>) => {
    submit({ ...filter, ...vals });
  };

  const removeFilter = (key: string) => {
    delete filter[key];

    submit(filter);
  };

  const clearFilter = () => {
    submit({});
  };

  return {
    searchParams,
    filter,
    setParams,
    clearFilter,
    removeFilter,
  };
};

export default useFilter;
