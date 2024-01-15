import { TextInput, Button, Group } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useLogin } from "../../../../hooks/useAuth";
import { Login } from "../../../../models/Auth";
import axios from "axios";
import { notifications } from "@mantine/notifications";
import { useSession } from "../../../../context/AuthContext";

export const LoginForm = () => {
  const sessionHook = useSession();
  const { mutate: login, isLoading } = useLogin();

  const form = useForm({
    initialValues: {
      email: "",
      password: "",
    },

    validate: {
      email: (value) =>
        value.trim().length === 0
          ? "Email is required"
          : /^\S+@\S+$/.test(value)
          ? null
          : "Invalid email",
      password: (value) =>
        value.trim().length === 0 ? "Password is required" : null,
    },
  });

  const onSubmitForm = async (values: { email: string; password: string }) => {
    // console.log(values)

    const loginParams: Login = {
      username: values.email,
      password: values.password,
    };

    login(loginParams, {
      onSuccess(data) {
        sessionHook?.signIn({
          ...data,
          accessToken:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImY0NjQ4M2M3LTU5ZWMtNGQzOC1iZjE0LWNkYTU1ZTNjODU2NSIsInJvbGVzIjoiW3tcIklkXCI6MSxcIk5hbWVcIjpcIkFkbWluXCJ9LHtcIklkXCI6MixcIk5hbWVcIjpcIlRlY2huaWNpYW5cIn0se1wiSWRcIjozLFwiTmFtZVwiOlwiQnJhbmQgbWFuYWdlclwifSx7XCJJZFwiOjQsXCJOYW1lXCI6XCJTaG9wIG1hbmFnZXJcIn0se1wiSWRcIjo1LFwiTmFtZVwiOlwiRW1wbG95ZWVcIn1dIiwic3RhdHVzIjoie1wiSWRcIjoyLFwiTmFtZVwiOlwiQWN0aXZlXCJ9IiwiZXhwIjoxNzAwOTg1ODc3LCJpc3MiOiJKV1RfSVNTVUVSIiwiYXVkIjoiSldUX0FVRElFTkNFIn0.phCS4hzfPAIOtf-6EswJbE7rIn4aWSJp7i81Ycgdeeg",
        });
      },
      onError(error) {
        if (axios.isAxiosError(error)) {
          // console.error(error.response?.data as ApiErrorResponse);
          notifications.show({
            message: "Wrong email or pasword",
            color: "pale-red.5",
            withCloseButton: true,
          });
        } else {
          console.error(error);
        }
      },
    });
  };

  return (
    <form
      onSubmit={form.onSubmit((values) => onSubmitForm(values))}
      style={{ marginTop: "20px", textAlign: "left" }}
    >
      <TextInput
        withAsterisk
        label="Email"
        placeholder="your@email.com"
        size="md"
        {...form.getInputProps("email")}
      />

      <TextInput
        withAsterisk
        label="Password"
        type="password"
        size="md"
        {...form.getInputProps("password")}
      />

      <Group
        justify="flex-start"
        mt="md"
      >
        <Button
          loading={isLoading}
          type="submit"
          variant="gradient"
          size="md"
          mt={20}
          gradient={{ from: "light-blue.5", to: "light-blue.7", deg: 90 }}
        >
          Login
        </Button>
      </Group>
    </form>
  );
};
