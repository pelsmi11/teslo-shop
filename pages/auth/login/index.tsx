import { GetServerSideProps } from "next";
import { AuthLayout } from "@/components/layouts";
// import { useAuthContext } from "@/hooks";
import { validations } from "@/utils";
import { ErrorOutline } from "@mui/icons-material";
import {
  Box,
  Button,
  Chip,
  Divider,
  Grid,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import { signIn, getSession, getProviders } from "next-auth/react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { UiProvider } from "../../../context/ui/UiProvider";

type FormData = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  // const onSubmit: SubmitHandler<FormData> = data => console.log(data);
  const router = useRouter();
  // const { loginUser } = useAuthContext();
  const [isError, setIsError] = useState(false);
  const [providers, setProviders] = useState<any>({});

  useEffect(() => {
    getProviders().then((prov) => {
      setProviders(prov);
    });
  }, []);

  const onLoginUser = async ({ email, password }: FormData) => {
    await signIn("credentials", {
      email,
      password,
    });
    // ##version default
    // const isValidLogin = loginUser(email, password);
    // if (!isValidLogin) {
    //   console.error("Error en las credenciales");
    //   setTimeout(() => setIsError(false), 3000);
    //   return;
    // }
    // const destinarion = router.query.p?.toString() || "/";
    // router.replace(destinarion);
    // ## first version
    // try {
    //   const { data } = await tesloApi.post("/user/login", { email, password });
    //   const { token, user } = data;
    //   console.log({ token, user });
    // } catch (error) {
    //   setIsError(true);
    //   if (axios.isAxiosError(error)) {
    //     console.error(error.response?.data.message);
    //     setTimeout(() => setIsError(false), 3000);
    //     return;
    //   }
    //   console.error("Error en las credenciales");
    //   setTimeout(() => setIsError(false), 3000);
    // }
  };
  return (
    <AuthLayout title="Iniciar Seción">
      <form onSubmit={handleSubmit(onLoginUser)}>
        <Box sx={{ width: 350, padding: "10px 20px" }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h1" component={"h1"}>
                Iniciar Sesión
              </Typography>
              <Chip
                label="No reconocemos ese usuario / contraseña"
                color="error"
                icon={<ErrorOutline />}
                className="fadeIn"
                sx={{
                  display: isError ? "flex" : "none",
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                type="email"
                label="Correo"
                variant="filled"
                fullWidth
                {...register("email", {
                  required: "Este campo es requerido",
                  validate: validations.isEmail,
                })}
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Contraseña"
                type="password"
                variant="filled"
                fullWidth
                {...register("password", {
                  required: "Este campo es requerido",
                  minLength: { value: 6, message: "Mínimo 6 caracteres" },
                })}
                error={!!errors.password}
                helperText={errors.password?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                color="secondary"
                className="circular-btn"
                size="large"
                fullWidth
                type="submit"
              >
                Ingresar
              </Button>
            </Grid>
            <Grid item xs={12} display={"flex"} justifyContent={"end"}>
              <NextLink
                href={{
                  pathname: "/auth/register",
                  query: { p: router.query.p?.toString() || "/" },
                }}
                passHref
              >
                <Link component={"span"}>¿No tienes una cuenta?</Link>
              </NextLink>
            </Grid>
            <Grid
              item
              xs={12}
              display={"flex"}
              flexDirection={"column"}
              justifyContent={"end"}
            >
              <Divider sx={{ width: "100%", mb: 2 }} />
              {Object.values(providers).map((provider: any) => {
                if (provider.id === "credentials")
                  return <div key="credentials"></div>;
                return (
                  <Button
                    key={provider.id}
                    variant="outlined"
                    fullWidth
                    color="primary"
                    sx={{ mb: 1 }}
                    onClick={() => signIn(provider.id)}
                  >
                    {provider.name}
                  </Button>
                );
              })}
            </Grid>
          </Grid>
        </Box>
      </form>
    </AuthLayout>
  );
}

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

export const getServerSideProps: GetServerSideProps = async ({
  req,
  query,
}) => {
  const session = await getSession({ req });
  const { p = "/" } = query;

  if (session) {
    return {
      redirect: {
        destination: p.toString(),
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};
