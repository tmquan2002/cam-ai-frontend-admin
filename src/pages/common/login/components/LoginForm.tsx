import { TextInput, Button, Group } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useLogin } from '../../../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { TOKEN } from '../../../../constants/LocalStorageItems';
import { Login } from '../../../../models/Auth';
import { storeToken } from '../../../../utils/LocalStorageUtil';

export const LoginForm = () => {
    const navigate = useNavigate();
    const {
        mutate: login,
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
        console.log(values)

        var loginParams: Login = {
            username: values.email,
            password: values.password
        }

        await login(loginParams, {
            onSuccess(data, variables, context) {
                //TODO: Handle refresh token, access token
                console.log(data)
                storeToken(data)
                navigate("/dashboard")
            },
            onError(error, variables, context) {
                console.log(error);
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
                    type="submit" variant="gradient" size='md'
                    gradient={{ from: 'light-blue.5', to: 'light-blue.7', deg: 90 }}
                >Login</Button>
            </Group>
        </form>
    );
}