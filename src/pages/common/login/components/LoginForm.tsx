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
        console.log({ data });

        sessionHook?.signIn(data);
      },
      onError(error) {
        if (axios.isAxiosError(error)) {
          // console.error(error.response?.data as ApiErrorResponse);
          notifications.show({
            message: error.response?.data.message,
            color: "pale-red.5",
            withCloseButton: true,
          });
        } else {
          // console.error(error);
          notifications.show({
            message: "Something wrong happen trying to login",
            color: "pale-red.5",
            withCloseButton: true,
          });
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
