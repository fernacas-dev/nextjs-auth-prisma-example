import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/libs/prisma";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "doe@gmail.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Verificar que las credenciales no sean nulas
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please enter both email and password.");
        }

        // Buscar el usuario por su email usando Prisma
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        // Si el usuario no existe, lanzar un error
        if (!user) {
          throw new Error("User not found");
        }

        // Comparar la contraseña introducida con la almacenada en la base de datos
        const passwordMatch = await bcrypt.compare(
          credentials.password,
          user.password
        );

        // Si la contraseña no coincide, lanzar un error
        if (!passwordMatch) {
          throw new Error("Invalid password");
        }

        // Retornar el usuario si todo es correcto
        return user;
      },
    }),
  ],
  callbacks: {
    // Callback para manejar el token JWT
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.fullname = user.fullname;
        token.email = user.email;
      }
      return token;
    },
    // Callback para establecer los datos de la sesión
    async session({ session, token }) {
      if (token) {
        session.id = token.id;
        session.user.fullname = token.fullname;
        session.user.email = token.email;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login", // Página personalizada de login
  },
});

export { handler as GET, handler as POST };
