import { defer, type LoaderFunctionArgs } from "@remix-run/node";
import { Await, useLoaderData } from "@remix-run/react";
import { Suspense } from "react";
import { getData } from "~/libs/api";
import type { MovieType } from "~/types";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  // throw new Response("Oh no! Something went wrong!", {
  //   status: 500,
  // });
  const url = new URL(request.url);
  const sort_by = url.searchParams.get("sort_by");
  const tv = getData("/discover/movie", {
    query: { sort_by },
  });

  console.log("-=-", tv);
  // await wait(4000);
  return defer({ tv });
};

const BlogSummary = () => {
  const { tv } = useLoaderData<typeof loader>() as {
    tv: Promise<{ results: MovieType[] }>;
  };
  return (
    <div className="bg-blue-100 rounded-lg p-5">
      <Suspense fallback="Loading...">
        <Await resolve={tv}>
          {(list) => (
            <ul>
              {JSON.stringify(list)}
              {list?.results.map((item) => (
                <div key={item.id}>{item.title}</div>
              ))}
            </ul>
          )}
        </Await>
      </Suspense>
    </div>
  );
};

export default BlogSummary;

export const ErrorBoundary = () => {
  return <div className="bg-pink-200 p-4">error</div>;
};
