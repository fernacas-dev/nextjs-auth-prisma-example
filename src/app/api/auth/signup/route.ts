import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/libs/prisma";

export async function POST(request: Request) {
  const { fullname, email, password } = await request.json();
  console.log(email);

  // Validación de la contraseña y el email
  if (!password || password.length < 6) {
    return NextResponse.json(
      {
        message: "Password must be at least 6 characters",
      },
      {
        status: 400,
      }
    );
  } else if (!email.includes("@")) {
    return NextResponse.json(
      {
        message: "Invalid email",
      },
      {
        status: 400,
      }
    );
  }

  try {
    // Verificar si el usuario ya existe en la base de datos usando Prisma
    const userFound = await prisma.user.findUnique({
      where: { email },
    });

    if (userFound) {
      return NextResponse.json(
        {
          message: "User already exists",
        },
        {
          status: 400,
        }
      );
    }

    // Hashear la contraseña
    const hashPassword = await bcrypt.hash(password, 12);

    // Crear el nuevo usuario en la base de datos usando Prisma
    const savedUser = await prisma.user.create({
      data: {
        fullname,
        email,
        password: hashPassword,
      },
    });

    console.log(savedUser);

    // Devolver la respuesta con los datos del usuario creado
    return NextResponse.json({
      id: savedUser.id,
      fullname: savedUser.fullname,
      email: savedUser.email,
    });
  } catch (error) {
    console.log(error);
    if (error instanceof Error) {
      return NextResponse.json(
        {
          error: error.message,
        },
        {
          status: 500,
        }
      );
    }
  }
}
