import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();
const resend = new Resend(process.env.RESEND_API_KEY);

export const enviarEmailRedefinicao = async (email, token) => {
  const link = `${process.env.FRONTEND_URL}/users/redefinir-senha/${token}`;

  const response = await resend.emails.send({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Redefinição de senha - Ilusões Industriais",

    html: `
      <div style="font-family: Arial, sans-serif;">
        <h2>Redefinição de senha</h2>

        <p>
          Recebemos uma solicitação para redefinir sua senha.
        </p>

        <p>
          Clique no botão abaixo:
        </p>

        <a
          href="${link}"
          style="
            display:inline-block;
            padding:12px 18px;
            background:#000;
            color:#fff;
            text-decoration:none;
            border-radius:6px;
          "
        >
          Redefinir senha
        </a>

        <p style="margin-top:20px;">
          Este link expira em 1 hora.
        </p>

        <p>
          Se você não solicitou esta redefinição,
          ignore este email.
        </p>
      </div>
    `,
  });
  console.log("Email enviado:", response);
};