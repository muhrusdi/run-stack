import { defer, redirect } from "@remix-run/node";
import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import {
  Await,
  Link,
  useFetcher,
  useLoaderData,
  useSearchParams,
} from "@remix-run/react";
import type { DeltaType } from "@tremor/react";
import { Card, Metric, Text, Flex, BadgeDelta, Grid } from "@tremor/react";
import { Suspense } from "react";
import { userPrefs } from "~/cookies.server";
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
  const cookieHeader = request.headers.get("Cookie");
  const cookie = (await userPrefs.parse(cookieHeader)) || {};
  console.log("--server", cookie);
  const sort_by = url.searchParams.get("sort_by");
  const page = url.searchParams.get("page");
  const data = getData("/discover/movie", {
    query: { sort_by },
    sleep: 4000,
  });

  const dataTv = getData("/discover/tv", {
    query: { page },
    sleep: 2000,
  });
  // await wait(4000);
  return defer({ data, dataTv });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();

  console.log(formData.get("page"));
  return redirect("/", {
    headers: {
      "Set-Cookie": await userPrefs.serialize({ page: formData.get("page") }),
    },
  });
};

export default function Index() {
  const { setParams, filter, removeFilter } = useFilter();
  const { isLoading, loadingState } = useLoading();
  const { data, dataTv } = useLoaderData<typeof loader>() as {
    data: Promise<{ results: MovieType[] }>;
    dataTv: Promise<{ results: MovieType[] }>;
    page: string;
  };

  const [params] = useSearchParams();

  const fetcher = useFetcher();

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
                          : setParams(
                              { [childItem.key]: childItem.value },
                              {
                                state: { [childItem.key]: childItem.value },
                              }
                            )
                      }
                    >
                      {isLoading &&
                      loadingState?.[childItem.key] === childItem.value
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
      <div>
        <fetcher.Form method="post">
          <button name="page" value={1}>
            Page 1
          </button>
          <button name="page" value={2}>
            Page 2
          </button>
        </fetcher.Form>
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
      <div className="flex space-x-3">
        <Suspense fallback="Loading...">
          <Await resolve={data}>
            {(list) =>
              isLoading && loadingState?.sort_by ? (
                "Loading..."
              ) : (
                <ul className="w-1/2">
                  {list.results.map((item) => (
                    <li key={item.id}>
                      <Link to={`/movie/${item.id}`}>{item.title}</Link>
                    </li>
                  ))}
                </ul>
              )
            }
          </Await>
        </Suspense>
        <Suspense fallback="Loading..." key={params.get("page")}>
          <Await resolve={dataTv}>
            {(listTv) =>
              isLoading && loadingState?.page ? (
                "Loading..."
              ) : (
                <ul className="w-1/2">
                  {listTv.results.map((item) => (
                    <li key={item.id}>
                      <Link to={`/movie/${item.id}`}>{item.name}</Link>
                    </li>
                  ))}
                </ul>
              )
            }
          </Await>
        </Suspense>
      </div>
    </div>
  );
}
