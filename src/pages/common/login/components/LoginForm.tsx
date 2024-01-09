import { TextInput, Button, Group } from '@mantine/core';
import { useForm } from '@mantine/form';
import { ApiErrorResponse, useLogin } from '../../../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Login } from '../../../../models/Auth';
import { storeToken } from '../../../../utils/LocalStorageUtil';
import axios, { AxiosError } from 'axios';
import { notifications } from '@mantine/notifications';

export const LoginForm = () => {
    const navigate = useNavigate();
    const {
        mutate: login,
        isLoading,
    } = useLogin();

    const form = useForm({
        initialValues: {
            email: '',
            password: '',
        },

        validate: {
            email: (value) => (
                value.trim().length === 0 ? "Email is required" :
                    /^\S+@\S+$/.test(value) ? null : 'Invalid email'
            ),
            password: (value) => (value.trim().length === 0 ? 'Password is required' : null),
        },
    });

    const onSubmitForm = async (values: { email: string; password: string; }) => {
        // console.log(values)

        var loginParams: Login = {
            username: values.email,
            password: values.password
        }

        await login(loginParams, {
            onSuccess(data) {
                // console.log(data)
                storeToken(data)
                navigate("/dashboard")
            },
            onError(error) {
                if (axios.isAxiosError(error)) {
                    // console.error(error.response?.data as ApiErrorResponse);
                    notifications.show({
                        message: 'Wrong email or pasword',
                        color: 'pale-red.5',
                        withCloseButton: true,
                    })
                } else {
                    console.error(error);
                }
            },
        });
    }

    return (
        <form onSubmit={form.onSubmit((values) => onSubmitForm(values))}
            style={{ marginTop: '20px', textAlign: 'left' }}>
            <TextInput
                withAsterisk
                label="Email"
                placeholder="your@email.com"
                size='md'
                {...form.getInputProps('email')}
            />

            <TextInput
                withAsterisk
                label="Password"
                type='password'
                size='md'
                {...form.getInputProps('password')}
            />

            <Group justify="flex-start" mt="md">
                <Button
                    loading={isLoading}
                    type="submit" variant="gradient" size='md' mt={20}
                    gradient={{ from: 'light-blue.5', to: 'light-blue.7', deg: 90 }}
                >Login</Button>
            </Group>
        </form>
    );
}