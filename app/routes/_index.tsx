import { defer } from "@remix-run/node";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Await, Link, useLoaderData } from "@remix-run/react";
import type { DeltaType } from "@tremor/react";
import { Card, Metric, Text, Flex, BadgeDelta, Grid } from "@tremor/react";
import { Suspense } from "react";
import { useLoading, useFilter } from "~/hooks";
import { getData } from "~/libs/api";
import type { MovieType } from "~/types";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const sort_by = url.searchParams.get("sort_by");
  const data = getData("/discover/movie", {
    query: { sort_by },
  });
  // await wait(4000);
  return defer({ data });
};

export default function Index() {
  const { setParams, filter, removeFilter } = useFilter();
  const { isLoading } = useLoading();
  const { data } = useLoaderData<typeof loader>() as {
    data: Promise<{ results: MovieType[] }>;
  };

  const categories: {
    title: string;
    metric: string;
    metricPrev: string;
    delta: string;
    deltaType: DeltaType;
  }[] = [
    {
      title: "Sales",
      metric: "$ 12,699",
      metricPrev: "$ 9,456",
      delta: "34.3%",
      deltaType: "moderateIncrease",
    },
    {
      title: "Profit",
      metric: "$ 40,598",
      metricPrev: "$ 45,564",
      delta: "10.9%",
      deltaType: "moderateDecrease",
    },
    {
      title: "Customers",
      metric: "1,072",
      metricPrev: "856",
      delta: "25.3%",
      deltaType: "moderateIncrease",
    },
  ];

  const filters = [
    {
      label: "Sort by",
      key: "sort_by",
      child: [
        {
          label: "Asc",
          key: "sort_by",
          value: "popularity.asc",
        },
        {
          label: "Desc",
          key: "sort_by",
          value: "popularity.desc",
        },
      ],
    },
    {
      label: "Page",
      key: "page",
      child: [
        {
          label: "Page 1",
          key: "page",
          value: "1",
        },
        {
          label: "Page 2",
          key: "page",
          value: "2",
        },
      ],
    },
  ];

  return (
    <div>
      <div>
        <div className="space-x-3">
          {filters.map((item, i) => (
            <div key={item.label}>
              <h4>{item.label}</h4>
              <ul className="flex space-x-3">
                {item.child.map((childItem, childI) => (
                  <li key={childItem.key + childI}>
                    <button
                      className={
                        filter[childItem.key] === childItem.value
                          ? "text-pink-500"
                          : ""
                      }
                      onClick={() =>
                        filter[childItem.key] === childItem.value
                          ? removeFilter(childItem.key)
                          : setParams({ [childItem.key]: childItem.value })
                      }
                    >
                      {isLoading && item.key === childItem.key
                        ? "Loading..."
                        : childItem.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      {isLoading ? (
        <div className="font-bold text-violet-700">Loading...</div>
      ) : null}
      <Grid numItemsSm={2} numItemsLg={3} className="gap-6">
        {categories.map((item) => (
          <Card key={item.title}>
            <Flex alignItems="start">
              <Text>{item.title}</Text>
              <BadgeDelta deltaType={item.deltaType}>{item.delta}</BadgeDelta>
            </Flex>
            <Flex
              justifyContent="start"
              alignItems="baseline"
              className="truncate space-x-3"
            >
              <Metric>{item.metric}</Metric>
              <Text className="truncate">from {item.metricPrev}</Text>
            </Flex>
          </Card>
        ))}
      </Grid>
      <div>
        <Suspense fallback="Loading...">
          <Await resolve={data}>
            {(list) => (
              <ul>
                {list.results.map((item) => (
                  <div key={item.id}>
                    <Link to={`/movie/${item.id}`}>{item.title}</Link>
                  </div>
                ))}
              </ul>
            )}
          </Await>
        </Suspense>
      </div>
    </div>
  );
}
