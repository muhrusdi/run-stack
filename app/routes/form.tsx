import { useForm } from "@conform-to/react";
import { getZodConstraint, parseWithZod } from "@conform-to/zod";
import { type ActionFunctionArgs, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { TextInput } from "@tremor/react";
import { z } from "zod";

const schema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email("Email is invalid"),
  message: z.string({ required_error: "Message is required" }),
});

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  const submission = parseWithZod(formData, { schema });

  if (submission.status !== "success") {
    return submission.reply();
  }

  return redirect("/form");
}

const TestForm = () => {
  const lastResult = useActionData<typeof action>();

  const [form, fields] = useForm({
    lastResult,
    shouldValidate: "onBlur",
    constraint: getZodConstraint(schema),
  });

  return (
    <div>
      <Form method="post" id={form.id} onSubmit={form.onSubmit}>
        <div>
          <label>Email</label>
          <TextInput
            type="email"
            error={Boolean(fields.email.errors?.length)}
            name={fields.email.name}
          />
          <div>{JSON.stringify(fields.email.errors)}</div>
        </div>
        <div>
          <label>Message</label>
          <TextInput name={fields.message.name} />
          <div>{fields.message.errors}</div>
        </div>
        <button>Send</button>
      </Form>
    </div>
  );
};

export default TestForm;
