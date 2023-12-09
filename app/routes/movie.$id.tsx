import { defer } from "@remix-run/node";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import {
  Await,
  useLoaderData,
  useRouteError,
  isRouteErrorResponse,
} from "@remix-run/react";
import { Suspense } from "react";
import { getData } from "~/libs/api";
import type { MovieType } from "~/types";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const data = getData("/movie/:id", {
    params: [params.id],
  });

  // await wait(4000);
  return defer({ data });
};

export default function Index() {
  const { data } = useLoaderData<typeof loader>() as {
    data: Promise<MovieType>;
  };

  return (
    <div>
      <div>
        <Suspense fallback="Loading...">
          <Await resolve={data}>{(d) => <div>{d.title}</div>}</Await>
        </Suspense>
      </div>
    </div>
  );
}

export const ErrorBoundary = () => {
  const error = useRouteError() as any;

  // when true, this is what used to go to `CatchBoundary`
  if (isRouteErrorResponse(error)) {
    return (
      <div>
        <h1>Oops</h1>
        <p>Status: {error.status}</p>
        <p>{error.data.message}</p>
      </div>
    );
  }

  // Don't forget to typecheck with your own logic.
  // Any value can be thrown, not just errors!

  return (
    <div>
      Uh oh. I did a whoopsies <pre>{error.message}</pre>
    </div>
  );
};
