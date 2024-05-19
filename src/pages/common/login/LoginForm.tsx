import { Button, Group, TextInput } from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import axios from "axios";
import { isEmpty } from "lodash";
import { MdEmail, MdLockOutline } from "react-icons/md";
import { useSession } from "../../../context/AuthContext";
import { useLogin } from "../../../hooks/useAuth";
import { Login } from "../../../models/Auth";
import { EMAIL_REGEX } from "../../../types/constant";

export const LoginForm = () => {
  const sessionHook = useSession();
  const { mutate: login, isLoading } = useLogin();

  const form = useForm({
    initialValues: {
      email: "",
      password: "",
    },

    validate: {
      email: (value: string) => isEmpty(value) ? "Email is required"
        : EMAIL_REGEX.test(value) ? null : "Invalid email - ex: name@gmail.com",
      password: isNotEmpty("Password is required")
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
        // console.log({ data });
        sessionHook?.signIn(data);
      },
      onError(error) {
        if (axios.isAxiosError(error)) {
          // console.error(error.response?.data as ApiErrorResponse);
          notifications.show({
            title: "Failed",
            message: error.response?.data.message,
            color: "pale-red.5",
            withCloseButton: true,
          });
        } else {
          // console.error(error);
          notifications.show({
            title: "Failed",
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
      <TextInput mt={10}
        withAsterisk
        label="Email"
        leftSection={<MdEmail />}
        placeholder="your@email.com"
        size="md"
        {...form.getInputProps("email")}
      />

      <TextInput mt={20}
        withAsterisk
        label="Password"
        type="password"
        placeholder="Password"
        leftSection={<MdLockOutline />}
        size="md"
        {...form.getInputProps("password")}
      />

      <Group
        justify="flex-start"
        mt={10}
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
