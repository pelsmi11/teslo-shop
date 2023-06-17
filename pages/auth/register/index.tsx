import { tesloApi } from "@/api";
import { GetServerSideProps } from "next";
import { AuthLayout } from "@/components/layouts";
import { useAuthContext } from "@/hooks";
import { validations } from "@/utils";
import { ErrorOutline } from "@mui/icons-material";
import {
  Box,
  Button,
  Chip,
  Grid,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import { getSession, signIn } from "next-auth/react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";

type FormData = {
  name: string;
  email: string;
  password: string;
};

export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  // const onSubmit: SubmitHandler<FormData> = data => console.log(data);

  const router = useRouter();
  const { registerUser } = useAuthContext();

  const [isError, setIsError] = useState(false);
  const [messageError, setMessageError] = useState("");

  const onRegisterForm = async ({ email, name, password }: FormData) => {
    const { hasError, message } = await registerUser(name, email, password);
    if (hasError) {
      setIsError(true);
      setMessageError(message || "Error en la creacion de usuario");
      setTimeout(() => {
        setIsError(false);
        setMessageError("");
      }, 3000);
      return;
    }
    // const destinarion = router.query.p?.toString() || "/";
    // router.replace(destinarion);
    await signIn("credentials", { email, password });
    // try {
    //   const { data } = await tesloApi.post("/user/register", {
    //     email,
    //     password,
    //     name,
    //   });
    //   const { token, user } = data;
    //   console.log({ token, user });
    // } catch (error) {
    //   setIsError(true);
    //   if (axios.isAxiosError(error)) {
    //     console.error(error.response?.data.message);
    //     setMessageError(error.response?.data.message);
    //     setTimeout(() => {
    //       setIsError(false);
    //       setMessageError("");
    //     }, 3000);
    //     return;
    //   }
    //   console.error("Error en las credenciales");
    //   setMessageError("Error en las credenciales");
    //   setTimeout(() => {
    //     setIsError(false);
    //     setMessageError("");
    //   }, 3000);
    // }
  };

  return (
    <AuthLayout title="Crear Cuenta">
      <form onSubmit={handleSubmit(onRegisterForm)} noValidate>
        <Box sx={{ width: 350, padding: "10px 20px" }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h1" component={"h1"}>
                Crear Cuenta
              </Typography>
              <Chip
                label={
                  messageError || "No reconocemos ese usuario / contraseña"
                }
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
                label="Nombre Completo"
                variant="filled"
                fullWidth
                {...register("name", {
                  required: "Este campo es requerido",
                  minLength: { value: 2, message: "Mínimo 2 caracteres" },
                })}
                error={!!errors.name}
                helperText={errors.name?.message}
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
                type="submit"
                fullWidth
              >
                Crear Cuenta
              </Button>
            </Grid>
            <Grid item xs={12} display={"flex"} justifyContent={"end"}>
              <NextLink href={"/auth/login"} passHref>
                <Link component={"span"}>¿Ya tienes cuenta?</Link>
              </NextLink>
            </Grid>
          </Grid>
        </Box>
      </form>
    </AuthLayout>
  );
}

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
