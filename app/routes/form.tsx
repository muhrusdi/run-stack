import { parse, useForm } from "@conform-to/react";
import { json, type ActionFunctionArgs } from "@remix-run/node";
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

  const submission = parse(formData, { schema });

  console.log(submission);

  return json(submission);
}

const TestForm = () => {
  const lastSubmission = useActionData<typeof action>();

  const [form, fields] = useForm({
    lastSubmission,

    shouldValidate: "onBlur",
  });

  return (
    <div>
      <Form method="post" {...form.props}>
        <div>
          <label>Email</label>
          <TextInput
            type="email"
            error={Boolean(fields.email.errors?.length)}
            name="email"
            defaultValue={fields.email.defaultValue}
          />
          <div>{JSON.stringify(fields.email.errors)}</div>
        </div>
        <div>
          <label>Message</label>
          <TextInput
            name="message"
            defaultValue={fields.message.defaultValue}
          />
          <div>{fields.message.errors}</div>
        </div>
        <button>Send</button>
      </Form>
    </div>
  );
};

export default TestForm;
